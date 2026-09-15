import { useState } from 'react';
import { supabase } from '../lib/supabase';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Website',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');
    setSubmitted(false);

    const { error: insertError } = await supabase
      .from('leads')
      .insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        source: form.source,
        message: form.message.trim(),
      });

    setLoading(false);

   if (insertError) {
  console.error('Supabase insert error:', insertError);

  setError(
    `Unable to submit enquiry: ${insertError.message}`
  );

  return;
}

    setSubmitted(true);

    setForm({
      name: '',
      email: '',
      phone: '',
      source: 'Website',
      message: '',
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-intro">
          <div className="contact-brand">
            <div className="brand-icon">L</div>

            <div>
              <h1>LeadEase</h1>
              <span>Simple CRM</span>
            </div>
          </div>

          <p className="eyebrow">Get in touch</p>

          <h2>
            Tell us what
            <br />
            you need.
          </h2>

          <p>
            Fill out the form and our team will get back to
            you shortly.
          </p>

          <div className="contact-info">
            <div>
              <strong>Quick response</strong>
              <span>Your enquiry goes directly to our team.</span>
            </div>

            <div>
              <strong>Secure submission</strong>
              <span>Your information is securely stored.</span>
            </div>
          </div>
        </div>

        <div className="contact-card">
          <div className="card-heading">
            <p className="eyebrow">Enquiry Form</p>
            <h3>Send us a message</h3>
          </div>

          {submitted && (
            <div className="success-message">
              Thank you! Your enquiry has been submitted
              successfully.
            </div>
          )}

          {error && (
            <div className="error-state">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="contact-form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="contact-form-grid">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>

               <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength="10"
              />
              </div>

              <div className="form-group">
                <label htmlFor="source">How did you find us?</label>

                <select
                  id="source"
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>

              <textarea
              id="message"
              name="message"
              placeholder="Tell us about your enquiry..."
              value={form.message}
              onChange={handleChange}
              maxLength="1000"
              required
            />
                        </div>

            <button
              type="submit"
              className="contact-submit-button"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </form>

          <a
            href="/"
            className="admin-login-link"
          >
            Admin login →
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;