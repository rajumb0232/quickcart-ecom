package com.donkie.quickcart.user.infra.integration.keycloak.tokens;

import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakProperties;
import com.donkie.quickcart.user.infra.integration.keycloak.model.AdminTokenResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.time.Instant;

/**
 * Manages KeycloakRequestHandler admin access tokens with automatic refresh.
 * <p>
 * This service provides thread-safe token retrieval and scheduled background refresh
 * to ensure admin tokens are always available for KeycloakRequestHandler administrative operations.
 * Tokens are refreshed proactively when they are within the buffer period of expiration.
 * </p>
 *
 * @author QuickCart Team
 * @since 1.0
 */
@Service
@Slf4j
public class AdminTokenService {

    private final RestClient restClient;
    private final KeycloakProperties props;
    private final AdminTokens adminTokens;

    private static final int BUFFER_SECONDS = 60;           // refresh if <= this many seconds to expiry
    private static final long INITIAL_DELAY_MS = 5_000L;    // 5s after startup
    private static final long FIXED_DELAY_MS = 30_000L;     // run every 30s

    /**
     * Constructs a new AdminTokenService with the specified configuration.
     *
     * @param props the KeycloakRequestHandler configuration properties
     * @param adminTokens the token storage component
     */
    public AdminTokenService(KeycloakProperties props, AdminTokens adminTokens) {
        this.props = props;
        this.adminTokens = adminTokens;
        this.restClient = RestClient.builder().baseUrl(props.getUrl()).build();
    }

    /**
     * Scheduled background job that refreshes admin tokens when necessary.
     * <p>
     * This method runs every 30 seconds and only fetches a new token if the current
     * token is missing or within the buffer period of expiration (60 seconds).
     * </p>
     *
     * @see #INITIAL_DELAY_MS
     * @see #FIXED_DELAY_MS
     * @see #BUFFER_SECONDS
     */
    @Scheduled(initialDelay = (int) INITIAL_DELAY_MS, fixedDelay = (int) FIXED_DELAY_MS)
    public void scheduledTokenJob() {
        try {
            if (needsRefresh()) {
                log.info("Scheduled job: token missing or near expiry -> fetching token");
                fetchTokenAndSet();
            } else {
                long secs = secondsUntilExpiry();
                log.debug("Scheduled job: token healthy ({}s until expiry)", secs);
            }
        } catch (Exception e) {
            log.warn("Scheduled token job failed: {}", e.getMessage());
            // retry in next scheduled job.
        }
    }

    /**
     * Retrieves a valid admin access token, refreshing if necessary.
     * <p>
     * This method ensures a valid token is always returned by checking if the current
     * token needs refresh and attempting to fetch a new one if required. If token
     * refresh fails but an existing token is still present, the existing token is returned.
     * </p>
     *
     * @return a valid admin access token
     * @throws IllegalStateException if no token exists and refresh fails, or if token
     *                               fetch succeeds but returns null
     */
    public String getAccessToken() {
        if (!needsRefresh()) {
            return adminTokens.getAccessToken();
        }

        try {
            fetchTokenAndSet(); // synchronous, single-threaded by synchronized
        } catch (Exception e) {
            log.warn("Synchronous token refresh failed: {}. Returning existing token if present.", e.getMessage());
            /*
            return if the token is present. (just in case the API call failed
            but token exists since called during buffer duration
            */
            if (adminTokens.getAccessToken() != null) {
                return adminTokens.getAccessToken();
            }
            throw new IllegalStateException("Unable to obtain access token", e);
        }

        String token = adminTokens.getAccessToken();
        if (token == null) throw new IllegalStateException("Token fetch succeeded but access token is null");
        return token;
    }

    /* --------- helpers --------- */

    /**
     * Determines if the current token needs to be refreshed.
     * <p>
     * A token needs refresh if it's missing, has no expiration time, or is within
     * the buffer period of expiration.
     * </p>
     *
     * @return true if token needs refresh, false otherwise
     */
    private boolean needsRefresh() {
        String token = adminTokens.getAccessToken();
        if (token == null) return true;
        Instant calcExp = adminTokens.getCalculatedExpiration();
        if (calcExp == null) return true;
        long secondsUntilExpiry = Duration.between(Instant.now(), calcExp).getSeconds();
        return secondsUntilExpiry <= BUFFER_SECONDS;
    }

    /**
     * Calculates the number of seconds until the current token expires.
     *
     * @return seconds until expiry, or -1 if expiration time is not available
     */
    private long secondsUntilExpiry() {
        Instant calcExp = adminTokens.getCalculatedExpiration();
        if (calcExp == null) return -1L;
        return Duration.between(Instant.now(), calcExp).getSeconds();
    }

    /**
     * Fetches a new token from KeycloakRequestHandler and updates the token storage.
     * <p>
     * This method is synchronized to prevent concurrent token requests and ensure
     * thread safety during token refresh operations.
     * </p>
     *
     * @throws IllegalStateException if the token response is invalid or null
     */
    private synchronized void fetchTokenAndSet() {
        log.debug("Fetching token from KeycloakRequestHandler for realm='{}' client='{}'", props.getRealm(), props.getAdminClientId());
        AdminTokenResult result = fetchToken();
        if (result == null || result.accessToken() == null) {
            throw new IllegalStateException("Invalid token response");
        }
        adminTokens.setTokens(result);
        log.info("Fetched token and updated AdminTokens; expiresIn={}s", result.expiresIn());
    }

    /**
     * Performs the actual HTTP request to fetch a new admin token from KeycloakRequestHandler.
     * <p>
     * Uses client credentials grant type to authenticate with KeycloakRequestHandler and obtain
     * an admin access token.
     * </p>
     *
     * @return the token result containing access token and expiration information
     * @throws RuntimeException if the HTTP request fails
     */
    private AdminTokenResult fetchToken() {
        String path = "/realms/{realm}/protocol/openid-connect/token";

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "client_credentials");
        formData.add("client_id", props.getAdminClientId());
        formData.add("client_secret", props.getAdminClientSecret());

        return restClient.post()
                .uri(uriBuilder -> uriBuilder.path(path).build(props.getRealm()))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .body(AdminTokenResult.class);
    }
}
