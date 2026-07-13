import "./App.css";

const hackathonProjects = [
  {
    name: "Code Jam 15",
    context: "McGill Engineering, 36h",
    description: "Minigames app including 2048, Snake, and Block Blast in one app.",
    href: "https://github.com/alex-wang55/CodeJam-Project",
  },
  {
    name: "Hack the Hill 2",
    context: "uOttawa, 48h",
    description: "Wearable health monitor concept.",
  },
  {
    name: "Counterspell",
    context: "Shopify/Hack Club, 24h",
    description: "PvP game built during the hackathon.",
    href: "https://github.com/Jeffrey-dai17/Hawk.vs.Paul",
  },
  {
    name: "Ignition Hacks",
    context: "36h, online",
    description: "Game raising awareness about issues facing third-world countries.",
    href: "https://github.com/dwseoh/EduAtlas",
  },
];

const hardwareBuilds = [
  "Custom claw machine with a gantry built to 3D-printer-level positional accuracy, controlled by 2 Arduinos.",
  "Brushed DC motor built using a 3D printer and household materials including paper clips and tin foil.",
];

const roboticsHighlights = [
  "2-time provincial finalist",
  "World Championship 2023 participant",
  "Drive Team Member",
  "Led small sub-teams",
];

const roboticsSkills = ["CAD", "3D printing", "Hand tools", "Power tools"];

const chemECarSkills = ["PCB board design", "PCB soldering", "Motors", "Circuits"];

function Hero() {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-title">
      <div className="hero-content">
        <p className="section-eyebrow">Software-focused Computer Engineering</p>
        <h1 id="hero-title">Jeffrey Dai</h1>
        <p className="hero-subtitle">
          Bachelor of Computer Engineering student at McGill University.
        </p>
        <div className="hero-actions" aria-label="Contact and profile links">
          <a className="hero-button primary" href="resume.pdf" download>
            Download Resume (PDF)
          </a>
          <a className="hero-button" href="mailto:jeffrey.dai@mail.mcgill.ca">
            Email
          </a>
          <a className="hero-button" href="https://github.com/Jeffrey-dai17">
            GitHub
          </a>
          <a className="hero-button" href="https://www.linkedin.com/in/jeffrey-dai-3a9080319/">
            LinkedIn
          </a>
        </div>
      </div>
      <div className="hero-circuit" aria-hidden="true">
        <span className="circuit-node node-one" />
        <span className="circuit-node node-two" />
        <span className="circuit-node node-three" />
      </div>
    </section>
  );
}

