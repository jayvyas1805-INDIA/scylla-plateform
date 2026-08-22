import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/navbar/Footer';
import '../../../styles/landing-theme.css';
import FeatureTeams from "../../../components/navbar/FeaturedTeams"
import './TeamLanding.css';

const BENEFITS = [
  {
    icon: '🏁',
    title: 'Build Your Team Profile',
    text: 'Showcase your achievements, sponsors, media gallery, and vehicle roster in one professional profile.',
  },
  {
    icon: '🤝',
    title: 'Connect With Vendors',
    text: 'Browse a verified marketplace of parts and service vendors, and request quotes directly.',
  },
  {
    icon: '📋',
    title: 'Manage Everything in One Place',
    text: 'Track your fleet, documents, and communications from a single team dashboard.',
  },
  {
    icon: '🌐',
    title: 'Get Discovered',
    text: 'Public profiles help sponsors, event organizers, and fans find and follow your team.',
  },
];

const STEPS = [
  { number: '01', title: 'Create your account', text: 'Enter your team and contact details to get started.' },
  { number: '02', title: 'Build your profile', text: 'Add your logo, description, achievements, and vehicles.' },
  { number: '03', title: 'Start connecting', text: 'Reach out to vendors and manage your team from the dashboard.' },
];

export default function TeamLanding() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="lp-page">
        {/* HERO */}
        <section className="lp-section team-lp-hero">
          <div className="lp-container team-lp-hero-grid">
            <div>
              <span className="lp-eyebrow">For Racing Teams</span>
              <h1 className="team-lp-title">
                Run your motorsport team like a pro operation
              </h1>
              <p className="team-lp-subtitle">
                One dashboard for your team profile, vehicle roster, vendor
                relationships, and documentation — built for the way racing
                teams actually work.
              </p>
              <div className="team-lp-cta-row">
                <button
                  className="lp-btn lp-btn-primary lp-btn-lg"
                  onClick={() => navigate('/team/register')}
                >
                  Register Your Team →
                </button>
                <button
                  className="lp-btn lp-btn-outline lp-btn-lg"
                  onClick={() => navigate('/team/login')}
                >
                  Sign In
                </button>
              </div>
              <button className="team-lp-browse-link" onClick={() => navigate('/teams-directory')}>
                Browse existing teams →
              </button>
              <p className="team-lp-fineprint">Free to join · Set up your profile in minutes</p>
            </div>

            <div className="lp-card team-lp-hero-card">
              <div className="team-lp-stat-row">
                <div className="team-lp-stat">
                  <span className="team-lp-stat-value">Profile</span>
                  <span className="team-lp-stat-label">Achievements, sponsors & media</span>
                </div>
                <div className="team-lp-stat">
                  <span className="team-lp-stat-value">Vehicles</span>
                  <span className="team-lp-stat-label">Track your full fleet</span>
                </div>
              </div>
              <div className="team-lp-stat-row">
                <div className="team-lp-stat">
                  <span className="team-lp-stat-value">Vendors</span>
                  <span className="team-lp-stat-label">Request quotes directly</span>
                </div>
                <div className="team-lp-stat">
                  <span className="team-lp-stat-value">Messages</span>
                  <span className="team-lp-stat-label">All in one inbox</span>
                </div>
              </div>
            </div>
          </div>
        </section>
    <FeatureTeams />
        {/* BENEFITS */}
        <section className="lp-section">
          <div className="lp-container">
            <div className="lp-section-heading">
              <h2 className="lp-section-title">Everything your team needs</h2>
              <p className="lp-section-subtitle">
                Purpose-built tools for managing a motorsport team, without the spreadsheets.
              </p>
            </div>

            <div className="team-lp-benefits-grid">
              {BENEFITS.map((benefit) => (
                <div className="lp-card team-lp-benefit-card" key={benefit.title}>
                  <div className="team-lp-benefit-icon">{benefit.icon}</div>
                  <h3 className="team-lp-benefit-title">{benefit.title}</h3>
                  <p className="team-lp-benefit-text">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="lp-section team-lp-steps-section">
          <div className="lp-container">
            <div className="lp-section-heading">
              <h2 className="lp-section-title">Get started in three steps</h2>
            </div>

            <div className="team-lp-steps-grid">
              {STEPS.map((step) => (
                <div className="lp-card team-lp-step-card" key={step.number}>
                  <span className="team-lp-step-number">{step.number}</span>
                  <h3 className="team-lp-step-title">{step.title}</h3>
                  <p className="team-lp-step-text">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="lp-section team-lp-closing">
          <div className="lp-container team-lp-closing-content">
            <h2 className="lp-section-title">Ready to bring your team on board?</h2>
            <p className="lp-section-subtitle">
              Registration takes a few minutes — your dashboard is ready as soon as you sign up.
            </p>
            <button
              className="lp-btn lp-btn-primary lp-btn-lg"
              onClick={() => navigate('/team/register')}
            >
              Register Your Team →
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
