-- Create Category table

CREATE TABLE category (
  category_id uuid PRIMARY KEY,
  name varchar(200) NOT NULL,
  status varchar(20) NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT','ACTIVE','ARCHIVE')),
  parent_id uuid REFERENCES category(category_id) ON DELETE SET NULL,
  created_date timestamp without time zone DEFAULT now() NOT NULL,
  created_by varchar(100) NOT NULL,
  last_modified_date timestamp without time zone,
  last_modified_by varchar(100)
);

CREATE INDEX idx_category_parent_id ON category(parent_id);
