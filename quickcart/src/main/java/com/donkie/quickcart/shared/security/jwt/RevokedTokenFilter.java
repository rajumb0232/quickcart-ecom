package com.donkie.quickcart.shared.security.jwt;

import com.donkie.quickcart.user.infra.service.TokenRevocationService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@AllArgsConstructor
public class RevokedTokenFilter extends OncePerRequestFilter {

    private final TokenRevocationService tokenRevocationService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        log.debug("Attempting check if token is blocked/revoked");
        // Get authentication from Spring Security context (already validated by BearerTokenAuthenticationFilter)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check if request is authenticated with JWT
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            log.debug("Validating if the token is blocked/revoked");
            Jwt jwt = jwtAuth.getToken();
            String jti = jwt.getClaim("jti");

            if (jti != null && tokenRevocationService.isBlacklisted(jti)) {
                log.warn("Blocked request with blacklisted/revoked token. JTI: {}", jti);

                // Clear security context
                SecurityContextHolder.clearContext();

                // Return 401 Unauthorized
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"error\":\"Token has been revoked\",\"message\":\"Please login again\"}"
                );
                return;  // Stop filter chain
            }
            log.debug("Token is not blocked/revoked");
        }

        log.debug("Continuing to next filters in the chain");
        // Continue with request if the token is valid
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Skip filter for public endpoints to improve performance
        String path = request.getRequestURI();
        return path.startsWith("/actuator/") // Skip Filtering to actuator endpoints
                || path.startsWith("/api/v1/public/") // Skip Filtering to all public endpoints
                || path.startsWith("/docs"); // Skip Filtering to all documentation endpoints (not "/api/v1/docs/**")
    }
}
