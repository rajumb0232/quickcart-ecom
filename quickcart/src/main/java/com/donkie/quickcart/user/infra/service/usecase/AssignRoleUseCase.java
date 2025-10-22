package com.donkie.quickcart.user.infra.service.usecase;

import com.donkie.quickcart.shared.exception.QuickcartBaseException;
import com.donkie.quickcart.user.domain.model.UserRole;
import com.donkie.quickcart.user.infra.integration.keycloak.KeycloakClient;
import com.donkie.quickcart.user.infra.integration.keycloak.model.UserRoleData;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.donkie.quickcart.shared.exception.handler.SafeExecutor.safeExecute;
import static com.donkie.quickcart.shared.integration.helper.ClientResponseStatusResolver.resolveStatus;

@Service
@AllArgsConstructor
@Slf4j
public class AssignRoleUseCase {

    private final KeycloakClient keycloakClient;

    /**
     * Assigns the specified roles to the user with the given ID.
     *
     * @param userId the user identifier
     * @param roles  the roles to assign
     */
    public void assignRolesToUser(UUID userId, List<UserRole> roles) {
        List<UserRoleData> roleDataList = safeExecute(
                keycloakClient::getAllUserRoles,
                (e) -> new QuickcartBaseException(
                        resolveStatus(e),
                        "Failed to retrieve user roles from Authentication Service.",
                        e)
        );

        List<UserRoleData> filteredRoles = roleDataList.stream().filter(roleData -> roles.stream().anyMatch(role -> role.getDisplayName().equals(roleData.roleName())))
                .toList();

        if (filteredRoles.isEmpty()) {
            log.warn("No roles found in keycloak among the requested roles, {}", roles.stream().map(UserRole::getDisplayName).toList());
            return;
        }

        log.info("Mapping (found) roles '{}', to user '{}'", filteredRoles.stream().map(UserRoleData::roleName).toList(), userId);

        safeExecute(
                () -> keycloakClient.mapRolesToKeycloakUser(filteredRoles, userId),
                (e) -> new QuickcartBaseException(
                        resolveStatus(e),
                        "Failed to map roles to the user.",
                        e)
        );
    }
}
