-- Flyway Migration: Create image_file table
-- Description: Stores uploaded image metadata for S3 integration

CREATE TABLE image_file (
    image_id uuid PRIMARY KEY,
    object_key VARCHAR(512) NOT NULL,
    differentiator_name VARCHAR(255) NOT NULL,
    upload_status VARCHAR(50) NOT NULL DEFAULT 'UPLOAD_PENDING'
        CHECK (upload_status IN ('UPLOAD_PENDING', 'UPLOAD_COMPLETE')),
    upload_window BIGINT NOT NULL DEFAULT 300, -- 5 minutes in seconds
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL
);

-- Indexes for faster lookups and cron jobs
CREATE INDEX idx_diff_name ON image_file (differentiator_name);
CREATE INDEX idx_upload_status ON image_file (upload_status);