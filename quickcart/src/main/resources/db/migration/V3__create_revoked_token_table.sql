-- Create revoked_token table for JWT blacklisting

CREATE TABLE revoked_token (
    jti VARCHAR(255) NOT NULL,
    expiration TIMESTAMP(6) NOT NULL,
    PRIMARY KEY (jti)
);

-- Create indexes for performance
CREATE INDEX idx_jti ON revoked_token(jti);
CREATE INDEX idx_exp ON revoked_token(expiration);

-- Optional: Comment for documentation
COMMENT ON TABLE revoked_token IS 'Stores revoked JWT tokens (blacklist) until their expiration time';
COMMENT ON COLUMN revoked_token.jti IS 'JWT ID claim - unique identifier for the token';
COMMENT ON COLUMN revoked_token.expiration IS 'Token expiration timestamp - used for automatic cleanup';