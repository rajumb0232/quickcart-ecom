
-- Drop the old icon_url column
ALTER TABLE category
DROP COLUMN IF EXISTS icon_url;

-- Add the new thumbnail column (UUID FK to image_file.image_id)
ALTER TABLE category
ADD COLUMN thumbnail UUID;

-- Add the foreign key constraint (with SET NULL on delete)
ALTER TABLE category
ADD CONSTRAINT fk_category_thumbnail
    FOREIGN KEY (thumbnail)
    REFERENCES image_file (image_id)
    ON DELETE SET NULL;