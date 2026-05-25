import { useState, useEffect, useRef } from "react";

const CONTACT = {
  phone: "520-483-0504",
  email: "keith@clarityaisolutions.io",
  website: "www.clarityaisolutions.io",
  scheduleUrl: "https://calendar.app.google/ymALGe2j8Xi5vXfW7",
};

const INDUSTRIES = [
  "Medical/Healthcare",
  "Home Services (Plumbing, HVAC, etc.)",
  "Retail/E-commerce",
  "Real Estate",
  "Legal",
];

const INDUSTRY_DATA = {
  "Medical/Healthcare": {
    painPoints: [
      "Patients calling after hours receive no answer, leading to lost appointments and frustrated patients who turn to competitors.",
      "Front desk staff are overwhelmed with routine calls, pulling focus away from in-office patient care.",
      "Missed appointment reminders and no-shows cost practices thousands per month in lost revenue.",
      "HIPAA-sensitive inquiries require a consistent, compliant response that human staff may not always deliver.",
    ],
    roiDriver: "missed appointments and after-hours patient inquiries",
    avgCallValue: 150,
    missedCallsPerMonth: 80,
  },
  "Home Services (Plumbing, HVAC, etc.)": {
    painPoints: [
      "Emergency calls at night or on weekends go unanswered, sending urgent customers directly to competitors.",
      "Technicians in the field can't answer calls, creating a gap between service delivery and customer acquisition.",
      "Seasonal spikes in call volume overwhelm staff, resulting in long hold times and abandoned calls.",
      "Inconsistent quoting and scheduling over the phone leads to confusion and unhappy customers.",
    ],
    roiDriver: "emergency service calls and after-hours inquiries",
    avgCallValue: 300,
    missedCallsPerMonth: 50,
  },
  "Retail/E-commerce": {
    painPoints: [
      "Customer service calls about orders, returns, and product questions go unanswered during peak hours.",
      "Small retail teams can't scale support during holidays or sales events without adding costly staff.",
      "Inconsistent answers to common product and policy questions damage brand trust and increase returns.",
      "After-hours shoppers have no way to get answers, leading to abandoned carts and lost sales.",
    ],
    roiDriver: "customer inquiries and abandoned purchase calls",
    avgCallValue: 85,
    missedCallsPerMonth: 120,
  },
  "Real Estate": {
    painPoints: [
      "Buyer and seller leads calling outside business hours get no response and move on to the next agent.",
      "Agents juggling showings, negotiations, and paperwork simply cannot answer every incoming call.",
      "Missed inquiry calls on new listings mean lost buyers and frustrated sellers who expect responsiveness.",
      "Inconsistent follow-up on warm leads results in thousands of dollars in lost commissions.",
    ],
    roiDriver: "missed buyer/seller leads and after-hours property inquiries",
    avgCallValue: 8000,
    missedCallsPerMonth: 25,
  },
  Legal: {
    painPoints: [
      "Prospective clients calling during or after hours receive no answer and immediately contact another firm.",
      "Attorneys and paralegals cannot interrupt court appearances or depositions to answer intake calls.",
      "Inconsistent intake screening means staff time is spent on unqualified leads instead of billable work.",
      "After-hours emergencies from existing clients go unaddressed, damaging client relationships and retention.",
    ],
    roiDriver: "new client intake calls and after-hours legal inquiries",
    avgCallValue: 3500,
    missedCallsPerMonth: 30,
  },
};

const PACKAGES = [
  {
    name: "Growth Plan",
    setupFee: 199,
    monthlyPrice: 299,
    description: "Perfect for small businesses ready to stop missing calls and start growing.",
    features: [
      "Sophia AI answering service",
      "Up to 300 calls/month",
      "Business hours & after-hours coverage",
      "Call transcripts & summaries",
      "Email notifications",
      "First 30 days FREE",
    ],
    highlighted: false,
  },
  {
    name: "Professional Plan",
    setupFee: 299,
    monthlyPrice: 499,
    description: "For businesses serious about scaling with full-featured AI support.",
    features: [
      "Everything in Growth Plan",
      "Unlimited calls",
      "24/7 coverage",
      "CRM integration",
      "Custom call scripts",
      "Advanced analytics dashboard",
      "Priority support",
      "First 30 days FREE",
    ],
    highlighted: true,
  },
];

