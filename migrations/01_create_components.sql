CREATE TABLE IF NOT EXISTS components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    value TEXT,
    package TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_quantity INTEGER,
    location TEXT,
    datasheet_url TEXT,
    supplier TEXT,
    supplier_code TEXT,
    unit_price REAL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_components_category ON components(category);
CREATE INDEX idx_components_name ON components(name);
CREATE INDEX idx_components_quantity ON components(quantity);

CREATE TRIGGER update_components_updated_at
    AFTER UPDATE ON components
    FOR EACH ROW
BEGIN
    UPDATE components SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;