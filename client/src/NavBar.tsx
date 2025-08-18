import React from "react";

export default function () {
  return (
    <header className="section mt-2">
      <div className="container">
        <nav className="navbar">
          <div className="navbar-brand">
            <a className="navbar-item" href="/">
              <img src="/logo.png" alt="Order Bits" />
            </a>
            <a
              role="button"
              className="navbar-burger"
              aria-label="menu"
              aria-expanded="false"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div className="navbar-menu">
            <div className="navbar-start">
              <a className="navbar-item" href="/">
                Components
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