function ProfessionalExperience() {
  return (
    <section
      className="experience-section"
      id="professional-experience"
      aria-labelledby="professional-experience-title"
    >
      <div className="experience-shell">
        <div className="experience-heading">
          <p className="section-eyebrow">Professional Experience</p>
          <h2 id="professional-experience-title">Canada Revenue Agency</h2>
        </div>

        <article className="experience-card" aria-label="CRA internship">
          <div className="experience-meta">
            <p className="experience-label">4-month internship</p>
            <h3>Enterprise Fraud Management Information Technology Branch</h3>
          </div>
          <div className="experience-copy">
            <p>
              At the CRA Enterprise Fraud Management Information Technology Branch, Jeffrey worked
              on mapping information between systems using XML and Java, contributing to
              enterprise-scale fraud-detection tooling.
            </p>
            <p>
              The work took place in an enterprise-scale production environment, giving the
              internship direct relevance to software engineering teams that maintain critical,
              real-world systems.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

function FeaturedProjects() {
  return (
    <section className="projects-section" id="featured-projects" aria-labelledby="projects-title">
      <div className="projects-shell">
        <div className="projects-heading">
          <p className="section-eyebrow">Featured Projects</p>
          <h2 id="projects-title">Software and hackathon builds</h2>
        </div>

        <article className="dishly-card" aria-label="Dishly Recipe Match project">
          <div className="dishly-card-main">
            <p className="project-label">Lead project - CUhacking, 36 hours</p>
            <h3>Dishly Recipe Match</h3>
            <p className="project-role">Full-Stack Developer</p>
            <p>
              Full-stack AI recipe-matching app that parses natural-language cravings into
              dietary and nutrition filters, fetches normalized recipe results, and presents them
              in a swipeable deck.
            </p>
            <p>
              Implemented Express API routes, provider integrations, session-based deck
              persistence, recipe detail flows, and automated test coverage across unit, API, and
              Playwright E2E tests.
            </p>
            <a className="project-link" href="https://github.com/Jeffrey-dai17/CU-Hack">
              View GitHub repository
            </a>
          </div>
          <div className="stack-panel" aria-label="Dishly technology stack">
            {["React", "Node.js", "Express", "Gemini API", "Spoonacular API"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>

        <div className="project-subsections">
          <section className="compact-block" aria-labelledby="hackathon-grid-title">
            <div className="compact-heading">
              <p className="project-label">Hackathon grid</p>
              <h3 id="hackathon-grid-title">More 24-48 hour builds</h3>
            </div>
            <div className="hackathon-grid">
              {hackathonProjects.map((project) => (
                <article className="hackathon-card" key={project.name}>
                  <p className="project-context">{project.context}</p>
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                  {project.href ? (
                    <a className="small-link" href={project.href}>
                      GitHub
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </section>

          <section className="compact-block hardware-block" aria-labelledby="hardware-builds-title">
            <div className="compact-heading">
              <p className="project-label">Hardware builds</p>
              <h3 id="hardware-builds-title">Secondary engineering builds</h3>
            </div>
            <ul className="hardware-list">
              {hardwareBuilds.map((build) => (
                <li key={build}>{build}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}

function CompetitiveRobotics() {
  return (
    <section
      className="robotics-section"
      id="competitive-robotics"
      aria-labelledby="robotics-title"
    >
      <div className="robotics-shell">
        <div className="robotics-heading">
          <p className="section-eyebrow">Competitive Robotics</p>
          <h2 id="robotics-title">FIRST Robotics Team 8729, "Sparkling H2O"</h2>
        </div>

        <div className="robotics-layout">
          <article className="robotics-main-card">
            <p className="project-label">2022-2025</p>
            <h3>Competition execution under pressure</h3>
            <p>
              Jeffrey competed as a Drive Team Member and Mechanical Sub-team Member on FIRST
              Robotics Team 8729, contributing in a high-pressure team environment that reached
              two provincial finals and the 2023 World Championship.
            </p>
            <p>
              He also gained experience leading small sub-teams, pairing competition-day execution
              with hands-on engineering delivery.
            </p>
          </article>

          <aside className="robotics-results" aria-label="Robotics highlights">
            {roboticsHighlights.map((highlight) => (
              <div className="robotics-result" key={highlight}>
                {highlight}
              </div>
            ))}
          </aside>
        </div>

        <div className="robotics-supporting" aria-label="Supporting mechanical skills">
          <p className="project-label">Supporting engineering skills</p>
          <div className="robotics-skill-list">
            {roboticsSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutLeadership() {
  return (
    <section className="about-section" id="about-leadership" aria-labelledby="about-title">
      <div className="about-shell">
        <div className="about-heading">
          <p className="section-eyebrow">About Me & Leadership</p>
          <h2 id="about-title">Leadership, systems thinking, and builder habits</h2>
        </div>

        <div className="about-grid">
          <article className="leadership-card primary-leadership-card">
            <p className="project-label">2025-present</p>
            <h3>McHacks Experience Team Lead</h3>
            <p>
              At McGill's largest hackathon, Jeffrey leads experience work for an event with 700
              participants across 1500+ applications.
            </p>
            <ul>
              <li>
                Led a team organizing and running workshops including intro to backend, intro to
                frontend, and adding AI chatbots to projects.
              </li>
              <li>
                Coordinated with companies including Athena AI and Gumloop on workshops, organized
                team socials, and helped review McHacks applications.
              </li>
            </ul>
          </article>

          <article className="leadership-card chem-card">
            <p className="project-label">2025-present</p>
            <h3>McGill Chem-E Car</h3>
            <p>Electrical sub-team member.</p>
            <div className="keyword-list" aria-label="Chem-E Car skills">
              {chemECarSkills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </article>
        </div>

        <article className="mindset-card">
          <p className="project-label">The Engineer's Mindset</p>
          <h3>Measured, iterative, and a little optimization-minded.</h3>
          <p>
            Outside class and projects, Jeffrey brings the same analytical habits to tracking
            fitness macronutrients with a data-driven approach and designing highly optimized,
            automated resource systems in Minecraft.
          </p>
        </article>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <header className="site-header">
        <a className="brand-link" href="#hero" aria-label="Jeffrey Dai portfolio home">
          Jeffrey Dai
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#professional-experience">Experience</a>
          <a href="#featured-projects">Projects</a>
          <a href="#competitive-robotics">Robotics</a>
          <a href="#about-leadership">About</a>
        </nav>
        <a className="resume-link" href="resume.pdf" download>
          Resume
        </a>
      </header>

      <main>
        <Hero />
        <ProfessionalExperience />
        <FeaturedProjects />
        <CompetitiveRobotics />
        <AboutLeadership />
      </main>
    </>
  );
}

export default App;

