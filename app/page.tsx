"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Dragon from "./dragon";

const navItems = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contacts" },
];

const experiences = [
  {
    role: "Software Engineer — Eve Team",
    org: "WATonomous",
    period: "2026 — Present",
    location: "Waterloo, Ontario",
    points: [
      "Reduced BEVFusion inference latency by 35% through TensorRT INT8 optimization while maintaining detection accuracy within 2% of the PyTorch baseline.",
      "Identified object-tracking, GPU memory, and inference bottlenecks using 50+ ROS bag recordings, improving autonomous vehicle perception pipeline processing speed by 10%.",
    ],
  },
  {
    role: "Software Engineer",
    org: "UW Cube Design Incubator",
    period: "Aug. 2026 — Present",
    location: "Waterloo, Ontario",
    points: [
      "Improve website performance and internal workflows by 15% by developing full-stack features and internal tools using Next.js, React, FastAPI, Prisma, and MongoDB.",
      "Improve UW CUBE’s AI chatbot response accuracy by 10% by integrating backend APIs, database services, and application logic to expand knowledge coverage and improve the user experience.",
    ],
  },
  {
    role: "Full-Stack Developer",
    org: "Teenage Theory",
    period: "July 2025 — July 2026",
    location: "Richmond Hill, Ontario",
    points: [
      "Co-founded a full-stack blogging platform using Next.js, React, Prisma, and MongoDB, implementing 10+ routes and 5+ database-backed features for publishing, authentication, and content management.",
      "Built CRUD workflows, responsive interfaces, and Firebase Storage integration for image uploads, supporting 2,000+ site visits across mobile and desktop devices.",
      "Optimized MongoDB and Prisma queries through schema refinement, indexing, and reduced redundant database calls, cutting average content retrieval latency by approximately 35% and reducing database operations by 25%.",
    ],
  },
  {
    role: "Lead Programmer",
    org: "Richmond Green Robotics Team",
    period: "Sept. 2024 — June 2026",
    location: "Richmond Hill, Ontario",
    points: [
      "Founded and led a VEX V5 robotics team with 20+ members, coordinating software, mechanical, and outreach efforts throughout the competition cycle.",
      "Programmed autonomous and driver-control systems in C++ using PROS and LemLib, integrating motors, sensors, pneumatics, and PID-based movement.",
    ],
  },
  {
    role: "Software Developer",
    org: "Richmond Green Computer Science and Model United Nations Club",
    period: "Sept. 2023 — June 2026",
    location: "Richmond Hill, Ontario",
    points: [
      "Developed the official Model UN website using HTML, CSS, JavaScript, and Tailwind CSS, serving 300+ users while leading a team of 10 contributors.",
      "Reduced invoice preparation time by approximately 80% by building a Python and PyQt5 desktop automation system to parse CSV and Excel delegation data and populate invoice records.",
      "Generated 50+ formatted invoices in under 1 second using python-docx, eliminating repetitive manual data entry and standardizing invoice formatting across Model UN delegations.",
    ],
  },
];

const education = [
  {
    school: "University of Waterloo",
    program: "Software Engineering",
    label: "Current student",
    detail: "Focused on full-stack development, systems, and practical software projects.",
  },
  {
    school: "Richmond Green Secondary School",
    program: "Ontario Secondary School Diploma",
    label: "Secondary education",
    detail: "Computer science, math, robotics, chemistry, physics, and leadership.",
  },
];

type Project = {
  name: string;
  type: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  className: string;
  href?: string;
};

const projects: Project[] = [
  {
    name: "Snitch",
    type: "Interview review & analysis",
    category: "Web",
    description: "An evidence-first second look at interviews. Review recordings, explore timestamped moments, and compare spoken claims with a résumé, with live interviews and screen sharing built in.",
    tags: ["Next.js", "Python", "FastAPI", "WebRTC"],
    image: "/snitch-logo.png",
    imageAlt: "Snitch interview review and analysis platform logo",
    className: "snitch",
    href: "https://github.com/amelialon/Snitch",
  },
  {
    name: "Air Transit",
    type: "Airport finder",
    category: "Web",
    description: "Making airport data easier to explore. Search by location and discover airport codes, cities, countries, and coordinates in one place.",
    tags: ["TypeScript", "HTML / CSS", "JSON"],
    image: "/Air Transit.png",
    imageAlt: "Air Transit airport finder application screenshot",
    className: "air-transit",
  },
  {
    name: "Invoice Generator",
    type: "Desktop productivity tool",
    category: "Automation",
    description: "From spreadsheets to ready-to-send invoices. A desktop app that turns CSV and XLSX data into formatted DOCX documents using reusable templates.",
    tags: ["Python", "PyQt5", "DOCX"],
    image: "/invoice.png",
    imageAlt: "Automated Invoice Generator desktop application screenshot",
    className: "invoice",
  },
  {
    name: "Autonomous Robotics",
    type: "VEX V5 / PROS",
    category: "Robotics",
    description: "Bringing code into the physical world. Robot control systems built with odometry, PID tuning, pneumatics, and autonomous path planning.",
    tags: ["C++", "PROS", "LemLib"],
    image: "/Vex-Logo.jpg",
    imageAlt: "VEX Robotics logo",
    className: "robotics",
  },
  {
    name: "Kitchen 3D",
    type: "3D cooking simulation",
    category: "Games",
    description: "A little kitchen chaos, built from scratch. A single-player game inspired by Overcooked, with ingredient preparation, cooking stations, and orders to complete.",
    tags: ["JavaScript", "Three.js", "Game development"],
    image: "/kicthen 3d.png",
    imageAlt: "Kitchen 3D cooking simulation game screenshot",
    className: "kitchen",
  },
];

