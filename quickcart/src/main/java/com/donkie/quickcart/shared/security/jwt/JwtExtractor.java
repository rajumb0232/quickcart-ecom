package com.donkie.quickcart.shared.security.jwt;

import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
public class JwtExtractor {

    /**
     * Extract JTI (JWT ID) from token.
     */
    public String extractJti(String token) {
        try {
            JWT jwt = JWTParser.parse(token);
            JWTClaimsSet claims = jwt.getJWTClaimsSet();
            return claims.getJWTID();
        } catch (Exception e) {
            log.error("Failed to extract JTI from token", e);
            return null;
        }
    }

    /**
     * Extract expiration time from token.
     */
    public Instant extractExpiration(String token) {
        try {
            JWT jwt = JWTParser.parse(token);
            JWTClaimsSet claims = jwt.getJWTClaimsSet();
            Date expiration = claims.getExpirationTime();
            return expiration != null ? expiration.toInstant() : null;
        } catch (Exception e) {
            log.error("Failed to extract expiration from token", e);
            return null;
        }
    }
}
