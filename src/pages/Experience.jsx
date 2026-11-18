import { Briefcase, Rocket, Trophy, Users } from "lucide-react";
import Reveal from "../components/Reveal";
import { Badge, Section, SectionHeading } from "../components/ui";

// Replace the details below with real information before sharing the portfolio.
const experiences = [
  {
    number: "01",
    category: "Internship",
    icon: Briefcase,
    title: "Internship (PKL)",
    role: "Front-End Developer",
    place: "PT. Informatik Sinergi",
    period: "2025",
    description:
      "A chance to experience a professional work environment and apply technical skills to real tasks.",
    highlights: [
      "Learned how to make a dashboard and login admin.",
      "Practised technical skills and workplace discipline.",
      "Built communication and teamwork habits.",
    ],
  },
  {
    number: "02",
    category: "Organization",
    icon: Users,
    title: "Student Council",
    role: "Student Council Member",
    place: "SMP Negeri 27 Banjarmasin",
    period: "2022 - 2024",
    description:
      "Involvement in school organizations to build responsibility, coordination, and the ability to work with others.",
    highlights: [
      "Collaborated in a team with clear task division.",
      "Helped plan and run events.",
      "Practised communication and decision making.",
    ],
  },
  {
    number: "03",
    category: "Competition",
    icon: Trophy,
    title: "MLBB Competitions",
    role: "Participant",
    place: "Mobile Legends:Bang Bang competitions",
    period: "2024",
    description:
      "My experience in MLBB tournaments serves to test my performance within a team, specifically regarding communication and collaboration..",
    highlights: [
      "Stay focused under pressure.",
      "Communication with the team.",
      "Gained new experience and useful feedback.",
    ],
  },
  {
    number: "04",
    category: "Personal Project",
    icon: Rocket,
    title: "Portfolio Website",
    role: "Developer & Designer",
    place: "Independent projects",
    period: "2026",
    description:
      "Self-directed projects that apply what I learn and build a portfolio anyone can view.",
    highlights: [
      "Designed website layouts and user flows.",
      "Applied HTML, CSS, JavaScript, and related tools.",
      "Reviewed and improved each project after launch.",
    ],
  },
];

function Experience() {
  return (
    <Section
      id="experience"
      tone="muted"
      offset="about"
      glow
      className="texture-paper">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal direction="up" distance={18}>
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Journey"
              title="Experience &"
              accent="involvement."
              description="Activities and projects that have helped me learn, gain experience, and grow my skills over time."
            />
            <p className="mt-6 max-w-sm font-editorial text-sm italic leading-7 text-[#A1A1AA]">
              A timeline of moments — internships, teams, and projects — that
              shaped how I work.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="note-tag bg-[#111116]/80">
                {experiences.length} moments
              </span>
              <span className="note-tag bg-[#111116]/80">still growing</span>
            </div>
          </div>
        </Reveal>

        <div className="relative pl-7 sm:pl-9">
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-[#6366F1]/80 via-[#3f3f52] to-transparent sm:left-[7px]"
          />

          <div className="space-y-6">
            {experiences.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.number} as="article" delay={index * 40}>
                  <div className="relative">
                    <span
                      className="absolute -left-[27px] top-6 flex h-3 w-3 items-center justify-center rounded-full bg-[#6366F1] ring-4 ring-[#111116] sm:-left-[33px]"
                      aria-hidden="true">
                      <span className="absolute h-3 w-3 rounded-full bg-[#6366F1]/60" />
                    </span>

                    <div className="card-lift group relative overflow-hidden rounded-xl border border-[#27272A] bg-[#18181F]/55 p-5 backdrop-blur sm:p-6">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-2 -top-4 select-none font-display text-6xl font-extrabold leading-none text-white/[0.03]">
                        {item.number}
                      </span>

                      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-2">
                        <Badge tone="accent">
                          <Icon aria-hidden="true" className="h-3 w-3" />
                          {item.category}
                        </Badge>
                        <span className="text-xs text-[#8b8b95]">
                          {item.period}
                        </span>
                      </div>
                      <h3 className="relative mt-3 text-xl font-bold tracking-tight text-[#F5F5F5]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#A5B4FC]">
                        {item.role} ·{" "}
                        <span className="text-[#A1A1AA]">{item.place}</span>
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">
                        {item.description}
                      </p>
                      <ul className="mt-4 space-y-1.5">
                        {item.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="flex gap-2 text-sm leading-6 text-[#d4d4d8]">
                            <span
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#6366F1]"
                              aria-hidden="true"
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Experience;
