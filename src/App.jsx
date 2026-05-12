import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BarChart3,
  Menu,
  Palette,
  Shield,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HERO_GIF = "/images/hero.gif";
const START_VIDEO = "/videos/start.mp4";
const CREATION_VIDEO = "/videos/creation.mp4";
const CONTACT_VIDEO = "/videos/contact.mp4";

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
        "fixed left-0 right-0 top-4 z-50 px-6 py-3 opacity-0 transition-opacity duration-500 lg:px-16",
        visibility > 0.04 ? "pointer-events-auto" : "pointer-events-none",
      )}
      style={{ opacity: visibility }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center">
        <nav className="hidden items-center gap-1 md:flex">
          <div className="liquid-glass flex items-center gap-1 rounded-full px-1.5 py-1">
            {navItems.map(([item, target]) => (
              <a
                key={item}
                href={`#${target}`}
                onClick={() => handleNavClick(target)}
                className={cn(
                  "rounded-full px-3 py-2 font-body text-sm font-medium transition",
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
  const [cardHovered, setCardHovered] = useState(false);
  const cardOpacity = 1 - introProgress;
  const cardOffset = introProgress * 18;

  const scrollToContent = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative h-screen min-h-[680px] scroll-mt-24 overflow-hidden bg-black"
      aria-labelledby="intro-title"
    >
      <img
        src={HERO_GIF}
        alt=""
        className={cn(
          "absolute left-0 top-[20%] z-0 h-auto w-full object-contain transition-transform duration-700 ease-out",
          cardHovered && "-translate-y-[2px]",
        )}
      />
      <div className="absolute inset-0 z-0 bg-black/5" />
      <div className="pointer-events-none absolute bottom-0 z-0 h-[300px] w-full bg-gradient-to-b from-transparent to-black" />
      <div
        className="absolute left-1/2 top-[62%] z-20 w-[calc(100%-2rem)] max-w-sm lg:w-[30vw] lg:max-w-[380px]"
        style={{
          opacity: cardOpacity,
          transform: `translate(-50%, calc(-50% - ${cardOffset}px))`,
          transition: "opacity 0.6s ease, transform 0.6s ease",
          pointerEvents: cardOpacity > 0.08 ? "auto" : "none",
        }}
      >
        <div
          className="rounded-lg border border-white/20 bg-black/80 px-6 py-5 text-center shadow-[0_0_28px_rgba(255,255,255,0.13)] backdrop-blur-md transition duration-[600ms] ease-out hover:-translate-y-[3px] hover:bg-black/75 hover:shadow-[0_0_38px_rgba(255,255,255,0.2)]"
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
        >
          <h1
            id="intro-title"
            className="font-body text-[30px] font-light leading-none text-white/90"
          >
            武禹德
          </h1>
          <p className="mt-3 font-body text-sm font-light text-white/55">
            AI产品的网页记录
          </p>
          <button
            type="button"
            onClick={scrollToContent}
            className="mt-5 rounded-full border border-white/40 px-6 py-2 font-body text-sm font-light text-white/80 transition duration-300 hover:border-white/70 hover:bg-white/10 hover:text-white hover:shadow-[0_0_18px_rgba(255,255,255,0.2)]"
          >
            启程
          </button>
        </div>
      </div>
    </section>
  );
}

function StartSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-black">
      <BackgroundVideo src={START_VIDEO} />
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[280px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.62)_45%,rgba(0,0,0,0)_75%)]" />
      <div className="video-fade-top pointer-events-none absolute top-0 h-[200px] w-full" />
      <div className="video-fade-bottom pointer-events-none absolute bottom-0 h-[200px] w-full" />
      <div className="relative z-10 mx-auto flex min-h-[500px] max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
        <span className="section-badge">个人定位</span>
        <h2 className="editorial-heading mt-5 text-4xl md:text-5xl lg:text-6xl">
          把智能能力落到真实业务里。
        </h2>
        <p className="body-copy mt-5 max-w-xl">
          我关注人工智能产品方向，具备大模型与智能体应用基础认知，能够从用户场景出发完成产品需求拆解、方案设计与推进交付。
        </p>
        <Button className="mt-8" asChild>
          <a href="#capabilities">
            查看能力
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </section>
  );
}

const featureRows = [
  {
    title: "智能体融合平台",
    body: "负责私有化智能体平台整体规划与落地，主导多种工作流与知识库方案对比，形成可复用的智能体搭建流程。",
    cta: "查看项目",
  },
  {
    title: "灵犀智传与灵犀智库",
    body: "设计“光闸单向传输 + 智能审核”方案，并推动企业级知识服务系统从需求分析到上线落地，覆盖政策解读、风险预警、舆情监测等场景。",
    cta: "了解方案",
  },
];

