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
    `
  };

  const STATUS = {
    done: {
      label: 'Completed',
      dot: 'bg-emerald-500 dark:bg-emerald-400',
      text: 'text-emerald-700 dark:text-emerald-200'
    },
    in_progress: {
      label: 'In progress',
      dot: 'bg-amber-500 dark:bg-amber-400',
      text: 'text-amber-700 dark:text-amber-200'
    },
    planned: {
      label: 'Planned',
      dot: 'bg-slate-400',
      text: 'text-slate-600 dark:text-slate-200'
    }
  };

  const isDark = () => document.documentElement.classList.contains('dark');
  const currentTheme = () => (isDark() ? 'dark' : 'light');

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'class') node.className = value;
      else if (key === 'html') node.innerHTML = value;
      else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value);
    }
    for (const child of Array.isArray(children) ? children : [children]) {
      if (child == null) continue;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return node;
  }

  const safeText = (text) => String(text ?? '');

  function percent(num) {
    return `${Math.max(0, Math.min(100, Math.round(num)))}%`;
  }

  function flattenTasks(phase) {
    return phase.groups.flatMap((g) => g.items || []);
  }

  function phaseStats(phase) {
    const tasks = flattenTasks(phase);
    const total = tasks.length || 0;
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const donePct = total === 0 ? 0 : (done / total) * 100;
    return { total, done, inProgress, donePct };
  }

  function ringSvg(donePct, accentClass) {
    const size = 46;
    const stroke = 4;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.max(0, Math.min(100, donePct)) / 100) * circumference;
    const accent =
      {
        emerald: '#06eca3',
        cyan: '#22d3ee',
        violet: '#8b5cf6',
        blue: '#2aa9ff'
      }[accentClass] || '#2aa9ff';

    const wrap = document.createElement('div');
    wrap.className = 'relative h-12 w-12';
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

  function updateThemeToggleButtons() {
    const theme = currentTheme();
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.innerHTML = theme === 'dark' ? ICONS.sun('h-5 w-5') : ICONS.moon('h-5 w-5');
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function startHeroCanvas(canvas) {
    if (!canvas) return;
    if (canvas.dataset.fx) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return;

    const ctx = canvas.getContext('2d', { alpha: true });
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
            r: (0.18 + Math.random() * 0.45) * dpr
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
          ctx.strokeStyle = dark ? `rgba(255,255,255,${0.085 * t})` : `rgba(15,23,42,${0.06 * t})`;
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
          Math.round(c1[2] + (c2[2] - c1[2]) * gx)
        ];
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${dark ? 0.42 : 0.26})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      state.raf = requestAnimationFrame(draw);
    };

    const onResize = () => resize();
    window.addEventListener('resize', onResize, { passive: true });

    resize();
    draw();
    canvas.dataset.fx = '1';
  }

  function renderHeader(data) {
    const header = el('header', {
      class:
        'sticky top-0 z-50 border-b border-slate-900/10 bg-white/75 backdrop-blur dark:border-white/10 dark:bg-slate-950/50'
    });

    const container = el('div', { class: 'mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6' });

    const left = el('a', { class: 'flex items-center', href: '#top', 'aria-label': 'Ace Data Cloud' }, [
      el('img', {
        src: './assets/logo.png',
        alt: 'Ace Data Cloud',
        class: 'h-8 w-auto select-none dark:hidden'
      }),
      el('img', {
        src: './assets/logo2.png',
        alt: 'Ace Data Cloud',
        class: 'hidden h-8 w-auto select-none dark:block'
      })
    ]);

    const nav = el('nav', { class: 'hidden items-center gap-2 md:flex' });
    for (const item of data.nav || []) {
      const isPrimary = !!item.primary;
      nav.appendChild(
        el(
          'a',
          {
            class: isPrimary
              ? 'rounded-full bg-gradient-to-r from-ace-emerald to-ace-blue px-4 py-2 text-sm font-semibold text-slate-950 shadow-glass hover:opacity-95'
              : 'rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-900/5 dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10',
            href: item.href,
            ...(item.new_tab ? { target: '_blank', rel: 'noreferrer' } : {})
          },
          item.label
        )
      );
    }

    const themeBtn = el('button', {
      class:
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/15 bg-slate-900/5 text-slate-700 shadow-ring hover:bg-slate-900/10 dark:border-white/20 dark:bg-white/10 dark:text-white/95 dark:hover:bg-white/15',
      type: 'button',
      'data-theme-toggle': '',
      onclick: () => window.AceRoadmapTheme?.toggle?.()
    });

    const right = el('div', { class: 'flex items-center gap-2' }, [
      themeBtn,
      el(
        'button',
        {
          class:
            'inline-flex items-center justify-center rounded-full border border-slate-900/15 bg-slate-900/5 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-900/10 dark:border-white/20 dark:bg-white/10 dark:text-white/95 dark:hover:bg-white/15 md:hidden',
          type: 'button',
          'aria-label': 'Open menu',
          onclick: () => {
            const menu = document.getElementById('mobile-nav');
            if (!menu) return;
            menu.classList.toggle('hidden');
          }
        },
        'Menu'
      )
    ]);

    container.appendChild(left);
    container.appendChild(nav);
    container.appendChild(right);
    header.appendChild(container);

    const mobile = el('div', {
      id: 'mobile-nav',
      class: 'hidden border-t border-slate-900/10 bg-white/90 md:hidden dark:border-white/10 dark:bg-slate-950/70'
    });
    const mobileInner = el('div', { class: 'mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 sm:px-6' });
    for (const item of data.nav || []) {
      mobileInner.appendChild(
        el(
          'a',
          {
            class: item.primary
              ? 'rounded-xl bg-gradient-to-r from-ace-emerald to-ace-blue px-4 py-3 text-sm font-semibold text-slate-950'
              : 'rounded-xl bg-slate-900/5 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-900/10 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15',
            href: item.href,
            ...(item.new_tab ? { target: '_blank', rel: 'noreferrer' } : {})
          },
          item.label
        )
      );
    }
    mobile.appendChild(mobileInner);
    header.appendChild(mobile);
    return header;
  }

  function renderHero(data) {
    const wrap = el('section', { id: 'top', class: 'relative overflow-hidden' });
    const bg = el('div', { class: 'hero-bg absolute inset-0' });
    if (data?.hero?.background_image) {
      bg.style.backgroundImage = `url("${String(data.hero.background_image)}")`;
    }
    bg.appendChild(el('div', { class: 'absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/70 to-slate-950' }));
    bg.appendChild(
      el('div', {
        class: 'absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(6,236,163,0.22),transparent_55%)] mix-blend-screen'
      })
    );
    bg.appendChild(
      el('div', {
        class: 'absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(42,169,255,0.18),transparent_60%)] mix-blend-screen opacity-70'
      })
    );
    bg.appendChild(el('canvas', { id: 'hero-canvas', class: 'pointer-events-none absolute inset-0 h-full w-full opacity-50 mix-blend-screen' }));

    const content = el('div', { class: 'relative mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6 sm:pb-28 sm:pt-32' });
    const eyebrow = el(
      'div',
      { class: 'mb-6 flex items-center justify-center gap-3 text-xs tracking-[0.45em] text-white/85 sm:text-sm' },
      [el('span', { class: 'h-px w-10 bg-white/35' }), el('span', { class: 'font-display' }, safeText(data.hero.eyebrow)), el('span', { class: 'h-px w-16 bg-white/25' })]
    );

    const title = el(
      'h1',
      { class: 'mx-auto max-w-3xl text-center font-display text-4xl font-semibold leading-tight text-white sm:text-6xl' },
      safeText(data.hero.title)
    );

    const subtitle = el(
      'p',
      { class: 'mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/85 sm:text-lg' },
      safeText(data.site.tagline)
    );

    const seq = el(
      'p',
      { class: 'mx-auto mt-3 max-w-2xl text-center text-sm text-white/65 sm:text-base' },
      safeText(data.hero.subtitle)
    );

    const ctas = el('div', { class: 'mt-10 flex flex-wrap items-center justify-center gap-4' }, [
      el(
        'a',
        {
          class:
            'inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-ace-emerald to-ace-blue px-7 text-sm font-semibold text-slate-950 shadow-glass hover:opacity-95',
          href: data.hero.primary_cta.href,
          ...(data.hero.primary_cta.new_tab ? { target: '_blank', rel: 'noreferrer' } : {})
        },
        data.hero.primary_cta.label
      ),
      el(
        'a',
        {
          class:
            'inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white hover:bg-white/15',
          href: data.hero.secondary_cta.href,
          ...(data.hero.secondary_cta.new_tab ? { target: '_blank', rel: 'noreferrer' } : {})
        },
        data.hero.secondary_cta.label
      )
    ]);

    content.appendChild(eyebrow);
    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(seq);
    content.appendChild(ctas);

    wrap.appendChild(bg);
    wrap.appendChild(content);
    return wrap;
  }

  function sectionShell(title, subtitle) {
    const wrap = el('section', { class: 'mx-auto max-w-6xl px-4 pt-24 pb-20 sm:px-6 sm:pt-32 sm:pb-24' });
    wrap.appendChild(
      el('div', { class: 'mb-10' }, [
        el('h2', { class: 'font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl' }, title),
        subtitle ? el('p', { class: 'mt-2 max-w-2xl text-sm text-slate-600 dark:text-white/75 sm:text-base' }, subtitle) : null
      ])
    );
    return wrap;
  }

  function renderOverview(data) {
    const wrap = sectionShell(data.overview.title, data.site.description);

    const grid = el('div', { class: 'grid gap-6 md:grid-cols-2' });

    const left = el('div', { class: 'glass rounded-3xl p-6 sm:p-7' });
    for (const p of data.overview.paragraphs || []) {
      left.appendChild(el('p', { class: 'text-sm leading-relaxed text-slate-700 dark:text-white/80 sm:text-base' }, p));
    }
    left.appendChild(
      el('div', { class: 'mt-6 flex flex-wrap items-center gap-2' }, [
        el(
          'span',
          { class: 'rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700 shadow-ring dark:bg-white/10 dark:text-white/85' },
          '2026'
        ),
        el(
          'span',
          { class: 'rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700 shadow-ring dark:bg-white/10 dark:text-white/85' },
          safeText(data.overview.sequence)
        )
      ])
    );

    const right = el('div', { class: 'glass rounded-3xl p-6 sm:p-7' }, [
      el('div', { class: 'text-sm font-semibold text-slate-800 dark:text-white/90' }, 'Roadmap priorities'),
      el('ul', { class: 'mt-4 space-y-3' })
    ]);

    const ul = right.querySelector('ul');
    for (const item of data.overview.priorities || []) {
      ul.appendChild(
        el('li', { class: 'flex gap-3' }, [
          el('span', { class: 'mt-2 h-2 w-2 flex-none rounded-full bg-ace-emerald' }),
          el('span', { class: 'text-sm leading-relaxed text-slate-700 dark:text-white/80 sm:text-base' }, item)
        ])
      );
    }

    grid.appendChild(left);
    grid.appendChild(right);
    wrap.appendChild(grid);
    return wrap;
  }

  function renderIntro(data) {
    const wrap = sectionShell(data.intro.title, data.intro.subtitle);
    const grid = el('div', { class: 'grid gap-6 lg:grid-cols-3' });

    const accent = (idx) => {
      const accents = [
        { bar: 'from-ace-emerald/40 to-ace-blue/30', chip: 'bg-ace-emerald/15 text-emerald-950 dark:bg-ace-emerald/20 dark:text-emerald-100' },
        { bar: 'from-ace-blue/35 to-violet-500/25', chip: 'bg-ace-blue/15 text-sky-950 dark:bg-ace-blue/20 dark:text-sky-100' },
        { bar: 'from-violet-500/30 to-ace-emerald/20', chip: 'bg-violet-500/15 text-violet-950 dark:bg-violet-500/20 dark:text-violet-100' }
      ];
      return accents[idx % accents.length];
    };

    (data.intro.cards || []).forEach((card, idx) => {
      const a = accent(idx);
      const shell = el('div', { class: 'glass rounded-3xl p-6 sm:p-7' });
      shell.appendChild(el('div', { class: `h-1.5 w-16 rounded-full bg-gradient-to-r ${a.bar}` }));
      shell.appendChild(el('div', { class: 'mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white/95' }, card.title));

      for (const p of card.paragraphs || []) {
        shell.appendChild(el('p', { class: 'mt-3 text-sm leading-relaxed text-slate-700 dark:text-white/80 sm:text-base' }, p));
      }

      if (card.bullets?.length) {
        const ul = el('ul', { class: 'mt-5 space-y-2' });
        for (const b of card.bullets) {
          ul.appendChild(
            el('li', { class: 'flex gap-3' }, [
              el('span', { class: 'mt-2 h-1.5 w-1.5 flex-none rounded-full bg-slate-900/25 dark:bg-white/40' }),
              el('span', { class: 'text-sm leading-relaxed text-slate-700 dark:text-white/80' }, b)
            ])
          );
        }
        shell.appendChild(ul);
      }

      if (card.links?.length) {
        const links = el('div', { class: 'mt-6 flex flex-wrap gap-2' });
        for (const link of card.links) {
          links.appendChild(
            el(
              'a',
              {
                class:
                  'inline-flex items-center justify-center rounded-full border border-slate-900/15 bg-slate-900/5 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-900/10 dark:border-white/20 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15',
                href: link.href,
                ...(link.new_tab ? { target: '_blank', rel: 'noreferrer' } : {})
              },
              link.label
            )
          );
        }
        shell.appendChild(links);
      }

      shell.appendChild(
        el('div', { class: `mt-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold shadow-ring ${a.chip}` }, 'Ace Data Cloud')
      );
      grid.appendChild(shell);
    });

    wrap.appendChild(grid);
    return wrap;
  }

  function renderPrinciples(data) {
    const wrap = sectionShell(data.guiding_principles.title, 'Principles that shape sequencing and execution.');
    const grid = el('div', { class: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4' });
    for (const item of data.guiding_principles.items || []) {
      grid.appendChild(
        el('div', { class: 'glass rounded-3xl p-6' }, [
          el('div', { class: 'mb-3 text-sm font-semibold text-slate-900 dark:text-white' }, item.title),
          el('p', { class: 'text-sm leading-relaxed text-slate-700 dark:text-white/75' }, item.description)
        ])
      );
    }
    wrap.appendChild(grid);
    return wrap;
  }

  function renderWhatBuilding(data) {
    const wrap = sectionShell(data.what_building.title, 'Products, layers, and how they connect.');
    const shell = el('div', { class: 'glass rounded-3xl p-6 sm:p-8' });

    for (const p of data.what_building.intro_paragraphs || []) {
      shell.appendChild(el('p', { class: 'text-sm leading-relaxed text-slate-700 dark:text-white/80 sm:text-base' }, p));
    }

    const sections = el('div', { class: 'mt-8 grid gap-6 lg:grid-cols-3' });
    for (const sec of data.what_building.sections || []) {
      const card = el('div', { class: 'rounded-3xl bg-slate-900/5 p-6 shadow-ring dark:bg-white/5' });
      card.appendChild(el('div', { class: 'text-sm font-semibold text-slate-900 dark:text-white/95' }, sec.title));
      for (const p of sec.paragraphs || []) {
        card.appendChild(el('p', { class: 'mt-3 text-sm leading-relaxed text-slate-700 dark:text-white/75' }, p));
      }
      if (sec.bullets?.length) {
        const ul = el('ul', { class: 'mt-4 space-y-2' });
        for (const b of sec.bullets) {
          ul.appendChild(
            el('li', { class: 'flex gap-3' }, [
              el('span', { class: 'mt-2 h-1.5 w-1.5 flex-none rounded-full bg-slate-900/25 dark:bg-white/40' }),
              el('span', { class: 'text-sm leading-relaxed text-slate-700 dark:text-white/80' }, b)
            ])
          );
        }
        card.appendChild(ul);
      }
      sections.appendChild(card);
    }

    shell.appendChild(sections);
    wrap.appendChild(shell);
    return wrap;
  }

  function formatIsoDate(value) {
    if (!value) return '';
    const d = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return String(value);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function renderPhases(data) {
    const wrap = sectionShell('2026 Roadmap', 'Quarter-by-quarter delivery with transparent task status.');

    const phases = data.phases || [];

    const quick = el('div', { class: 'mb-6 flex flex-wrap gap-2' });
    for (const p of phases) {
      quick.appendChild(
        el(
          'a',
          {
            class:
              'rounded-full border border-slate-900/15 bg-slate-900/5 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-900/10 dark:border-white/20 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15',
            href: `#${p.id}`
          },
          p.label
        )
      );
    }
    wrap.appendChild(quick);

    const list = el('div', { class: 'space-y-5' });

    phases.forEach((phase) => {
      const stats = phaseStats(phase);
      const pct = stats.donePct;

      const details = el('details', {
        class: 'glass group rounded-3xl',
        id: phase.id,
        open: ''
      });
      details.addEventListener('toggle', () => {
        if (!details.open) return;
        history.replaceState(null, '', `#${phase.id}`);
      });

      const summary = el('summary', {
        class:
          'flex cursor-pointer items-start justify-between gap-4 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ace-blue/60 sm:p-7'
      });

      const left = el('div', { class: 'flex min-w-0 items-start gap-4' });
      const accent = {
        emerald: { bg: 'bg-emerald-500/15', fg: 'text-emerald-700 dark:text-emerald-200' },
        cyan: { bg: 'bg-cyan-500/15', fg: 'text-cyan-700 dark:text-cyan-200' },
        violet: { bg: 'bg-violet-500/15', fg: 'text-violet-700 dark:text-violet-200' },
        blue: { bg: 'bg-sky-500/15', fg: 'text-sky-700 dark:text-sky-200' }
      }[phase.accent] || { bg: 'bg-slate-900/5 dark:bg-white/5', fg: 'text-slate-700 dark:text-white/90' };

      const iconWrap = el('div', {
        class: `mt-0.5 flex h-11 w-11 flex-none items-center justify-center rounded-2xl shadow-ring ${accent.bg}`
      });
      iconWrap.innerHTML = (ICONS[phase.icon] || ICONS.bolt)(`h-6 w-6 ${accent.fg}`);

      const titleWrap = el('div', { class: 'min-w-0' });
      titleWrap.appendChild(el('div', { class: 'text-xs font-semibold tracking-[0.2em] text-slate-600 dark:text-white/75' }, phase.label));
      titleWrap.appendChild(el('h3', { class: 'mt-1 truncate font-display text-lg font-semibold text-slate-900 dark:text-white sm:text-xl' }, `${phase.title}`));
      titleWrap.appendChild(el('p', { class: 'mt-2 text-sm text-slate-600 dark:text-white/70' }, `Focus: ${phase.focus}`));

      left.appendChild(iconWrap);
      left.appendChild(titleWrap);

      const right = el('div', { class: 'flex flex-none items-center gap-4' });
      const progress = el('div', { class: 'hidden text-right sm:block' }, [
        el('div', { class: 'text-sm font-semibold text-slate-800 dark:text-white/90' }, `${percent(pct)} Complete`),
        el('div', { class: 'mt-0.5 text-xs text-slate-600 dark:text-white/75' }, `${stats.done} of ${stats.total} tasks`)
      ]);
      right.appendChild(progress);

      const ring = ringSvg(pct, phase.accent);
      ring.classList.add('flex-none');
      ring.appendChild(
        el('div', { class: 'pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-white/90' }, `${Math.round(pct)}%`)
      );
      right.appendChild(ring);

      const chev = el('div', { class: 'chev ml-1 hidden h-10 w-10 items-center justify-center text-slate-600 transition-transform dark:text-white/70 sm:flex' });
      chev.innerHTML = ICONS.chevron('h-6 w-6');
      right.appendChild(chev);

      summary.appendChild(left);
      summary.appendChild(right);

      const body = el('div', { class: 'border-t border-slate-900/10 px-6 pb-6 pt-6 dark:border-white/10 sm:px-7 sm:pb-7' });
      if (phase.date_range) {
        body.appendChild(el('div', { class: 'mb-5 text-xs font-semibold tracking-[0.18em] text-slate-600 dark:text-white/75' }, phase.date_range));
      }

      const groups = el('div', { class: 'grid gap-6 lg:grid-cols-2' });
      for (const group of phase.groups || []) {
        const card = el('div', { class: 'rounded-3xl bg-slate-900/5 p-6 shadow-ring dark:bg-white/5' });
        card.appendChild(el('div', { class: 'text-sm font-semibold text-slate-800 dark:text-white/90' }, group.title));

        const ul = el('ul', { class: 'mt-4 space-y-3' });
        for (const task of group.items || []) {
          const meta = STATUS[task.status] || STATUS.planned;
          let subline = meta.label;
          if (task.completed_at) subline = `${meta.label} • ${formatIsoDate(task.completed_at)}`;
          else if (task.target_at) subline = `${meta.label} • Target ${formatIsoDate(task.target_at)}`;
          ul.appendChild(
            el('li', { class: 'flex gap-3' }, [
              el('span', { class: `mt-2 h-2 w-2 flex-none rounded-full ${meta.dot}` }),
              el('div', { class: 'min-w-0' }, [
                el('div', { class: 'text-sm leading-relaxed text-slate-700 dark:text-white/85' }, task.title),
                el('div', { class: `mt-1 text-xs ${meta.text}` }, subline)
              ])
            ])
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
    const wrap = sectionShell(data.token_fit.title, 'Mechanisms follow adoption—never the other way around.');
    const card = el('div', { class: 'glass rounded-3xl p-6 sm:p-8' });
    for (const p of data.token_fit.paragraphs || []) {
      card.appendChild(el('p', { class: 'text-sm leading-relaxed text-slate-700 dark:text-white/80 sm:text-base' }, p));
    }
    const ul = el('ul', { class: 'mt-6 grid gap-3 sm:grid-cols-2' });
    for (const b of data.token_fit.bullets || []) {
      ul.appendChild(el('li', { class: 'rounded-2xl bg-slate-900/5 px-4 py-3 text-sm text-slate-700 shadow-ring dark:bg-white/5 dark:text-white/80' }, b));
    }
    card.appendChild(ul);
    wrap.appendChild(card);
    return wrap;
  }

  function renderDailyUpdates(updates) {
    const wrap = sectionShell(updates.title, updates.subtitle);

    const items = (updates.items || [])
      .slice()
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

    const initialVisible = Math.max(1, Math.min(60, Number(updates.initial_visible) || 6));
    const visible = items.slice(0, initialVisible);
    const rest = items.slice(initialVisible);

    const shell = el('div', { class: 'glass rounded-3xl p-6 sm:p-8' });

    const list = el('div', { class: 'space-y-3' });
    const row = (item) =>
      el(
        'a',
        {
          class:
            'block rounded-2xl bg-slate-900/5 px-4 py-4 shadow-ring hover:bg-slate-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ace-blue/60 dark:bg-white/5 dark:hover:bg-white/10',
          href: item.url,
          target: '_blank',
          rel: 'noreferrer'
        },
        [
          el('div', { class: 'flex flex-wrap items-center justify-between gap-3' }, [
            el('div', { class: 'font-semibold text-slate-900 dark:text-white/95' }, item.title),
            el('div', { class: 'text-xs font-semibold text-slate-600 dark:text-white/75' }, formatIsoDate(item.date))
          ]),
          item.summary ? el('div', { class: 'mt-2 text-sm text-slate-700 dark:text-white/75' }, item.summary) : null,
          item.tags?.length
            ? el(
                'div',
                { class: 'mt-3 flex flex-wrap gap-2' },
                item.tags.map((t) =>
                  el('span', { class: 'rounded-full border border-slate-900/10 bg-slate-900/5 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-white/70' }, t)
                )
              )
            : null
        ]
      );

    visible.forEach((i) => list.appendChild(row(i)));
    shell.appendChild(list);

    if (rest.length) {
      const more = el('details', { class: 'mt-5 rounded-2xl bg-slate-900/5 p-4 shadow-ring dark:bg-white/5' });
      more.appendChild(
        el('summary', { class: 'cursor-pointer select-none text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-white/85 dark:hover:text-white' }, [
          `Show ${rest.length} more updates`,
          el('span', { class: 'ml-2 text-xs text-slate-600 dark:text-white/75' }, '(expand)')
        ])
      );
      const restWrap = el('div', { class: 'mt-4 space-y-3' });
      rest.forEach((i) => restWrap.appendChild(row(i)));
      more.appendChild(restWrap);
      shell.appendChild(more);
    }

    wrap.appendChild(shell);
    return wrap;
  }

  function renderClosing(data) {
    const wrap = sectionShell(data.closing.title, null);
    const card = el('div', { class: 'glass rounded-3xl p-6 sm:p-8' });
    for (const p of data.closing.paragraphs || []) {
      card.appendChild(el('p', { class: 'text-sm leading-relaxed text-slate-700 dark:text-white/80 sm:text-base' }, p));
    }

    const ul = el('ul', { class: 'mt-6 grid gap-3 sm:grid-cols-2' });
    for (const b of data.closing.bullets || []) {
      ul.appendChild(el('li', { class: 'rounded-2xl bg-slate-900/5 px-4 py-3 text-sm text-slate-700 shadow-ring dark:bg-white/5 dark:text-white/80' }, b));
    }
    card.appendChild(ul);
    card.appendChild(
      el('div', { class: 'mt-8 rounded-3xl bg-gradient-to-r from-ace-emerald/15 via-white/20 to-ace-blue/15 p-6 text-center shadow-ring dark:via-white/5' }, [
        el('div', { class: 'font-display text-lg font-semibold text-slate-900 dark:text-white sm:text-xl' }, data.closing.final_line),
        el('div', { class: 'mt-2 text-sm text-slate-600 dark:text-white/75' }, 'Every milestone is dated. Every claim is backed by something you can verify — docs, code, or production usage.')
      ])
    );
    wrap.appendChild(card);
    return wrap;
  }

  function renderFooter(data) {
    const footer = el('footer', { class: 'mt-16 border-t border-slate-900/10 bg-white/70 dark:border-white/10 dark:bg-slate-950/60' });
    const inner = el('div', { class: 'mx-auto max-w-6xl px-4 py-14 sm:px-6' });

    const top = el('div', { class: 'grid gap-10 lg:grid-cols-3' });

    const brand = el('div', { class: 'min-w-0' }, [
      el('div', { class: 'flex items-center gap-3' }, [
        el('img', { src: './assets/logo.png', alt: 'Ace Data Cloud', class: 'h-8 w-auto dark:hidden' }),
        el('img', { src: './assets/logo2.png', alt: 'Ace Data Cloud', class: 'hidden h-8 w-auto dark:block' })
      ]),
      el('div', { class: 'mt-6 text-sm font-semibold text-slate-800 dark:text-white/90' }, data.footer.brand.title)
    ]);

    const lines = el('div', { class: 'mt-4 space-y-3 text-sm text-slate-600 dark:text-white/75' });
    for (const line of data.footer.brand.lines || []) {
      const content = line.href
        ? el('a', { class: 'hover:text-slate-900 dark:hover:text-white', href: line.href, ...(line.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {}) }, line.text)
        : el('span', {}, line.text);
      lines.appendChild(
        el('div', { class: 'flex gap-3' }, [el('span', { class: 'mt-0.5 h-2 w-2 flex-none rounded-full bg-slate-900/20 dark:bg-white/35' }), content])
      );
    }
    brand.appendChild(lines);

    const cols = el('div', { class: 'grid gap-10 sm:grid-cols-2 lg:col-span-2' });
    for (const col of data.footer.columns || []) {
      const colEl = el('div', {}, [
        el('div', { class: 'text-sm font-semibold text-slate-800 dark:text-white/90' }, col.title),
        el('div', { class: 'mt-4 space-y-3 text-sm' })
      ]);
      const list = colEl.querySelector('div.mt-4');
      for (const link of col.links || []) {
        list.appendChild(
          el(
            'a',
            { class: 'block text-slate-600 hover:text-slate-900 dark:text-white/75 dark:hover:text-white', href: link.href, ...(link.new_tab ? { target: '_blank', rel: 'noreferrer' } : {}) },
            link.label
          )
        );
      }
      cols.appendChild(colEl);
    }

    top.appendChild(brand);
    top.appendChild(cols);

    const year = new Date().getFullYear();
    const bottom = el('div', { class: 'mt-12 border-t border-slate-900/10 pt-8 text-center text-sm text-slate-600 dark:border-white/10 dark:text-white/75' }, [
      el('div', {}, data.footer.bottom.copyright_text.replace('{year}', String(year))),
      el('a', { class: 'mt-2 inline-block hover:text-slate-900 dark:hover:text-white', href: data.footer.bottom.secondary_href, target: '_blank', rel: 'noreferrer' }, data.footer.bottom.secondary_text)
    ]);

    inner.appendChild(top);
    inner.appendChild(bottom);
    footer.appendChild(inner);
    return footer;
  }

  function openFromHash() {
    const id = (location.hash || '').replace('#', '');
    if (!id) return;
    const node = document.getElementById(id);
    if (node?.tagName?.toLowerCase?.() === 'details') node.open = true;
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function main() {
    const app = document.getElementById('app');
    if (!app) return;

    let data;
    let dailyUpdates;
    try {
      const res = await fetch('./config/roadmap.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load config/roadmap.json (${res.status})`);
      data = await res.json();
    } catch (_err) {
      app.appendChild(
        el('div', { class: 'mx-auto max-w-3xl px-4 py-16 text-center sm:px-6' }, [
          el('div', { class: 'glass rounded-3xl p-8' }, [
            el('h1', { class: 'font-display text-xl font-semibold text-slate-900 dark:text-white' }, 'Could not load config/roadmap.json'),
            el('p', { class: 'mt-3 text-sm leading-relaxed text-slate-600 dark:text-white/75' }, 'If you opened this page via file://, browsers block JSON fetch. Serve the folder with a local web server, e.g. `python3 -m http.server` from the Roadmap directory.')
          ])
        ])
      );
      return;
    }

    try {
      if (data?.daily_updates?.source) {
        const dr = await fetch(String(data.daily_updates.source), { cache: 'no-store' });
        if (dr.ok) dailyUpdates = await dr.json();
      }
    } catch (_err) {
      dailyUpdates = undefined;
    }

    document.title = safeText(data.site.page_title || document.title);

    app.appendChild(renderHeader(data));

    const hero = renderHero(data);
    app.appendChild(hero);
    startHeroCanvas(hero.querySelector('#hero-canvas'));

    app.appendChild(renderOverview(data));
    app.appendChild(renderIntro(data));
    app.appendChild(renderPrinciples(data));
    app.appendChild(renderWhatBuilding(data));
    app.appendChild(renderPhases(data));
    app.appendChild(renderTokenFit(data));
    if (dailyUpdates) app.appendChild(renderDailyUpdates(dailyUpdates));
    app.appendChild(renderClosing(data));
    app.appendChild(renderFooter(data));

    updateThemeToggleButtons();
    requestAnimationFrame(openFromHash);
    window.addEventListener('hashchange', openFromHash);
  }

  document.addEventListener('ace:themechange', () => {
    updateThemeToggleButtons();
  });

  main();
})();
