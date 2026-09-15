import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import LeadStatus from '../components/LeadStatus';
import { supabase } from '../lib/supabase';

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const { data: leadsData, error: leadsError } =
        await supabase
          .from('leads')
          .select('*')
          .order('created_at', {
            ascending: false,
          });

      const { data: followUpsData, error: followUpsError } =
        await supabase
          .from('follow_ups')
          .select(`
            *,
            leads (
              name,
              email,
              status
            )
          `)
          .order('follow_up_date', {
            ascending: true,
          })
          .limit(10);

      if (leadsError) {
        console.error('Leads error:', leadsError);
      }

      if (followUpsError) {
        console.error(
          'Follow-up error:',
          followUpsError
        );
      }

      setLeads(leadsData || []);
      setFollowUps(followUpsData || []);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === 'New'
  ).length;

  const contactedLeads = leads.filter(
    (lead) => lead.status === 'Contacted'
  ).length;

  const convertedLeads = leads.filter(
    (lead) => lead.status === 'Converted'
  ).length;

  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (convertedLeads / totalLeads) * 100
        )
      : 0;

  const recentLeads = leads.slice(0, 5);
  const sourceCounts = leads.reduce((counts, lead) => {
  const source = lead.source || 'Other';

  counts[source] = (counts[source] || 0) + 1;

  return counts;
}, {});

const sourceEntries = Object.entries(sourceCounts).sort(
  (a, b) => b[1] - a[1]
);

const maxSourceCount =
  sourceEntries.length > 0
    ? sourceEntries[0][1]
    : 1;

  const upcomingFollowUps = followUps.filter(
    (item) => item.follow_up_date
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getFollowUpLabel = (dateString) => {
    const followUpDate = new Date(
      `${dateString}T00:00:00`
    );

    const difference = Math.round(
      (followUpDate - today) /
        (1000 * 60 * 60 * 24)
    );

    if (difference < 0) {
      return 'Overdue';
    }

    if (difference === 0) {
      return 'Today';
    }

    if (difference === 1) {
      return 'Tomorrow';
    }

    return `In ${difference} days`;
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return '—';
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
    <section className="dashboard">
      <div className="welcome">
        <div>
          <p className="eyebrow">Dashboard</p>

          <h2>
            Welcome back, Admin.
          </h2>

          <p>
            Keep track of enquiries, follow-ups and
            conversions from one place.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          description="All enquiries received"
        />

        <StatCard
          title="New Leads"
          value={newLeads}
          description="Awaiting first contact"
        />

        <StatCard
          title="Contacted"
          value={contactedLeads}
          description="Leads currently being handled"
        />

        <StatCard
          title="Converted"
          value={convertedLeads}
          description="Successfully converted"
        />
      </div>

      <div className="analytics-card">
        <div className="card-heading">
          <div>
            <p className="eyebrow">
              Performance
            </p>

            <h3>Conversion Overview</h3>
          </div>

          <strong className="conversion-rate">
            {conversionRate}%
          </strong>
        </div>

        <div className="conversion-bar">
          <div
            className="conversion-progress"
            style={{
              width: `${conversionRate}%`,
            }}
          ></div>
        </div>

        <div className="conversion-info">
          <span>
            {convertedLeads} converted
          </span>

          <span>
            {totalLeads} total leads
          </span>
        </div>
      </div>

      <div className="analytics-card">
        <div className="card-heading">
          <div>
            <p className="eyebrow">
              Follow-up Intelligence
            </p>

            <h3>Upcoming Follow-ups</h3>
          </div>
        </div>

        {loading ? (
          <p className="notes-loading">
            Loading follow-ups...
          </p>
        ) : upcomingFollowUps.length > 0 ? (
          <div className="follow-up-dashboard-list">
            {upcomingFollowUps.map((item) => {
              const label = getFollowUpLabel(
                item.follow_up_date
              );

              return (
                <div
                  className="upcoming-follow-up"
                  key={item.id}
                >
                  <div className="follow-up-date-box">
                    <strong>
                      {new Date(
                        `${item.follow_up_date}T00:00:00`
                      ).getDate()}
                    </strong>

                    <span>
                      {new Date(
                        `${item.follow_up_date}T00:00:00`
                      ).toLocaleDateString(
                        'en-IN',
                        {
                          month: 'short',
                        }
                      )}
                    </span>
                  </div>

                  <div className="upcoming-follow-up-info">
                    <strong>
                      {item.leads?.name ||
                        'Unknown lead'}
                    </strong>

                    <span>
                      {item.note}
                    </span>
                  </div>

                  <div className="upcoming-follow-up-status">
                    <LeadStatus
                      status={
                        item.leads?.status ||
                        'New'
                      }
                    />

                    <span
                      className={`follow-up-label ${
                        label === 'Overdue'
                          ? 'overdue'
                          : label === 'Today'
                          ? 'today'
                          : ''
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="notes-loading">
            No follow-up dates available.
          </p>
        )}
      </div>

      <div className="recent-section">
        <div className="analytics-card">
  <div className="card-heading">
    <div>
      <p className="eyebrow">
        Acquisition
      </p>

      <h3>Lead Sources</h3>
    </div>

    <span className="source-summary">
      {sourceEntries.length} sources
    </span>
  </div>

  {sourceEntries.length > 0 ? (
    <div className="source-analytics">
      {sourceEntries.map(([source, count]) => {
        const percentage = Math.round(
          (count / maxSourceCount) * 100
        );

        return (
          <div
            className="source-row"
            key={source}
          >
            <div className="source-row-header">
              <span>{source}</span>

              <strong>{count}</strong>
            </div>

            <div className="source-bar">
              <div
                className="source-progress"
                style={{
                  width: `${percentage}%`,
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="notes-loading">
      No lead source data available yet.
    </p>
  )}
</div>
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              Activity
            </p>

            <h3>Recent Leads</h3>
          </div>
        </div>

        {loading ? (
          <p className="notes-loading">
            Loading leads...
          </p>
        ) : recentLeads.length > 0 ? (
          <div className="lead-list">
            {recentLeads.map((lead) => (
              <div
                className="lead-row"
                key={lead.id}
              >
                <div className="lead-avatar">
                  {lead.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="lead-info">
                  <strong>
                    {lead.name}
                  </strong>

                  <span>
                    {lead.email}
                  </span>
                </div>

                <div className="lead-source">
                  {lead.source}
                </div>

                <LeadStatus
                  status={lead.status}
                />

                <span className="lead-date">
                  {formatDate(
                    lead.created_at
                  )}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="notes-loading">
            No leads available yet.
          </p>
        )}
      </div>
    </section>
  );
}

export default Dashboard;