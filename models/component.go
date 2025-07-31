package models

type Component struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	Category     string `json:"category"`
	Value        string `json:"value"`
	Package      string `json:"package"`
	Quantity     int    `json:"quantity"`
	MinQuantity  int    `json:"min_quantity"`
	Location     string `json:"location"`
	DatasheetUrl string `json:"datasheet_url"`
	Supplier     string `json:"supplier"`
	SupplierCode string `json:"supplier_code"`
	UnitPrice    int    `json:"unit_price"`
	Notes        string `json:"notes"`
	CreatedAt    int    `json:"created_at"`
	UpdatedAt    int    `json:"updated_at"`
}
