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
CREATE INDEX idx_components_supplier ON components(supplier);
CREATE INDEX idx_components_location ON components(location);
CREATE INDEX idx_components_low_stock ON components(quantity, min_quantity);


CREATE TRIGGER update_components_updated_at
    AFTER UPDATE ON components
    FOR EACH ROW
BEGIN
    UPDATE components SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Add some sample data for testing
INSERT OR IGNORE INTO components (name, category, value, package, quantity, min_quantity, location, supplier) VALUES
('Resistor 10k', 'Resistor', '10k', '0805', 100, 20, 'Bin-A1', 'Digikey'),
('Capacitor 100nF', 'Capacitor', '100nF', '0603', 50, 10, 'Bin-B2', 'Mouser'),
('LED Red 5mm', 'LED', 'Red', 'THT', 25, 5, 'Bin-C3', 'Digikey');
