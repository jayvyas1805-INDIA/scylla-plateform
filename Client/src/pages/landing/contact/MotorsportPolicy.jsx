import { useNavigate } from 'react-router-dom';


export default function MotorsportPolicy() {
  const navigate = useNavigate();

  const rules = [
    {
      category: 'Safety Requirements',
      icon: '🛡️',
      items: [
        'All drivers must wear FIA-approved helmets',
        'Fire-resistant racing suits (FIA/SFI certified) are mandatory',
        'Safety harnesses must meet international standards',
        'Racing gloves and shoes are compulsory',
        'All vehicles must have functioning safety equipment including fire extinguishers',
      ]
    },
    {
      category: 'Vehicle Regulations',
      icon: '🏎️',
      items: [
        'Vehicles must pass technical inspection before competition',
        'Engine modifications must comply with class specifications',
        'Weight limits must be maintained as per category rules',
        'Tire types must match the designated specifications for the event',
        'Brake systems must meet minimum safety standards',
        'Fuel type and tank capacity must comply with regulations',
      ]
    },
    {
      category: 'On-Track Conduct',
      icon: '🚩',
      items: [
        'Drivers must obey all flag signals from race officials',
        'Aggressive driving that endangers others is prohibited',
        'Blocking or deliberate contact with other vehicles is not permitted',
        'Speed limits in pit lane must be strictly observed',
        'Drivers must yield to safety vehicles immediately',
        'All instructions from race control must be followed',
      ]
    },
    {
      category: 'Race Start & Finish',
      icon: '🏁',
      items: [
        'All drivers must participate in mandatory driver briefing',
        'Rolling starts must follow exact procedure as communicated',
        'Formation laps are compulsory unless cancelled by officials',
        'Finishing position is determined by crossing the finish line first',
        'Drivers must slow down gradually after finishing',
        'Post-race procedures must be followed for technical checks',
      ]
    },
    {
      category: 'Pit Lane Rules',
      icon: '🛠️',
      items: [
        'Only authorized personnel permitted in pit lane',
        'Pit stop duration limits must be observed',
        'Fuel handling must follow strict safety protocols',
        'Equipment must not obstruct the pit lane',
        'Team members must wear required safety gear',
        'Vehicle can only be refueled at designated areas',
      ]
    },
    {
      category: 'Classification & Penalties',
      icon: '📋',
      items: [
        'Finishing positions determined by official timekeeping',
        'Time penalties are issued for rule violations',
        'Disqualification may result from serious infractions',
        'Appeals must be filed within specified timeframe',
        'Penalty decisions made by stewards are final unless appealed',
        'Drivers can be banned for dangerous driving',
      ]
    },
    {
      category: 'Driver Licensing',
      icon: '🎖️',
      items: [
        'Valid racing license required to compete',
        'License must match the category of competition',
        'Annual medical certificate required',
        'License renewal based on experience and record',
        'Minimum age requirements vary by category',
        'Track day participants may need separate endorsement',
      ]
    },
    {
      category: 'Environmental & Fuel Regulations',
      icon: '♻️',
      items: [
        'Fuel specifications must comply with event rules',
        'Fuel consumption limits may apply in certain categories',
        'Alternative fuel vehicles must be certified',
        'Noise level limits must be adhered to',
        'Proper disposal of fuel and fluids required',
        'Environmental protection measures must be maintained',
      ]
    },
    {
      category: 'Technical Specifications',
      icon: '⚙️',
      items: [
        'Engine displacement limits enforced by category',
        'Turbo restrictions and specifications required',
        'Anti-lock braking systems (ABS) regulations vary by class',
        'Traction control usage must follow category rules',
        'Electronic power steering may have restrictions',
        'Aerodynamic modifications must be approved',
      ]
    },
    {
      category: 'Insurance & Liability',
      icon: '📜',
      items: [
        'Comprehensive insurance required for all participants',
        'Damage liability coverage must be maintained',
        'Medical coverage recommended for all drivers',
        'Waivers and liability forms must be signed',
        'Event organizers not responsible for personal injuries',
        'Participants compete at own risk',
      ]
    },
  ];

  return (
    <div className="container">
      {/* Policy Header */}
      <section className="policy-header">
        <div className="policy-header-content">
          <div className="policy-icon">🏁</div>
          <h1 className="policy-title">Motorsports Rules & Regulations</h1>
          <p className="policy-subtitle">Essential guidelines for safe and fair racing competition</p>
        </div>
      </section>

      {/* Rules Content */}
      <section className="rules-section">
        <div className="rules-content">
          {rules.map((ruleGroup, index) => (
            <div key={index} className="rule-group">
              <div className="rule-group-header">
                <div className="rule-group-icon">{ruleGroup.icon}</div>
                <h2 className="rule-group-title">{ruleGroup.category}</h2>
              </div>
              <ul className="rule-items">
                {ruleGroup.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="rule-item">
                    <span className="rule-checkmark">✓</span>
                    <span className="rule-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Important Notice */}
      <section className="policy-notice">
        <div className="notice-card">
          <div className="notice-icon">⚠️</div>
          <div className="notice-content">
            <h3 className="notice-title">Important Notice</h3>
            <p className="notice-text">
              These are the basic rules and regulations for motorsports competitions. Specific events may have additional rules and requirements. All participants must review the detailed race regulations provided by the event organizers and comply with all local, state, and international motorsports regulations. Failure to follow these rules may result in penalties, disqualification, or suspension from future events.
            </p>
            <p className="notice-text">
              For complete and up-to-date regulations, please contact the event organizers or your racing federation. The platform is not responsible for rule enforcement; that responsibility lies with the event officials and sanctioning bodies.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="policy-contact">
        <div className="contact-card">
          <h2 className="contact-title">Questions About the Rules?</h2>
          <p className="contact-subtitle">Contact us for clarification on specific regulations</p>
          <div className="contact-buttons">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              Submit an Inquiry
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
