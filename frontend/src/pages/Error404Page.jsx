import React from "react";

const Error404Page = () => (
  <div className="container">
    <div className="error-page has-text-centered" style={{ padding: '80px 0' }}>
      <h1 className="title is-1">404</h1>
      <h2 className="subtitle is-3">Page Not Found</h2>
      <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="button is-solid primary-button">Go Home</a>
    </div>
  </div>
);

export default Error404Page; 