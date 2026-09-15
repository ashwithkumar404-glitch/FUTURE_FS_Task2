import { useEffect, useState } from 'react';
import LeadStatus from '../components/LeadStatus';
import { supabase } from '../lib/supabase';

function LeadDetails({ lead, onBack }) {
  const [status, setStatus] = useState(lead.status);
  const [followUps, setFollowUps] = useState([]);
  const [note, setNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const [loadingNotes, setLoadingNotes] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFollowUps() {
      setLoadingNotes(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('follow_ups')
        .select('*')
        .eq('lead_id', lead.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error(fetchError);
        setError('Unable to load follow-up notes.');
      } else {
        setFollowUps(data || []);
      }

      setLoadingNotes(false);
    }

    fetchFollowUps();
  }, [lead.id]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    setSavingStatus(true);
    setError('');

    const { error: updateError } = await supabase
      .from('leads')
      .update({
        status: newStatus,
      })
      .eq('id', lead.id);

    if (updateError) {
      console.error(updateError);
      setError('Unable to update lead status.');
    } else {
      setStatus(newStatus);
    }

    setSavingStatus(false);
  };

  const handleAddNote = async () => {
    if (!note.trim()) {
      setError('Please enter a follow-up note.');
      return;
    }

    if (!followUpDate) {
      setError('Please select a follow-up date.');
      return;
    }

    setSavingNote(true);
    setError('');

    const { data, error: insertError } = await supabase
      .from('follow_ups')
      .insert({
        lead_id: lead.id,
        note: note.trim(),
        follow_up_date: followUpDate,
      })
      .select()
      .single();

    if (insertError) {
      console.error(insertError);
      setError('Unable to save the follow-up note.');
    } else {
      setFollowUps((previous) => [data, ...previous]);
      setNote('');
      setFollowUpDate('');
    }

    setSavingNote(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return 'No date';
    }

    return new Date(dateString).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  return (
    <section className="lead-details-page">
      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Leads
      </button>

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}

      <div className="details-header">
        <div className="details-person">
          <div className="large-lead-avatar">
            {lead.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="eyebrow">Lead Details</p>
            <h2>{lead.name}</h2>
            <span>{lead.email}</span>
          </div>
        </div>

        <LeadStatus status={status} />
      </div>

      <div className="details-grid">
        <div className="details-main">

          <div className="details-card">
            <div className="card-heading">
              <div>
                <p className="eyebrow">Contact</p>
                <h3>Contact Information</h3>
              </div>
            </div>

            <div className="contact-grid">
              <div className="contact-item">
                <span>Email</span>
                <strong>{lead.email}</strong>
              </div>

              <div className="contact-item">
                <span>Phone</span>
                <strong>{lead.phone || '—'}</strong>
              </div>

              <div className="contact-item">
                <span>Source</span>
                <strong>{lead.source}</strong>
              </div>

              <div className="contact-item">
                <span>Received</span>
                <strong>
                  {formatDate(lead.created_at)}
                </strong>
              </div>
            </div>
          </div>

          <div className="details-card">
            <div className="card-heading">
              <div>
                <p className="eyebrow">Message</p>
                <h3>Customer Enquiry</h3>
              </div>
            </div>

            <p className="lead-message">
              {lead.message || 'No message provided.'}
            </p>
          </div>

          <div className="details-card">
            <div className="card-heading">
              <div>
                <p className="eyebrow">Communication</p>
                <h3>Follow-up Notes</h3>
              </div>
            </div>

            <div className="note-form">
              <textarea
                placeholder="Add a note or follow-up..."
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
              />

              <div className="follow-up-input-row">
                <div className="follow-up-date-field">
                  <label htmlFor="followUpDate">
                    Follow-up date
                  </label>

                  <input
                    id="followUpDate"
                    type="date"
                    value={followUpDate}
                    onChange={(event) =>
                      setFollowUpDate(event.target.value)
                    }
                  />
                </div>

                <button
                  onClick={handleAddNote}
                  disabled={savingNote}
                >
                  {savingNote
                    ? 'Saving...'
                    : 'Add Follow-up'}
                </button>
              </div>
            </div>

            <div className="follow-up-list">
              {loadingNotes ? (
                <p className="notes-loading">
                  Loading notes...
                </p>
              ) : followUps.length > 0 ? (
                followUps.map((item) => (
                  <div
                    className="follow-up-item"
                    key={item.id}
                  >
                    <div className="follow-up-dot"></div>

                    <div className="follow-up-content">
                      <p>{item.note}</p>

                      <div className="follow-up-meta">
                        <span>
                          Follow-up:{' '}
                          {formatDate(item.follow_up_date)}
                        </span>

                        <span>
                          Added:{' '}
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="notes-loading">
                  No follow-up notes yet.
                </p>
              )}
            </div>
          </div>

        </div>

        <aside className="details-side">

          <div className="details-card">
            <p className="eyebrow">Lead Status</p>
            <h3>Update Status</h3>

            <select
              className="status-select"
              value={status}
              onChange={handleStatusChange}
              disabled={savingStatus}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
            </select>

            {savingStatus && (
              <p className="save-message">
                Saving status...
              </p>
            )}
          </div>

          <div className="details-card">
            <p className="eyebrow">Quick Action</p>
            <h3>Contact Lead</h3>

            <div className="quick-actions">
              <a href={`mailto:${lead.email}`}>
                Email
              </a>

              {lead.phone && (
                <a href={`tel:${lead.phone}`}>
                  Call
                </a>
              )}
            </div>
          </div>

        </aside>
      </div>
    </section>
  );
}

export default LeadDetails;