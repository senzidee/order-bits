import React from "react";
import ComponentForm, { ComponentFormData } from "../forms/Component";

export default function AddComponent() {
  const initialData: ComponentFormData = {
    name: "",
    category: "",
    value: "",
    package: "",
    quantity: 0,
    min_quantity: 0,
    location: "",
    datasheet_url: "",
    supplier: "",
    supplier_code: "",
    unit_price: 0,
    notes: "",
  };

  const handleSubmit = async (formData: ComponentFormData): Promise<void> => {
    const response = await fetch("/api/components", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to add component");
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Add New Component</h1>
        <ComponentForm initialData={initialData} onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
