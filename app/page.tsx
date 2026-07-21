"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Contact", href: "#contacts" },
];

const experiences = [
  {
    role: "Co-Founder & Full-Stack Developer",
    org: "Teenage Theory",
    period: "2024 — 2026",
    points: [
      "Teenage Theory is a web application inspired by Medium, designed to let users write, share, and discover articles.",
      "Built using Next.js, MongoDB, Prisma, and Firebase.",
    ],
  },
  {
    role: "Founder & President",
    org: "Richmond Green Robotics Team",
    period: "2024 — 2026",
    points: [
      "Lead a VEX V5 team building competitive robots with autonomous and driver-control systems.",
      "Coordinate team roles, outreach, sponsorship conversations, and technical planning.",
    ],
  },
  {
    role: "Front End Developer",
    org: "Richmond Green Model United Nations",
    period: "2023 — 2026",
    points: [
      "Designed responsive UI components with Tailwind CSS for an enhanced UX.",
      "Developed multiple webpages, including committee, registration, and event information pages, using Next.js and React.",
    ],
  },
];

const education = [
  {
    school: "University of Waterloo",
    program: "Software Engineering",
    detail:
      "Incoming student focused on full-stack development, systems, and practical software projects.",
  },
  {
    school: "Richmond Green Secondary School",
    program: "Ontario Secondary School Diploma",
    detail:
      "Coursework and activities in computer science, math, robotics, chemistry, physics, and leadership.",
  },
];

const projects = [
  
  {
    name: "Air Transit",
    type: "Airport Finder Web Application",
    description:
      "A web application that allows users to search through airport data, find airports by location, and view details such as airport codes, cities, countries, and coordinates.",
    tags: ["TypeScript", "HTML/CSS", "JSON", "Data Filtering"],
    image: "/Air Transit.png",
    imageAlt: "Air Transit airport finder application screenshot",
  },
  {
    name: "Automated Invoice Generator",
    type: "Desktop Productivity Tool",
    description:
      "A PyQt5 app that turns CSV and XLSX data into clean DOCX invoices using templates and automated replacements.",
    tags: ["Python", "PyQt5", "DOCX", "Automation"],
    image: "/invoice.png",
    imageAlt: "Automated Invoice Generator application screenshot",
  },
  {
    name: "Robotics Autonomous Code",
    type: "VEX V5 / PROS",
    description:
      "Robot control code using odometry, PID tuning, intake systems, pneumatics, and autonomous path planning.",
    tags: ["C++", "PROS", "LemLib", "Robotics"],
    image: "/Vex-Logo.jpg",
    imageAlt: "VEX V5 competition robot",
  },
  {
    name: "Kitchen 3D",
    type: "3D Cooking Simulation Game",
    description:
      "A single-player 3D cooking game inspired by Overcooked, featuring player movement, ingredient preparation, cooking stations, order completion, and an interactive kitchen environment.",
    tags: ["JavaScript", "Three.js", "3D Game Dev", "Game Logic"],
    image: "/kicthen 3d.png",
    imageAlt: "Kitchen 3D cooking simulation game screenshot",
  }
];

const techGroups = [
  {
    title: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "C++", "C", "C#", "HTML", "CSS"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Responsive UI", "Canvas", "A-Frame"],
  },
  {
    title: "Backend & Data",
    items: ["Node.js", "MongoDB", "Prisma", "Firebase", "REST APIs"],
  },
  {
    title: "Tools",
    items: ["Git", "Vercel", "Figma", "PyQt5", "PROS", "LemLib"],
  },
];

