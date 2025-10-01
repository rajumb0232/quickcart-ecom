package com.donkie.quickcart.shared.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class KeycloakRolesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        Object realmAccessObj = jwt.getClaim("realm_access");
        if (realmAccessObj instanceof Map<?, ?> realmAccess) {
            Object rolesObj = realmAccess.get("roles");
            List<String> roles = extractRoles(rolesObj);
            roles.forEach(role -> authorities.add(new SimpleGrantedAuthority(role)));
        }

        Object resourceAccessObj = jwt.getClaim("resource_access");
        if (resourceAccessObj instanceof Map<?, ?> resourceAccess) {
            resourceAccess.forEach((client, data) -> {
                if (data instanceof Map<?, ?> clientData) {
                    Object rolesObj = clientData.get("roles");
                    List<String> roles = extractRoles(rolesObj);
                    roles.forEach(role -> authorities.add(new SimpleGrantedAuthority(role)));
                }
            });
        }

        return authorities;
    }

    private List<String> extractRoles(Object rolesObj) {
        if (rolesObj instanceof List<?> rawList) {
            List<String> roles = new ArrayList<>();
            for (Object item : rawList) {
                if (item instanceof String roleStr) {
                    roles.add(roleStr);
                }
            }
            return roles;
        }
        return Collections.emptyList();
    }
}

