import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_GIF = "/images/hero.gif";
const START_VIDEO = "/videos/start.mp4";
const CREATION_VIDEO = "/videos/creation.mp4";
const CONTACT_VIDEO = "/videos/contact.mp4";

const creationProjects = [
  {
    title: "Sakura Radio",
    image: "/images/project-sakura-radio.png",
    tag: "AI 音乐陪伴",
  },
  {
    title: "AI 编程任务卡片生成器",
    image: "/images/project-task-card-generator.png",
    tag: "AI 编程工具",
  },
];

const navItems = [
  ["首页", "home"],
  ["能力", "capabilities"],
  ["项目", "work"],
  ["造物", "experience"],
  ["联系", "contact"],
];

function BlurText({
  text,
  className,
  splitBy = "words",
  delay = 100,
  direction = "bottom",
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const units = splitBy === "letters" ? [...text] : text.split(" ");
  const y = direction === "bottom" ? 50 : -50;

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={cn("inline-flex flex-wrap", className)}>
      {units.map((unit, index) => (
        <motion.span
          // eslint-disable-next-line react/no-array-index-key
          key={`${unit}-${index}`}
          className="inline-block will-change-transform"
          initial={{ filter: "blur(10px)", opacity: 0, y }}
          animate={
            visible
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [y, -5, 0],
                }
              : {}
          }
          transition={{
            delay: (index * delay) / 1000,
            duration: 0.7,
            times: [0, 0.5, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {unit === " " ? "\u00A0" : unit}
          {splitBy === "words" && index < units.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

function BackgroundVideo({ src, className, desaturated = false }) {
  return (
    <video
      className={cn(
        "absolute inset-0 h-full w-full object-cover",
        desaturated && "saturate-0",
        className,
      )}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function SectionHeader({ badge, title }) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <span className="section-badge">{badge}</span>
      <h2 className="editorial-heading mt-5 text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h2>
    </div>
  );
}

function useScrollFade(ref) {
  const [fade, setFade] = useState({ opacity: 0, y: 28 });

  useEffect(() => {
    let frameId = null;

    const updateFade = () => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - viewportHeight * 0.52);
      const rawOpacity = 1 - distance / (viewportHeight * 0.62);
      const opacity = Math.min(Math.max(rawOpacity * 1.35, 0), 1);

      setFade({
        opacity,
        y: (1 - opacity) * 28,
      });
    };

    const scheduleUpdate = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateFade();
      });
    };

    updateFade();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [ref]);

  return fade;
}

function Navbar({ visibility }) {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frameId = null;

    const updateActiveSection = () => {
      const sections = navItems
        .map(([, target]) => document.getElementById(target))
        .filter(Boolean);
      const scrollPosition = window.scrollY + window.innerHeight * 0.28;
      const current = sections.reduce((active, section) => {
        if (section.offsetTop <= scrollPosition) {
          return section;
        }

        return active;
      }, sections[0]);

      if (current?.id) {
        setActiveSection(current.id);
      }
    };

    const scheduleUpdate = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (visibility <= 0.02) {
      setMenuOpen(false);
    }
  }, [visibility]);

  const handleNavClick = (target) => {
    setActiveSection(target);
    setMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed left-4 top-4 z-50 opacity-0 transition-opacity duration-500 md:left-6 md:top-1/2 md:-translate-y-1/2",
        visibility > 0.04 ? "pointer-events-auto" : "pointer-events-none",
      )}
      style={{ opacity: visibility }}
    >
      <div className="flex items-start justify-start">
        <nav className="hidden items-center gap-1 md:flex">
          <div className="liquid-glass flex flex-col items-stretch gap-1 rounded-full px-1.5 py-1.5">
            {navItems.map(([item, target]) => (
              <a
                key={item}
                href={`#${target}`}
                onClick={() => handleNavClick(target)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-center font-body text-sm font-medium transition",
                  activeSection === target
                    ? "bg-white text-black shadow-[0_0_22px_rgba(255,255,255,0.28)]"
                    : "text-foreground/75 hover:bg-white/10 hover:text-white",
                )}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        <div className="relative md:hidden">
          <button
            type="button"
            aria-label={menuOpen ? "关闭导航" : "打开导航"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/10"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div
            className={cn(
              "liquid-glass absolute left-1/2 top-14 w-36 -translate-x-1/2 rounded-lg p-2 transition duration-300",
              menuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 pointer-events-none opacity-0",
            )}
          >
            {navItems.map(([item, target]) => (
              <a
                key={item}
                href={`#${target}`}
                onClick={() => handleNavClick(target)}
                className={cn(
                  "block rounded-md px-3 py-2 text-center font-body text-sm font-medium transition",
                  activeSection === target
                    ? "bg-white text-black"
                    : "text-white/75 hover:bg-white/10 hover:text-white",
                )}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero({ introProgress }) {
  const titleOpacity = 1 - introProgress;
  const titleOffset = introProgress * 22;

  return (
    <section
      id="home"
      className="relative h-screen min-h-[680px] scroll-mt-24 overflow-hidden bg-black"
      aria-labelledby="intro-title"
    >
      <img
        src={HERO_GIF}
        alt=""
        className="absolute left-0 top-[20%] z-0 h-auto w-full object-contain"
      />
      <div className="absolute inset-0 z-0 bg-black/5" />
      <div className="pointer-events-none absolute bottom-0 z-0 h-[300px] w-full bg-gradient-to-b from-transparent to-black" />
      <div
        className="absolute left-1/2 top-[43%] z-20 w-[calc(100%-2rem)] max-w-5xl px-2 text-center"
        style={{
          opacity: titleOpacity,
          transform: `translate(-50%, calc(-50% - ${titleOffset}px))`,
          transition: "opacity 0.6s ease, transform 0.6s ease",
          pointerEvents: "none",
        }}
      >
        <h1
          id="intro-title"
          className="mx-auto max-w-5xl font-heading text-4xl font-light italic leading-[0.95] text-white md:text-6xl lg:text-7xl"
        >
          在 AI 时代，持续寻找属于人的痕迹。
        </h1>
        <p className="mx-auto mt-6 max-w-3xl font-body text-sm font-light tracking-[0.16em] text-white/65 md:text-base">
          AI 产品经理 / AI 产品拆解创作者 / 独立产品探索者
        </p>
      </div>
    </section>
  );
}

const personalIntroLines = [
  "你好呀，我是武禹德。",
  "",
  "一名正在持续探索 AI 产品的产品经理。",
  "",
  "相比 AI 能生成什么，",
  "我更关注：",
  "它会如何改变人与世界的交互方式。",
  "",
  "目前正在尝试用 vibe coding 构建自己的工具，",
  "也在持续做 AI 产品拆解与内容表达。",
  "",
  "我喜欢晚风轻拂的感觉，",
  "也容易被真诚的故事打动。",
  "",
  "相比复杂与喧闹，",
  "我更喜欢一种执着的简单。",
  "",
  "这个网站，",
  "会记录我的成长、观察",
  "以及我对 AI 发展的长期观察。",
];

function StaggeredIntroLines({ lines, active }) {
  return (
    <div className="mt-8 font-body text-base font-light leading-relaxed text-white/78 md:text-lg md:leading-8">
      {lines.map((line, index) =>
        line ? (
          <motion.p
            // eslint-disable-next-line react/no-array-index-key
            key={`${line}-${index}`}
            className="will-change-transform"
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={
              active
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 18, filter: "blur(8px)" }
            }
            transition={{
              delay: index * 0.18,
              duration: 0.62,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.p>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <span key={`space-${index}`} aria-hidden="true" className="block h-3 md:h-4" />
        ),
      )}
    </div>
  );
}

function AboutSection() {
  const cardRef = useRef(null);
  const fade = useScrollFade(cardRef);
  const [introVisible, setIntroVisible] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntroVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.42 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="capabilities"
      className="relative scroll-mt-24 overflow-hidden bg-black px-6 py-32 md:px-10"
      aria-label="个人介绍"
    >
      <BackgroundVideo src={START_VIDEO} className="scale-105" />
      <div className="pointer-events-none absolute inset-0 bg-black/50" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.52)_0%,rgba(0,0,0,0.28)_50%,rgba(0,0,0,0)_78%)]" />
      <div className="video-fade-top pointer-events-none absolute top-0 h-[200px] w-full" />
      <div className="video-fade-bottom pointer-events-none absolute bottom-0 h-[200px] w-full" />
      <div className="relative z-10 mx-auto flex min-h-[820px] max-w-7xl items-center justify-center">
        <article
          ref={cardRef}
          className="relative w-full max-w-4xl rounded-[8px] border border-white/25 bg-white/[0.045] px-6 py-9 text-left shadow-[0_22px_80px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-2xl md:px-12 md:py-12"
          style={{
            opacity: fade.opacity,
            transform: `translate3d(0, ${fade.y + 120}px, 0)`,
            transition: "opacity 0.18s linear, transform 0.18s linear",
          }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[8px] bg-[linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.02)_45%,rgba(255,255,255,0.08))]" />
          <div className="relative z-10">
            <span className="section-badge">个人介绍</span>
            <StaggeredIntroLines lines={personalIntroLines} active={introVisible} />
          </div>
        </article>
      </div>
    </section>
  );
}

const featureRows = [
  {
    title: "智能体融合平台",
    body: "负责私有化智能体平台整体规划与落地，主导多种工作流与知识库方案对比，形成可复用的智能体搭建流程。",
  },
  {
    title: "灵犀智传",
    body: "设计“光闸单向传输 + 智能审核”方案，并推动企业级知识服务系统从需求分析到上线落地，覆盖政策解读、风险预警、舆情监测等场景。",
  },
];

function FeaturesChess() {
  return (
    <section id="work" className="scroll-mt-24 bg-black px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-4xl -translate-x-3 text-left md:-translate-x-8">
          <h2 className="editorial-heading text-3xl md:text-4xl lg:text-5xl">
            我做过的项目
          </h2>
        </div>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-10">
          {featureRows.map((row) => (
            <article
              key={row.title}
              className="relative w-full max-w-3xl overflow-hidden rounded-[8px] border border-white/25 bg-white/[0.045] px-7 py-10 text-center shadow-[0_22px_80px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-2xl md:px-10 md:py-12"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[8px] bg-[linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.02)_45%,rgba(255,255,255,0.08))]" />
              <div className="relative z-10">
                <h3 className="editorial-heading mx-auto max-w-lg text-4xl md:text-5xl">
                  {row.title}
                </h3>
                <p className="body-copy mx-auto mt-5 max-w-md">{row.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section
      id="experience"
      className="relative scroll-mt-24 overflow-hidden bg-black py-28"
      aria-label="AI 编程小项目"
    >
      <BackgroundVideo src={CREATION_VIDEO} desaturated />
      <div className="video-fade-top pointer-events-none absolute top-0 h-[200px] w-full" />
      <div className="video-fade-bottom pointer-events-none absolute bottom-0 h-[200px] w-full" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader title="小项目实验。" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {creationProjects.map((project) => (
            <article
              key={project.title}
              className="liquid-glass-strong group relative overflow-hidden rounded-2xl border border-white/18 bg-black/55 p-2 transition-transform duration-300 ease-out hover:-translate-y-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black/45">
                <img
                  src={project.image}
                  alt={`${project.title} 产品截图`}
                  className="h-full w-full object-contain"
                  draggable="false"
                />
              </div>
              <div className="px-3 pb-3 pt-4">
                <p className="font-body text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">
                  {project.tag}
                </p>
                <h3 className="mt-1 font-body text-lg font-medium text-white">
                  {project.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return null;
}

function CtaFooter() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden bg-black px-6 py-28 md:px-10"
    >
      <BackgroundVideo src={CONTACT_VIDEO} />
      <div className="video-fade-top pointer-events-none absolute top-0 h-[200px] w-full" />
      <div className="video-fade-bottom pointer-events-none absolute bottom-0 h-[200px] w-full" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <article className="relative mx-auto max-w-3xl overflow-hidden rounded-[8px] border border-white/30 bg-neutral-950/75 px-7 py-10 text-center shadow-[0_22px_80px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl md:px-12 md:py-12">
          <div className="pointer-events-none absolute inset-0 rounded-[8px] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06)_45%,rgba(255,255,255,0.1))]" />
          <div className="relative z-10">
            <div className="mx-auto max-w-xl space-y-5 font-body text-base font-light leading-relaxed text-white/78 md:text-lg md:leading-8">
              <p>世界变化得很快。</p>
              <p>
                希望我们都能在自己的方向里，
                <br />
                慢慢落地，持续生长。
              </p>
              <p>如果你对这些内容感兴趣，欢迎和我交流。</p>
            </div>
            <p className="mt-9 font-body text-sm font-light tracking-[0.12em] text-white/70 md:text-base">
              1074910496@qq.com
            </p>
          </div>
        </article>

        <footer className="mt-32 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <p className="font-body text-xs text-white/40">
            (c) 2026 武禹德 / 屿青和。保留所有权利。
          </p>
          <div className="flex gap-6">
            {[
              ["能力", "capabilities"],
              ["项目", "work"],
              ["联系", "contact"],
            ].map(([link, target]) => (
              <a
                key={link}
                href={`#${target}`}
                className="font-body text-xs text-white/40 transition hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}

export default function App() {
  const [introProgress, setIntroProgress] = useState(0);

  useEffect(() => {
    let frameId = null;

    const updateProgress = () => {
      const fadeDistance = window.innerHeight * 0.1;
      const progress = fadeDistance
        ? Math.min(Math.max(window.scrollY / fadeDistance, 0), 1)
        : 0;

      setIntroProgress(progress);
    };

    const scheduleUpdate = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="bg-black">
      <div className="relative z-10">
        <Navbar visibility={introProgress} />
        <Hero introProgress={introProgress} />
        <div className="bg-black">
          <AboutSection />
          <FeaturesChess />
          <Stats />
          <Testimonials />
          <CtaFooter />
        </div>
      </div>
    </div>
  );
}
