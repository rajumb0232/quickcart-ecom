-- ============================================================
-- 1) Create store
-- ============================================================
CREATE TABLE IF NOT EXISTS store (
    store_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    contact_number TEXT,
    email TEXT,
    about TEXT,

    -- lifecycle / audit (embeddable fields)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    is_orphan BOOLEAN NOT NULL DEFAULT FALSE,

    created_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by TEXT,
    last_modified_date TIMESTAMPTZ DEFAULT now(),
    last_modified_by TEXT
);

-- Index to speed up queries for active (non-deleted) stores
CREATE INDEX IF NOT EXISTS idx_store_active_only
ON store (store_id)
WHERE is_active = TRUE AND is_deleted = FALSE;


-- ============================================================
-- 2) Create product
-- ============================================================
CREATE TABLE IF NOT EXISTS product (
    product_id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    brand TEXT NOT NULL,
    category_path TEXT NOT NULL,
    category_id UUID,
    store_id UUID,
    avg_rating DOUBLE PRECISION DEFAULT 0,
    rating_count INT DEFAULT 0,

    -- lifecycle / audit (embeddable fields)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    is_orphan BOOLEAN NOT NULL DEFAULT FALSE,

    created_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by TEXT,
    last_modified_date TIMESTAMPTZ DEFAULT now(),
    last_modified_by TEXT,

    CONSTRAINT fk_product_store
        FOREIGN KEY (store_id)
        REFERENCES store(store_id)
        ON DELETE RESTRICT
);

-- Optional index for active products (partial)
CREATE INDEX IF NOT EXISTS idx_product_active_only
ON product (product_id)
WHERE is_active = TRUE AND is_deleted = FALSE;


-- ============================================================
-- 3) Create product_variant
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variant (
    variant_id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    quantity INT NOT NULL,
    description TEXT,
    attributes JSONB,
    product_id UUID,

    -- lifecycle / audit (embeddable fields)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    is_orphan BOOLEAN NOT NULL DEFAULT FALSE,

    created_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_by TEXT,
    last_modified_date TIMESTAMPTZ DEFAULT now(),
    last_modified_by TEXT,

    CONSTRAINT fk_variant_product
        FOREIGN KEY (product_id)
        REFERENCES product(product_id)
        ON DELETE CASCADE
);

-- Optional index for active variants (partial)
CREATE INDEX IF NOT EXISTS idx_variant_active_only
ON product_variant (variant_id)
WHERE is_active = TRUE AND is_deleted = FALSE;


-- ============================================================
-- 4) Create product_variant_images (join table)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variant_images (
    variant_id UUID NOT NULL,
    image_id UUID NOT NULL,
    PRIMARY KEY (variant_id, image_id),

    CONSTRAINT fk_variant_images_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variant(variant_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_variant_images_image
        FOREIGN KEY (image_id)
        REFERENCES image_file(image_id)
        ON DELETE CASCADE
);

-- Indexes for product_variant_images for faster joins (optional)
CREATE INDEX IF NOT EXISTS idx_variant_images_variant_id ON product_variant_images (variant_id);
CREATE INDEX IF NOT EXISTS idx_variant_images_image_id ON product_variant_images (image_id);
