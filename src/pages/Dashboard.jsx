import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import LeadStatus from '../components/LeadStatus';
import { supabase } from '../lib/supabase';

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);

    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

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
        .order('follow_up_date', { ascending: true })
        .limit(10);

    if (leadsError) {
      console.error('Dashboard leads error:', leadsError);
      setLeads([]);
    } else {
      setLeads(leadsData || []);
    }

    if (followUpsError) {
      console.error(
        'Dashboard follow-ups error:',
        followUpsError
      );
      setFollowUps([]);
    } else {
      setFollowUps(followUpsData || []);
    }

    setLoading(false);
  };

  useEffect(() => {
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

  const recentLeads = leads.slice(0, 5);

  const conversionRate =
    totalLeads > 0
      ? Math.round(
          (convertedLeads / totalLeads) * 100
        )
      : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingFollowUps = followUps.filter((item) => {
    if (!item.follow_up_date) {
      return false;
    }

    const date = new Date(
      `${item.follow_up_date}T00:00:00`
    );

    return date >= today;
  });

  const getFollowUpLabel = (dateString) => {
    const followUpDate = new Date(
      `${dateString}T00:00:00`
    );

    const difference =
      Math.round(
        (followUpDate - today) /
          (1000 * 60 * 60 * 24)
      );

    if (difference === 0) {
      return 'Today';
    }

    if (difference === 1) {
      return 'Tomorrow';
    }

    return followUpDate.toLocaleDateString(
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
        <p className="eyebrow">Today</p>

        <h2>Good morning, Admin</h2>

        <p>
          Here's a quick look at what's happening with your leads.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Leads"
          value={totalLeads}
          description="All enquiries"
        />

        <StatCard
          title="New"
          value={newLeads}
          description="Need attention"
        />

        <StatCard
          title="Contacted"
          value={contactedLeads}
          description="Currently followed up"
        />

        <StatCard
          title="Converted"
          value={convertedLeads}
          description="Successful leads"
        />
      </div>

      {/* Conversion Overview */}

      <div className="analytics-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Performance</p>

            <h3>Lead Conversion Overview</h3>
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
            {convertedLeads} of {totalLeads} leads converted
          </span>

          <span>
            Conversion rate
          </span>
        </div>
      </div>

      {/* Upcoming Follow-ups */}

      <div className="recent-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Priority</p>

            <h3>Upcoming Follow-ups</h3>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading follow-ups...
          </div>
        ) : upcomingFollowUps.length > 0 ? (
          <div className="follow-up-dashboard-list">
            {upcomingFollowUps.map((item) => (
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
                    ).toLocaleDateString('en-IN', {
                      month: 'short',
                    })}
                  </span>
                </div>

                <div className="upcoming-follow-up-info">
                  <strong>
                    {item.leads?.name || 'Unknown Lead'}
                  </strong>

                  <span>
                    {item.note}
                  </span>
                </div>

                <div className="upcoming-follow-up-status">
                  <span className="follow-up-label">
                    {getFollowUpLabel(
                      item.follow_up_date
                    )}
                  </span>

                  {item.leads?.status && (
                    <LeadStatus
                      status={item.leads.status}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No upcoming follow-ups.
          </div>
        )}
      </div>

      {/* Recent Leads */}

      <div className="recent-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Activity</p>

            <h3>Recent Leads</h3>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            Loading recent leads...
          </div>
        ) : (
          <div className="lead-list">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div
                  className="lead-row"
                  key={lead.id}
                >
                  <div>
                    <strong>{lead.name}</strong>

                    <span>{lead.email}</span>
                  </div>

                  <span>{lead.source}</span>

                  <LeadStatus status={lead.status} />
                </div>
              ))
            ) : (
              <div className="empty-state">
                No leads available yet.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;