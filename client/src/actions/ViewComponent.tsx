import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Component } from "../types/Component";
import { formatToLocalDateTime } from "../utils/Formatters";

export default function ViewComponent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [component, setComponent] = useState<Component | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/components/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch component: ${response.statusText}`);
        }

        const data = await response.json();
        setComponent(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchComponent();
    }
  }, [id]);

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <div className="box">
            <div className="skeleton-block"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !component) {
    return (
      <section className="section">
        <div className="container">
          <div className="notification is-danger">
            {error || "Component not found"}
          </div>
          <button className="button" onClick={() => navigate("/")}>
            Back to List
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <a href="/">Components</a>
            </li>
            <li className="is-active">
              <a href="#" aria-current="page">
                {component.name}
              </a>
            </li>
          </ul>
        </nav>

        <div className="box">
          <h1 className="title">{component.name}</h1>

          <div className="columns is-multiline">
            <div className="column is-half">
              <div className="field">
                <label className="label">Category</label>
                <div className="control">
                  <p>{component.category}</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Value</label>
                <div className="control">
                  <p>{component.value}</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Package</label>
                <div className="control">
                  <p>{component.package}</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Location</label>
                <div className="control">
                  <p>{component.location}</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Quantity</label>
                <div className="control">
                  <p>{component.quantity}</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Minimum Quantity</label>
                <div className="control">
                  <p>{component.min_quantity}</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Supplier</label>
                <div className="control">
                  <p>{component.supplier}</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Supplier Code</label>
                <div className="control">
                  <p>{component.supplier_code}</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Unit Price</label>
                <div className="control">
                  <p>${component.unit_price.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="column is-full">
              <div className="field">
                <label className="label">Datasheet URL</label>
                <div className="control">
                  {component.datasheet_url ? (
                    <a
                      href={component.datasheet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {component.datasheet_url}
                    </a>
                  ) : (
                    <p>No datasheet available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="column is-full">
              <div className="field">
                <label className="label">Notes</label>
                <div className="control">
                  <p>{component.notes || "No notes"}</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Created At</label>
                <div className="control">
                  <p>{formatToLocalDateTime(component.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="column is-half">
              <div className="field">
                <label className="label">Updated At</label>
                <div className="control">
                  <p>{formatToLocalDateTime(component.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="buttons mt-5">
            <button
              className="button is-info"
              onClick={() => navigate(`/edit/${component.id}`)}
            >
              Edit
            </button>
            <button className="button" onClick={() => navigate(`/`)}>
              Back to List
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
