import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './LandingPage.css';

type Feature = {
  title: string;
  description: string;
  icon: 'brain' | 'target' | 'board' | 'market' | 'insight';
};

type Step = {
  title: string;
  description: string;
};

type JobCard = {
  company: string;
  role: string;
  fit: string;
  accent: string;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const features: Feature[] = [
  {
    title: 'CV Analysis Engine',
    description:
      'Upload a CV and let SmartHire Jira extract strengths, seniority signals, and hidden skills in seconds.',
    icon: 'brain',
  },
  {
    title: 'Smart Job Matching',
    description:
      'Rank advertised jobs by skill fit, experience match, and the kind of roles you are most likely to win.',
    icon: 'target',
  },
  {
    title: 'Jira-Style Job Tracking',
    description:
      'Move opportunities across Applied, Interview, and Offered boards with a workflow that feels immediate.',
    icon: 'board',
  },
  {
    title: 'Job Marketplace',
    description:
      'Browse and filter fresh job listings with salary, location, and stack-aware filters built for speed.',
    icon: 'market',
  },
  {
    title: 'Real-Time Insights',
    description:
      'Get suggestions on missing keywords, weak spots, and the next action that will improve your chances.',
    icon: 'insight',
  },
];

const steps: Step[] = [
  {
    title: 'Upload CV',
    description: 'Add your CV once and let the assistant parse your experience, skills, and focus areas.',
  },
  {
    title: 'AI Analysis',
    description: 'The system scores your profile against live listings and surfaces clear strengths and gaps.',
  },
  {
    title: 'Get Matches',
    description: 'See roles aligned to your background, plus jobs worth stretching for with targeted guidance.',
  },
  {
    title: 'Track Applications',
    description: 'Push cards across the board and keep every application, reminder, and interview in view.',
  },
];

const boardColumns: Array<{ title: string; tint: string; jobs: JobCard[] }> = [
  {
    title: 'Applied',
    tint: 'from-sky-400/20 to-cyan-500/10',
    jobs: [
      { company: 'NovaPay', role: 'Frontend Engineer', fit: '92% fit', accent: 'Perfect stack match' },
      { company: 'CloudAtlas', role: 'Product Designer', fit: '84% fit', accent: 'Strong CV overlap' },
    ],
  },
  {
    title: 'Interview',
    tint: 'from-violet-400/20 to-fuchsia-500/10',
    jobs: [
      { company: 'ApexGrid', role: 'Data Analyst', fit: '89% fit', accent: 'Case prep ready' },
      { company: 'PulseStack', role: 'Junior PM', fit: '81% fit', accent: 'Follow-up queued' },
    ],
  },
  {
    title: 'Offered',
    tint: 'from-emerald-400/20 to-teal-500/10',
    jobs: [{ company: 'LumaWorks', role: 'Solutions Consultant', fit: '96% fit', accent: 'Offer accepted' }],
  },
];

const marketplaceJobs: Array<{ role: string; company: string; details: string; score: string }> = [
  { role: 'AI Product Analyst', company: 'Helio Labs', details: 'Remote - Python - SQL - $95k', score: '94 match' },
  { role: 'Growth Designer', company: 'Sora Commerce', details: 'Hybrid - Figma - UX Systems - $88k', score: '88 match' },
  { role: 'Platform PM', company: 'Vector Cloud', details: 'Remote - SaaS - APIs - $120k', score: '90 match' },
];

const testimonials: Testimonial[] = [
  {
    quote:
      'It finally feels like my job search has a brain. The matching and board view helped me focus on the right openings.',
    name: 'Amina R.',
    role: 'Data Analyst',
  },
  {
    quote:
      'The CV insights were practical, not vague. I knew exactly which keywords and skills to strengthen next.',
    name: 'Jonas T.',
    role: 'Frontend Developer',
  },
  {
    quote:
      'The Jira-style board made follow-ups effortless. I moved from scattered tabs to one clear pipeline.',
    name: 'Maya S.',
    role: 'Product Associate',
  },
];

function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing-page">
      <div className="landing-glow landing-glow-a" aria-hidden="true" />
      <div className="landing-glow landing-glow-b" aria-hidden="true" />
      <div className="landing-glow landing-glow-c" aria-hidden="true" />

      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>

      <header className="landing-shell landing-header">
        <Link to="/landing" className="brand-mark" aria-label="SmartHire Jira home">
          <span className="brand-icon">SJ</span>
          <span>
            <strong>SmartHire Jira</strong>
            <small>AI job matching workspace</small>
          </span>
        </Link>

        <nav className="landing-nav" aria-label="Landing page sections">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#dashboard-preview">Dashboard</a>
          <a href="#reviews">Reviews</a>
        </nav>
      </header>

      <main className="landing-shell landing-main">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow-pill">
              <span className="eyebrow-dot" />
              AI-powered CV matching for a smarter job hunt
            </div>

            <h1>Find jobs that truly fit you.</h1>
            <p className="hero-description">
              SmartHire Jira reads your CV, matches you to relevant advertised jobs, and keeps every
              application moving through a clean Jira-style workflow from Applied to Offered.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="button button-primary">
                Upload CV
              </Link>
              <Link to="/login" className="button button-secondary">
                Get Started
              </Link>
            </div>

            <div className="hero-stats" aria-label="Product highlights">
              <div>
                <strong>AI analysis</strong>
                <span>CV to role fit scoring</span>
              </div>
              <div>
                <strong>Jira-style board</strong>
                <span>Track every application</span>
              </div>
              <div>
                <strong>Live marketplace</strong>
                <span>Filter advertised jobs fast</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="glass-card hero-visual-card">
              <div className="hero-visual-topline">
                <span>Match confidence</span>
                <strong>94%</strong>
              </div>

              <WorkflowIllustration />

              <div className="insight-strip">
                <div>
                  <strong>Smart suggestion</strong>
                  <span>Add two React projects to lift frontend matches by 11%</span>
                </div>
                <span className="insight-badge">Real-time</span>
              </div>
            </div>

            <aside className="glass-card assistant-card">
              <span className="assistant-label">AI assistant</span>
              <p>
                I found 8 roles aligned with your CV, 3 near-matches worth stretching for, and 1
                interview follow-up due today.
              </p>
              <div className="assistant-sparkline" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </aside>
          </div>
        </section>

        <section className="section-block" id="features">
          <SectionHeading
            eyebrow="Core features"
            title="Everything you need to turn job hunting into a guided system."
            description="A focused set of tools that reads your CV, matches opportunities, and keeps your pipeline moving with less friction."
          />

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="glass-card feature-card">
                <div className={`feature-icon feature-icon-${feature.icon}`} aria-hidden="true">
                  {renderFeatureIcon(feature.icon)}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="how-it-works">
          <SectionHeading
            eyebrow="How it works"
            title="A simple flow from CV upload to tracked applications."
            description="The assistant does the heavy lifting so you can focus on the roles that matter and the actions that improve your odds."
          />

          <div className="steps-grid">
            {steps.map((step, index) => (
              <article key={step.title} className="glass-card step-card">
                <span className="step-index">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="dashboard-preview">
          <SectionHeading
            eyebrow="Dashboard preview"
            title="A Jira-inspired board for Applied, Interview, and Offered jobs."
            description="Track progress like work tickets, while the marketplace panel keeps fresh openings and filters in view."
          />

          <div className="dashboard-layout">
            <div className="board-panel glass-card">
              <div className="panel-head">
                <strong>Job tracking board</strong>
                <span>Drag, filter, and prioritize</span>
              </div>

              <div className="board-grid">
                {boardColumns.map((column) => (
                  <div key={column.title} className={`board-column board-column-${column.title.toLowerCase()}`}>
                    <div className={`board-column-head ${column.tint}`}>
                      <span>{column.title}</span>
                      <small>{column.jobs.length} cards</small>
                    </div>

                    <div className="board-cards">
                      {column.jobs.map((job) => (
                        <article key={job.company + job.role} className="board-card">
                          <div className="board-card-top">
                            <strong>{job.company}</strong>
                            <span>{job.fit}</span>
                          </div>
                          <p>{job.role}</p>
                          <div className="board-card-footer">
                            <span>{job.accent}</span>
                            <button type="button">Open</button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="glass-card marketplace-panel">
              <div className="panel-head">
                <strong>Job marketplace</strong>
                <span>Filter advertised jobs</span>
              </div>

              <div className="filter-row" aria-label="Suggested job filters">
                <span className="filter-chip active">Remote</span>
                <span className="filter-chip">Frontend</span>
                <span className="filter-chip">Product</span>
                <span className="filter-chip">$80k+</span>
              </div>

              <div className="marketplace-list">
                {marketplaceJobs.map((job) => (
                  <article key={job.company + job.role} className="marketplace-card">
                    <div>
                      <strong>{job.role}</strong>
                      <p>{job.company}</p>
                    </div>
                    <span>{job.score}</span>
                    <small>{job.details}</small>
                  </article>
                ))}
              </div>

              <div className="marketplace-metric">
                <span>Insight</span>
                <strong>6 listings improved after adding missing skill keywords.</strong>
              </div>
            </aside>
          </div>
        </section>

        <section className="section-block trust-block" id="reviews">
          <SectionHeading
            eyebrow="Testimonials"
            title="Designed to feel useful, not decorative."
            description="Placeholder reviews that communicate the real outcome: clearer decisions, better matching, and faster follow-through."
          />

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="glass-card testimonial-card">
                <p>“{testimonial.quote}”</p>
                <div>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="trust-strip glass-card">
            <span>Trusted workflow ideas for modern hiring</span>
            <div>
              <em>AI-driven matching</em>
              <em>Job board clarity</em>
              <em>Fast application tracking</em>
            </div>
          </div>
        </section>

        <section className="section-block cta-block">
          <div className="glass-card cta-panel">
            <div>
              <span className="cta-label">Ready to start?</span>
              <h2>Upload your CV and let SmartHire Jira guide the next move.</h2>
              <p>
                Get tailored matches, structured tracking, and real-time suggestions without the clutter of a
                generic job board.
              </p>
            </div>

            <div className="cta-actions">
              <Link to="/register" className="button button-primary">
                Upload CV
              </Link>
              <Link to="/login" className="button button-secondary">
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-shell footer-grid">
          <div>
            <strong>SmartHire Jira</strong>
            <p>AI job matching and application tracking for focused job seekers.</p>
          </div>

          <div>
            <span>Explore</span>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#dashboard-preview">Dashboard</a>
          </div>

          <div>
            <span>Contact</span>
            <a href="mailto:hello@smarthirejira.com">hello@smarthirejira.com</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer">
              X
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function WorkflowIllustration() {
  return (
    <svg className="workflow-svg" viewBox="0 0 640 420" role="img" aria-label="Smart job matching workflow illustration">
      <defs>
        <linearGradient id="workflow-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.28" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="workflow-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>

      <rect x="16" y="16" width="608" height="388" rx="28" fill="url(#workflow-bg)" stroke="rgba(255,255,255,0.12)" />

      <g className="workflow-orbit">
        <circle cx="106" cy="100" r="8" fill="#67e8f9" />
        <circle cx="530" cy="84" r="7" fill="#a78bfa" />
        <circle cx="560" cy="300" r="10" fill="#22c55e" />
        <circle cx="92" cy="298" r="6" fill="#f9a8d4" />
      </g>

      <path
        d="M132 140C180 118 224 116 276 140C328 164 356 166 420 142C484 118 514 122 552 144"
        fill="none"
        stroke="url(#workflow-line)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="8 10"
      />

      <g className="workflow-node">
        <rect x="56" y="172" width="152" height="104" rx="22" fill="rgba(255,255,255,0.9)" />
        <rect x="74" y="192" width="62" height="12" rx="6" fill="#60a5fa" />
        <rect x="74" y="214" width="102" height="10" rx="5" fill="#cbd5e1" />
        <rect x="74" y="232" width="78" height="10" rx="5" fill="#dbeafe" />
        <circle cx="176" cy="216" r="18" fill="#0f172a" />
        <path d="M168 216h16M176 208v16" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
      </g>

      <g className="workflow-node">
        <rect x="238" y="110" width="164" height="130" rx="24" fill="rgba(15,23,42,0.9)" />
        <rect x="258" y="132" width="84" height="12" rx="6" fill="#67e8f9" />
        <rect x="258" y="156" width="116" height="10" rx="5" fill="#475569" />
        <rect x="258" y="174" width="96" height="10" rx="5" fill="#334155" />
        <rect x="258" y="196" width="132" height="24" rx="12" fill="rgba(103,232,249,0.16)" />
        <circle cx="370" cy="142" r="16" fill="#67e8f9" opacity="0.95" />
        <path d="M363 142h14M370 135v14" stroke="#082f49" strokeWidth="3" strokeLinecap="round" />
      </g>

      <g className="workflow-node">
        <rect x="448" y="176" width="136" height="102" rx="22" fill="rgba(255,255,255,0.88)" />
        <rect x="466" y="196" width="86" height="12" rx="6" fill="#a78bfa" />
        <rect x="466" y="220" width="92" height="10" rx="5" fill="#c4b5fd" />
        <rect x="466" y="240" width="68" height="10" rx="5" fill="#ddd6fe" />
        <circle cx="552" cy="214" r="18" fill="#22c55e" />
        <path d="M544 214l6 7 12-15" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g className="workflow-status">
        <rect x="126" y="304" width="392" height="58" rx="18" fill="rgba(15,23,42,0.72)" />
        <rect x="144" y="320" width="170" height="12" rx="6" fill="#e2e8f0" opacity="0.92" />
        <rect x="144" y="340" width="244" height="8" rx="4" fill="#94a3b8" opacity="0.75" />
        <rect x="432" y="319" width="68" height="22" rx="11" fill="rgba(103,232,249,0.2)" />
      </g>
    </svg>
  );
}

function renderFeatureIcon(icon: Feature['icon']) {
  switch (icon) {
    case 'brain':
      return <BrainIcon />;
    case 'target':
      return <TargetIcon />;
    case 'board':
      return <BoardIcon />;
    case 'market':
      return <MarketIcon />;
    case 'insight':
      return <InsightIcon />;
  }
}

function BrainIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 9a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v.5a2.5 2.5 0 0 1 0 5V15a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-.5a2.5 2.5 0 0 1 0-5V9Z" />
      <path d="M9 7.5V5.8A2.8 2.8 0 0 1 11.8 3h.4" />
      <path d="M15 7.5V5.8A2.8 2.8 0 0 0 12.2 3h-.4" />
      <path d="M9 16.5V18.2A2.8 2.8 0 0 0 11.8 21h.4" />
      <path d="M15 16.5V18.2A2.8 2.8 0 0 1 12.2 21h-.4" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
    </svg>
  );
}

function BoardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <path d="M8 8v8M15 8v8M4 12h16" />
    </svg>
  );
}

function MarketIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
      <path d="M12 4v16" />
      <path d="M4 8.5l8 4.5 8-4.5" />
    </svg>
  );
}

function InsightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a7 7 0 0 0-4 12.7V17h8v-1.3A7 7 0 0 0 12 3Z" />
      <path d="M9 11l2 2 4-5" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.8A8.5 8.5 0 0 1 11.2 3a9 9 0 1 0 9.8 9.8Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
    </svg>
  );
}

export default LandingPage;
