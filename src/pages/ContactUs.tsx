import React, { useState } from "react";
import "../styles/ContactUs.css";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // TODO: Implement contact form submission
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-info-blue">
          <h1>Contact Us</h1>
          <p>
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>

          <div className="contact-details">
            <div className="contact-item">
              <h3>Merchant Details</h3>
              <p>
                <strong>Legal Entity Name:</strong> Resume Marketplace
              </p>
              <p>
                <strong>Registered Address:</strong> 42, Pratap Nagar, Ext-B,
                Murlipura
              </p>
              <p>Jaipur, RAJASTHAN 302013</p>
            </div>

            <div className="contact-item">
              <h3>Contact Information</h3>
              <p>
                <strong>Telephone:</strong>{" "}
                <a href="tel:+919950121676">+91 99501 21676</a>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:avnishranwa7@gmail.com">
                  avnishranwa7@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Your message"
                rows={5}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && (
              <div className="success-message">Message sent successfully!</div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
