import React, { useState } from "react";
import { Component } from "../types/Component";
import { useNavigate } from "react-router-dom";

export type ComponentFormData = Omit<
  Component,
  "id" | "created_at" | "updated_at"
>;

interface ComponentFormProps {
  initialData: ComponentFormData;
  onSubmit: (data: ComponentFormData) => Promise<void>;
  isEdit?: boolean;
  componentId?: string;
}

export default function ComponentForm({
  initialData,
  onSubmit,
  isEdit = false,
  componentId,
}: ComponentFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ComponentFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);

      // Navigate based on context
      if (isEdit && componentId) {
        navigate(`/view/${componentId}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate back based on context
  const handleCancel = () => {
    if (isEdit && componentId) {
      navigate(`/view/${componentId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {error && (
        <div className="notification is-danger">
          <button className="delete" onClick={() => setError(null)}></button>
          {error}
        </div>
      )}

      <div className="box">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Component name"
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Category</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Value</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="Value (e.g. 10k, 0.1uF)"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Package</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="package"
                value={formData.package}
                onChange={handleChange}
                placeholder="Package (e.g. 0805, TO-220)"
              />
            </div>
          </div>

          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Quantity</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    placeholder="Quantity"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="label">Minimum Quantity</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    name="min_quantity"
                    value={formData.min_quantity}
                    onChange={handleChange}
                    min="0"
                    placeholder="Minimum quantity"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Location</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Storage location"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Datasheet URL</label>
            <div className="control">
              <input
                className="input"
                type="url"
                name="datasheet_url"
                value={formData.datasheet_url}
                onChange={handleChange}
                placeholder="URL to datasheet"
              />
            </div>
          </div>

          <div className="columns">
            <div className="column">
              <div className="field">
                <label className="label">Supplier</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="Supplier name"
                  />
                </div>
              </div>
            </div>

            <div className="column">
              <div className="field">
                <label className="label">Supplier Code</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="supplier_code"
                    value={formData.supplier_code}
                    onChange={handleChange}
                    placeholder="Supplier part code"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Unit Price</label>
            <div className="control">
              <input
                className="input"
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Unit price"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Notes</label>
            <div className="control">
              <textarea
                className="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes"
              ></textarea>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                type="submit"
                className={`button is-primary ${isSubmitting ? "is-loading" : ""}`}
                disabled={isSubmitting}
              >
                {isEdit ? "Update" : "Submit"}
              </button>
            </div>
            <div className="control">
              <button
                type="button"
                className="button is-light"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
