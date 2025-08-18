import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Component } from "../types/Component";

export default function ListComponents() {
  const [components, setComponents] = useState<Component[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const longPressTimeoutRef = useRef<number | null>(null);
  const longPressDuration = 800; // 800ms for long press

  async function fetchComponents() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/components");
      const data = await response.json();
      setComponents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchComponents();

    return () => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, []);

  // Handle mouse/touch down - start the long press timer
  const handlePointerDown = (id: string) => {
    longPressTimeoutRef.current = window.setTimeout(() => {
      navigate(`/edit/${id}`);
      longPressTimeoutRef.current = null;
    }, longPressDuration);
  };

  // Handle mouse/touch up - if it's a short press, navigate to view
  const handlePointerUp = (id: string) => {
    if (longPressTimeoutRef.current) {
      window.clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
      navigate(`/view/${id}`);
    }
  };

  // Handle leaving the element before mouse/touch up
  const handlePointerLeave = () => {
    if (longPressTimeoutRef.current) {
      window.clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title">Components</h1>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button
                className="button is-primary"
                onClick={() => navigate("/add")}
              >
                Add New Component
              </button>
            </div>
          </div>
        </div>

        <div className="notification is-info is-light mb-5">
          <p>
            Tip: Click on a row to view details. Press and hold for 0.8 seconds
            to edit.
          </p>
        </div>

        {isLoading ? (
          <div className="skeleton-block"></div>
        ) : (
          <table className="table is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Value</th>
                <th>Package</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Supplier</th>
                <th>Supplier Code</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {components.map((component) => (
                <tr
                  key={component.id}
                  onPointerDown={() => handlePointerDown(component.id)}
                  onPointerUp={() => handlePointerUp(component.id)}
                  onPointerLeave={handlePointerLeave}
                  className="is-clickable"
                  style={{
                    touchAction: "none",
                  }} /* Prevents scrolling on touch devices during interaction */
                >
                  <td>{component.name}</td>
                  <td>{component.category}</td>
                  <td>{component.value}</td>
                  <td>{component.package}</td>
                  <td>{component.quantity}</td>
                  <td>{component.location}</td>
                  <td>{component.supplier}</td>
                  <td>{component.supplier_code}</td>
                  <td>{component.unit_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