export default function Home() {
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    const revealElements =
      document.querySelectorAll<HTMLElement>(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      if (scrollingDown && currentScrollY > 120) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main>
      <nav
        className={`nav ${navHidden ? "navHidden" : ""}`}
        aria-label="Main navigation"
      >
        <a href="#home" className="brand" aria-label="Go to home">
          BL
        </a>

        <div className="navLinks">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="home" className="hero section reveal">
        <div className="heroText">
          <p className="eyebrow">Software Engineering Student</p>

          <h1>
            Hey, I&apos;m
            <br />
            Bernie Liu
          </h1>

          <p className="heroCopy">
            I&apos;m interested in full-stack development, robotics,
            automation, and building tools that make learning and productivity
            easier.
          </p>

          <div className="heroActions">
            <a href="#projects" className="button primary">
              View Projects
            </a>

            <a href="#contacts" className="button secondary">
              Contact Me
            </a>
          </div>
        </div>

        <div className="heroCard" aria-label="Profile summary card">
          <div className="orb" />
          <div className="profileCircle">BL</div>

          <p className="cardLabel">Currently exploring</p>

          <h2>Web apps, robotics, and intelligent tools</h2>

          <div className="miniStats">
            <span>Next.js</span>
            <span>Python</span>
            <span>Robotics</span>
          </div>
        </div>
      </section>

      <section id="about" className="section split reveal">
        <div>
          <p className="eyebrow">About Me</p>

          <h2>
            I like projects that combine logic, creativity, and real users.
          </h2>
        </div>

        <p className="sectionText">
          I started by building small games and websites, then moved into larger
          projects like educational apps, automation tools, and robotics
          systems. Outside of coding, I lead clubs, mentor new students, and
          look for ways to make technical spaces more welcoming.
        </p>
      </section>

      <section id="experience" className="section reveal">
        <div className="sectionHeader">
          <p className="eyebrow">Experience</p>

          <h2>Leadership, technical projects, and student impact.</h2>
        </div>

        <div className="timeline">
          {experiences.map((experience) => (
            <article
              className="timelineItem"
              key={`${experience.role}-${experience.org}`}
            >
              <div className="timelineDot" />

              <div className="card">
                <div className="cardTop">
                  <div>
                    <h3>{experience.role}</h3>
                    <p>{experience.org}</p>
                  </div>

                  <span>{experience.period}</span>
                </div>

                <ul>
                  {experience.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="section reveal">
        <div className="sectionHeader">
          <p className="eyebrow">Education</p>
          <h2>Academic background.</h2>
        </div>

        <div className="grid two">
          {education.map((item) => (
            <article className="card educationCard" key={item.school}>
              <span className="pill">Education</span>
              <h3>{item.school}</h3>
              <p className="muted">{item.program}</p>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section reveal">
        <div className="sectionHeader row">
          <div>
            <p className="eyebrow">Projects</p>
            <h2>Selected work.</h2>
          </div>

          <a
            href="https://github.com/83rnyyyy"
            target="_blank"
            rel="noopener noreferrer"
            className="textLink"
          >
            GitHub →
          </a>
        </div>

        <div className="grid projectsGrid">
          {projects.map((project, index) => (
            <article className="projectCard" key={project.name}>
              <div className="projectVisual">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 880px) 100vw, 50vw"
                  className="projectImage"
                />

                <div className="projectImageOverlay" />
              </div>

              <div className="projectContent">
                <p className="muted">{project.type}</p>
                <h3>{project.name}</h3>
                <p>{project.description}</p>

                <div className="tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="tech-stack" className="section reveal">
        <div className="sectionHeader">
          <p className="eyebrow">Tech Stack</p>
          <h2>Tools I use to build.</h2>
        </div>

        <div className="stackGrid">
          {techGroups.map((group) => (
            <article className="stackCard" key={group.title}>
              <h3>{group.title}</h3>

              <div className="tags large">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contacts" className="section contact reveal">
        <p className="eyebrow">Contact</p>

        <h2>Feel Free To Reach Out!</h2>

        <p>
          I&apos;m always open to talking about software, robotics, projects,
          or new opportunities.
        </p>

        <div className="contactLinks">
          <a href="mailto:b384liu@uwaterloo.ca">
            b384liu@uwaterloo.ca
          </a>

          <a
            href="https://github.com/83rnyyyy"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/bernie-liu"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
        </div>
      </section>
    </main>
  );
}
