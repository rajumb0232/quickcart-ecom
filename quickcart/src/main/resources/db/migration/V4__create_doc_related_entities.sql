CREATE TABLE api_category (
  category_id uuid PRIMARY KEY,
  name varchar(100) NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE api_endpoint (
  endpoint_id uuid PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES api_category(category_id) ON DELETE CASCADE,
  title varchar(200) NOT NULL,
  markdown_content text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);
