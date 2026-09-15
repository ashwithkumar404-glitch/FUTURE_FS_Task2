function LeadStatus({ status }) {
  return (
    <span className={`lead-status ${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

export default LeadStatus;