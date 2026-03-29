-- Korisnici
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'operater' CHECK (role IN ('admin', 'operater')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dobavljači
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Materijali (Repromaterijal)
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit_of_measure VARCHAR(20) NOT NULL, 
    stock_quantity DECIMAL(10, 2) DEFAULT 0,
    min_stock DECIMAL(10, 2) DEFAULT 0,
    purchase_price DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nabavka (Ulaz materijala)
CREATE TABLE IF NOT EXISTS material_entries (
    id SERIAL PRIMARY KEY,
    material_id INT REFERENCES materials(id) ON DELETE RESTRICT,
    supplier_id INT REFERENCES suppliers(id) ON DELETE SET NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proizvodi
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    stock_quantity DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Normativi (Receptura)
CREATE TABLE IF NOT EXISTS product_norms (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    material_id INT REFERENCES materials(id) ON DELETE RESTRICT,
    quantity_required DECIMAL(10, 2) NOT NULL,
    UNIQUE(product_id, material_id)
);

-- Radni nalozi (Proizvodnja)
CREATE TABLE IF NOT EXISTS work_orders (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE RESTRICT,
    quantity_to_produce DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'completed', 'canceled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Izlaz gotove robe
CREATE TABLE IF NOT EXISTS product_outputs (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE RESTRICT,
    quantity DECIMAL(10, 2) NOT NULL,
    output_type VARCHAR(50) DEFAULT 'sale',
    output_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
