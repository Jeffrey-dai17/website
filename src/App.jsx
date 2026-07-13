import "./App.css";

import { useRef } from "react";
import { MotionConfig, motion, useReducedMotion, useScroll, useTransform } from "motion/react";

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

const sectionReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
};

const cardReveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
};

function PageSection({ children, className, id, labelledBy }) {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.42, 1, 1, 0.52]);
  const y = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], ["7vh", "0vh", "0vh", "-5vh"]);
  const scale = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.975, 1, 1, 0.985]);
  const filter = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    ["blur(10px)", "blur(0px)", "blur(0px)", "blur(8px)"],
  );

  return (
    <motion.section
      ref={sectionRef}
      className={className}
      id={id}
      aria-labelledby={labelledBy}
      style={shouldReduceMotion ? undefined : { opacity, y, scale, filter }}
    >
      {children}
    </motion.section>
  );
}

function Hero() {
  return (
    <PageSection className="hero-section" id="hero" labelledBy="hero-title">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
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
      </motion.div>
      <motion.div
        className="hero-circuit"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      >
        <div className="lock-mark">
          <span className="lock-shackle" />
          <span className="lock-body">
            <span className="lock-keyhole" />
          </span>
        </div>
        <span className="circuit-trace trace-one" />
        <span className="circuit-trace trace-two" />
        <span className="circuit-trace trace-three" />
        <span className="circuit-node node-one" />
        <span className="circuit-node node-two" />
        <span className="circuit-node node-three" />
        <span className="circuit-node node-four" />
      </motion.div>
    </PageSection>
  );
}

function ProfessionalExperience() {
  return (
    <PageSection
      className="experience-section"
      id="professional-experience"
      labelledBy="professional-experience-title"
    >
      <motion.div className="experience-shell" {...sectionReveal}>
        <div className="experience-heading">
          <p className="section-eyebrow">Professional Experience</p>
          <h2 id="professional-experience-title">Canada Revenue Agency</h2>
        </div>

        <motion.article className="experience-card" aria-label="CRA internship" {...cardReveal}>
          <div className="experience-meta">
            <p className="experience-label">4-month internship</p>
            <h3>Enterprise Fraud Management Information Technology Branch</h3>
            <div className="meta-chip-row" aria-label="Public experience keywords">
              <span>XML</span>
              <span>Java</span>
              <span>Enterprise environment</span>
            </div>
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
        </motion.article>
      </motion.div>
    </PageSection>
  );
}

function FeaturedProjects() {
  return (
    <PageSection className="projects-section" id="featured-projects" labelledBy="projects-title">
      <motion.div className="projects-shell" {...sectionReveal}>
        <div className="projects-heading">
          <p className="section-eyebrow">Featured Projects</p>
          <h2 id="projects-title">Software and hackathon builds</h2>
        </div>

        <motion.article className="dishly-card" aria-label="Dishly Recipe Match project" {...cardReveal}>
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
        </motion.article>

        <div className="project-subsections">
          <section className="compact-block" aria-labelledby="hackathon-grid-title">
            <div className="compact-heading">
              <p className="project-label">Hackathon grid</p>
              <h3 id="hackathon-grid-title">More 24-48 hour builds</h3>
            </div>
            <div className="hackathon-grid">
              {hackathonProjects.map((project) => (
                <motion.article className="hackathon-card" key={project.name} {...cardReveal}>
                  <p className="project-context">{project.context}</p>
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                  {project.href ? (
                    <a className="small-link" href={project.href}>
                      GitHub
                    </a>
                  ) : null}
                </motion.article>
              ))}
            </div>
          </section>

          <motion.section
            className="compact-block hardware-block"
            aria-labelledby="hardware-builds-title"
            {...cardReveal}
          >
            <div className="compact-heading">
              <p className="project-label">Hardware builds</p>
              <h3 id="hardware-builds-title">Secondary engineering builds</h3>
            </div>
            <ul className="hardware-list">
              {hardwareBuilds.map((build) => (
                <li key={build}>{build}</li>
              ))}
            </ul>
          </motion.section>
        </div>
      </motion.div>
    </PageSection>
  );
}

function CompetitiveRobotics() {
  return (
    <PageSection
      className="robotics-section"
      id="competitive-robotics"
      labelledBy="robotics-title"
    >
      <motion.div className="robotics-shell" {...sectionReveal}>
        <div className="robotics-heading">
          <p className="section-eyebrow">Competitive Robotics</p>
          <h2 id="robotics-title">FIRST Robotics Team 8729, "Sparkling H2O"</h2>
        </div>

        <div className="robotics-layout">
          <motion.article className="robotics-main-card" {...cardReveal}>
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
          </motion.article>

          <aside className="robotics-results" aria-label="Robotics highlights">
            {roboticsHighlights.map((highlight) => (
              <motion.div className="robotics-result" key={highlight} {...cardReveal}>
                {highlight}
              </motion.div>
            ))}
          </aside>
        </div>

        <motion.div className="robotics-supporting" aria-label="Supporting mechanical skills" {...cardReveal}>
          <p className="project-label">Supporting engineering skills</p>
          <div className="robotics-skill-list">
            {roboticsSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </PageSection>
  );
}

function AboutLeadership() {
  return (
    <PageSection className="about-section" id="about-leadership" labelledBy="about-title">
      <motion.div className="about-shell" {...sectionReveal}>
        <div className="about-heading">
          <p className="section-eyebrow">About Me & Leadership</p>
          <h2 id="about-title">Leadership, systems thinking, and builder habits</h2>
        </div>

        <div className="about-grid">
          <motion.article className="leadership-card primary-leadership-card" {...cardReveal}>
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
          </motion.article>

          <motion.article className="leadership-card chem-card" {...cardReveal}>
            <p className="project-label">2025-present</p>
            <h3>McGill Chem-E Car</h3>
            <p>Electrical sub-team member.</p>
            <div className="keyword-list" aria-label="Chem-E Car skills">
              {chemECarSkills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </motion.article>
        </div>

        <motion.article className="mindset-card" {...cardReveal}>
          <p className="project-label">The Engineer's Mindset</p>
          <h3>Measured, iterative, and a little optimization-minded.</h3>
          <p>
            Outside class and projects, Jeffrey brings the same analytical habits to tracking
            fitness macronutrients with a data-driven approach and designing highly optimized,
            automated resource systems in Minecraft.
          </p>
        </motion.article>
      </motion.div>
    </PageSection>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  );
}

export default App;

