package models

import "encoding/json"

type PriceInCents int

func (p *PriceInCents) UnmarshalJSON(data []byte) error {
	var price float64
	if err := json.Unmarshal(data, &price); err != nil {
		return err
	}
	*p = PriceInCents(price * 1000)
	return nil
}

func (p PriceInCents) MarshalJSON() ([]byte, error) {
	price := float64(p) / 1000
	return json.Marshal(price)
}

// Update your struct
type Component struct {
	ID           int           `json:"id"`
	Name         string        `json:"name"`
	Category     string        `json:"category"`
	Value        *string       `json:"value"`
	Package      *string       `json:"package"`
	Quantity     int           `json:"quantity"`
	MinQuantity  *int          `json:"min_quantity"`
	Location     *string       `json:"location"`
	DatasheetUrl *string       `json:"datasheet_url"`
	Supplier     *string       `json:"supplier"`
	SupplierCode *string       `json:"supplier_code"`
	UnitPrice    *PriceInCents `json:"unit_price"`
	Notes        *string       `json:"notes"`
	CreatedAt    *string       `json:"created_at"`
	UpdatedAt    *string       `json:"updated_at"`
}
