function Topbar() {
  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">Workspace</p>
        <h1>Overview</h1>
      </div>

      <div className="admin-profile">
        <div className="admin-avatar">A</div>

        <div>
          <strong>Admin</strong>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  );
}

export default Topbar;