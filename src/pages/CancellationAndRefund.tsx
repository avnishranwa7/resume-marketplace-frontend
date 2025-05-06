import React from "react";
import "../styles/PrivacyPolicy.css";
import useDocumentTitle from '../hooks/useDocumentTitle';

const CancellationAndRefund: React.FC = () => {
  useDocumentTitle('Cancellation & Refund');

  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1>Cancellation and Refund Policy</h1>
        <section>
          <h2>1. Cancellation Policy</h2>
          <p>
            As Resume Marketplace provides digital products and services, orders once placed and paid for cannot be cancelled. Please review your order carefully before making a payment.
          </p>
        </section>
        <section>
          <h2>2. Refund Policy</h2>
          <p>
            Refunds will only be provided in the event of a technical error or failed delivery of purchased profile contacts. If you believe you are eligible for a refund, please contact us within 7 days of your purchase with your order details and a description of the issue.
          </p>
        </section>
        <section>
          <h2>3. How to Request a Refund</h2>
          <p>
            To request a refund, please email us at <a href="mailto:avnishranwa7@gmail.com">avnishranwa7@gmail.com</a> with your order ID, registered email address, and a brief explanation of the issue. Our team will review your request and respond within 3-5 business days.
          </p>
        </section>
        <section>
          <h2>4. Contact Us</h2>
          <p>
            For any questions about our cancellation and refund policy, please contact us at <a href="mailto:avnishranwa7@gmail.com">avnishranwa7@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CancellationAndRefund; 