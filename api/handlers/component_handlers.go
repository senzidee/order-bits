package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/senzidee/order-bits/api/database"
	"github.com/senzidee/order-bits/api/models"
	"github.com/senzidee/order-bits/api/response"
)

func GetComponentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	path := strings.TrimPrefix(r.URL.Path, "/api/components/")
	if path == "" {
		http.Error(w, "Component ID required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(path)
	if err != nil {
		http.Error(w, "Invalid component ID", http.StatusBadRequest)
		return
	}

	component, err := database.GetComponent(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if component == nil {
		http.NotFound(w, r)
		return
	}

	response.WriteJSONResponse(w, http.StatusOK, component)
}

func GetComponentsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	components, err := database.GetAllComponents()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response.WriteJSONResponse(w, http.StatusOK, components)
}

func CreateComponentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var component models.Component
	err := json.NewDecoder(r.Body).Decode(&component)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	id, err := database.CreateComponent(component)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response.WriteJSONResponse(w, http.StatusCreated, map[string]interface{}{
		"id": id,
	})
}

func UpdateComponentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	path := strings.TrimPrefix(r.URL.Path, "/api/components/")
	if path == "" {
		http.Error(w, "Component ID required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(path)
	if err != nil {
		http.Error(w, "Invalid component ID", http.StatusBadRequest)
		return
	}

	var component models.Component
	err = json.NewDecoder(r.Body).Decode(&component)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	err = database.UpdateComponent(id, component)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response.WriteJSONResponse(w, http.StatusOK, map[string]interface{}{
		"id": id,
	})
}

func DeleteComponentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	path := strings.TrimPrefix(r.URL.Path, "/api/components/")
	if path == "" {
		http.Error(w, "Component ID required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(path)
	if err != nil {
		http.Error(w, "Invalid component ID", http.StatusBadRequest)
		return
	}

	err = database.DeleteComponent(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response.WriteJSONResponse(w, http.StatusOK, map[string]interface{}{
		"id": id,
	})
}
