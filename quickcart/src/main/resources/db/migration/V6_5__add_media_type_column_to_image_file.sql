-- Add new column "media_type" to table "image_file"

ALTER TABLE image_file
ADD COLUMN content_type VARCHAR(255);