// ─── Saved Proposals Log ───────────────────────────────────────────────
function SavedProposals({ onClose, onLoad }) {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const keys = JSON.parse(localStorage.getItem("clarity_proposal_keys") || "[]");
      const entries = [];
      for (const key of keys) {
        try {
          const val = localStorage.getItem(key);
          if (val) entries.push({ key, data: JSON.parse(val) });
        } catch {}
      }
      entries.sort((a, b) => (b.data.savedAt || 0) - (a.data.savedAt || 0));
      setSaved(entries);
    } catch {}
    setLoading(false);
  }, []);

  const handleDelete = (key) => {
    try {
      localStorage.removeItem(key);
      const keys = JSON.parse(localStorage.getItem("clarity_proposal_keys") || "[]");
      localStorage.setItem("clarity_proposal_keys", JSON.stringify(keys.filter(k => k !== key)));
    } catch {}
    setSaved((s) => s.filter((e) => e.key !== key));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span>Saved Proposals</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {loading ? (
          <div className="modal-empty">Loading…</div>
        ) : saved.length === 0 ? (
          <div className="modal-empty">No saved proposals yet. Generate one and save it!</div>
        ) : (
          <div className="saved-list">
            {saved.map(({ key, data }) => (
              <div className="saved-item" key={key}>
                <div className="saved-info">
                  <div className="saved-name">{data.businessName}</div>
                  <div className="saved-meta">{data.industry} · {new Date(data.savedAt).toLocaleDateString()}</div>
                </div>
                <div className="saved-actions">
                  <button className="btn-load" onClick={() => { onLoad(data); onClose(); }}>Load</button>
                  <button className="btn-del" onClick={() => handleDelete(key)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }
        .modal-box {
          background: #fff; border-radius: 14px;
          width: 100%; max-width: 480px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          overflow: hidden;
        }
        .modal-header {
          background: #0A1628; color: #fff;
          padding: 18px 24px;
          display: flex; justify-content: space-between; align-items: center;
          font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700;
        }
        .modal-close {
          background: none; border: none; color: #d4af6a;
          font-size: 16px; cursor: pointer; padding: 4px 8px;
        }
        .modal-empty { padding: 32px 24px; color: #999; font-size: 14px; text-align: center; }
        .saved-list { max-height: 380px; overflow-y: auto; }
        .saved-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 24px; border-bottom: 1px solid #f0ece5;
        }
        .saved-item:last-child { border-bottom: none; }
        .saved-name { font-size: 15px; font-weight: 600; color: #1a1a1a; }
        .saved-meta { font-size: 12px; color: #999; margin-top: 3px; }
        .saved-actions { display: flex; gap: 8px; align-items: center; }
        .btn-load {
          background: #0A1628; color: #d4af6a;
          border: none; border-radius: 6px;
          padding: 7px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-del {
          background: none; border: 1.5px solid #ddd; color: #999;
          border-radius: 6px; padding: 7px 10px; cursor: pointer; font-size: 12px;
        }
      `}</style>
    </div>
  );
}

// ─── Proposal View ─────────────────────────────────────────────────────
function ProposalView({ data, onBack }) {
  const [showSaved, setShowSaved] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const { businessName, industry, ownerName, missedCalls } = data;
  const industryInfo = INDUSTRY_DATA[industry];
  const missed = parseInt(missedCalls) || industryInfo.missedCallsPerMonth;
  const roiMonthly = Math.round(missed * industryInfo.avgCallValue * 0.3);
  const roiAnnual = roiMonthly * 12;
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handlePrint = () => window.print();

  const handleEmail = () => {
    const subject = `Sophia AI Proposal — ${businessName}`;
    const body = `Hi ${ownerName || "there"},

Thank you for your time! As discussed, I've put together a proposal for how Sophia by Clarity AI Solutions can help ${businessName} never miss another call.

ABOUT SOPHIA
Sophia is an intelligent AI answering service that answers every call — 24/7 — with the professionalism and warmth of your best employee, without the overhead.

THE CHALLENGE
Businesses in ${industry} lose significant revenue every month from ${industryInfo.roiDriver}. Based on an estimated ${missed} missed calls per month, Sophia could help recover approximately $${roiMonthly.toLocaleString()}/month — that's $${roiAnnual.toLocaleString()} per year.

PRICING
• Growth Plan — $199 one-time setup fee + $299/month (first 30 days FREE)
• Professional Plan — $299 one-time setup fee + $499/month (first 30 days FREE)

Both plans include no contracts and no risk — start free for 30 days.

Ready to get started or have questions? Let's schedule a quick demo:
${CONTACT.scheduleUrl}

Best regards,
Keith
Clarity AI Solutions
📞 ${CONTACT.phone}
📧 ${CONTACT.email}
🌐 ${CONTACT.website}`;

    window.location.href = `mailto:?cc=${encodeURIComponent(CONTACT.email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSave = () => {
    const key = `proposal:${Date.now()}`;
    try {
      const keys = JSON.parse(localStorage.getItem("clarity_proposal_keys") || "[]");
      if (!keys.includes(key)) {
        keys.push(key);
        localStorage.setItem("clarity_proposal_keys", JSON.stringify(keys));
      }
      localStorage.setItem(key, JSON.stringify({ ...data, savedAt: Date.now() }));
      setSaveStatus("Saved!");
      setTimeout(() => setSaveStatus(""), 2500);
    } catch {
      setSaveStatus("Error saving");
      setTimeout(() => setSaveStatus(""), 2500);
    }
  };

  return (
    <div className="proposal-wrapper">
      <div className="no-print toolbar">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="toolbar-right">
          <button className="btn-tool" onClick={() => setShowSaved(true)}>📋 Saved Proposals</button>
          <button className="btn-tool" onClick={handleSave}>
            {saveStatus || "💾 Save"}
          </button>
          <button className="btn-tool" onClick={handleEmail}>✉ Email</button>
          <button className="btn-print" onClick={handlePrint}>⬇ Download PDF</button>
        </div>
      </div>

      {showSaved && (
        <SavedProposals
          onClose={() => setShowSaved(false)}
          onLoad={(d) => { onBack(); setTimeout(() => onBack(d), 10); }}
        />
      )}

      <div className="proposal">
        {/* Header */}
        <div className="proposal-header">
          <div className="header-logo-area">
            <img src="/logo.png" alt="Clarity AI Solutions" className="header-logo-img" />
            <div className="logo-sub">Powered by Sophia™</div>
          </div>
          <div className="header-meta">
            <div className="proposal-label">PROPOSAL</div>
            <div className="proposal-date">{today}</div>
          </div>
        </div>

        {/* Cover */}
        <div className="cover-section">
          <div className="cover-eyebrow">Prepared exclusively for</div>
          <h1 className="cover-business">{businessName}</h1>
          <div className="cover-tagline">
            How Sophia Can Transform Your {industry.split("(")[0].trim()} Business
          </div>
          {ownerName && <div className="cover-recipient">Attn: {ownerName}</div>}
        </div>

        {/* About */}
        <div className="section-divider"><span>About Clarity AI Solutions</span></div>
        <div className="section">
          <div className="about-grid">
            <div className="about-text">
              <h2>Meet Sophia™</h2>
              <p>Clarity AI Solutions is the company behind <strong>Sophia</strong>, an intelligent AI answering service built specifically for local and growing businesses. Sophia answers every call — day or night — with the professionalism and warmth of your best employee, without the overhead.</p>
              <p>Sophia handles appointment scheduling, FAQs, lead qualification, and urgent message routing — seamlessly integrating into your existing workflow so you never miss an opportunity again.</p>
            </div>
            <div className="about-stats">
              {[["24/7","Always Available"],["<2s","Answer Time"],["100%","Calls Answered"],["5★","Client Rated"]].map(([n,l]) => (
                <div className="stat-card" key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
              ))}
            </div>
          </div>
        </div>

        {/* Pain Points */}
        <div className="section-divider"><span>The Challenge You're Facing</span></div>
        <div className="section">
          <h2>The Hidden Cost of Missed Calls in {industry.split("(")[0].trim()}</h2>
          <p className="section-intro">Businesses like <strong>{businessName}</strong> face real, measurable losses every day because of {industryInfo.roiDriver}. Here's what's happening right now:</p>
          <div className="pain-list">
            {industryInfo.painPoints.map((point, i) => (
              <div className="pain-item" key={i}>
                <div className="pain-icon">!</div>
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROI */}
        <div className="section-divider"><span>Your ROI Estimate</span></div>
        <div className="section">
          <h2>What Sophia Means for {businessName}</h2>
          <p className="section-intro">Based on typical {industry.split("(")[0].trim()} businesses, here's a conservative estimate of what Sophia could recover for you:</p>
          <div className="roi-grid">
            {[
              ["Estimated Missed Calls / Month", missed],
              ["Avg. Value Per Converted Call", `$${industryInfo.avgCallValue.toLocaleString()}`],
              ["Estimated Monthly Recovery", `$${roiMonthly.toLocaleString()}`, true],
              ["Estimated Annual Recovery", `$${roiAnnual.toLocaleString()}`, true],
            ].map(([label, val, hi]) => (
              <div className={`roi-card ${hi ? "highlight-card" : ""}`} key={label}>
                <div className="roi-label">{label}</div>
                <div className="roi-value">{val}</div>
              </div>
            ))}
          </div>
          <div className="roi-footnote">* Based on a 30% conversion rate of recovered calls. Actual results vary by business.</div>
        </div>

        {/* Pricing */}
        <div className="section-divider"><span>Pricing &amp; Packages</span></div>
        <div className="section">
          <h2>Simple, Transparent Pricing</h2>
          <p className="section-intro">No contracts. First 30 days FREE. Choose the plan that fits <strong>{businessName}</strong>:</p>
          <div className="packages-grid">
            {PACKAGES.map((pkg) => (
              <div className={`package-card ${pkg.highlighted ? "package-highlighted" : ""}`} key={pkg.name}>
                {pkg.highlighted && <div className="popular-badge">MOST POPULAR</div>}
                <div className="pkg-name">{pkg.name}</div>
                <div className="pkg-setup">
                  <span className="setup-label">One-time setup:</span>
                  <span className="setup-val">${pkg.setupFee} <span className="setup-note">(non-refundable)</span></span>
                </div>
                <div className="pkg-price">
                  <span className="pkg-dollar">$</span>{pkg.monthlyPrice.toLocaleString()}<span className="pkg-period">/mo</span>
                </div>
                <div className="pkg-free-badge">🎉 First 30 Days FREE</div>
                <div className="pkg-desc">{pkg.description}</div>
                <ul className="pkg-features">
                  {pkg.features.map((f, i) => (
                    <li key={i}><span className="check">✓</span> {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="proposal-footer">
          <div className="footer-cta">
            <div className="footer-cta-text">Ready to let Sophia get to work for <strong>{businessName}</strong>?</div>
            <div className="footer-links">
              <a href={`tel:${CONTACT.phone}`} className="footer-link">📞 {CONTACT.phone}</a>
              <a href={`mailto:${CONTACT.email}`} className="footer-link">✉ {CONTACT.email}</a>
              <a href={`https://${CONTACT.website}`} target="_blank" rel="noreferrer" className="footer-link">🌐 {CONTACT.website}</a>
            </div>
            <a href={CONTACT.scheduleUrl} target="_blank" rel="noreferrer" className="footer-schedule-btn">
              📅 Schedule a Free Demo
            </a>
          </div>
          <div className="footer-brand">
            <div className="footer-logo">Clarity AI Solutions</div>
            <div className="footer-tagline">Never Miss Another Call.</div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0ede8; }
        .proposal-wrapper { font-family: 'DM Sans', sans-serif; background: #f0ede8; min-height: 100vh; padding: 24px 16px 60px; }
        .no-print.toolbar { display: flex; justify-content: space-between; align-items: center; max-width: 860px; margin: 0 auto 20px; flex-wrap: wrap; gap: 10px; }
        .toolbar-right { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-back, .btn-tool, .btn-print { padding: 9px 16px; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; }
        .btn-back { background: #fff; color: #1a1a1a; border: 1.5px solid #ccc; }
        .btn-back:hover { background: #eee; }
        .btn-tool { background: #fff; color: #0A1628; border: 1.5px solid #0A1628; }
        .btn-tool:hover { background: #f0f5f2; }
        .btn-print { background: #0A1628; color: #d4af6a; letter-spacing: 0.03em; }
        .btn-print:hover { background: #0f1a27; }
        .proposal { max-width: 860px; margin: 0 auto; background: #fff; box-shadow: 0 8px 48px rgba(0,0,0,0.12); }
        .proposal-header { background: #0A1628; padding: 28px 40px; display: flex; justify-content: space-between; align-items: center; }
        .header-logo-area { display: flex; align-items: center; gap: 14px; }
        .header-logo-img { height: 42px; width: auto; object-fit: contain; }
        .logo-text { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #fff; }
        .logo-sub { font-size: 11px; color: #d4af6a; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 2px; }
        .header-meta { text-align: right; }
        .proposal-label { font-size: 11px; letter-spacing: 0.15em; color: #d4af6a; font-weight: 600; text-transform: uppercase; }
        .proposal-date { color: rgba(255,255,255,0.7); font-size: 13px; margin-top: 4px; }
        .cover-section { background: linear-gradient(135deg, #0A1628 0%, #061020 100%); padding: 60px 40px 50px; position: relative; overflow: hidden; }
        .cover-section::before { content: ''; position: absolute; top: -60px; right: -60px; width: 280px; height: 280px; border-radius: 50%; border: 40px solid rgba(212,175,106,0.08); }
        .cover-eyebrow { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #d4af6a; font-weight: 600; margin-bottom: 12px; }
        .cover-business { font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 16px; }
        .cover-tagline { font-size: 17px; color: rgba(255,255,255,0.75); font-weight: 300; max-width: 480px; line-height: 1.5; }
        .cover-recipient { margin-top: 24px; display: inline-block; background: rgba(212,175,106,0.15); border: 1px solid rgba(212,175,106,0.3); color: #d4af6a; padding: 8px 18px; border-radius: 30px; font-size: 13px; font-weight: 500; }
        .section-divider { background: #f7f4ef; padding: 12px 40px; border-top: 1px solid #e8e2d8; border-bottom: 1px solid #e8e2d8; }
        .section-divider span { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; color: #0A1628; }
        .section { padding: 44px 40px; border-bottom: 1px solid #f0ece5; }
        .section h2 { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #1a1a1a; margin-bottom: 14px; }
        .section-intro { font-size: 15px; color: #555; line-height: 1.65; margin-bottom: 28px; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: start; }
        .about-text p { font-size: 14px; color: #444; line-height: 1.7; margin-bottom: 14px; }
        .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .stat-card { background: #f7f4ef; border: 1px solid #e8e2d8; border-radius: 10px; padding: 18px 14px; text-align: center; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 900; color: #0A1628; }
        .stat-label { font-size: 11px; color: #888; margin-top: 4px; letter-spacing: 0.05em; text-transform: uppercase; }
        .pain-list { display: flex; flex-direction: column; gap: 14px; }
        .pain-item { display: flex; gap: 16px; align-items: flex-start; background: #fff8f0; border-left: 3px solid #d4af6a; padding: 14px 18px; border-radius: 0 8px 8px 0; }
        .pain-icon { width: 26px; height: 26px; background: #d4af6a; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }
        .pain-item p { font-size: 14px; color: #444; line-height: 1.6; padding-top: 3px; }
        .roi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 14px; }
        .roi-card { background: #f7f4ef; border: 1px solid #e8e2d8; border-radius: 10px; padding: 20px 16px; text-align: center; }
        .roi-card.highlight-card { background: #0A1628; border-color: #0A1628; }
        .roi-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; line-height: 1.4; }
        .highlight-card .roi-label { color: rgba(212,175,106,0.8); }
        .roi-value { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900; color: #0A1628; }
        .highlight-card .roi-value { color: #d4af6a; }
        .roi-footnote { font-size: 11px; color: #aaa; font-style: italic; }
        .packages-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .package-card { border: 1.5px solid #e8e2d8; border-radius: 12px; padding: 28px 24px; position: relative; }
        .package-highlighted { border-color: #0A1628; background: #f7f9f8; box-shadow: 0 4px 20px rgba(26,35,50,0.1); }
        .popular-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #0A1628; color: #d4af6a; font-size: 9px; font-weight: 700; letter-spacing: 0.15em; padding: 4px 14px; border-radius: 20px; white-space: nowrap; }
        .pkg-name { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #0A1628; margin-bottom: 10px; }
        .pkg-setup { font-size: 12px; color: #888; margin-bottom: 6px; }
        .setup-label { font-weight: 600; color: #555; margin-right: 4px; }
        .setup-val { color: #0A1628; font-weight: 600; }
        .setup-note { font-weight: 400; color: #aaa; font-size: 11px; }
        .pkg-price { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 900; color: #1a1a1a; line-height: 1; margin-bottom: 8px; }
        .pkg-dollar { font-size: 20px; vertical-align: super; }
        .pkg-period { font-size: 14px; color: #999; font-family: 'DM Sans', sans-serif; font-weight: 400; }
        .pkg-free-badge { display: inline-block; background: #e8f5ee; color: #0A1628; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
        .pkg-desc { font-size: 12px; color: #888; line-height: 1.5; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #eee; }
        .pkg-features { list-style: none; display: flex; flex-direction: column; gap: 9px; }
        .pkg-features li { font-size: 13px; color: #444; display: flex; align-items: flex-start; gap: 8px; line-height: 1.4; }
        .check { color: #0A1628; font-weight: 700; flex-shrink: 0; }
        .proposal-footer { background: #0A1628; padding: 40px 40px 36px; display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; flex-wrap: wrap; }
        .footer-cta-text { font-size: 17px; color: #fff; font-weight: 500; margin-bottom: 14px; }
        .footer-links { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
        .footer-link { color: rgba(255,255,255,0.75); font-size: 13px; text-decoration: none; }
        .footer-link:hover { color: #d4af6a; }
        .footer-schedule-btn { display: inline-block; background: #d4af6a; color: #0A1628; font-size: 13px; font-weight: 700; padding: 10px 22px; border-radius: 6px; text-decoration: none; letter-spacing: 0.02em; }
        .footer-schedule-btn:hover { background: #c9a050; }
        .footer-logo { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #fff; text-align: right; }
        .footer-tagline { font-size: 11px; color: #d4af6a; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; text-align: right; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; }
          .proposal-wrapper { padding: 0; background: #fff; }
          .proposal { box-shadow: none; max-width: 100%; }
          .cover-business { font-size: 36px; }
          .roi-grid { grid-template-columns: 1fr 1fr; }
          .packages-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 680px) {
          .about-grid { grid-template-columns: 1fr; }
          .roi-grid { grid-template-columns: 1fr 1fr; }
          .packages-grid { grid-template-columns: 1fr; }
          .cover-business { font-size: 32px; }
          .proposal-footer { flex-direction: column; }
          .footer-logo, .footer-tagline { text-align: left; }
        }
      `}</style>
    </div>
  );
}

// ─── Form ──────────────────────────────────────────────────────────────
function ProposalForm({ onGenerate, savedEntry }) {
  const [form, setForm] = useState(savedEntry || { businessName: "", industry: "", ownerName: "", missedCalls: "" });
  const [showSaved, setShowSaved] = useState(false);
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const ready = form.businessName.trim() && form.industry;

  return (
    <div className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <div className="form-logo">
            <img src="/logo.png" alt="Clarity AI Solutions" className="form-logo-img" />
            <div className="form-logo-sub">Proposal Generator</div>
          </div>
          <button className="saved-btn" onClick={() => setShowSaved(true)}>📋 Saved</button>
        </div>
        <div className="form-body">
          <p className="form-desc">Fill in the prospect's details below to instantly generate a branded, personalized proposal for Sophia.</p>
          <div className="field">
            <label>Business Name <span className="req">*</span></label>
            <input type="text" placeholder="e.g. Sunrise Family Clinic" value={form.businessName} onChange={(e) => update("businessName", e.target.value)} />
          </div>
          <div className="field">
            <label>Industry <span className="req">*</span></label>
            <select value={form.industry} onChange={(e) => update("industry", e.target.value)}>
              <option value="">Select an industry…</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Owner / Decision Maker Name <span className="opt">(optional)</span></label>
            <input type="text" placeholder="e.g. Dr. Maria Santos" value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} />
          </div>
          <div className="field">
            <label>Estimated Missed Calls / Month <span className="opt">(optional)</span></label>
            <input type="number" placeholder="We'll estimate if left blank" value={form.missedCalls} onChange={(e) => update("missedCalls", e.target.value)} />
          </div>
          <button className={`generate-btn ${ready ? "ready" : "disabled"}`} onClick={() => ready && onGenerate(form)} disabled={!ready}>
            Generate Proposal →
          </button>
        </div>
      </div>
      {showSaved && (
        <SavedProposals
          onClose={() => setShowSaved(false)}
          onLoad={(d) => { setForm(d); setShowSaved(false); }}
        />
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .form-wrapper { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #f0ede8; display: flex; align-items: center; justify-content: center; padding: 40px 16px; }
        .form-card { background: #fff; border-radius: 16px; width: 100%; max-width: 500px; box-shadow: 0 8px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .form-header { background: #0A1628; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; }
        .form-logo { display: flex; align-items: center; gap: 14px; }
        .form-logo-img { height: 38px; width: auto; object-fit: contain; }
        .form-logo-text { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 700; color: #fff; }
        .form-logo-sub { font-size: 11px; color: #d4af6a; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 3px; }
        .saved-btn { background: rgba(212,175,106,0.15); border: 1px solid rgba(212,175,106,0.4); color: #d4af6a; padding: 8px 14px; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .saved-btn:hover { background: rgba(212,175,106,0.25); }
        .form-body { padding: 32px; }
        .form-desc { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 28px; }
        .field { margin-bottom: 20px; }
        .field label { display: block; font-size: 13px; font-weight: 600; color: #1a1a1a; margin-bottom: 7px; }
        .req { color: #c0392b; }
        .opt { font-weight: 400; color: #aaa; font-size: 11px; }
        .field input, .field select { width: 100%; padding: 11px 14px; border: 1.5px solid #ddd; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a1a; outline: none; transition: border-color 0.2s; background: #fff; }
        .field input:focus, .field select:focus { border-color: #0A1628; }
        .field input::placeholder { color: #bbb; }
        .generate-btn { width: 100%; padding: 14px; border: none; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 8px; letter-spacing: 0.02em; transition: all 0.2s; }
        .generate-btn.ready { background: #0A1628; color: #d4af6a; }
        .generate-btn.ready:hover { background: #0f1a27; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(26,35,50,0.25); }
        .generate-btn.disabled { background: #eee; color: #bbb; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────
export default function App() {
  const [proposalData, setProposalData] = useState(null);
  return proposalData
    ? <ProposalView data={proposalData} onBack={() => setProposalData(null)} />
    : <ProposalForm onGenerate={setProposalData} />;
}
