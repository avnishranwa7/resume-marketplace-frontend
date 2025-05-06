import React from "react";
import "../styles/PrivacyPolicy.css";
import useDocumentTitle from '../hooks/useDocumentTitle';

const ShippingAndDelivery: React.FC = () => {
  useDocumentTitle('Shipping & Delivery');

  return (
    <div className="privacy-container">
      <div className="privacy-content">
        <h1>Shipping and Delivery Policy</h1>
        <section>
          <h2>1. Digital Product Delivery</h2>
          <p>
            Resume Marketplace provides digital products and services. Upon successful payment, purchased profile contact unlocks are instantly credited to your account. No physical goods are shipped.
          </p>
        </section>
        <section>
          <h2>2. Accessing Your Purchase</h2>
          <p>
            You can access your purchased profile contacts by logging into your account. The number of available contacts will be updated immediately after a successful transaction.
          </p>
        </section>
        <section>
          <h2>3. Delivery Issues</h2>
          <p>
            If you do not see your purchased contacts reflected in your account within a few minutes, please contact our support team at <a href="mailto:avnishranwa7@gmail.com">avnishranwa7@gmail.com</a> for assistance.
          </p>
        </section>
        <section>
          <h2>4. Contact Us</h2>
          <p>
            For any questions about our shipping and delivery policy, please contact us at <a href="mailto:avnishranwa7@gmail.com">avnishranwa7@gmail.com</a>.
          </p>
        </section>
        <section>
          <h2>5. Additional Shipping & Delivery Details</h2>
          <ul style={{ paddingLeft: '1.2em', marginBottom: 0 }}>
            <li>
              <strong>International Buyers:</strong> Orders are shipped and delivered through registered international courier companies and/or International speed post only.
            </li>
            <li>
              <strong>Domestic Buyers:</strong> Orders are shipped through registered domestic courier companies and/or speed post only.
            </li>
            <li>
              <strong>Shipping Timelines:</strong> Orders are shipped within <em>Not Applicable</em> or as per the delivery date agreed at the time of order confirmation, subject to courier company/post office norms.
            </li>
            <li>
              <strong>Liability:</strong> Resume Marketplace is not liable for any delay in delivery by the courier company/postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within <em>Not Applicable</em> from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
            </li>
            <li>
              <strong>Delivery Address:</strong> Delivery of all orders will be to the address provided by the buyer.
            </li>
            <li>
              <strong>Service Confirmation:</strong> Delivery of our services will be confirmed on your email ID as specified during registration.
            </li>
            <li>
              <strong>Support:</strong> For any issues in utilizing our services, you may contact our helpdesk at <a href="tel:+919950121676" style={{ color: '#4361EE', fontWeight: 600 }}>9950121676</a> or <a href="mailto:avnishranwa7@gmail.com" style={{ color: '#4361EE', fontWeight: 600 }}>avnishranwa7@gmail.com</a>.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ShippingAndDelivery; 