function FeaturesChess() {
  return (
    <section id="work" className="scroll-mt-24 bg-black px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          badge="精选项目"
          title="从方案设计到上线交付。"
        />
        <div className="space-y-14">
          {featureRows.map((row) => (
            <div
              key={row.title}
              className="liquid-glass max-w-3xl rounded-2xl p-8 md:p-10"
            >
              <h3 className="editorial-heading max-w-lg text-4xl md:text-5xl">
                {row.title}
              </h3>
              <p className="body-copy mt-5 max-w-md">{row.body}</p>
              <Button className="mt-8" asChild>
                <a href="#experience">
                  {row.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const gridFeatures = [
  {
    icon: Zap,
    title: "人工智能产品设计",
    body: "需求分析、功能设计、PRD 输出、产品迭代，从用户场景出发拆解产品方案。",
  },
  {
    icon: Palette,
    title: "智能体实践",
    body: "具备基础智能体搭建、流程设计与知识库接入经验，关注可复用落地框架。",
  },
  {
    icon: BarChart3,
    title: "提示词设计",
    body: "围绕业务目标优化提示词，提高结果稳定性，并结合工作流完成任务编排。",
  },
  {
    icon: Shield,
    title: "跨团队推进",
    body: "能够与算法、工程和业务团队协作，推动多项目并行交付与持续优化。",
  },
];

function FeaturesGrid() {
  return (
    <section id="capabilities" className="scroll-mt-24 bg-black px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader badge="核心能力" title="产品、技术理解与交付推进。" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {gridFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="liquid-glass rounded-2xl p-6"
              >
                <div className="liquid-glass-strong flex h-10 w-10 items-center justify-center rounded-full">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="mt-16 font-body text-lg font-medium text-white">
                  {feature.title}
                </h3>
                <p className="mt-4 font-body text-sm font-light leading-relaxed text-white/60">
                  {feature.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const projectPlaceholders = Array.from({ length: 8 }, (_, index) => index);
  const trackRef = useRef(null);
  const frameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const offsetRef = useRef(0);
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startOffset: 0,
  });
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const getLoopWidth = () => (trackRef.current?.scrollWidth ?? 0) / 2;

    const wrapOffset = (value) => {
      const loopWidth = getLoopWidth();
      if (!loopWidth) return value;

      let next = value;
      while (next >= 0) next -= loopWidth;
      while (next <= -loopWidth) next += loopWidth;
      return next;
    };

    const syncOffset = (value) => {
      const next = wrapOffset(value);
      offsetRef.current = next;
      setOffset(next);
    };

    const setInitialOffset = () => {
      const loopWidth = getLoopWidth();
      if (loopWidth) syncOffset(-loopWidth / 2);
    };

    setInitialOffset();
    window.addEventListener("resize", setInitialOffset);

    const animate = (time) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!dragRef.current.active) {
        syncOffset(offsetRef.current + delta * 0.035);
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", setInitialOffset);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleProjectPointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
    };
    setIsDragging(true);
  };

  const handleProjectPointerMove = (event) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const loopWidth = (trackRef.current?.scrollWidth ?? 0) / 2;
    if (!loopWidth) return;

    let next = dragRef.current.startOffset + event.clientX - dragRef.current.startX;
    while (next >= 0) next -= loopWidth;
    while (next <= -loopWidth) next += loopWidth;

    offsetRef.current = next;
    setOffset(next);
  };

  const handleProjectPointerUp = (event) => {
    if (dragRef.current.pointerId !== event.pointerId) return;

    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    setIsDragging(false);
  };

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
        <SectionHeader badge="AI 编程" title="小项目实验。" />
      </div>
      <div
        className={cn(
          "relative z-10 mt-8 overflow-hidden py-12 select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onPointerDown={handleProjectPointerDown}
        onPointerMove={handleProjectPointerMove}
        onPointerUp={handleProjectPointerUp}
        onPointerCancel={handleProjectPointerUp}
        style={{ touchAction: "pan-y" }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-black to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-black to-transparent md:w-32" />
        <div
          ref={trackRef}
          className="flex w-max gap-6 px-6 md:gap-8 md:px-10"
          style={{ transform: `translate3d(${offset}px, 0, 0)` }}
        >
          {[...projectPlaceholders, ...projectPlaceholders].map((_, index) => (
            <article
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className="liquid-glass-strong relative aspect-[4/3] w-[260px] shrink-0 rounded-2xl transition-transform duration-300 ease-out hover:z-20 hover:scale-[1.2] md:w-[340px] lg:w-[400px]"
            />
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
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-5xl italic leading-[0.85] text-white md:text-6xl lg:text-7xl">
            让智能产品真正进入业务现场。
          </h2>
          <p className="body-copy mx-auto mt-6 max-w-xl">
            如果你想交流智能体应用、政企人工智能场景、知识服务产品或项目合作，可以通过邮件联系我。
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button asChild>
              <a href="mailto:18947075747@163.com">
                发送邮件
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="secondary" asChild>
              <a href="#work">查看项目</a>
            </Button>
          </div>
        </div>

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
          <StartSection />
          <FeaturesGrid />
          <FeaturesChess />
          <Stats />
          <Testimonials />
          <CtaFooter />
        </div>
      </div>
    </div>
  );
}
