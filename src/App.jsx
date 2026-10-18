import softwareResumeUrl from "../Jeffrey_Dai_Software_Resume.pdf?url";

import { Component, lazy, Suspense, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";

const OrbitalSculpture = lazy(() => import("./OrbitalSculpture.jsx"));

class OrbitBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed
      ? <p className="orbital-model-error">Portrait view / interactive scene unavailable</p>
      : this.props.children;
  }
}

const hackathonProjects = [
  { name: "In Class Bored Games", context: "Code Jam 15", description: "A unified minigame app featuring 2048, Snake, and Block Blast.", href: "https://github.com/alex-wang55/CodeJam-Project" },
  { name: "Serenity", context: "Hack the Hill II", description: "An Arduino health-monitor concept developed during the hackathon." },
  { name: "PvP Game", context: "Counterspell", description: "A player-versus-player game built during the hackathon.", href: "https://github.com/Jeffrey-dai17/Hawk.vs.Paul" },
  { name: "EduAtlas", context: "Ignition Hacks", description: "A Java education game built during the hackathon.", href: "https://github.com/dwseoh/EduAtlas" },
];

const DISHLY_LINKS = [
  {
    id: "website",
    optionLabel: "Website",
    linkLabel: "View website",
    href: "https://dishly.brandonjameschoi.com/",
  },
  {
    id: "github",
    optionLabel: "GitHub",
    linkLabel: "View GitHub repository",
    href: "https://github.com/Jeffrey-dai17/CU-Hack",
  },
];

const projectLinkMotion = {
  enter: (direction) => ({ opacity: 0, y: direction * 12 }),
  active: { opacity: 1, y: 0 },
  exit: (direction) => ({ opacity: 0, y: direction * -12 }),
};

const hardwareBuilds = [
  "I designed and built a claw machine with a 3D-printer-style gantry controlled by two Arduinos.",
  "I wrote the control code for three stepper motors: two for gantry movement and one for the claw.",
];

const skillGroups = [
  { label: "Languages", items: "JavaScript / Java / Python / C / C++ / Bash / VHDL" },
  { label: "Web & testing", items: "React / Node.js / Express / Socket.IO / Playwright" },
  { label: "Developer tools", items: "Git / Azure DevOps / Jira / VS Code / SSH / Claude / Render" },
  { label: "APIs & data", items: "Gemini API / Spoonacular API / XML / JSON" },
  { label: "Embedded & hardware", items: "Arduino / stepper motors / PCB design / 3D printing" },
];

const revealMotion = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.54, ease: [0.22, 1, 0.36, 1] },
};