const techGroups = [
  { title: "Languages", items: ["JavaScript", "TypeScript", "Python", "C++", "C", "C#", "HTML", "CSS"] },
  { title: "Frontend", items: ["React", "Next.js", "Responsive UI", "Canvas", "A-Frame"] },
  { title: "Backend & data", items: ["Node.js", "MongoDB", "Prisma", "Firebase", "REST APIs"] },
  { title: "Tools", items: ["Git", "Vercel", "Figma", "PyQt5", "PROS", "LemLib"] },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}</svg>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All work");
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection("#" + entry.target.id);
      });
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    navItems.forEach(({ href }) => {
      const element = document.querySelector(href);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const visibleProjects = projects.filter((project) => filter === "All work" || project.category === filter);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Dragon />
      <header className="site-header">
        <nav className="nav container" aria-label="Main navigation">
          <a href="#home" className="brand" aria-label="Bernie Liu, home" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">b<span>l</span><i /></span>
            <span className="brand-name">Bernie Liu<span className="brand-period">.</span></span>
          </a>
          <div className="nav-links desktop-nav">
            {navItems.map((item) => <a key={item.href} href={item.href} className={activeSection === item.href ? "active" : ""} aria-current={activeSection === item.href ? "location" : undefined}>{item.label}</a>)}
          </div>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-link">Résumé <Arrow diagonal /></a>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? "open" : ""}><i /><i /></span>
          </button>
        </nav>
        {menuOpen && <div className="mobile-nav" id="mobile-navigation">{navItems.map((item, index) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{item.label}<Arrow /></a>)}</div>}
      </header>

      <main id="main-content">
        <section id="home" className="hero container" aria-labelledby="hero-title">
          <div className="hero-orbit" aria-hidden="true"><span /><span /><i className="orbit-cross cross-one" /><i className="orbit-cross cross-two" /></div>
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow"><span className="small-star">✳</span> A little curiosity. A lot of code.</p>
            <h1 id="hero-title">Bernie<br /><span>Liu<span className="name-period">.</span></span></h1>
            <div className="hero-description">
              <p className="hero-role">Software Engineering student at Waterloo.</p>
              <p>I build thoughtful web experiences, useful tools, and robots that find their own way.</p>
            </div>
            <div className="hero-actions">
              <a href="#projects" className="button button-primary">Explore my work <Arrow /></a>
              <a href="#contacts" className="button button-text">Let’s connect <Arrow diagonal /></a>
            </div>
          </div>
          <div className="dragon-caption" aria-hidden="true"><span className="caption-line" /><span>Led by curiosity.<br />Built to keep moving.</span></div>
          <div className="hero-bottom">
            <p><span className="status-dot" /> Software Engineering student <span className="hero-school">@ University of Waterloo</span></p>
            <a href="#projects" className="scroll-link">Scroll to explore <span>↓</span></a>
          </div>
        </section>

        <div className="content-surface">
          <section id="projects" className="section container" aria-labelledby="work-title">
            <div className="section-heading">
              <div><p className="eyebrow"><span>01 /</span> Selected work</p><h2 id="work-title">Ideas, made real<span className="subtle-period">.</span></h2></div>
              <a href="https://github.com/83rnyyyy" target="_blank" rel="noopener noreferrer" className="inline-link">More on GitHub <Arrow diagonal /></a>
            </div>
            <div className="project-filters" role="group" aria-label="Filter projects by category">
              {["All work", "Web", "Automation", "Robotics", "Games"].map((category) => <button key={category} type="button" className={filter === category ? "selected" : ""} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{category === "All work" && <span>{String(projects.length).padStart(2, "0")}</span>}</button>)}
            </div>
            <div className="projects-grid" aria-live="polite" aria-atomic="true">
              {visibleProjects.map((project) => <article className={"project-card " + project.className} key={project.name}>
                <div className="project-visual">
                  <div className="project-visual-top" aria-hidden="true"><span>{project.type}</span><span>0{projects.indexOf(project) + 1}</span></div>
                  <div className="project-image-frame"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 760px) 90vw, 44vw" className="project-image" /></div>
                  <span className="project-category">{project.category}</span>
                </div>
                <div className="project-content">
                  <h3>{project.href ? <a href={project.href} target="_blank" rel="noopener noreferrer" className="project-title-link" aria-label={"View " + project.name + " on GitHub"}>{project.name}<Arrow diagonal /></a> : project.name}</h3>
                  <p>{project.description}</p>
                  <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </article>)}
            </div>
          </section>

          <section id="about" className="section about-section container" aria-labelledby="about-title">
            <div className="about-intro"><p className="eyebrow"><span>02 /</span> A little about me</p><h2 id="about-title">Logic meets<br /><span className="serif-word">imagination.</span></h2><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-link">The longer version <Arrow diagonal /></a></div>
            <div className="about-copy">
              <p className="large-copy">I like turning “what if?” into something you can actually use.</p>
              <p>I’m Bernie, a Software Engineering student at the University of Waterloo. My interests live somewhere between full-stack development, robotics, and making everyday things a little easier.</p>
              <p>I started with small games and websites, then found my way into educational apps, automation tools, and autonomous systems. Outside of code, I lead clubs, mentor new students, and help make technical spaces more welcoming.</p>
              <div className="interest-list"><span>Thoughtful interfaces</span><span>Useful automation</span><span>Things that move</span></div>
            </div>
          </section>

          <section id="experience" className="section container" aria-labelledby="experience-title">
            <div className="section-heading"><div><p className="eyebrow"><span>03 /</span> Along the way</p><h2 id="experience-title">Building. Leading. Learning.</h2></div><span className="section-note">The experience behind the work.</span></div>
            <div className="experience-list">
              {experiences.map((experience, index) => <article className="experience-row" key={experience.org}>
                <span className="experience-index">0{index + 1}</span>
                <div className="experience-title"><h3>{experience.org}</h3><p>{experience.role}</p><span className="experience-period">{experience.period}</span><span className="experience-location">{experience.location}</span></div>
                <div className="experience-description">{experience.points.map((point) => <p key={point}>{point}</p>)}</div>
              </article>)}
            </div>
            <div id="education" className="education-section">
              <p className="eyebrow">A foundation for what’s next</p>
              <div className="education-grid">{education.map((item) => <article className="education-item" key={item.school}><span className="education-label">{item.label}</span><h3>{item.school}</h3><p className="education-program">{item.program}</p><p>{item.detail}</p></article>)}</div>
            </div>
          </section>

          <section id="tech-stack" className="section stack-section container" aria-labelledby="stack-title">
            <h2 id="stack-title" className="eyebrow"><span>04 /</span> The toolkit</h2>
            <div className="stack-grid">{techGroups.map((group, index) => <article className="stack-group" key={group.title}><span className="stack-number">0{index + 1}</span><h3>{group.title}</h3><div className="stack-items">{group.items.map((item) => <span key={item}>{item}</span>)}</div></article>)}</div>
          </section>

          <section id="contacts" className="contact-section container" aria-labelledby="contact-title">
            <p className="eyebrow"><span>05 /</span> Something in mind?</p>
            <div className="contact-heading"><h2 id="contact-title">Let’s build<br /><span className="serif-word">something good.</span></h2><a href="mailto:b384liu@uwaterloo.ca" className="contact-arrow" aria-label="Email Bernie Liu"><Arrow diagonal /></a></div>
            <div className="contact-bottom"><a href="mailto:b384liu@uwaterloo.ca" className="email-link">b384liu@uwaterloo.ca <Arrow diagonal /></a><p>Projects, opportunities, or a good conversation.<br />My inbox is open.</p></div>
          </section>

          <footer className="footer container"><a href="#home" className="footer-name">Bernie Liu<span>.</span></a><p>Built with intention. And a little imagination.</p><div className="footer-links"><a href="https://github.com/83rnyyyy" target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal /></a><a href="https://www.linkedin.com/in/bernie-liu" target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a><a href="#home" aria-label="Back to top">↑</a></div></footer>
        </div>
      </main>
    </>
  );
}

