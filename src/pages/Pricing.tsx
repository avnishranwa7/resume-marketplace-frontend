import React from 'react';
import styles from "./Pricing.module.css";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from '../hooks/useDocumentTitle';

const Pricing: React.FC = () => {
  useDocumentTitle('Pricing');

  const navigate = useNavigate();

  return (
    <div className={styles.pricingPage}>
      <div className={styles.pricingHeader}>
        <h1>Pay Per Profile</h1>
        <p>
          View candidate profiles for free. Pay only when you want to contact
          them.
        </p>
      </div>

      <div className={styles.pricingCards}>
        <div className={styles.pricingCard}>
          <div className={styles.cardHeader}>
            <h2>Free</h2>
            <p className={styles.price}>₹0</p>
            <p className={styles.priceSubtitle}>forever</p>
          </div>
          <div className={styles.features}>
            <div className={styles.feature}>
              <CheckCircleIcon className={styles.featureIcon} />
              <span>View candidate profiles</span>
            </div>
            <div className={styles.feature}>
              <CheckCircleIcon className={styles.featureIcon} />
              <span>Search and filter candidates</span>
            </div>
            <div className={styles.feature}>
              <CheckCircleIcon className={styles.featureIcon} />
              <span>Save profiles to favorites</span>
            </div>
            <div className={styles.feature}>
              <CancelIcon className={styles.featureIcon} />
              <span>Access contact details</span>
            </div>
          </div>
          <Button
            variant="outlined"
            className={styles.planButton}
            sx={{
              borderColor: "#4361EE",
              color: "#4361EE",
              "&:hover": {
                borderColor: "#4361EE",
                backgroundColor: "#f7faff",
              },
            }}
          >
            Current Plan
          </Button>
        </div>

        <div className={`${styles.pricingCard} ${styles.popular}`}>
          <div className={styles.popularBadge}>Most Popular</div>
          <div className={styles.cardHeader}>
            <h2>Contact Access</h2>
            <p className={styles.price}>₹49</p>
            <p className={styles.priceSubtitle}>per profile</p>
          </div>
          <div className={styles.features}>
            <div className={styles.feature}>
              <CheckCircleIcon className={styles.featureIcon} />
              <span>All Free features</span>
            </div>
            <div className={styles.feature}>
              <CheckCircleIcon className={styles.featureIcon} />
              <span>Access one profile's contact details</span>
            </div>
            <div className={styles.feature}>
              <CheckCircleIcon className={styles.featureIcon} />
              <span>Email and phone number access</span>
            </div>
            <div className={styles.feature}>
              <CheckCircleIcon className={styles.featureIcon} />
              <span>Direct contact with the candidate</span>
            </div>
          </div>
          <Button
            variant="contained"
            onClick={() => navigate("/buy-contacts")}
            className={styles.planButton}
            sx={{
              backgroundColor: "#4361EE",
              "&:hover": {
                backgroundColor: "#3651d4",
              },
            }}
          >
            Buy Contact Access
          </Button>
        </div>
      </div>

      <div className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3>How does the pricing work?</h3>
            <p>
              You can view all candidate profiles for free. When you find a
              candidate you want to contact, you can purchase access to their
              contact details for ₹49 per profile. Each purchase gives you
              access to one profile's contact information.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>Do I need to pay for each profile separately?</h3>
            <p>
              Yes, each profile's contact details require a separate purchase of
              ₹49. This allows you to only pay for the candidates you're
              genuinely interested in contacting.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>Is there a subscription required?</h3>
            <p>
              No, there's no subscription. You only pay for the specific
              profiles you want to contact. Each purchase is a one-time payment
              for that profile's contact details.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>How do I pay?</h3>
            <p>
              We accept all major credit cards, debit cards, and UPI payments
              through our secure payment gateway. Payment is required only when
              you want to access a profile's contact details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
