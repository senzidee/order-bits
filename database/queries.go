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
		err := rows.Scan(&component.ID, &component.Name)
		if err != nil {
			return nil, err
		}
		components = append(components, component)
	}

	return components, rows.Err()
}

func GetComponent(id int) (*models.Component, error) {
	var component models.Component
	err := db.QueryRow("SELECT * FROM components WHERE id = $1", id).Scan(&component.ID, &component.Name)
	if err != nil {
		return nil, err
	}

	return &component, nil
}

func CreateComponent(name string) (*models.Component, error) {
	var id int
	err := db.QueryRow("INSERT INTO components (name) VALUES ($1) RETURNING id", name).Scan(&id)
	if err != nil {
		return nil, err
	}

	return &models.Component{ID: id, Name: name}, nil
}
