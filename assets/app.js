(() => {
  const ICONS = {
    bolt: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <path d="M13 2L3 14h8l-1 8 11-14h-8l0-6z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `,
    spark: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M19 2l.8 2.7L22 6l-2.2.7L19 9l-.8-2.3L16 6l2.2-1.3L19 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" opacity=".7"/>
      </svg>
    `,
    cash: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <path d="M4.5 7.5h15a2 2 0 012 2v5a2 2 0 01-2 2h-15a2 2 0 01-2-2v-5a2 2 0 012-2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M12 9.3v5.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M13.8 10.1c-.4-.6-1.1-.9-1.8-.9-1 0-1.8.6-1.8 1.4 0 .9.8 1.3 1.8 1.5 1 .2 1.8.6 1.8 1.5 0 .8-.8 1.4-1.8 1.4-.7 0-1.4-.3-1.8-.9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
        <path d="M6.2 10.2a1.6 1.6 0 000 3.6M17.8 10.2a1.6 1.6 0 010 3.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".75"/>
      </svg>
    `,
    globe: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <path d="M12 22a10 10 0 100-20 10 10 0 000 20z" stroke="currentColor" stroke-width="1.8"/>
        <path d="M2 12h20" stroke="currentColor" stroke-width="1.8" opacity=".75"/>
        <path d="M12 2c3.2 2.7 5 6.2 5 10s-1.8 7.3-5 10c-3.2-2.7-5-6.2-5-10s1.8-7.3 5-10z" stroke="currentColor" stroke-width="1.8" opacity=".75"/>
      </svg>
    `,
    shield: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <path d="M12 2l8 4v6c0 5.2-3.3 9.7-8 10-4.7-.3-8-4.8-8-10V6l8-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
        <path d="M9.2 12.3l1.9 1.9 3.8-4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>
      </svg>
    `,
    chart: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <path d="M3 3v18h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 14l4-4 4 4 5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
        <circle cx="7" cy="14" r="1.5" fill="currentColor" opacity=".7"/>
        <circle cx="11" cy="10" r="1.5" fill="currentColor" opacity=".7"/>
        <circle cx="15" cy="14" r="1.5" fill="currentColor" opacity=".7"/>
        <circle cx="20" cy="8" r="1.5" fill="currentColor" opacity=".7"/>
      </svg>
    `,
    users: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <circle cx="9" cy="7" r="3.5" stroke="currentColor" stroke-width="1.8"/>
        <path d="M2.5 21v-2c0-2.2 2.7-4 6.5-4s6.5 1.8 6.5 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="17" cy="8" r="2.5" stroke="currentColor" stroke-width="1.6" opacity=".7"/>
        <path d="M17 13c2.5 0 4.5 1.3 4.5 3v1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
      </svg>
    `,
    handshake: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <path d="M12 8l4-4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 8l-4-4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 8v4c0 2.2 1.8 4 4 4h1l3 4 3-4h1c2.2 0 4-1.8 4-4V8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 12h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>
      </svg>
    `,
    chevron: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <path d="M6.5 9.5L12 15l5.5-5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    sun: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" stroke="currentColor" stroke-width="1.8"/>
        <path d="M12 2v2.2M12 19.8V22M4.2 12H2M22 12h-2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `,
    moon: (className) => `
      <svg viewBox="0 0 24 24" fill="none" class="${className}" aria-hidden="true">
        <path d="M21 14.8A8.6 8.6 0 019.2 3a7.4 7.4 0 1011.8 11.8z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
    `,
  };

  const STATUS = {
    done: {
      label: "Shipped",
      dot: "bg-emerald-500 dark:bg-emerald-400",
      text: "text-emerald-700 dark:text-emerald-200",
    },
    in_progress: {
      label: "In progress",
      dot: "bg-amber-500 dark:bg-amber-400",
      text: "text-amber-700 dark:text-amber-200",
    },
    planned: {
      label: "On track",
      dot: "bg-slate-400",
      text: "text-slate-600 dark:text-slate-200",
    },
  };

  // Donut chart color palette (matches the image style)
  const DONUT_COLORS = [
    "#3b82f6", // blue
    "#22c55e", // green
    "#f59e0b", // amber/yellow
    "#ef4444", // red
    "#10b981", // emerald/teal
    "#a855f7", // purple
    "#ec4899", // pink
    "#6366f1", // indigo
    "#14b8a6", // teal
    "#f97316", // orange
  ];

  const isDark = () => document.documentElement.classList.contains("dark");
  const currentTheme = () => (isDark() ? "dark" : "light");
  const CARD_CLASS = "glass rounded-3xl p-6 sm:p-7";

  function parsePercentValue(value) {
    const raw = String(value ?? "").trim();
    const match = raw.match(/(\d+(?:\.\d+)?)/);
    if (!match) return 0;
    const num = Number(match[1]);
    return Number.isFinite(num) ? num : 0;
  }

  function formatPercentDisplay(value) {
    const num = parsePercentValue(value);
    if (!Number.isFinite(num)) return "0";
    return num % 1 === 0 ? String(Math.trunc(num)) : String(num);
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === "class") node.className = value;
      else if (key === "html") node.innerHTML = value;
      else if (key.startsWith("on") && typeof value === "function")
        node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value);
    }
    for (const child of Array.isArray(children) ? children : [children]) {
      if (child == null) continue;
      node.appendChild(
        typeof child === "string" ? document.createTextNode(child) : child,
      );
    }
    return node;
  }

  const safeText = (text) => String(text ?? "");

  function percent(num) {
    return `${Math.max(0, Math.min(100, Math.round(num)))}%`;
  }

  function flattenTasks(phase) {
    return phase.groups.flatMap((g) => g.items || []);
  }

  function phaseStats(phase) {
    const tasks = flattenTasks(phase);
    const total = tasks.length || 0;
    const done = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const donePct = total === 0 ? 0 : (done / total) * 100;
    return { total, done, inProgress, donePct };
  }

  function ringSvg(donePct, accentClass) {
    const size = 46;
    const stroke = 4;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset =
      circumference -
      (Math.max(0, Math.min(100, donePct)) / 100) * circumference;
    const accent =
      {
        emerald: "#06eca3",
        cyan: "#22d3ee",
        violet: "#8b5cf6",
        blue: "#2aa9ff",
      }[accentClass] || "#2aa9ff";

    const wrap = document.createElement("div");
    wrap.className = "relative h-12 w-12";
    wrap.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="block">
        <circle class="ring-track" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-width="${stroke}" fill="none"></circle>
        <circle
          class="ring-progress"
          cx="${size / 2}"
          cy="${size / 2}"
          r="${radius}"
          stroke="${accent}"
          stroke-width="${stroke}"
          fill="none"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 ${size / 2} ${size / 2})"
        ></circle>
      </svg>
    `;
    return wrap;
  }

  // Render a donut chart with legend
  function renderDonutChart(allocations, title) {
    const container = el("div", { class: "allocation-chartInner" });

    // SVG donut chart
    const size = 200;
    const strokeWidth = 40;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const centerX = size / 2;
    const centerY = size / 2;

    let svgPaths = "";
    let currentOffset = 0;

    // Parse percentages and create segments
    const segments = allocations.map((alloc, index) => {
      const pct =
        typeof alloc.percentage === "number"
          ? alloc.percentage
          : parsePercentValue(alloc.percentage);
      return {
        category: alloc.category,
        percentage: pct,
        color: DONUT_COLORS[index % DONUT_COLORS.length],
      };
    });

    // Calculate total for normalization (in case percentages don't add to 100)
    const total = segments.reduce((sum, s) => sum + s.percentage, 0) || 100;

    for (const seg of segments) {
      const segmentPct = (seg.percentage / total) * 100;
      const dashLength = (segmentPct / 100) * circumference;
      const dashGap = circumference - dashLength;
      const rotation = (currentOffset / 100) * 360 - 90; // Start from top

      svgPaths += `
        <circle
          cx="${centerX}"
          cy="${centerY}"
          r="${radius}"
          fill="none"
          stroke="${seg.color}"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${dashLength} ${dashGap}"
          transform="rotate(${rotation} ${centerX} ${centerY})"
          style="transition: stroke-dasharray 0.5s ease"
        />
      `;
      currentOffset += segmentPct;
    }

    const chartWrapper = el("div", { class: "allocation-chartSvgWrap" });
    chartWrapper.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="drop-shadow-lg">
        <circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="${strokeWidth}" class="dark:stroke-white/10" />
        ${svgPaths}
      </svg>
    `;
    container.appendChild(chartWrapper);

    // Legend
    const legend = el("div", { class: "allocation-chartLegend" });

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const pctDisplay = `${formatPercentDisplay(allocations[i].percentage)}%`;

      const item = el("div", { class: "allocation-chartLegendItem" });

      // Color dot
      const dot = el("span", {
        class: "allocation-chartLegendDot",
        style: `background-color: ${seg.color}`,
      });

      // Text content
      const textWrap = el(
        "div",
        { class: "allocation-chartLegendText" },
        `${seg.category} — ${pctDisplay}`,
      );

      item.appendChild(dot);
      item.appendChild(textWrap);
      legend.appendChild(item);
    }

    container.appendChild(legend);
    return container;
  }

  function updateThemeToggleButtons() {
    const theme = currentTheme();
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.innerHTML =
        theme === "dark" ? ICONS.sun("h-5 w-5") : ICONS.moon("h-5 w-5");
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
    });
  }

  function startHeroCanvas(canvas) {
    if (!canvas) return;
    if (canvas.dataset.fx) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
      return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const state = { raf: 0, w: 0, h: 0, dpr: 1, particles: [] };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      state.dpr = dpr;
      state.w = Math.max(1, Math.floor(rect.width * dpr));
      state.h = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = state.w;
      canvas.height = state.h;

      const density = Math.round((rect.width * rect.height) / 32000);
      const count = Math.max(34, Math.min(82, density));
      if (state.particles.length !== count) {
        state.particles = Array.from({ length: count }, () => {
          const speed = (0.12 + Math.random() * 0.26) * dpr;
          const angle = Math.random() * Math.PI * 2;
          return {
            x: Math.random() * state.w,
            y: Math.random() * state.h,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: (0.18 + Math.random() * 0.45) * dpr,
          };
        });
      }
    };

    const draw = () => {
      const dark = isDark();
      const { w, h, particles } = state;
      ctx.clearRect(0, 0, w, h);

      const lineMax = 155 * state.dpr;
      const lineMax2 = lineMax * lineMax;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > lineMax2) continue;
          const t = 1 - d2 / lineMax2;
          ctx.strokeStyle = dark
            ? `rgba(255,255,255,${0.085 * t})`
            : `rgba(15,23,42,${0.06 * t})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const gx = p.x / w;
        const c1 = [6, 236, 163];
        const c2 = [42, 169, 255];
        const c = [
          Math.round(c1[0] + (c2[0] - c1[0]) * gx),
          Math.round(c1[1] + (c2[1] - c1[1]) * gx),
          Math.round(c1[2] + (c2[2] - c1[2]) * gx),
        ];
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${dark ? 0.42 : 0.26})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      state.raf = requestAnimationFrame(draw);
    };

    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    resize();
    draw();
    canvas.dataset.fx = "1";
  }

  function renderHeader(data) {
    const header = el("header", {
      class:
        "sticky top-0 z-50 border-b border-slate-900/10 bg-white/75 backdrop-blur dark:border-white/10 dark:bg-slate-950/50",
    });

    const container = el("div", {
      class:
        "mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6",
    });

    const left = el(
      "a",
      {
        class: "flex items-center",
        href: "#top",
        "aria-label": "Ace Data Cloud",
      },
      [
        el("img", {
          src: "./assets/logo.png",
          alt: "Ace Data Cloud",
          class: "h-8 w-auto select-none dark:hidden",
        }),
        el("img", {
          src: "./assets/logo2.png",
          alt: "Ace Data Cloud",
          class: "hidden h-8 w-auto select-none dark:block",
        }),
      ],
    );

    const nav = el("nav", { class: "hidden items-center gap-2 md:flex" });
    for (const item of data.nav || []) {
      const isPrimary = !!item.primary;
      nav.appendChild(
        el(
          "a",
          {
            class: isPrimary
              ? "rounded-full bg-gradient-to-r from-ace-emerald to-ace-blue px-4 py-2 text-sm font-semibold text-slate-950 shadow-glass hover:opacity-95"
              : "rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-900/5 dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10",
            href: item.href,
            ...(item.new_tab ? { target: "_blank", rel: "noreferrer" } : {}),
          },
          item.label,
        ),
      );
    }

    const themeBtn = el("button", {
      class:
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/15 bg-slate-900/5 text-slate-700 shadow-ring hover:bg-slate-900/10 dark:border-white/20 dark:bg-white/10 dark:text-white/95 dark:hover:bg-white/15",
      type: "button",
      "data-theme-toggle": "",
      onclick: () => window.AceRoadmapTheme?.toggle?.(),
    });

    const right = el("div", { class: "flex items-center gap-2" }, [
      themeBtn,
      el(
        "button",
        {
          class:
            "inline-flex items-center justify-center rounded-full border border-slate-900/15 bg-slate-900/5 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-900/10 dark:border-white/20 dark:bg-white/10 dark:text-white/95 dark:hover:bg-white/15 md:hidden",
          type: "button",
          "aria-label": "Open menu",
          onclick: () => {
            const menu = document.getElementById("mobile-nav");
            if (!menu) return;
            menu.classList.toggle("hidden");
          },
        },
        "Menu",
      ),
    ]);

    container.appendChild(left);
    container.appendChild(nav);
    container.appendChild(right);
    header.appendChild(container);

    const mobile = el("div", {
      id: "mobile-nav",
      class:
        "hidden border-t border-slate-900/10 bg-white/90 md:hidden dark:border-white/10 dark:bg-slate-950/70",
    });
    const mobileInner = el("div", {
      class: "mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6",
    });
    for (const item of data.nav || []) {
      mobileInner.appendChild(
        el(
          "a",
          {
            class: item.primary
              ? "rounded-xl bg-gradient-to-r from-ace-emerald to-ace-blue px-4 py-3 text-sm font-semibold text-slate-950"
              : "rounded-xl bg-slate-900/5 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-900/10 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15",
            href: item.href,
            ...(item.new_tab ? { target: "_blank", rel: "noreferrer" } : {}),
          },
          item.label,
        ),
      );
    }
    mobile.appendChild(mobileInner);
    header.appendChild(mobile);
    return header;
  }

  function renderHero(data) {
    const wrap = el("section", {
      id: "top",
      class: "relative overflow-hidden",
    });
    const bg = el("div", { class: "hero-bg absolute inset-0" });
    if (data?.hero?.background_image) {
      bg.style.backgroundImage = `url("${String(data.hero.background_image)}")`;
    }
    bg.appendChild(
      el("div", {
        class:
          "absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/70 to-slate-950",
      }),
    );
    bg.appendChild(
      el("div", {
        class:
          "absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(6,236,163,0.22),transparent_55%)] mix-blend-screen",
      }),
    );
    bg.appendChild(
      el("div", {
        class:
          "absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(42,169,255,0.18),transparent_60%)] mix-blend-screen opacity-70",
      }),
    );
    bg.appendChild(
      el("canvas", {
        id: "hero-canvas",
        class:
          "pointer-events-none absolute inset-0 h-full w-full opacity-50 mix-blend-screen",
      }),
    );

    const content = el("div", {
      class:
        "relative mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6 sm:pb-28 sm:pt-32",
    });
    const eyebrow = el(
      "div",
      {
        class:
          "mb-6 flex items-center justify-center gap-3 text-xs tracking-[0.45em] text-white/85 sm:text-sm",
      },
      [
        el("span", { class: "h-px w-10 bg-white/35" }),
        el("span", { class: "font-display" }, safeText(data.hero.eyebrow)),
        el("span", { class: "h-px w-16 bg-white/25" }),
      ],
    );

    const title = el(
      "h1",
      {
        class:
          "mx-auto max-w-3xl text-center font-display text-4xl font-semibold leading-tight text-white sm:text-6xl",
      },
      safeText(data.hero.title),
    );

    const subtitle = el(
      "p",
      {
        class:
          "mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/85 sm:text-lg",
      },
      safeText(data.site.tagline),
    );

    const seq = el(
      "p",
      {
        class:
          "mx-auto mt-3 max-w-2xl text-center text-sm text-white/65 sm:text-base",
      },
      safeText(data.hero.subtitle),
    );

    const ctas = el(
      "div",
      { class: "mt-10 flex flex-wrap items-center justify-center gap-4" },
      [
        el(
          "a",
          {
            class:
              "inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-ace-emerald to-ace-blue px-7 text-sm font-semibold text-slate-950 shadow-glass hover:opacity-95",
            href: data.hero.primary_cta.href,
            ...(data.hero.primary_cta.new_tab
              ? { target: "_blank", rel: "noreferrer" }
              : {}),
          },
          data.hero.primary_cta.label,
        ),
        el(
          "a",
          {
            class:
              "inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white hover:bg-white/15",
            href: data.hero.secondary_cta.href,
            ...(data.hero.secondary_cta.new_tab
              ? { target: "_blank", rel: "noreferrer" }
              : {}),
          },
          data.hero.secondary_cta.label,
        ),
      ],
    );

    content.appendChild(eyebrow);
    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(seq);
    content.appendChild(ctas);

    wrap.appendChild(bg);
    wrap.appendChild(content);
    return wrap;
  }

  function renderSideNav(data) {
    const sections = [
      { label: "Overview", id: "overview" },
      {
        label: data?.what_building ? "What We Build" : null,
        id: "what-building",
      },
      { label: data?.ace_token ? "ACE Token" : null, id: "ace-token" },
      { label: data?.founder ? "Founding Team" : null, id: "founding-team" },
      { label: "Principles", id: "guiding-principles" },
      { label: data?.revenue ? "Revenue" : null, id: "revenue" },
      { label: data?.creator_fees ? "Creator Fees" : null, id: "creator-fees" },
      {
        label: data?.capital_governance ? "Capital Governance" : null,
        id: "capital-governance",
      },
      { label: "Roadmap", id: "roadmap" },
      { label: "Token Fit", id: "token-fit" },
      {
        label: data?.buyback_history ? "Buyback History" : null,
        id: "buyback-history",
      },
      {
        label: data?.daily_updates ? "Daily Updates" : null,
        id: "daily-updates",
      },
      { label: "Closing", id: "closing" },
    ].filter((s) => s.label);

    const nav = el("nav", {
      id: "side-nav",
      class: "side-nav",
      "aria-label": "Page sections",
    });

    // Track line
    const track = el("div", { class: "side-nav-track" });
    const trackProgress = el("div", { class: "side-nav-trackProgress" });
    track.appendChild(trackProgress);
    nav.appendChild(track);

    // Section items
    const items = [];
    for (const section of sections) {
      const item = el("a", {
        class: "side-nav-item",
        href: `#${section.id}`,
        "data-section": section.id,
        "aria-label": section.label,
      });

      const dot = el("span", { class: "side-nav-dot" });
      const dotInner = el("span", { class: "side-nav-dotInner" });
      dot.appendChild(dotInner);

      const label = el("span", { class: "side-nav-label" }, section.label);

      item.appendChild(label);
      item.appendChild(dot);
      nav.appendChild(item);
      items.push({ el: item, id: section.id });
    }

    // Scroll-based active tracking
    let ticking = false;
    function updateActiveSection() {
      const scrollY = window.scrollY;

      // Show/hide based on scroll position
      if (scrollY < 200) {
        nav.classList.add("side-nav--hidden");
      } else {
        nav.classList.remove("side-nav--hidden");
      }

      // Find active section
      const windowHeight = window.innerHeight;
      let activeIdx = 0;
      for (let i = sections.length - 1; i >= 0; i--) {
        const target = document.getElementById(sections[i].id);
        if (target) {
          const rect = target.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.35) {
            activeIdx = i;
            break;
          }
        }
      }

      // Update active states
      items.forEach((item, idx) => {
        item.el.classList.toggle("side-nav-item--active", idx === activeIdx);
      });

      // Update track progress
      const progressPct =
        sections.length > 1 ? (activeIdx / (sections.length - 1)) * 100 : 0;
      trackProgress.style.height = `${progressPct}%`;

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    requestAnimationFrame(updateActiveSection);

    return nav;
  }

  function sectionShell(title, subtitle, id) {
    const attrs = {
      class: "mx-auto max-w-6xl px-4 pt-24 pb-8 sm:px-6 sm:pt-16 sm:pb-10",
    };
    if (id) attrs.id = id;
    const wrap = el("section", attrs);
    wrap.appendChild(
      el("div", { class: "mb-10" }, [
        el(
          "h2",
          {
            class:
              "font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl",
          },
          title,
        ),
        subtitle
          ? el(
              "p",
              {
                class:
                  "mt-2 max-w-2xl text-sm text-slate-600 dark:text-white/80 sm:text-base",
              },
              subtitle,
            )
          : null,
      ]),
    );
    return wrap;
  }

  function renderOverview(data) {
    const wrap = sectionShell(
      data.overview.title,
      data.site.description,
      "overview",
    );

    const grid = el("div", { class: "grid gap-6 md:grid-cols-2" });

    const left = el("div", { class: "glass rounded-3xl p-6 sm:p-7" });
    for (const p of data.overview.paragraphs || []) {
      left.appendChild(
        el(
          "p",
          {
            class:
              "text-sm leading-relaxed text-slate-700 dark:text-white/90 sm:text-base",
          },
          p,
        ),
      );
    }
    left.appendChild(
      el("div", { class: "mt-6 flex flex-wrap items-center gap-2" }, [
        el(
          "span",
          {
            class:
              "rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700 shadow-ring dark:bg-white/10 dark:text-white/90",
          },
          "2026",
        ),
        el(
          "span",
          {
            class:
              "rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700 shadow-ring dark:bg-white/10 dark:text-white/90",
          },
          safeText(data.overview.sequence),
        ),
      ]),
    );

    const right = el("div", { class: "glass rounded-3xl p-6 sm:p-7" }, [
      el(
        "div",
        { class: "text-sm font-semibold text-slate-800 dark:text-white/90" },
        "Roadmap priorities",
      ),
      el("ul", { class: "mt-4 space-y-3" }),
    ]);

    const ul = right.querySelector("ul");
    for (const item of data.overview.priorities || []) {
      ul.appendChild(
        el("li", { class: "flex gap-3" }, [
          el("span", {
            class: "mt-2 h-2 w-2 flex-none rounded-full bg-ace-emerald",
          }),
          el(
            "span",
            {
              class:
                "text-sm leading-relaxed text-slate-700 dark:text-white/90 sm:text-base",
            },
            item,
          ),
        ]),
      );
    }

    grid.appendChild(left);
    grid.appendChild(right);
    wrap.appendChild(grid);
    return wrap;
  }

  function renderAceToken(data) {
    const cfg = data?.ace_token;
    if (!cfg) return null;

    const wrap = sectionShell(
      cfg.title || "$ACE Token",
      cfg.subtitle || "Token overview and links.",
      "ace-token",
    );

    const card = el("div", { class: `${CARD_CLASS} ace-tokenCard` });

    const body = el("div", { class: "ace-tokenBody" });
    for (const p of cfg.paragraphs || []) {
      body.appendChild(
        el(
          "p",
          {
            class:
              "text-sm leading-relaxed text-slate-700 dark:text-white/90 sm:text-base",
          },
          p,
        ),
      );
    }
    if (body.childNodes.length) card.appendChild(body);

    const howUsed = Array.isArray(cfg.how_used)
      ? cfg.how_used
          .map((x) => safeText(x))
          .filter(Boolean)
          .slice(0, 12)
      : [];
    if (howUsed.length) {
      const title = safeText(cfg.how_used_title) || "How ACE is used";
      const subtitle = safeText(cfg.how_used_subtitle);
      const header = el(
        "div",
        { class: "ace-tokenUseHeader" },
        [
          el("div", { class: "ace-tokenUseTitle" }, title),
          subtitle
            ? el("div", { class: "ace-tokenUseSubtitle" }, subtitle)
            : null,
        ].filter(Boolean),
      );

      const grid = el("div", { class: "ace-tokenUseGrid" });
      for (const item of howUsed) {
        grid.appendChild(
          el("div", { class: "ace-tokenUseItem" }, [
            el("span", { class: "ace-tokenUseDot", "aria-hidden": "true" }),
            el("div", { class: "ace-tokenUseText" }, item),
          ]),
        );
      }

      card.appendChild(header);
      card.appendChild(grid);
    }

    if (cfg.contract_address) {
      const copyBtn = el(
        "button",
        {
          type: "button",
          class: "ace-tokenCopyBtn",
          onclick: async () => {
            const value = safeText(cfg.contract_address);
            if (!value) return;
            try {
              await navigator.clipboard.writeText(value);
              copyBtn.textContent = "Copied";
              setTimeout(() => (copyBtn.textContent = "Copy"), 1100);
            } catch (_err) {
              copyBtn.textContent = "Copy failed";
              setTimeout(() => (copyBtn.textContent = "Copy"), 1100);
            }
          },
        },
        "Copy",
      );

      const ca = el("div", { class: "ace-tokenCA" }, [
        el("div", { class: "ace-tokenCALabel" }, "Contract address"),
        el("div", { class: "ace-tokenCARow" }, [
          el(
            "div",
            { class: "ace-tokenCAValue" },
            safeText(cfg.contract_address),
          ),
          copyBtn,
        ]),
      ]);
      card.appendChild(ca);
    }

    const links = Array.isArray(cfg.links) ? cfg.links : [];
    if (links.length) {
      const linkGrid = el("div", { class: "ace-tokenLinks" });
      links.slice(0, 8).forEach((link, idx) => {
        const isPrimary = idx === 0;
        linkGrid.appendChild(
          el(
            "a",
            {
              class:
                `ace-tokenLink ${isPrimary ? "ace-tokenLink--primary" : ""}`.trim(),
              href: link.href,
              ...(link.new_tab ? { target: "_blank", rel: "noreferrer" } : {}),
            },
            link.label,
          ),
        );
      });
      card.appendChild(linkGrid);
    }

    wrap.appendChild(card);
    return wrap;
  }

  function renderFounder(data) {
    if (!data?.founder) return null;

    const wrap = sectionShell(
      data.founder.title,
      data.founder.subtitle,
      "founding-team",
    );
    const grid = el("div", { class: "grid gap-6 lg:grid-cols-3" });

    const info = el("div", { class: "glass rounded-3xl p-6 sm:p-7" });
    const profile = el("a", {
      href: data.founder.github?.href || "#",
      target: "_blank",
      rel: "noreferrer",
    });
    profile.appendChild(
      el("img", {
        src: data.founder.avatar_url,
        alt: safeText(data.founder.name || "Founder"),
        class: "h-20 w-20 rounded-2xl object-cover shadow-ring",
      }),
    );
    info.appendChild(profile);
    info.appendChild(
      el(
        "div",
        {
          class:
            "mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white/95",
        },
        safeText(data.founder.name),
      ),
    );

    const links = el("div", {
      class: "mt-4 space-y-2 text-sm text-slate-700 dark:text-white/90",
    });
    if (data.founder.github?.href) {
      links.appendChild(
        el(
          "a",
          {
            class: "block hover:text-slate-900 dark:hover:text-white",
            href: data.founder.github.href,
            target: "_blank",
            rel: "noreferrer",
          },
          `GitHub: ${safeText(data.founder.github.label || data.founder.github.href)}`,
        ),
      );
    }
    if (data.founder.x?.href) {
      links.appendChild(
        el(
          "a",
          {
            class: "block hover:text-slate-900 dark:hover:text-white",
            href: data.founder.x.href,
            target: "_blank",
            rel: "noreferrer",
          },
          `X: ${safeText(data.founder.x.label || data.founder.x.href)}`,
        ),
      );
    }
    info.appendChild(links);

    const details = el("div", {
      class: "glass rounded-3xl p-6 sm:p-7 lg:col-span-2",
    });
    if (data.founder.contribution_image_url) {
      details.appendChild(
        el("img", {
          src: data.founder.contribution_image_url,
          alt: "Contribution activity",
          loading: "lazy",
          decoding: "async",
          class: "w-full rounded-2xl shadow-ring",
        }),
      );
    }

    const ul = el("ul", {
      class:
        "mt-6 space-y-3 text-sm leading-relaxed text-slate-700 dark:text-white/90 sm:text-base",
    });
    for (const item of data.founder.introductions || []) {
      ul.appendChild(
        el("li", { class: "flex gap-3" }, [
          el("span", {
            class:
              "mt-2 h-1.5 w-1.5 flex-none rounded-full bg-slate-900/25 dark:bg-white/40",
          }),
          el("span", { class: "min-w-0", html: String(item) }),
        ]),
      );
    }
    details.appendChild(ul);

    grid.appendChild(info);
    grid.appendChild(details);
    wrap.appendChild(grid);
    return wrap;
  }

  function renderRevenue(data) {
    if (!data?.revenue) return null;

    const snapshot = data.revenue.snapshot;
    const loadFailed = !!data.revenue.load_failed;
    const currency = safeText(
      snapshot?.currency || data.revenue.currency || "USD",
    );
    const asOf = snapshot?.as_of ? safeText(snapshot.as_of) : null;

    const formatMoney = (value) => {
      const num = Number(value);
      if (!Number.isFinite(num)) return "—";
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
        }).format(num);
      } catch (_err) {
        return `${num.toFixed(2)} ${currency}`;
      }
    };

    const wrap = sectionShell(
      data.revenue.title,
      data.revenue.subtitle,
      "revenue",
    );

    if (loadFailed || !snapshot) {
      wrap.appendChild(
        el("div", { class: CARD_CLASS }, [
          el(
            "div",
            {
              class:
                "rounded-2xl bg-slate-900/5 px-4 py-4 text-sm text-slate-700 shadow-ring dark:bg-white/5 dark:text-white/90",
            },
            "Revenue snapshot unavailable right now.",
          ),
        ]),
      );
      return wrap;
    }

    const items = [
      { key: "last_7d", label: "Last 7 days" },
      { key: "last_30d", label: "Last 30 days" },
      { key: "last_90d", label: "Last 90 days" },
    ];

    const colsLg =
      items.length >= 4
        ? "lg:grid-cols-4"
        : items.length === 3
          ? "lg:grid-cols-3"
          : items.length === 2
            ? "lg:grid-cols-2"
            : "lg:grid-cols-1";
    const grid = el("div", { class: `grid gap-6 sm:grid-cols-2 ${colsLg}` });
    for (const item of items) {
      const iconWrap = el("div", {
        class:
          "flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-800 shadow-ring dark:bg-white/10 dark:text-white/90",
      });
      iconWrap.innerHTML = ICONS.cash("h-5 w-5");
      grid.appendChild(
        el("div", { class: CARD_CLASS }, [
          el("div", { class: "flex items-center gap-3" }, [
            iconWrap,
            el("div", { class: "min-w-0" }, [
              el(
                "div",
                {
                  class:
                    "text-xs font-semibold text-slate-600 dark:text-white/80",
                },
                item.label,
              ),
              el(
                "div",
                {
                  class:
                    "mt-1 font-display text-2xl font-semibold text-slate-900 dark:text-white/95",
                },
                formatMoney(snapshot[item.key]),
              ),
            ]),
          ]),
        ]),
      );
    }

    wrap.appendChild(grid);
    if (asOf) {
      wrap.appendChild(
        el(
          "div",
          { class: "mt-6 text-xs text-slate-600 dark:text-white/80" },
          `As of: ${asOf}`,
        ),
      );
    }
    return wrap;
  }

  function renderCreatorFees(data) {
    if (!data?.creator_fees) return null;

    const snapshot = data.creator_fees.snapshot;
    const loadFailed = !!data.creator_fees.load_failed;
    const asOf = snapshot?.as_of ? safeText(snapshot.as_of) : null;
    const solPrice = snapshot?.sol_price_usd || 0;

    const formatSol = (value) => {
      const num = Number(value);
      if (!Number.isFinite(num)) return "—";
      return `${num.toFixed(4)} SOL`;
    };

    const formatUsd = (value) => {
      const num = Number(value);
      if (!Number.isFinite(num)) return "";
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(num);
      } catch (_err) {
        return `$${num.toFixed(2)}`;
      }
    };

    const wrap = sectionShell(
      data.creator_fees.title,
      data.creator_fees.subtitle,
      "creator-fees",
    );

    if (loadFailed || !snapshot) {
      wrap.appendChild(
        el("div", { class: CARD_CLASS }, [
          el(
            "div",
            {
              class:
                "rounded-2xl bg-slate-900/5 px-4 py-4 text-sm text-slate-700 shadow-ring dark:bg-white/5 dark:text-white/90",
            },
            "Creator fees snapshot unavailable right now.",
          ),
        ]),
      );
      return wrap;
    }

    const items = [
      { key: "last_1d", label: "Last 24 hours", tradesKey: "trades_1d" },
      { key: "last_7d", label: "Last 7 days", tradesKey: "trades_7d" },
      { key: "last_30d", label: "Last 30 days", tradesKey: "trades_30d" },
      { key: "total", label: "All Time", tradesKey: null },
    ];

    const grid = el("div", {
      class: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
    });
    for (const item of items) {
      const solValue = snapshot[`${item.key}_sol`];
      const usdValue = snapshot[`${item.key}_usd`];
      const trades = item.tradesKey ? snapshot[item.tradesKey] : null;

      const iconWrap = el("div", {
        class:
          "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-600 shadow-ring dark:from-purple-400/20 dark:to-pink-400/20 dark:text-purple-300",
      });
      iconWrap.innerHTML = ICONS.spark("h-5 w-5");

      const card = el("div", { class: CARD_CLASS }, [
        el("div", { class: "flex items-start gap-3" }, [
          iconWrap,
          el(
            "div",
            { class: "min-w-0 flex-1" },
            [
              el(
                "div",
                {
                  class:
                    "text-xs font-semibold text-slate-600 dark:text-white/80",
                },
                item.label,
              ),
              el(
                "div",
                {
                  class:
                    "mt-1 font-display text-xl font-semibold text-slate-900 dark:text-white/95",
                },
                formatSol(solValue),
              ),
              el(
                "div",
                { class: "mt-0.5 text-sm text-slate-500 dark:text-white/60" },
                formatUsd(usdValue),
              ),
              trades !== null
                ? el(
                    "div",
                    { class: "mt-1 text-xs text-slate-400 dark:text-white/50" },
                    `${trades.toLocaleString()} trades`,
                  )
                : null,
            ].filter(Boolean),
          ),
        ]),
      ]);
      grid.appendChild(card);
    }

    wrap.appendChild(grid);

    // SOL price info and timestamp
    const footer = el("div", {
      class:
        "mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-white/80",
    });
    if (solPrice) {
      footer.appendChild(el("span", {}, `SOL Price: $${solPrice.toFixed(2)}`));
    }
    if (asOf) {
      footer.appendChild(el("span", {}, `As of: ${asOf}`));
    }
    if (snapshot.creator_address) {
      const link = el(
        "a",
        {
          href: `https://solscan.io/account/${snapshot.creator_address}`,
          target: "_blank",
          rel: "noopener noreferrer",
          class:
            "text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300",
        },
        "View on Solscan ↗",
      );
      footer.appendChild(link);
    }
    wrap.appendChild(footer);

    return wrap;
  }

  function getEndOfMonthDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const y = lastDay.getFullYear();
    const m = String(lastDay.getMonth() + 1).padStart(2, "0");
    const d = String(lastDay.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function getNextSundayDate() {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekday = d.getDay(); // 0 = Sunday
    let delta = (7 - weekday) % 7;
    if (delta === 0) delta = 7;
    d.setDate(d.getDate() + delta);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function renderAllocationCard(alloc, allocationInfo) {
    const card = el("div", {
      class: "allocation-card p-6 flex flex-col h-full",
    });

    // Header row with icon and percentage
    const header = el("div", { class: "allocation-header" });

    const iconWrap = el("div", { class: "allocation-icon shrink-0" });
    if (ICONS[alloc.icon]) {
      iconWrap.innerHTML = ICONS[alloc.icon]("allocation-iconSvg");
    }
    header.appendChild(iconWrap);

    const pctBadge = el("div", { class: "allocation-pct" }, [
      el(
        "span",
        { class: "allocation-pctValue font-display" },
        formatPercentDisplay(alloc.percentage),
      ),
      el("span", { class: "allocation-pctUnit" }, "%"),
    ]);
    header.appendChild(pctBadge);
    card.appendChild(header);

    // Category title
    card.appendChild(el("h4", { class: "allocation-title" }, alloc.category));

    // Subtitle if any
    if (alloc.subtitle) {
      card.appendChild(
        el("div", { class: "allocation-subtitle" }, alloc.subtitle),
      );
    }

    // Note badge if any
    if (alloc.note) {
      card.appendChild(el("div", { class: "allocation-note" }, alloc.note));
    }

    const shouldShowAllocationBlock =
      allocationInfo &&
      (alloc.is_buyback || alloc.category === "Liquidity Pool Injection");

    if (shouldShowAllocationBlock) {
      const pct = parsePercentValue(alloc.percentage);
      const sourceName = allocationInfo.sourceName || "Revenue";
      const currency = allocationInfo.currency || "USD";
      const windowLabel = allocationInfo.windowLabel || "Last 30 days";
      const cadenceLabel =
        allocationInfo.cadenceLabel ||
        (alloc.is_buyback ? "Monthly" : "Monthly");
      const nextDate =
        allocationInfo.nextDate ||
        (alloc.is_buyback ? getEndOfMonthDate() : getEndOfMonthDate());
      const hasData =
        !!allocationInfo.hasData &&
        Number.isFinite(Number(allocationInfo.baseAmount));
      const baseAmount = hasData ? Number(allocationInfo.baseAmount) : 0;
      const allocAmount = baseAmount * (pct / 100);

      const formatMoney = (value) => {
        const num = Number(value);
        if (!Number.isFinite(num)) return "—";
        try {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
          }).format(num);
        } catch (_err) {
          return `$${num.toFixed(0)}`;
        }
      };

      // Determine colors based on type
      const isBuyback = alloc.is_buyback;
      const calcClass = isBuyback
        ? "allocation-calc--buyback"
        : "allocation-calc--liquidity";

      // Calculation display
      const calcWrap = el("div", { class: `allocation-calc ${calcClass}` });

      // Formula line
      calcWrap.appendChild(
        el(
          "div",
          { class: "allocation-calcFormula" },
          `${sourceName} (${windowLabel}) × ${pct}%`,
        ),
      );

      // Calculation
      if (hasData) {
        calcWrap.appendChild(
          el("div", { class: "allocation-calcMath" }, [
            el("span", {}, `${formatMoney(baseAmount)} × ${pct}% = `),
            el(
              "span",
              {
                class: `allocation-calcValue ${isBuyback ? "allocation-calcValue--buyback" : "allocation-calcValue--liquidity"}`,
              },
              formatMoney(allocAmount),
            ),
          ]),
        );
      } else {
        calcWrap.appendChild(
          el(
            "div",
            { class: "allocation-calcEmpty" },
            "Snapshot unavailable — showing schedule only.",
          ),
        );
      }

      if (allocationInfo.metaLines?.length) {
        const meta = el("div", { class: "allocation-calcMeta" });
        for (const line of allocationInfo.metaLines) {
          meta.appendChild(
            el("div", { class: "allocation-calcMetaLine" }, String(line)),
          );
        }
        calcWrap.appendChild(meta);
      }

      // Target date for buybacks
      if (isBuyback) {
        calcWrap.appendChild(
          el("div", { class: "allocation-calcFooter" }, [
            el(
              "div",
              { class: "allocation-buyback allocation-buyback--compact" },
              [
                el(
                  "span",
                  { class: "allocation-buybackEmoji", "aria-hidden": "true" },
                  "🎯",
                ),
                el("span", { class: "allocation-buybackText" }, "Next:"),
                el(
                  "span",
                  { class: "allocation-buybackDate font-display" },
                  nextDate,
                ),
              ],
            ),
          ]),
        );
      } else {
        // For liquidity, show cadence + next time
        calcWrap.appendChild(
          el("div", { class: "allocation-calcFooter" }, [
            el(
              "div",
              { class: "allocation-schedule allocation-schedule--liquidity" },
              [
                el(
                  "span",
                  { class: "allocation-scheduleIcon", "aria-hidden": "true" },
                  "📅",
                ),
                el("span", { class: "allocation-scheduleText" }, cadenceLabel),
                el(
                  "span",
                  { class: "allocation-scheduleSep", "aria-hidden": "true" },
                  "·",
                ),
                el("span", { class: "allocation-scheduleNext" }, "Next:"),
                el(
                  "span",
                  { class: "allocation-scheduleDate font-display" },
                  nextDate,
                ),
              ],
            ),
          ]),
        );
      }

      card.appendChild(calcWrap);
    } else if (alloc.is_buyback) {
      // Fallback if no allocation info available
      const targetDate = getEndOfMonthDate();
      card.appendChild(
        el("div", { class: "allocation-buyback" }, [
          el(
            "span",
            { class: "allocation-buybackEmoji", "aria-hidden": "true" },
            "🎯",
          ),
          el("span", { class: "allocation-buybackText" }, "Next:"),
          el(
            "span",
            { class: "allocation-buybackDate font-display" },
            targetDate,
          ),
        ]),
      );
    }

    // Positioning text for buybacks
    if (alloc.positioning) {
      card.appendChild(
        el("p", { class: "allocation-positioning" }, alloc.positioning),
      );
    }

    // Purpose list
    if (alloc.purpose?.length) {
      const purposeList = el("ul", { class: "allocation-list flex-1" });
      for (const p of alloc.purpose) {
        purposeList.appendChild(
          el("li", { class: "allocation-listItem" }, [
            el("span", { class: "allocation-bullet" }),
            el("span", {}, p),
          ]),
        );
      }
      card.appendChild(purposeList);
    }

    // Execution conditions (for buybacks)
    if (alloc.execution_conditions?.length) {
      const condWrap = el("div", { class: "allocation-meta" });
      condWrap.appendChild(
        el("div", { class: "allocation-metaTitle" }, "Execution Conditions"),
      );
      const condList = el("ul", { class: "allocation-metaList" });
      for (const c of alloc.execution_conditions) {
        condList.appendChild(
          el("li", { class: "allocation-metaItem" }, [
            el("span", { class: "allocation-bullet allocation-bullet--amber" }),
            el("span", {}, c),
          ]),
        );
      }
      condWrap.appendChild(condList);
      card.appendChild(condWrap);
    }

    // Principle quote
    if (alloc.principle) {
      card.appendChild(
        el("div", { class: "allocation-principle" }, alloc.principle),
      );
    }

    // Constraints
    if (alloc.constraints?.length) {
      const constraintsWrap = el("div", { class: "allocation-constraints" });
      constraintsWrap.appendChild(
        el("div", { class: "allocation-metaTitle" }, "Constraints"),
      );
      const cList = el("ul", { class: "allocation-metaList" });
      for (const c of alloc.constraints) {
        cList.appendChild(
          el("li", { class: "allocation-metaItem" }, [
            el("span", {
              class: "allocation-bullet allocation-bullet--neutral",
            }),
            el("span", {}, c),
          ]),
        );
      }
      constraintsWrap.appendChild(cList);
      card.appendChild(constraintsWrap);
    }

    return card;
  }

  function renderCapitalGovernance(data) {
    if (!data?.capital_governance) return null;

    const cfg = data.capital_governance;
    const wrap = sectionShell(cfg.title, cfg.subtitle, "capital-governance");

    // Prepare buyback info from snapshots
    const creatorFeesLiquidityInfo = data?.creator_fees
      ? {
          hasData:
            !!data.creator_fees.snapshot &&
            Number.isFinite(Number(data.creator_fees.snapshot.last_30d_usd)),
          baseAmount: data.creator_fees.snapshot?.last_30d_usd,
          windowLabel: "Last 30 days",
          sourceName: "Creator Fees",
          currency: "USD",
          cadenceLabel: "Monthly allocation",
          nextDate: getEndOfMonthDate(),
          metaLines: [
            "Occurs once per month (end of month).",
            "Computed from the rolling 30-day Creator Fees total.",
          ],
        }
      : null;

    const creatorFeesBuybackInfo = data?.creator_fees
      ? {
          hasData:
            !!data.creator_fees.snapshot &&
            Number.isFinite(Number(data.creator_fees.snapshot.last_7d_usd)),
          baseAmount: data.creator_fees.snapshot?.last_7d_usd,
          windowLabel: "Last 7 days",
          sourceName: "Creator Fees",
          currency: "USD",
          cadenceLabel: "Weekly buyback (Sun)",
          nextDate: getNextSundayDate(),
          metaLines: [
            "Occurs once per week (every Sunday).",
            "Computed from the Creator Fees total over the last 7 days.",
          ],
        }
      : null;

    const revenueBuybackInfo = data?.revenue
      ? {
          hasData:
            !!data.revenue.snapshot &&
            Number.isFinite(Number(data.revenue.snapshot.last_30d)),
          baseAmount: data.revenue.snapshot?.last_30d,
          windowLabel: "Last 30 days",
          sourceName: "Platform Revenue",
          currency: data.revenue.snapshot?.currency || "USD",
          cadenceLabel: "Monthly buyback",
          nextDate: getEndOfMonthDate(),
          metaLines: [
            "Occurs once per month (end of month).",
            "Computed from the rolling 30-day Platform Revenue total.",
          ],
        }
      : null;

    // Creator Fees Section
    if (cfg.creator_fees) {
      const cf = cfg.creator_fees;
      const cfSection = el("div", { class: "glass rounded-3xl p-6 sm:p-8" });

      // Section Header
      const cfHeader = el("div", { class: "mb-6" });
      cfHeader.appendChild(
        el(
          "h3",
          {
            class:
              "font-display text-xl font-semibold text-slate-900 dark:text-white",
          },
          "I. " + cf.title,
        ),
      );
      cfHeader.appendChild(
        el(
          "p",
          {
            class:
              "mt-2 text-sm leading-relaxed text-slate-700 dark:text-white/80",
          },
          cf.description,
        ),
      );
      cfSection.appendChild(cfHeader);

      // Donut Chart for Creator Fees
      if (cf.allocations?.length) {
        const chartContainer = el("div", { class: "allocation-chart mb-6" });
        chartContainer.appendChild(renderDonutChart(cf.allocations, cf.title));
        cfSection.appendChild(chartContainer);
      }

      // Allocation label
      cfSection.appendChild(
        el(
          "div",
          {
            class:
              "mt-4 mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/70",
          },
          "Allocation Breakdown (100%)",
        ),
      );

      // Allocation cards grid
      const allocGrid = el("div", {
        class: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
      });
      for (const alloc of cf.allocations || []) {
        const isLiquidity = alloc.category === "Liquidity Pool Injection";
        const info = alloc.is_buyback
          ? creatorFeesBuybackInfo
          : isLiquidity
            ? creatorFeesLiquidityInfo
            : null;
        allocGrid.appendChild(renderAllocationCard(alloc, info));
      }
      cfSection.appendChild(allocGrid);
      wrap.appendChild(cfSection);
    }

    // Platform Revenue Section
    if (cfg.platform_revenue) {
      const pr = cfg.platform_revenue;
      const prSection = el("div", {
        class: "glass rounded-3xl p-6 sm:p-8 mt-6",
      });

      // Section Header
      const prHeader = el("div", { class: "mb-6" });
      prHeader.appendChild(
        el(
          "h3",
          {
            class:
              "font-display text-xl font-semibold text-slate-900 dark:text-white",
          },
          "II. " + pr.title,
        ),
      );
      prHeader.appendChild(
        el(
          "p",
          {
            class:
              "mt-2 text-sm leading-relaxed text-slate-700 dark:text-white/80",
          },
          pr.description,
        ),
      );
      prSection.appendChild(prHeader);

      // Donut Chart for Platform Revenue
      if (pr.allocations?.length) {
        const chartContainer = el("div", { class: "allocation-chart mb-6" });
        chartContainer.appendChild(renderDonutChart(pr.allocations, pr.title));
        prSection.appendChild(chartContainer);
      }

      // Allocation label
      prSection.appendChild(
        el(
          "div",
          {
            class:
              "mt-4 mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/70",
          },
          "Allocation Breakdown (100%)",
        ),
      );

      // Allocation cards grid
      const prGrid = el("div", {
        class: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
      });
      for (const alloc of pr.allocations || []) {
        prGrid.appendChild(
          renderAllocationCard(
            alloc,
            alloc.is_buyback ? revenueBuybackInfo : null,
          ),
        );
      }
      prSection.appendChild(prGrid);
      wrap.appendChild(prSection);
    }

    return wrap;
  }

  function renderPrinciples(data) {
    const wrap = sectionShell(
      data.guiding_principles.title,
      "Principles that shape sequencing and execution.",
      "guiding-principles",
    );
    const grid = el("div", {
      class: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
    });
    for (const item of data.guiding_principles.items || []) {
      grid.appendChild(
        el("div", { class: "glass rounded-3xl p-6" }, [
          el(
            "div",
            {
              class:
                "mb-3 text-sm font-semibold text-slate-900 dark:text-white",
            },
            item.title,
          ),
          el(
            "p",
            {
              class:
                "text-sm leading-relaxed text-slate-700 dark:text-white/90",
            },
            item.description,
          ),
        ]),
      );
    }
    wrap.appendChild(grid);
    return wrap;
  }

  function renderWhatBuilding(data) {
    if (!data?.what_building) return null;

    const wrap = sectionShell(
      data.what_building.title,
      data.what_building.subtitle,
      "what-building",
    );
    const grid = el("div", {
      class: "grid gap-6 md:grid-cols-2 lg:grid-cols-4",
    });

    const accent = (idx) => {
      const accents = [
        {
          bar: "from-ace-emerald/40 to-ace-blue/30",
          chip: "bg-ace-emerald/15 text-emerald-950 dark:bg-ace-emerald/20 dark:text-emerald-100",
        },
        {
          bar: "from-ace-blue/35 to-violet-500/25",
          chip: "bg-ace-blue/15 text-sky-950 dark:bg-ace-blue/20 dark:text-sky-100",
        },
        {
          bar: "from-violet-500/30 to-ace-emerald/20",
          chip: "bg-violet-500/15 text-violet-950 dark:bg-violet-500/20 dark:text-violet-100",
        },
        {
          bar: "from-amber-500/30 to-rose-500/20",
          chip: "bg-amber-500/15 text-amber-950 dark:bg-amber-500/20 dark:text-amber-100",
        },
      ];
      return accents[idx % accents.length];
    };

    (data.what_building.cards || []).forEach((card, idx) => {
      const a = accent(idx);
      const shell = el("div", { class: "glass rounded-3xl p-6 sm:p-7" });
      shell.appendChild(
        el("div", {
          class: `h-1.5 w-16 rounded-full bg-gradient-to-r ${a.bar}`,
        }),
      );
      shell.appendChild(
        el(
          "div",
          {
            class:
              "mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white/95",
          },
          card.title,
        ),
      );

      for (const p of card.paragraphs || []) {
        shell.appendChild(
          el(
            "p",
            {
              class:
                "mt-3 text-sm leading-relaxed text-slate-700 dark:text-white/90",
            },
            p,
          ),
        );
      }

      if (card.bullets?.length) {
        const ul = el("ul", { class: "mt-4 space-y-2" });
        for (const b of card.bullets) {
          ul.appendChild(
            el("li", { class: "flex gap-3" }, [
              el("span", {
                class:
                  "mt-2 h-1.5 w-1.5 flex-none rounded-full bg-slate-900/25 dark:bg-white/40",
              }),
              el(
                "span",
                {
                  class:
                    "text-sm leading-relaxed text-slate-700 dark:text-white/90",
                },
                b,
              ),
            ]),
          );
        }
        shell.appendChild(ul);
      }

      if (card.links?.length) {
        const links = el("div", { class: "mt-5 flex flex-wrap gap-2" });
        for (const link of card.links) {
          links.appendChild(
            el(
              "a",
              {
                class:
                  "inline-flex items-center justify-center rounded-full border border-slate-900/15 bg-slate-900/5 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-900/10 dark:border-white/20 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15",
                href: link.href,
                ...(link.new_tab
                  ? { target: "_blank", rel: "noreferrer" }
                  : {}),
              },
              link.label,
            ),
          );
        }
        shell.appendChild(links);
      }

      grid.appendChild(shell);
    });

    wrap.appendChild(grid);
    return wrap;
  }

  function formatIsoDate(value) {
    if (!value) return "";
    const d = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return String(value);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function formatIsoDateTime(value) {
    if (!value) return "";
    const d = new Date(String(value));
    if (Number.isNaN(d.getTime())) return String(value);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    const ss = String(d.getUTCSeconds()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}:${ss} UTC`;
  }

  function shortenAddress(address, { head = 4, tail = 4 } = {}) {
    const raw = safeText(address).trim();
    if (!raw) return "";
    if (raw.length <= head + tail + 3) return raw;
    return `${raw.slice(0, head)}…${raw.slice(-tail)}`;
  }

  function renderPhases(data) {
    const wrap = sectionShell(
      "2026 Roadmap",
      "Quarter-by-quarter delivery with transparent task status.",
      "roadmap",
    );

    const phases = data.phases || [];

    const quick = el("div", { class: "mb-6 flex flex-wrap gap-2" });
    for (const p of phases) {
      quick.appendChild(
        el(
          "a",
          {
            class:
              "rounded-full border border-slate-900/15 bg-slate-900/5 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-900/10 dark:border-white/20 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15",
            href: `#${p.id}`,
          },
          p.label,
        ),
      );
    }
    wrap.appendChild(quick);

    const list = el("div", { class: "space-y-5" });

    phases.forEach((phase) => {
      const stats = phaseStats(phase);
      const pct = stats.donePct;

      const details = el("details", {
        class: "glass group rounded-3xl",
        id: phase.id,
        open: "",
      });
      let isInitialRender = true;
      details.addEventListener("toggle", () => {
        if (!details.open) return;
        // Only update hash if this is not the initial render
        if (!isInitialRender) {
          history.replaceState(null, "", `#${phase.id}`);
        }
      });
      // After the first event loop, mark as no longer initial render
      setTimeout(() => {
        isInitialRender = false;
      }, 0);

      const summary = el("summary", {
        class:
          "flex cursor-pointer items-start justify-between gap-4 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ace-blue/60 sm:p-7",
      });

      const left = el("div", { class: "flex min-w-0 items-start gap-4" });
      const accent = {
        emerald: {
          bg: "bg-emerald-500/15",
          fg: "text-emerald-700 dark:text-emerald-200",
        },
        cyan: { bg: "bg-cyan-500/15", fg: "text-cyan-700 dark:text-cyan-200" },
        violet: {
          bg: "bg-violet-500/15",
          fg: "text-violet-700 dark:text-violet-200",
        },
        blue: { bg: "bg-sky-500/15", fg: "text-sky-700 dark:text-sky-200" },
      }[phase.accent] || {
        bg: "bg-slate-900/5 dark:bg-white/5",
        fg: "text-slate-700 dark:text-white/90",
      };

      const iconWrap = el("div", {
        class: `mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-2xl shadow-ring ${accent.bg}`,
      });
      iconWrap.innerHTML = (ICONS[phase.icon] || ICONS.bolt)(
        `h-6 w-6 ${accent.fg}`,
      );

      const titleWrap = el("div", { class: "min-w-0" });
      const labelRow = el(
        "div",
        { class: "flex flex-wrap items-center gap-2" },
        [
          el(
            "div",
            {
              class:
                "text-xs font-semibold tracking-[0.2em] text-slate-600 dark:text-white/80",
            },
            phase.label,
          ),
        ],
      );
      if (phase.status_note) {
        labelRow.appendChild(
          el(
            "span",
            {
              class:
                "rounded-full border border-slate-900/15 bg-slate-900/5 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-white/90",
            },
            phase.status_note,
          ),
        );
      }
      titleWrap.appendChild(labelRow);
      titleWrap.appendChild(
        el(
          "h3",
          {
            class:
              "mt-1 truncate font-display text-lg font-semibold text-slate-900 dark:text-white sm:text-xl",
          },
          `${phase.title}`,
        ),
      );
      titleWrap.appendChild(
        el(
          "p",
          { class: "mt-2 text-sm text-slate-600 dark:text-white/80" },
          `Focus: ${phase.focus}`,
        ),
      );

      left.appendChild(iconWrap);
      left.appendChild(titleWrap);

      const right = el("div", { class: "flex flex-none items-center gap-4" });
      const progress = el("div", { class: "hidden text-right sm:block" }, [
        el(
          "div",
          { class: "text-sm font-semibold text-slate-800 dark:text-white/90" },
          `${percent(pct)} Complete`,
        ),
        el(
          "div",
          { class: "mt-0.5 text-xs text-slate-600 dark:text-white/80" },
          `${stats.done} of ${stats.total} tasks`,
        ),
      ]);
      right.appendChild(progress);

      const ring = ringSvg(pct, phase.accent);
      ring.classList.add("flex-none");
      ring.appendChild(
        el(
          "div",
          {
            class:
              "pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-white/90",
          },
          `${Math.round(pct)}%`,
        ),
      );
      right.appendChild(ring);

      const chev = el("div", {
        class:
          "chev ml-1 hidden h-10 w-10 items-center justify-center text-slate-600 transition-transform dark:text-white/80 sm:flex",
      });
      chev.innerHTML = ICONS.chevron("h-6 w-6");
      right.appendChild(chev);

      summary.appendChild(left);
      summary.appendChild(right);

      const body = el("div", {
        class:
          "border-t border-slate-900/10 px-6 pb-6 pt-6 dark:border-white/10 sm:px-7 sm:pb-7",
      });
      if (phase.date_range) {
        body.appendChild(
          el(
            "div",
            {
              class:
                "mb-5 text-xs font-semibold tracking-[0.18em] text-slate-600 dark:text-white/80",
            },
            phase.date_range,
          ),
        );
      }

      const groups = el("div", { class: "grid gap-6 lg:grid-cols-2" });
      for (const group of phase.groups || []) {
        const card = el("div", {
          class: "rounded-3xl bg-slate-900/5 p-6 shadow-ring dark:bg-white/5",
        });
        card.appendChild(
          el(
            "div",
            {
              class: "text-sm font-semibold text-slate-800 dark:text-white/90",
            },
            group.title,
          ),
        );

        const ul = el("ul", { class: "mt-4 space-y-3" });
        for (const task of group.items || []) {
          const meta = STATUS[task.status] || STATUS.planned;
          const note = typeof task.note === "string" ? task.note.trim() : "";
          const targetAt =
            typeof task.target_at === "string" ? task.target_at.trim() : "";
          const completedAt =
            typeof task.completed_at === "string"
              ? task.completed_at.trim()
              : "";

          const parts = [meta.label];
          if (note) parts.push(note);
          if (targetAt) parts.push(`Target ${formatIsoDate(targetAt)}`);
          if (completedAt)
            parts.push(`Completed ${formatIsoDate(completedAt)}`);
          const subline = parts.join(" • ");
          ul.appendChild(
            el("li", { class: "flex gap-3" }, [
              el("span", {
                class: `mt-2 h-2 w-2 flex-none rounded-full ${meta.dot}`,
              }),
              el("div", { class: "min-w-0" }, [
                el(
                  "div",
                  {
                    class:
                      "text-sm leading-relaxed text-slate-700 dark:text-white/90",
                  },
                  task.title,
                ),
                el("div", { class: `mt-1 text-xs ${meta.text}` }, subline),
              ]),
            ]),
          );
        }
        card.appendChild(ul);
        groups.appendChild(card);
      }

      body.appendChild(groups);

      details.appendChild(summary);
      details.appendChild(body);
      list.appendChild(details);
    });

    wrap.appendChild(list);
    return wrap;
  }

  function renderTokenFit(data) {
    const wrap = sectionShell(
      data.token_fit.title,
      "Mechanisms follow adoption—never the other way around.",
      "token-fit",
    );
    const card = el("div", { class: CARD_CLASS });
    for (const p of data.token_fit.paragraphs || []) {
      card.appendChild(
        el(
          "p",
          {
            class:
              "text-sm leading-relaxed text-slate-700 dark:text-white/90 sm:text-base",
          },
          p,
        ),
      );
    }
    const ul = el("ul", { class: "mt-6 grid gap-3 sm:grid-cols-2" });
    for (const b of data.token_fit.bullets || []) {
      ul.appendChild(
        el(
          "li",
          {
            class:
              "rounded-2xl bg-slate-900/5 px-4 py-3 text-sm text-slate-700 shadow-ring dark:bg-white/5 dark:text-white/90",
          },
          b,
        ),
      );
    }
    card.appendChild(ul);
    wrap.appendChild(card);
    return wrap;
  }

  function renderBuybackHistory(data, { load_failed } = {}) {
    if (!data) return null;

    const wrap = sectionShell(
      data.title || "Buyback History",
      data.subtitle ||
        "On-chain buyback transactions — transparent and verifiable.",
      "buyback-history",
    );

    const shell = el("div", { class: CARD_CLASS });

    if (load_failed) {
      shell.appendChild(
        el(
          "div",
          { class: "text-sm text-slate-600 dark:text-white/70" },
          "Failed to load buyback history.",
        ),
      );
      wrap.appendChild(shell);
      return wrap;
    }

    const transactionsRaw = Array.isArray(data.transactions)
      ? data.transactions
      : [];
    const transactions = transactionsRaw
      .filter((tx) => tx && typeof tx === "object")
      .slice()
      .sort((a, b) => {
        const aTime = new Date(String(a.occurred_at || a.date || "")).getTime();
        const bTime = new Date(String(b.occurred_at || b.date || "")).getTime();
        if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
        if (Number.isNaN(aTime)) return 1;
        if (Number.isNaN(bTime)) return -1;
        return bTime - aTime;
      });
    if (transactions.length === 0) {
      shell.appendChild(
        el(
          "div",
          { class: "text-sm text-slate-600 dark:text-white/70" },
          "No buyback transactions yet.",
        ),
      );
      wrap.appendChild(shell);
      return wrap;
    }

    // Stats summary
    const totalUsd = transactions.reduce(
      (sum, tx) => sum + (Number(tx.amount_usd) || 0),
      0,
    );
    const totalAce = transactions.reduce(
      (sum, tx) => sum + (Number(tx.ace_bought) || 0),
      0,
    );
    const avgUsd = transactions.length ? totalUsd / transactions.length : 0;

    const statsGrid = el("div", { class: "buyback-stats" });

    const statCard = ({ tone, icon, label, value, subtext }) => {
      const iconWrap = el("div", {
        class: `buyback-statIcon buyback-statIcon--${tone}`,
      });
      if (ICONS[icon]) iconWrap.innerHTML = ICONS[icon]("buyback-statIconSvg");

      return el("div", { class: `buyback-stat buyback-stat--${tone}` }, [
        el("div", { class: "buyback-statRow" }, [
          iconWrap,
          el(
            "div",
            { class: "buyback-statBody" },
            [
              el("div", { class: "buyback-statLabel" }, label),
              el("div", { class: "buyback-statValue font-display" }, value),
              subtext ? el("div", { class: "buyback-statSub" }, subtext) : null,
            ].filter(Boolean),
          ),
        ]),
      ]);
    };

    statsGrid.appendChild(
      statCard({
        tone: "emerald",
        icon: "cash",
        label: "Total spent",
        value: `$${totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        subtext: "USD across all buybacks",
      }),
    );
    statsGrid.appendChild(
      statCard({
        tone: "violet",
        icon: "spark",
        label: "ACE bought",
        value: totalAce.toLocaleString("en-US", { maximumFractionDigits: 6 }),
        subtext: "tokens acquired",
      }),
    );
    statsGrid.appendChild(
      statCard({
        tone: "blue",
        icon: "chart",
        label: "Avg / tx",
        value: `$${avgUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        subtext: `${transactions.length.toLocaleString("en-US")} transactions`,
      }),
    );
    shell.appendChild(statsGrid);

    // Transaction list
    const list = el("div", { class: "buyback-list" });

    for (const tx of transactions) {
      const txHash = safeText(tx.tx_hash);
      if (!txHash) continue;

      const occurredAt = tx.occurred_at
        ? formatIsoDateTime(tx.occurred_at)
        : safeText(tx.date);
      const amountUsd = Number(tx.amount_usd) || 0;
      const amountSol = tx.amount_sol != null ? Number(tx.amount_sol) : null;
      const aceBought = tx.ace_bought != null ? Number(tx.ace_bought) : null;
      const sourceLabel = safeText(tx.source);
      const sourcePct =
        tx.source_percentage != null ? Number(tx.source_percentage) : null;
      const fromLabel = safeText(tx.from_label);
      const fromAddress = safeText(tx.from_address);
      const pair = safeText(tx.pair);
      const note = safeText(tx.note);

      const txCard = el("a", {
        class:
          "buyback-txCard block focus:outline-none focus-visible:ring-2 focus-visible:ring-ace-blue/60",
        href: `https://solscan.io/tx/${txHash}`,
        target: "_blank",
        rel: "noreferrer",
      });

      const top = el("div", { class: "buyback-txTop" });

      const titleLeft = el("div", { class: "buyback-txTitle" });
      const txIcon = el("div", { class: "buyback-txIcon" });
      txIcon.innerHTML = ICONS.spark("buyback-txIconSvg");
      titleLeft.appendChild(txIcon);

      const titleText = el("div", { class: "buyback-txTitleText" });
      titleText.appendChild(el("div", { class: "buyback-txWhen" }, occurredAt));
      const fromText = fromLabel
        ? fromLabel
        : shortenAddress(fromAddress, { head: 6, tail: 6 });
      if (fromText)
        titleText.appendChild(
          el("div", { class: "buyback-txFrom" }, `From: ${fromText}`),
        );
      titleLeft.appendChild(titleText);
      top.appendChild(titleLeft);

      const amounts = el("div", { class: "buyback-txAmounts" });
      amounts.appendChild(
        el(
          "div",
          { class: "buyback-txUsd font-display" },
          `$${amountUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        ),
      );
      if (amountSol != null && Number.isFinite(amountSol) && amountSol > 0) {
        amounts.appendChild(
          el("div", { class: "buyback-txSol" }, `${amountSol} SOL`),
        );
      }
      top.appendChild(amounts);

      txCard.appendChild(top);

      // Details row
      const details = el("div", { class: "buyback-txMeta" });

      if (sourceLabel) {
        const label =
          sourcePct != null && Number.isFinite(sourcePct)
            ? `${sourceLabel} (${sourcePct}%)`
            : sourceLabel;
        details.appendChild(
          el(
            "span",
            {
              class: "buyback-pill buyback-pill--blue",
            },
            label,
          ),
        );
      }

      if (pair) {
        details.appendChild(
          el("span", { class: "buyback-pill buyback-pill--neutral" }, pair),
        );
      }

      if (aceBought != null && Number.isFinite(aceBought) && aceBought > 0) {
        details.appendChild(
          el(
            "span",
            {
              class: "buyback-pill buyback-pill--violet",
            },
            `${aceBought.toLocaleString("en-US")} ACE`,
          ),
        );
      }

      // Card already links to Solscan; avoid redundant address/hash pills.

      if (details.childNodes.length) txCard.appendChild(details);

      if (note)
        txCard.appendChild(el("div", { class: "buyback-txNote" }, note));

      list.appendChild(txCard);
    }

    shell.appendChild(list);
    wrap.appendChild(shell);
    return wrap;
  }

  function renderDailyUpdates(index, sourceUrl, { load_failed } = {}) {
    const wrap = sectionShell(
      index?.title || "Daily Updates",
      index?.subtitle ||
        "Short, dated shipping notes — linked to docs, demos, or code.",
      "daily-updates",
    );

    const shell = el("div", { class: CARD_CLASS });
    const list = el("div", { class: "space-y-4" });
    shell.appendChild(list);

    const footer = el("div", {
      class:
        "mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
    });
    const status = el(
      "div",
      { class: "text-xs font-semibold text-slate-600 dark:text-white/80" },
      "",
    );
    const btn = el(
      "button",
      {
        type: "button",
        class:
          "inline-flex items-center justify-center rounded-full border border-slate-900/15 bg-slate-900/5 px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-ring hover:bg-slate-900/10 disabled:opacity-60 dark:border-white/20 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15",
      },
      "Load older days",
    );
    footer.appendChild(status);
    footer.appendChild(btn);
    shell.appendChild(footer);

    wrap.appendChild(shell);

    const days = Array.isArray(index?.days)
      ? index.days.filter((d) => typeof d === "string" && d.trim())
      : [];
    const initialOpenDays = Math.max(
      0,
      Math.min(days.length, Number(index.initial_open_days) || 3),
    );
    const pageSizeDays = Math.max(
      1,
      Math.min(60, Number(index.page_size_days) || 20),
    );

    const source = (() => {
      try {
        return new URL(String(sourceUrl || ""), window.location.href);
      } catch (_err) {
        return null;
      }
    })();

    const dayUrl = (day) => {
      if (source) return new URL(`${day}.json`, source).toString();
      return `./config/daily-updates/${day}.json`;
    };

    const state = { cursor: 0, paging: false };

    const setUi = () => {
      if (load_failed) {
        status.textContent = "Feed unavailable — check GitHub Actions sync.";
        return;
      }
      status.textContent = days.length
        ? `${Math.min(state.cursor, days.length)} / ${days.length} days listed`
        : "No updates yet.";
      const remaining = Math.max(0, days.length - state.cursor);
      btn.disabled = state.paging || remaining <= 0;
      if (remaining <= 0) btn.textContent = "All days loaded";
      else if (state.paging) btn.textContent = "Loading…";
      else
        btn.textContent = `Load ${Math.min(pageSizeDays, remaining)} older days`;
    };

    const row = (item) => {
      const canLink = !!item.public && !!item.url;
      const tagWrap =
        item.tags?.length || !canLink
          ? el(
              "div",
              { class: "mt-3 flex flex-wrap gap-2" },
              [
                !canLink
                  ? el(
                      "span",
                      {
                        class:
                          "rounded-full border border-slate-900/10 bg-slate-900/5 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-white/80",
                      },
                      "private",
                    )
                  : null,
                ...(item.tags || []).map((t) =>
                  el(
                    "span",
                    {
                      class:
                        "rounded-full border border-slate-900/10 bg-slate-900/5 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-white/80",
                    },
                    t,
                  ),
                ),
              ].filter(Boolean),
            )
          : null;

      const inner = [
        el(
          "div",
          { class: "font-semibold text-slate-900 dark:text-white/95" },
          item.title,
        ),
        item.summary
          ? el(
              "div",
              { class: "mt-2 text-sm text-slate-700 dark:text-white/90" },
              item.summary,
            )
          : null,
        tagWrap,
      ];

      if (canLink) {
        return el(
          "a",
          {
            class:
              "block rounded-2xl bg-slate-900/5 px-4 py-4 shadow-ring hover:bg-slate-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ace-blue/60 dark:bg-white/5 dark:hover:bg-white/10",
            href: item.url,
            target: "_blank",
            rel: "noreferrer",
          },
          inner,
        );
      }

      return el(
        "div",
        {
          class:
            "block rounded-2xl bg-slate-900/5 px-4 py-4 shadow-ring dark:bg-white/5",
        },
        inner,
      );
    };

    const dayGroup = (day, { open }) => {
      const attrs = { class: "glass rounded-3xl" };
      if (open) attrs.open = "";
      const details = el("details", attrs);

      const summary = el("summary", {
        class:
          "flex cursor-pointer items-center justify-between gap-4 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ace-blue/60 sm:p-7",
      });
      summary.appendChild(
        el(
          "div",
          {
            class:
              "min-w-0 font-display text-lg font-semibold text-slate-900 dark:text-white",
          },
          formatIsoDate(day),
        ),
      );
      const countEl = el(
        "div",
        {
          class:
            "flex flex-none items-center gap-2 text-xs font-semibold text-slate-600 dark:text-white/80",
        },
        "Open to load",
      );
      summary.appendChild(countEl);

      const body = el("div", {
        class:
          "border-t border-slate-900/10 px-6 pb-6 pt-6 dark:border-white/10 sm:px-7 sm:pb-7",
      });
      const stack = el("div", { class: "space-y-3" });
      body.appendChild(stack);

      details.appendChild(summary);
      details.appendChild(body);

      const renderLoading = () => {
        stack.replaceChildren(
          el(
            "div",
            {
              class:
                "rounded-2xl bg-slate-900/5 px-4 py-4 text-sm text-slate-700 shadow-ring dark:bg-white/5 dark:text-white/80",
            },
            "Loading updates…",
          ),
        );
      };

      const renderError = () => {
        const retry = el(
          "button",
          {
            type: "button",
            class:
              "mt-3 inline-flex items-center justify-center rounded-full border border-slate-900/15 bg-slate-900/5 px-4 py-2 text-sm font-semibold text-slate-800 shadow-ring hover:bg-slate-900/10 dark:border-white/20 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15",
          },
          "Retry",
        );
        retry.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          void loadDay();
        });

        stack.replaceChildren(
          el(
            "div",
            {
              class:
                "rounded-2xl bg-slate-900/5 px-4 py-4 text-sm text-slate-700 shadow-ring dark:bg-white/5 dark:text-white/90",
            },
            [`Failed to load ${day}.`, retry],
          ),
        );
      };

      const loadDay = async () => {
        if (details.dataset.loaded === "1" || details.dataset.loading === "1")
          return;
        details.dataset.loading = "1";
        countEl.textContent = "Loading…";
        renderLoading();
        try {
          const items = await fetchDay(day);
          stack.replaceChildren(...items.map((it) => row(it)));
          details.dataset.loaded = "1";
          countEl.textContent = `${items.length} updates`;
        } catch (_err) {
          countEl.textContent = "Load failed";
          renderError();
        } finally {
          details.dataset.loading = "0";
        }
      };

      details.addEventListener("toggle", () => {
        if (!details.open) return;
        void loadDay();
      });

      if (open) queueMicrotask(() => void loadDay());
      return details;
    };

    const fetchDay = async (day) => {
      const res = await fetch(dayUrl(day), { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${day} (${res.status})`);
      const doc = await res.json();
      const itemsRaw = doc?.items;
      const items = Array.isArray(itemsRaw) ? itemsRaw : [];
      return items
        .filter((it) => it && typeof it === "object")
        .map((it, idx) => {
          const title = safeText(it.title);
          const url = it.url ? safeText(it.url) : "";

          // Back-compat: older day files might miss "id". Use url or a stable per-day fallback.
          const id =
            safeText(it.id) || url || `${day}:${idx}:${title.slice(0, 48)}`;

          // If url is missing, treat as non-public for display.
          const publicFlag = Boolean(url) && it.public !== false;

          return {
            id,
            title,
            url,
            public: publicFlag,
            summary: it.summary ? safeText(it.summary) : "",
            tags: Array.isArray(it.tags)
              ? it.tags
                  .map((t) => safeText(t))
                  .filter(Boolean)
                  .slice(0, 8)
              : [],
          };
        })
        .filter((it) => it.id && it.title);
    };

    const loadMore = ({ count, open }) => {
      if (state.paging) return;
      state.paging = true;
      setUi();

      const slice = days.slice(state.cursor, state.cursor + count);
      for (const day of slice) {
        list.appendChild(dayGroup(day, { open }));
      }

      state.cursor += slice.length;
      state.paging = false;
      setUi();
    };

    btn.addEventListener("click", () => {
      loadMore({ count: pageSizeDays, open: false });
    });

    if (!days.length) {
      list.appendChild(
        el(
          "div",
          {
            class:
              "rounded-2xl bg-slate-900/5 px-4 py-4 text-sm text-slate-700 shadow-ring dark:bg-white/5 dark:text-white/80",
          },
          load_failed
            ? "Daily updates are configured, but the index feed could not be loaded. Run the sync workflow (or check the Pages build output) and refresh."
            : "No updates yet — this section will populate automatically as PRs and commits land.",
        ),
      );
    }

    setUi();
    queueMicrotask(() => {
      if (!days.length) return;
      loadMore({ count: initialOpenDays, open: true });
    });

    return wrap;
  }

  function renderClosing(data) {
    const wrap = sectionShell(data.closing.title, null, "closing");
    const card = el("div", { class: CARD_CLASS });
    for (const p of data.closing.paragraphs || []) {
      card.appendChild(
        el(
          "p",
          {
            class:
              "text-sm leading-relaxed text-slate-700 dark:text-white/90 sm:text-base",
          },
          p,
        ),
      );
    }

    const ul = el("ul", { class: "mt-6 grid gap-3 sm:grid-cols-2" });
    for (const b of data.closing.bullets || []) {
      ul.appendChild(
        el(
          "li",
          {
            class:
              "rounded-2xl bg-slate-900/5 px-4 py-3 text-sm text-slate-700 shadow-ring dark:bg-white/5 dark:text-white/90",
          },
          b,
        ),
      );
    }
    card.appendChild(ul);
    card.appendChild(
      el(
        "div",
        {
          class:
            "mt-8 rounded-3xl bg-gradient-to-r from-ace-emerald/15 via-white/20 to-ace-blue/15 p-6 text-center shadow-ring dark:via-white/5",
        },
        [
          el(
            "div",
            {
              class:
                "font-display text-lg font-semibold text-slate-900 dark:text-white sm:text-xl",
            },
            data.closing.final_line,
          ),
          el(
            "div",
            { class: "mt-2 text-sm text-slate-600 dark:text-white/80" },
            "Every milestone is dated. Every claim is backed by something you can verify — docs, code, or production usage.",
          ),
        ],
      ),
    );
    wrap.appendChild(card);
    return wrap;
  }

  function renderFooter(data) {
    const footer = el("footer", { class: "mt-16" });
    const inner = el("div", { class: "mx-auto max-w-6xl px-4 py-14 sm:px-6" });

    const top = el("div", { class: "grid gap-10 lg:grid-cols-3" });

    const brand = el("div", { class: "min-w-0" }, [
      el("div", { class: "flex items-center gap-3" }, [
        el("img", {
          src: "./assets/logo.png",
          alt: "Ace Data Cloud",
          class: "h-8 w-auto dark:hidden",
        }),
        el("img", {
          src: "./assets/logo2.png",
          alt: "Ace Data Cloud",
          class: "hidden h-8 w-auto dark:block",
        }),
      ]),
      el(
        "div",
        {
          class: "mt-6 text-sm font-semibold text-slate-800 dark:text-white/90",
        },
        data.footer.brand.title,
      ),
    ]);

    const lines = el("div", {
      class: "mt-4 space-y-3 text-sm text-slate-600 dark:text-white/80",
    });
    for (const line of data.footer.brand.lines || []) {
      const content = line.href
        ? el(
            "a",
            {
              class: "hover:text-slate-900 dark:hover:text-white",
              href: line.href,
              ...(line.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer" }
                : {}),
            },
            line.text,
          )
        : el("span", {}, line.text);
      lines.appendChild(
        el("div", { class: "flex gap-3" }, [
          el("span", {
            class:
              "mt-0.5 h-2 w-2 flex-none rounded-full bg-slate-900/20 dark:bg-white/35",
          }),
          content,
        ]),
      );
    }
    brand.appendChild(lines);

    const cols = el("div", {
      class: "grid gap-10 sm:grid-cols-2 lg:col-span-2",
    });
    for (const col of data.footer.columns || []) {
      const colEl = el("div", {}, [
        el(
          "div",
          { class: "text-sm font-semibold text-slate-800 dark:text-white/90" },
          col.title,
        ),
        el("div", { class: "mt-4 space-y-3 text-sm" }),
      ]);
      const list = colEl.querySelector("div.mt-4");
      for (const link of col.links || []) {
        list.appendChild(
          el(
            "a",
            {
              class:
                "block text-slate-600 hover:text-slate-900 dark:text-white/80 dark:hover:text-white",
              href: link.href,
              ...(link.new_tab ? { target: "_blank", rel: "noreferrer" } : {}),
            },
            link.label,
          ),
        );
      }
      cols.appendChild(colEl);
    }

    top.appendChild(brand);
    top.appendChild(cols);

    const year = new Date().getFullYear();
    const bottomElements = [
      el(
        "div",
        {},
        data.footer.bottom.copyright_text.replace("{year}", String(year)),
      ),
    ];
    if (
      data.footer.bottom.secondary_text &&
      data.footer.bottom.secondary_href
    ) {
      bottomElements.push(
        el(
          "a",
          {
            class:
              "mt-2 inline-block hover:text-slate-900 dark:hover:text-white",
            href: data.footer.bottom.secondary_href,
            target: "_blank",
            rel: "noreferrer",
          },
          data.footer.bottom.secondary_text,
        ),
      );
    }
    const bottom = el(
      "div",
      { class: "mt-12 text-center text-sm text-slate-600 dark:text-white/80" },
      bottomElements,
    );

    inner.appendChild(top);
    inner.appendChild(bottom);
    footer.appendChild(inner);
    return footer;
  }

  function openFromHash() {
    const id = (location.hash || "").replace("#", "");
    if (!id) return;
    const node = document.getElementById(id);
    if (node?.tagName?.toLowerCase?.() === "details") node.open = true;
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function main() {
    const app = document.getElementById("app");
    if (!app) return;

    let data;
    let revenueSnapshot;
    let revenueLoadFailed = false;
    let buybackHistoryDoc;
    let buybackHistoryLoadFailed = false;
    let dailyUpdatesIndex;
    let dailyUpdatesSourceUrl;
    let dailyUpdatesLoadFailed = false;
    try {
      const res = await fetch("./config/roadmap.json", { cache: "no-store" });
      if (!res.ok)
        throw new Error(`Failed to load config/roadmap.json (${res.status})`);
      data = await res.json();
    } catch (_err) {
      app.appendChild(
        el(
          "div",
          { class: "mx-auto max-w-3xl px-4 py-16 text-center sm:px-6" },
          [
            el("div", { class: "glass rounded-3xl p-8" }, [
              el(
                "h1",
                {
                  class:
                    "font-display text-xl font-semibold text-slate-900 dark:text-white",
                },
                "Could not load config/roadmap.json",
              ),
              el(
                "p",
                {
                  class:
                    "mt-3 text-sm leading-relaxed text-slate-600 dark:text-white/80",
                },
                "If you opened this page via file://, browsers block JSON fetch. Serve the folder with a local web server, e.g. `python3 -m http.server` from the Roadmap directory.",
              ),
            ]),
          ],
        ),
      );
      return;
    }

    try {
      if (data?.revenue?.source) {
        const rr = await fetch(String(data.revenue.source), {
          cache: "no-store",
        });
        if (rr.ok) revenueSnapshot = await rr.json();
        else revenueLoadFailed = true;
      }
    } catch (_err) {
      revenueLoadFailed = true;
      revenueSnapshot = undefined;
    }
    if (data?.revenue) {
      data.revenue.snapshot = revenueSnapshot;
      data.revenue.load_failed = revenueLoadFailed;
    }

    // Load creator fees snapshot
    let creatorFeesSnapshot;
    let creatorFeesLoadFailed = false;
    try {
      if (data?.creator_fees?.source) {
        const cfr = await fetch(String(data.creator_fees.source), {
          cache: "no-store",
        });
        if (cfr.ok) creatorFeesSnapshot = await cfr.json();
        else creatorFeesLoadFailed = true;
      }
    } catch (_err) {
      creatorFeesLoadFailed = true;
      creatorFeesSnapshot = undefined;
    }
    if (data?.creator_fees) {
      data.creator_fees.snapshot = creatorFeesSnapshot;
      data.creator_fees.load_failed = creatorFeesLoadFailed;
    }

    // Load buyback history (transaction feed)
    try {
      if (data?.buyback_history?.source) {
        const bhr = await fetch(String(data.buyback_history.source), {
          cache: "no-store",
        });
        if (bhr.ok) buybackHistoryDoc = await bhr.json();
        else buybackHistoryLoadFailed = true;
      } else if (data?.buyback_history?.transactions) {
        buybackHistoryDoc = data.buyback_history;
      }
    } catch (_err) {
      buybackHistoryLoadFailed = true;
      buybackHistoryDoc = undefined;
    }

    if (data?.daily_updates) {
      dailyUpdatesIndex = {
        title: "Daily Updates",
        subtitle:
          "Short, dated shipping notes — linked to docs, demos, or code.",
        initial_open_days: 3,
        page_size_days: 20,
        days: [],
      };
    }

    try {
      if (data?.daily_updates?.source) {
        const src = String(data.daily_updates.source);
        const dr = await fetch(src, { cache: "no-store" });
        if (dr.ok) {
          dailyUpdatesIndex = await dr.json();
          dailyUpdatesSourceUrl = dr.url || src;
        } else {
          dailyUpdatesLoadFailed = true;
        }
      }
    } catch (_err) {
      dailyUpdatesLoadFailed = true;
      dailyUpdatesSourceUrl = undefined;
    }

    document.title = safeText(data.site.page_title || document.title);

    app.appendChild(renderHeader(data));

    const hero = renderHero(data);
    app.appendChild(hero);
    startHeroCanvas(hero.querySelector("#hero-canvas"));

    app.appendChild(renderOverview(data));
    const whatBuilding = renderWhatBuilding(data);
    if (whatBuilding) app.appendChild(whatBuilding);
    const aceToken = renderAceToken(data);
    if (aceToken) app.appendChild(aceToken);
    const founder = renderFounder(data);
    if (founder) app.appendChild(founder);
    app.appendChild(renderPrinciples(data));
    const revenue = renderRevenue(data);
    if (revenue) app.appendChild(revenue);
    const creatorFees = renderCreatorFees(data);
    if (creatorFees) app.appendChild(creatorFees);
    const capitalGovernance = renderCapitalGovernance(data);
    if (capitalGovernance) app.appendChild(capitalGovernance);
    app.appendChild(renderPhases(data));
    app.appendChild(renderTokenFit(data));
    if (data?.buyback_history) {
      const merged = {
        ...(data.buyback_history || {}),
        ...(buybackHistoryDoc || {}),
      };
      app.appendChild(
        renderBuybackHistory(merged, { load_failed: buybackHistoryLoadFailed }),
      );
    }
    if (dailyUpdatesIndex)
      app.appendChild(
        renderDailyUpdates(dailyUpdatesIndex, dailyUpdatesSourceUrl, {
          load_failed: dailyUpdatesLoadFailed,
        }),
      );
    app.appendChild(renderClosing(data));
    app.appendChild(renderFooter(data));

    // Add sidebar navigation
    app.appendChild(renderSideNav(data));

    updateThemeToggleButtons();
    requestAnimationFrame(openFromHash);
    window.addEventListener("hashchange", openFromHash);
  }

  document.addEventListener("ace:themechange", () => {
    updateThemeToggleButtons();
  });

  main();
})();
