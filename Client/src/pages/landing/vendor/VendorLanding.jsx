import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/navbar/Footer';
import '../../../styles/landing-theme.css';
import './VendorLanding.css';

const BENEFITS = [
  {
    icon: '🏪',
    title: 'Showcase Your Business',
    text: 'Build a public vendor profile with your services, gallery, business hours, and completed projects.',
  },
  {
    icon: '📩',
    title: 'Receive Direct Inquiries',
    text: 'Teams reach out to you directly with quote requests — no middlemen, no lost leads.',
  },
  {
    icon: '📈',
    title: 'Grow With the Community',
    text: 'Get discovered by active racing teams looking for parts, services, and expertise.',
  },
  {
    icon: '🗂️',
    title: 'Manage Everything in One Place',
    text: 'Track quotes, inquiries, and your product listings from a single vendor dashboard.',
  },
];

const STEPS = [
  { number: '01', title: 'Create your account', text: 'Enter your business details to get verified and set up.' },
  { number: '02', title: 'Build your profile', text: 'Add your services, portfolio, and business information.' },
  { number: '03', title: 'Start receiving inquiries', text: 'Teams find you and reach out directly through the platform.' },
];

export default function VendorLanding() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="lp-page">
        {/* HERO */}
        <section className="lp-section vendor-lp-hero">
          <div className="lp-container vendor-lp-hero-grid">
            <div>
              <span className="lp-eyebrow">For Vendors & Service Providers</span>
              <h1 className="vendor-lp-title">
                Put your business in front of active racing teams
              </h1>
              <p className="vendor-lp-subtitle">
                List your products and services on a marketplace built
                specifically for motorsports — and manage every inquiry from
                one dashboard.
              </p>
              <div className="vendor-lp-cta-row">
                <button
                  className="lp-btn lp-btn-primary lp-btn-lg"
                  onClick={() => navigate('/vendor/register')}
                >
                  Become a Vendor →
                </button>
                <button
                  className="lp-btn lp-btn-outline lp-btn-lg"
                  onClick={() => navigate('/vendor/login')}
                >
                  Sign In
                </button>
              </div>
              <p className="vendor-lp-fineprint">Free to list · Get discovered by verified teams</p>
            </div>

            <div className="lp-card vendor-lp-hero-card">
              <div className="vendor-lp-stat-row">
                <div className="vendor-lp-stat">
                  <span className="vendor-lp-stat-value">Marketplace</span>
                  <span className="vendor-lp-stat-label">List products & services</span>
                </div>
                <div className="vendor-lp-stat">
                  <span className="vendor-lp-stat-value">Quotes</span>
                  <span className="vendor-lp-stat-label">Respond to inquiries fast</span>
                </div>
              </div>
              <div className="vendor-lp-stat-row">
                <div className="vendor-lp-stat">
                  <span className="vendor-lp-stat-value">Profile</span>
                  <span className="vendor-lp-stat-label">Showcase your best work</span>
                </div>
                <div className="vendor-lp-stat">
                  <span className="vendor-lp-stat-value">Messages</span>
                  <span className="vendor-lp-stat-label">Talk to teams directly</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="lp-section">
          <div className="lp-container">
            <div className="lp-section-heading">
              <h2 className="lp-section-title">Built for vendors who serve motorsports</h2>
              <p className="lp-section-subtitle">
                Everything you need to reach teams and manage business, without the back-and-forth.
              </p>
            </div>

            <div className="vendor-lp-benefits-grid">
              {BENEFITS.map((benefit) => (
                <div className="lp-card vendor-lp-benefit-card" key={benefit.title}>
                  <div className="vendor-lp-benefit-icon">{benefit.icon}</div>
                  <h3 className="vendor-lp-benefit-title">{benefit.title}</h3>
                  <p className="vendor-lp-benefit-text">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="lp-section vendor-lp-steps-section">
          <div className="lp-container">
            <div className="lp-section-heading">
              <h2 className="lp-section-title">Get started in three steps</h2>
            </div>

            <div className="vendor-lp-steps-grid">
              {STEPS.map((step) => (
                <div className="lp-card vendor-lp-step-card" key={step.number}>
                  <span className="vendor-lp-step-number">{step.number}</span>
                  <h3 className="vendor-lp-step-title">{step.title}</h3>
                  <p className="vendor-lp-step-text">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="lp-section vendor-lp-closing">
          <div className="lp-container vendor-lp-closing-content">
            <h2 className="lp-section-title">Ready to list your business?</h2>
            <p className="lp-section-subtitle">
              Registration takes a few minutes — start receiving inquiries as soon as your profile is live.
            </p>
            <button
              className="lp-btn lp-btn-primary lp-btn-lg"
              onClick={() => navigate('/vendor/register')}
            >
              Become a Vendor →
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
