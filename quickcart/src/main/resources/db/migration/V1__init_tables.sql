-- 1) Create user_profile
CREATE TABLE IF NOT EXISTS user_profile (
    user_id UUID PRIMARY KEY,
    first_name TEXT,
    last_name  TEXT,
    email TEXT,
    phone_number TEXT,
    create_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_modified_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1.1) Create indexes for user_profile table
CREATE INDEX IF NOT EXISTS idx_user_email  ON user_profile (email);
CREATE INDEX IF NOT EXISTS idx_user_phone  ON user_profile (phone_number);

-- 2) Create seller_profile
CREATE TABLE IF NOT EXISTS seller_profile (
    seller_id UUID PRIMARY KEY,
    bio VARCHAR(2000),
    selling_since TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_profile_id UUID UNIQUE NOT NULL,
    CONSTRAINT fk_seller_user
        FOREIGN KEY (user_profile_id)
        REFERENCES user_profile(user_id)
        ON DELETE RESTRICT
);
