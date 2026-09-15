import { useEffect, useState } from 'react';
import LeadStatus from '../components/LeadStatus';
import { supabase } from '../lib/supabase';

function Leads({ onViewLead }) {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error(fetchError);
      setError('Unable to load leads.');
    } else {
      setLeads(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingId(leadId);
    setError('');

    const { error: updateError } = await supabase
      .from('leads')
      .update({
        status: newStatus,
      })
      .eq('id', leadId);

    if (updateError) {
      console.error(updateError);
      setError('Unable to update lead status.');
    } else {
      setLeads((previousLeads) =>
        previousLeads.map((lead) =>
          lead.id === leadId
            ? { ...lead, status: newStatus }
            : lead
        )
      );
    }

    setUpdatingId(null);
  };

  const filteredLeads = leads.filter((lead) => {
    const searchText = search.toLowerCase();

  const matchesSearch =
  lead.name.toLowerCase().includes(searchText) ||
  lead.email.toLowerCase().includes(searchText) ||
  (lead.phone || '').toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === 'All' ||
      lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="leads-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Management</p>

          <h2>Leads</h2>

          <p>
            Search, review and manage all your leads.
          </p>
        </div>
      </div>

      <div className="lead-tools">
        <div className="search-box">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Converted">Converted</option>
        </select>
      </div>

      {loading && (
        <div className="empty-state">
          Loading leads...
        </div>
      )}

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="leads-table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-person">
                        <div className="lead-avatar">
                          {lead.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>{lead.name}</strong>
                          <span>{lead.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>{lead.phone || '—'}</td>

                    <td>{lead.source}</td>

                    <td>
                      <div className="status-control">
                        <LeadStatus status={lead.status} />

                        <select
                          value={lead.status}
                          disabled={updatingId === lead.id}
                          onChange={(event) =>
                            handleStatusChange(
                              lead.id,
                              event.target.value
                            )
                          }
                        >
                          <option value="New">
                            New
                          </option>

                          <option value="Contacted">
                            Contacted
                          </option>

                          <option value="Converted">
                            Converted
                          </option>
                        </select>
                      </div>
                    </td>

                    <td>
                      {new Date(
                        lead.created_at
                      ).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td>
                      <button
                        className="view-lead-button"
                        onClick={() =>
                          onViewLead(lead)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="no-leads"
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Leads;