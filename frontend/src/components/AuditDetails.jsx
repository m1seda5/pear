import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useFetch from "../hooks/useFetch";

const AuditDetails = ({ audit }) => {
  return (
    <div className="audit-details">
      <h2>Audit Details</h2>
      <div className="audit-info">
        <p><strong>User:</strong> {audit.user}</p>
        <p><strong>Action:</strong> {audit.action}</p>
        <p><strong>Timestamp:</strong> {new Date(audit.timestamp).toLocaleString()}</p>
        <p><strong>Details:</strong> {audit.details}</p>
      </div>
    </div>
  );
};

export default AuditDetails;