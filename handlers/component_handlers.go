package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"order-bits/database"
	"order-bits/response"
)

func GetComponentHandler(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/components/")
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
