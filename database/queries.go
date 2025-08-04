package database

import (
	"order-bits/models"
)

func GetAllComponents() ([]models.Component, error) {
	var components []models.Component
	rows, err := db.Query("SELECT * FROM components ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var component models.Component
		err := rows.Scan(
			&component.ID, &component.Name, &component.Category, &component.Value,
			&component.Package, &component.Quantity, &component.MinQuantity,
			&component.Location, &component.DatasheetUrl, &component.Supplier,
			&component.SupplierCode, &component.UnitPrice, &component.Notes,
			&component.CreatedAt, &component.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		components = append(components, component)
	}

	return components, rows.Err()
}

func GetComponent(id int) (*models.Component, error) {
	var component models.Component
	err := db.QueryRow("SELECT * FROM components WHERE id = ?", id).Scan(
		&component.ID, &component.Name, &component.Category, &component.Value,
		&component.Package, &component.Quantity, &component.MinQuantity,
		&component.Location, &component.DatasheetUrl, &component.Supplier,
		&component.SupplierCode, &component.UnitPrice, &component.Notes,
		&component.CreatedAt, &component.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &component, nil
}

func CreateComponent(item models.Component) (*models.Component, error) {
	var id int
	err := db.QueryRow(
		"INSERT INTO components (name, category, value, package, quantity, min_quantity, location, datasheet_url, supplier, supplier_code, unit_price, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
		item.Name, item.Category, item.Value, item.Package, item.Quantity, item.MinQuantity, item.Location, item.DatasheetUrl, item.Supplier, item.SupplierCode, item.UnitPrice, item.Notes,
	).Scan(&id)
	if err != nil {
		return nil, err
	}

	createdComponent := item
	createdComponent.ID = int(id)
	return &createdComponent, nil
}
