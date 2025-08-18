import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Component } from "../types/Component";
import ComponentForm, { ComponentFormData } from "../forms/Component";

export default function EditComponent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<ComponentFormData | null>(
    null,
  );
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

        const component: Component = await response.json();

        // Extract only the editable fields
        const {
          id: _id,
          created_at: _created,
          updated_at: _updated,
          ...editableData
        } = component;

        setInitialData(editableData);
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

  const handleSubmit = async (formData: ComponentFormData): Promise<void> => {
    const response = await fetch(`/api/components/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update component");
    }
  };

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

  if (error || !initialData) {
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
            <li>
              <a href={`/view/${id}`}>{initialData.name}</a>
            </li>
            <li className="is-active">
              <a href="#" aria-current="page">
                Edit
              </a>
            </li>
          </ul>
        </nav>

        <h1 className="title">Edit Component: {initialData.name}</h1>

        <ComponentForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isEdit={true}
          componentId={id}
        />
      </div>
    </section>
  );
}
