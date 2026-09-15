function Sidebar({
  currentPage,
  setCurrentPage,
  onLogout,
  onSettings,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">L</div>

        <div>
          <h2>LeadEase</h2>
          <span>CRM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${
            currentPage === 'overview'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setCurrentPage('overview')
          }
        >
          <span>⌂</span>
          <span>Overview</span>
        </button>

        <button
          className={`nav-item ${
            currentPage === 'leads' ||
            currentPage === 'lead-details'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setCurrentPage('leads')
          }
        >
          <span>◉</span>
          <span>Leads</span>
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button
          className="nav-item"
          onClick={onSettings}
        >
          <span>⚙</span>
          <span>Settings</span>
        </button>

        <button
          className="nav-item logout"
          onClick={onLogout}
        >
          <span>↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;