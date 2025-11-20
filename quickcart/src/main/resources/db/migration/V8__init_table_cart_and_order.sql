-- ============================================================
-- 1) Create Cart
-- ============================================================
CREATE TABLE IF NOT EXISTS cart (
    cart_id UUID PRIMARY KEY,
    created_by TEXT NOT NULL
);

-- ============================================================
-- 2) Create CartItem
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_item (
    item_id UUID PRIMARY KEY,
    product_variant_id UUID,
    store_id UUID,
    quantity INT,
    cart_id UUID,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    last_modified_date TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT fk_cart_cart_item
        FOREIGN KEY (cart_id)
        REFERENCES cart(cart_id)
        ON DELETE RESTRICT
);

-- ============================================================
-- 3) Create Type OrderStatus
-- ============================================================
CREATE TYPE order_status AS ENUM (
    'CREATED',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUND_INITIATED'
);

-- ============================================================
-- 4) Create Type PaymentStatus
-- ============================================================
CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'PAID',
    'CANCELLED',
    'REFUND_INITIATED',
    'REFUND_COMPLETED'
);

-- ============================================================
-- 5) Create Order
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY,
    bill_amount DOUBLE PRECISION NOT NULL,
    payment_id TEXT,
    payment_status payment_status NOT NULL,
    order_status order_status NOT NULL,
    shipping_address TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    last_modified_date TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6) Create OrderItem
-- ============================================================
CREATE TABLE IF NOT EXISTS order_item (
    item_id UUID PRIMARY KEY,
    product_variant_id UUID NOT NULL,
    store_id UUID NOT NULL,
    quantity INT NOT NULL,
    price_per_unit DOUBLE PRECISION NOT NULL,
    order_id UUID NOT NULL,
    created_by TEXT NOT NULL,
    created_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    last_modified_date TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT fk_order_order_item
        FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE RESTRICT
);

-- ============================================================
-- 7) Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cart_item_cart_id
ON cart_item(cart_id);

CREATE INDEX IF NOT EXISTS idx_order_item_order_id
ON order_item(order_id);

CREATE INDEX IF NOT EXISTS idx_order_item_store_id
ON order_item(store_id);

CREATE INDEX IF NOT EXISTS idx_order_item_product_variant_id
ON order_item(product_variant_id);


-- ============================================================
-- 7) Prevent Update Triggers
-- ============================================================
CREATE OR REPLACE FUNCTION prevent_update_created_columns() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_date IS DISTINCT FROM OLD.created_date THEN
    RAISE EXCEPTION 'created_date column is not updatable';
  END IF;
  IF NEW.created_by IS DISTINCT FROM OLD.created_by THEN
    RAISE EXCEPTION 'created_by column is not updatable';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_update_created
BEFORE UPDATE ON cart
FOR EACH ROW
EXECUTE FUNCTION prevent_update_created_columns();

CREATE TRIGGER trg_prevent_update_created
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION prevent_update_created_columns();
