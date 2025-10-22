-- 1) Drop foreign key constraint on user_profile_id
ALTER TABLE seller_profile DROP CONSTRAINT IF EXISTS fk_seller_user;

-- 2) Drop the redundant user_profile_id column
ALTER TABLE seller_profile DROP COLUMN IF EXISTS user_profile_id;

-- 3) Ensure seller_id is primary key (if not already)
-- Note: Usually it is, but including this as safe check
ALTER TABLE seller_profile DROP CONSTRAINT IF EXISTS seller_profile_pkey;
ALTER TABLE seller_profile ADD PRIMARY KEY (seller_id);

-- 4) Add foreign key constraint from seller_id to user_profile(user_id)
ALTER TABLE seller_profile
  ADD CONSTRAINT fk_seller_user
  FOREIGN KEY (seller_id) REFERENCES user_profile(user_id) ON DELETE RESTRICT;
