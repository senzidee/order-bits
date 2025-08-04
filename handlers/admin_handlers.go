package handlers

import (
	"net/http"
	"order-bits/database"
	"order-bits/response"
)

// GetMigrationsStatusHandler returns the status of all executed migrations
func GetMigrationsStatusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	migrations, err := database.GetMigrationStatus()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response.WriteJSONResponse(w, http.StatusOK, map[string]interface{}{
		"migrations": migrations,
		"count":      len(migrations),
	})
}
