import React from "react";
import "../styles/TermsAndConditions.css";
import useDocumentTitle from '../hooks/useDocumentTitle';

const TermsAndConditions: React.FC = () => {
  useDocumentTitle('Terms & Conditions');

  return (
    <div className="privacy-container">
      <div className="privacy-content">
      <h1>Terms and Conditions</h1>
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to our Resume Marketplace. By accessing and using this
            platform, you agree to be bound by these Terms and Conditions.
          </p>
          <p>
            For the purpose of these Terms and Conditions, The term "we", "us",
            "our" used anywhere on this page shall mean Resume Marketplace,
            whose registered/operational office is 42, Pratap Nagar, Ext-B,
            Murlipura Jaipur RAJASTHAN 302013. "you", "your", "user", "visitor"
            shall mean any natural or legal person who is visiting our website
            and/or agreed to purchase from us.
          </p>
          <p>
            Your use of the website and/or purchase from us are governed by
            following Terms and Conditions:
          </p>
        </section>

        <section>
          <h2>2. Website Content and Changes</h2>
          <p>
            The content of the pages of this website is subject to change
            without notice.
          </p>
          <p>
            Neither we nor any third parties provide any warranty or guarantee
            as to the accuracy, timeliness, performance, completeness or
            suitability of the information and materials found or offered on
            this website for any particular purpose. You acknowledge that such
            information and materials may contain inaccuracies or errors and we
            expressly exclude liability for any such inaccuracies or errors to
            the fullest extent permitted by law.
          </p>
          <p>
            Your use of any information or materials on our website and/or
            product pages is entirely at your own risk, for which we shall not
            be liable. It shall be your own responsibility to ensure that any
            products, services or information available through our website
            and/or product pages meet your specific requirements.
          </p>
        </section>

        <section>
          <h2>3. Intellectual Property and Copyright</h2>
          <p>
            Our website contains material which is owned by or licensed to us.
            This material includes, but are not limited to, the design, layout,
            look, appearance and graphics. Reproduction is prohibited other than
            in accordance with the copyright notice, which forms part of these
            terms and conditions.
          </p>
          <p>
            All trademarks reproduced in our website which are not the property
            of, or licensed to, the operator are acknowledged on the website.
          </p>
          <p>
            Unauthorized use of information provided by us shall give rise to a
            claim for damages and/or be a criminal offense.
          </p>
        </section>

        <section>
          <h2>4. External Links and Website Usage</h2>
          <p>
            From time to time our website may also include links to other
            websites. These links are provided for your convenience to provide
            further information.
          </p>
          <p>
            You may not create a link to our website from another website or
            document without Resume Marketplace's prior written consent.
          </p>
        </section>

        <section>
          <h2>5. User Accounts</h2>
          <p>
            To access certain features of the Platform, you must register for an
            account. You agree to:
          </p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>
              Notify us immediately of any unauthorized use of your account
            </li>
          </ul>
        </section>

        <section>
          <h2>6. User Content</h2>
          <p>By posting content on the Platform, you:</p>
          <ul>
            <li>
              Grant us a worldwide, non-exclusive license to use, reproduce, and
              display your content
            </li>
            <li>
              Warrant that you have all necessary rights to post such content
            </li>
            <li>
              Agree not to post any illegal, harmful, or inappropriate content
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Privacy</h2>
          <p>
            Your privacy is important to us. Our Privacy Policy explains how we
            collect, use, and protect your personal information.
          </p>
        </section>

        <section>
          <h2>8. Payment Terms</h2>
          <p>For premium features and services:</p>
          <ul>
            <li>
              All payments are processed securely through our payment providers
            </li>
            <li>Prices are subject to change with notice</li>
            <li>Refunds are subject to our refund policy</li>
          </ul>
          <p>
            We shall be under no liability whatsoever in respect of any loss or
            damage arising directly or indirectly out of the decline of
            authorization for any Transaction, on Account of the Cardholder
            having exceeded the preset limit mutually agreed by us with our
            acquiring bank from time to time.
          </p>
        </section>

        <section>
          <h2>9. Jurisdiction and Disputes</h2>
          <p>
            Any dispute arising out of use of our website and/or purchase with
            us and/or any engagement with us is subject to the laws of India.
          </p>
        </section>

        <section>
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes via email or through the
            Platform.
          </p>
        </section>

        <section>
          <h2>11. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please
            contact us at support@resumemarketplace.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
