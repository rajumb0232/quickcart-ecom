-- Edit Category by adding two new columns - Category Level and Icon URL

ALTER TABLE category
  ADD COLUMN category_level integer NOT NULL DEFAULT 1
    CHECK (category_level IN (1, 2, 3)),
  ADD COLUMN icon_url varchar(512);

CREATE INDEX IF NOT EXISTS idx_category_category_level ON category(category_level);