function Reveal({ as = "div", children, className = "", ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const Component = as;
  const MotionComponent = motion[as] || motion.div;

  if (shouldReduceMotion) {
    return <Component className={className} {...props}>{children}</Component>;
  }

  return <MotionComponent className={className} {...revealMotion} {...props}>{children}</MotionComponent>;
}

function ArrowLink({ href, children, download = false }) {
  return (
    <a className="arrow-link" href={href} download={download || undefined}>
      <span>{children}</span>
      <span aria-hidden="true">-&gt;</span>
    </a>
  );
}

function ProjectLinkSwitcher({ links, projectName, switcherId }) {
  const shouldReduceMotion = useReducedMotion();
  const [[activeIndex, direction], setActiveLink] = useState([0, 0]);
  const activeLink = links[activeIndex];

  function selectLink(nextIndex) {
    if (nextIndex === activeIndex) return;

    setActiveLink([nextIndex, nextIndex > activeIndex ? 1 : -1]);
  }

  return (
    <div className="project-link-switcher">
      <div className="project-link-options" role="group" aria-label={`Choose a ${projectName} project link`}>
        {links.map((link, index) => {
          const isActive = activeIndex === index;

          return (
            <button
              className="project-link-option"
              type="button"
              aria-pressed={isActive}
              onClick={() => selectLink(index)}
              key={link.id}
            >
              {isActive ? (
                <motion.span
                  className="project-link-selection"
                  layoutId={`${switcherId}-link-selection`}
                  transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 430, damping: 36 }}
                  aria-hidden="true"
                />
              ) : null}
              <span className="project-link-option-copy">{link.optionLabel}</span>
            </button>
          );
        })}
      </div>
      <div className="project-link-stage">
        <AnimatePresence initial={false} custom={direction}>
          <motion.a
            className="project-destination-link"
            href={activeLink.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${activeLink.linkLabel} (opens in a new tab)`}
            key={activeLink.id}
            custom={direction}
            variants={projectLinkMotion}
            initial={shouldReduceMotion ? false : "enter"}
            animate="active"
            exit="exit"
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>{activeLink.linkLabel}</span>
            <span className="project-destination-arrow" aria-hidden="true">-&gt;</span>
          </motion.a>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand-link" href="#hero" aria-label="Jeffrey Dai portfolio home">Jeffrey Dai</a>
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#professional-experience">Experience</a>
        <a href="#featured-projects">Projects</a>
        <a href="#leadership-skills">Leadership + skills</a>
      </nav>
      <a className="resume-link" href={softwareResumeUrl} download="Jeffrey_Dai_Software_Resume.pdf">Software resume <span aria-hidden="true">↗</span></a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-title">
      <Reveal className="hero-copy">
        <p className="section-eyebrow">Software &amp; computer engineering</p>
        <h1 id="hero-title"><span>Jeffrey</span><span>Dai</span></h1>
        <p className="hero-subtitle">I build real-time games and web applications. At the Canada Revenue Agency, I work on the systems behind enterprise fraud management.</p>
        <p className="hero-education">Computer Engineering at McGill <span>Montreal / Ottawa</span></p>
        <div className="hero-actions" aria-label="Contact and profile links">
          <ArrowLink href={softwareResumeUrl} download="Jeffrey_Dai_Software_Resume.pdf">Download software resume</ArrowLink>
          <ArrowLink href="mailto:jeffrey.dai@mail.mcgill.ca">Send email</ArrowLink>
        </div>
        <div className="hero-profiles" aria-label="Social profiles">
          <a href="https://github.com/Jeffrey-dai17">GitHub <span aria-hidden="true">↗</span></a>
          <a href="https://www.linkedin.com/in/jeffrey-dai-3a9080319/">LinkedIn <span aria-hidden="true">↗</span></a>
        </div>
      </Reveal>
      <Reveal className="hero-image-block">
        <div className="image-stage">
          <img className="orbit-preview" src={`${import.meta.env.BASE_URL}orbit-preview.jpg`} alt="" aria-hidden="true" width="778" height="928" fetchPriority="high" />
          <OrbitBoundary>
            <Suspense fallback={<p className="orbital-model-status">Loading the orbit</p>}>
              <OrbitalSculpture />
            </Suspense>
          </OrbitBoundary>
        </div>
      </Reveal>
    </section>
  );
}

function ProfessionalExperience() {
  return (
    <section className="page-section experience-section" id="professional-experience" aria-labelledby="professional-experience-title">
      <Reveal className="section-heading">
        <p className="section-eyebrow">Experience / May 2026-present</p>
        <h2 id="professional-experience-title">Canada Revenue Agency</h2>
      </Reveal>
      <Reveal className="feature-row" as="article" aria-label="CRA internship and part-time continuation">
        <div className="row-meta">
          <p className="experience-label">Enterprise Fraud Management / IT Branch</p>
          <h3>Information Technology Intern</h3>
          <p className="experience-arrangement">Four-month internship, continuing part time at 20 hours per week.</p>
          <div className="meta-chip-row" aria-label="Public experience keywords">
            <span>Java</span><span>XML + JSON</span><span>Azure DevOps</span><span>Jira</span><span>SSH</span>
          </div>
        </div>
        <div className="row-copy">
          <p>I build and maintain Java and XML information mappings for enterprise fraud-management systems, and support monitoring of database queries, fraud-detection services, and JSON-based message queues.</p>
          <p>I develop remotely through SSH in VS Code, with Git for version control, Azure DevOps for pull requests and pipelines, and Jira for task tracking.</p>
        </div>
      </Reveal>
    </section>
  );
}

function FeaturedProjects() {
  return (
    <section className="page-section projects-section" id="featured-projects" aria-labelledby="projects-title">
      <Reveal className="section-heading">
        <p className="section-eyebrow">Selected projects</p>
        <h2 id="projects-title">From shared tables to everyday tools.</h2>
      </Reveal>
      <Reveal className="project-feature project-feature--chinatown project-spotlight" as="article" aria-label="Chinatown Online project">
        <div className="project-main project-spotlight-intro">
          <p className="project-label">React + Node.js / deployed on Render / 3-5 players</p>
          <h3>Chinatown Online</h3>
          <p className="project-role">Creator &amp; Full-Stack Developer</p>
        </div>

        <a className="project-preview" href="https://csuboardgame.onrender.com/" target="_blank" rel="noreferrer" aria-label="Open the Chinatown Online live game in a new tab">
          <div className="project-preview-bar">
            <span>Live product / browser multiplayer</span>
            <span>Open game -&gt;</span>
          </div>
          <img src={`${import.meta.env.BASE_URL}chinatown-preview.jpg`} alt="Canal Street 1965 game landing page with a new-table form over an illustrated Chinatown street" loading="lazy" />
        </a>

        <div className="project-main project-spotlight-story">
          <p>I built a real-time browser adaptation of Chinatown so my friends and I could keep our board-game nights going after we left for different universities.</p>
          <p>Room codes and private player state keep the table organized, while live trading and reconnect handling support the messy reality of a multiplayer session.</p>
          <div className="project-spotlight-links" aria-label="Chinatown Online project links">
            <a className="project-spotlight-link project-spotlight-link--primary" href="https://csuboardgame.onrender.com/" target="_blank" rel="noreferrer">
              <span>Visit the live game</span>
              <span aria-hidden="true">-&gt;</span>
            </a>
            <a className="project-spotlight-link" href="https://github.com/Jeffrey-dai17/China-Town" target="_blank" rel="noreferrer">
              <span>Read the source</span>
              <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
          <p className="project-access-note">Demo password: <code>2026CSUroom</code></p>
        </div>

        <div className="project-engineering" aria-label="Chinatown Online engineering highlights">
          <div>
            <p className="project-evidence-label">Real-time architecture</p>
            <p>A server-authoritative Node and Socket.IO engine keeps every player's turn phase, property, shop tile, trade, and cash balance in sync.</p>
          </div>
          <div>
            <p className="project-evidence-label">Private state &amp; resilience</p>
            <p>Private player state protects information that belongs to one player, while reconnect handling lets a session survive ordinary connection drops.</p>
          </div>
          <div>
            <p className="project-evidence-label">Tested multiplayer flow</p>
            <p>Automated end-to-end smoke tests exercise the multiplayer flow so changes can be checked against a real browser session.</p>
          </div>
        </div>

        <dl className="project-skill-ledger">
          <div>
            <dt>Technology</dt>
            <dd>React / JavaScript / Node.js / Express / Socket.IO / Vite / Render</dd>
          </div>
          <div>
            <dt>Skills demonstrated</dt>
            <dd>Server-authoritative state / real-time multiplayer / private player data / reconnect handling / end-to-end testing</dd>
          </div>
        </dl>
      </Reveal>

      <Reveal className="project-feature" as="article" aria-label="Dishly Recipe Match project">
        <div className="project-main">
          <p className="project-label">CUhacking / 36-hour build</p>
          <h3>Dishly Recipe Match</h3>
          <p className="project-role">Full-Stack Developer</p>
          <p>I helped build a full-stack AI recipe-matching app that turns natural-language cravings into dietary and nutrition filters, fetches normalized recipe results, and presents them in a swipeable deck.</p>
          <p>I implemented Express API routes, provider integrations, session-based deck persistence, recipe detail flows, and automated test coverage across unit, API, and Playwright E2E tests.</p>
          <ProjectLinkSwitcher
            links={DISHLY_LINKS}
            projectName="Dishly Recipe Match"
            switcherId="dishly"
          />
        </div>
        <div className="stack-panel" aria-label="Dishly technology stack">
          {["React", "Node.js", "Express", "Gemini API", "Spoonacular API"].map((item) => <span key={item}>{item}</span>)}
        </div>
      </Reveal>

      <div className="subsection-grid">
        <section className="compact-block" aria-labelledby="hackathon-grid-title">
          <Reveal className="compact-heading">
            <p className="project-label">Additional hackathons</p>
            <h3 id="hackathon-grid-title">Built with a team, against the clock.</h3>
          </Reveal>
          <div className="feed-list">
            {hackathonProjects.map((project) => (
              <Reveal className="feed-row" as="article" key={project.name}>
                <p className="project-context">{project.context}</p>
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                {project.href ? <a className="small-link" href={project.href}>GitHub</a> : null}
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="compact-block hardware-block" as="section" aria-labelledby="hardware-builds-title">
          <div className="compact-heading">
            <p className="project-label">Arduino / stepper motors / 3D printing</p>
            <h3 id="hardware-builds-title">Claw Machine</h3>
          </div>
          <ul className="hardware-list">
            {hardwareBuilds.map((build) => <li key={build}>{build}</li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function LeadershipSkills() {
  return (
    <section className="page-section about-section" id="leadership-skills" aria-labelledby="leadership-skills-title">
      <Reveal className="section-heading">
        <p className="section-eyebrow">Leadership + skills</p>
        <h2 id="leadership-skills-title">Workshops, teams, and a working toolkit.</h2>
      </Reveal>
      <div className="about-grid">
        <Reveal className="leadership-block primary-leadership-block" as="article">
          <p className="project-label">2025-present</p>
          <h3>McHacks Experience Team Lead</h3>
          <p>I lead a team supporting a hackathon with 700 participants selected from more than 1,500 applications.</p>
          <ul>
            <li>Organize backend, frontend, and AI chatbot workshops.</li>
            <li>Coordinate sessions with external partners.</li>
          </ul>
        </Reveal>
        <Reveal className="leadership-block skills-ledger" as="article">
          <p className="project-label">Working toolkit</p>
          <h3>Across software and hardware</h3>
          <dl className="project-skill-ledger">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <dt>{group.label}</dt>
                <dd>{group.items}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
      <Reveal className="mindset-block" as="article">
        <p className="project-label">Education</p>
        <h3>McGill University</h3>
        <p>Bachelor of Engineering in Computer Engineering, expected April 2029. CGPA: 3.89 / 4.00. Fluent in English and advanced in French.</p>
      </Reveal>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-heading">
        <p className="section-eyebrow">Contact / McGill / Montréal</p>
        <h2>Have an engineering problem worth talking through?</h2>
      </div>
      <a className="footer-email" href="mailto:jeffrey.dai@mail.mcgill.ca">
        <span>jeffrey.dai@mail.mcgill.ca</span>
        <span aria-hidden="true">-&gt;</span>
      </a>
      <div className="footer-meta">
        <p>Jeffrey Dai / Computer Engineering</p>
        <nav aria-label="Footer navigation">
          <a href={softwareResumeUrl} download="Jeffrey_Dai_Software_Resume.pdf">Software resume</a>
          <a href="https://github.com/Jeffrey-dai17">GitHub</a>
          <a href="https://www.linkedin.com/in/jeffrey-dai-3a9080319/">LinkedIn</a>
          <a href="#hero">Back to top</a>
        </nav>
      </div>
    </footer>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <ProfessionalExperience />
        <FeaturedProjects />
        <LeadershipSkills />
      </main>
      <SiteFooter />
    </MotionConfig>
  );
}

export default App;
