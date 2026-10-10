/* ============================================================
   trazo — el recorrido · v.03
   Interacción: GSAP ScrollTrigger · canvas · micro-UIs
   ============================================================ */

(() => {
    "use strict";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    if (reduceMotion) html.classList.add("reduce");

    const STATION_LABELS = [
        "estación 00 / inicio",
        "estación 01 / quién soy",
        "estación 02 / el recorrido",
        "estación 03 / kata",
        "estación 04 / miso",
        "estación 05 / trazo",
        "estación 06 / mercium",
        "estación 07 / sysdash",
        "estación 08 / vellum",
        "estación 09 / cierre",
    ];

    const stations = Array.from(document.querySelectorAll(".station"));
    const railDots = Array.from(document.querySelectorAll(".rail-dot"));
    const railFill = document.getElementById("railFill");
    const barStation = document.getElementById("barStation");

    /* Eliminar el estado oculto de .reveal antes de cualquier animación si no hay GSAP */
    const gsapAvailable = typeof window.gsap !== "undefined";

    /* --------------------------------------------------------
       ARRANQUE / FIRMA
       -------------------------------------------------------- */
    const boot = document.getElementById("boot");
    const bootStroke = boot.querySelector(".boot-stroke path");
    const closeBoot = () => {
        if (boot.dataset.done) return;
        boot.dataset.done = "1";
        document.body.style.overflow = "";
        if (reduceMotion || !gsapAvailable) {
            boot.style.display = "none";
        } else {
            gsap.to(boot, {
                autoAlpha: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => (boot.style.display = "none"),
            });
        }
        heroIntro();
        initRailTriggers();
        realignMapIfSection(3);
    };

    if (reduceMotion || !gsapAvailable) {
        if (!gsapAvailable) html.classList.add("no-gsap");
        /* sin animación: overlay desaparece de inmediato */
        boot.style.display = "none";
        heroIntro();
        initRailTriggers();
    } else {
        html.classList.add("js");
        document.body.style.overflow = "hidden"; // bloqueo durante la firma
        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo(bootStroke, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" })
            .fromTo(
                ".boot-name",
                { opacity: 0, scale: 0.98 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
                0.1
            )
            .fromTo(
                ".boot-tag",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
                0.55
            )
            .add(() => closeBoot(), 1.35);

        boot.addEventListener("pointerdown", closeBoot, { once: true });
    }

    /* --------------------------------------------------------
       HERO INTRO (después de la firma)
       -------------------------------------------------------- */
    function heroIntro() {
        if (reduceMotion || !gsapAvailable) return;
        const hero = document.getElementById("st-0");
        const lines = hero.querySelectorAll(".hero-line");
        const extras = hero.querySelectorAll(".kicker, .hero-sub, .hero-cta");

        const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: hero, start: "top top" },
        });
        lines.forEach((line, i) => {
            tl.fromTo(
                line,
                { clipPath: "inset(0 0 100% 0)", y: 34, opacity: 0 },
                { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1, duration: 0.85 },
                i === 0 ? 0.1 : "<0.06"
            );
        });
        extras.forEach((el, i) => {
            tl.fromTo(
                el,
                { opacity: 0, y: 22 },
                { opacity: 1, y: 0, duration: 0.7 },
                i === 0 ? "-=0.5" : "<0.08"
            );
        });
    }

    /* --------------------------------------------------------
       REVEALS GENERALES (una vez por estación)
       -------------------------------------------------------- */
    function initReveals() {
        if (reduceMotion || !gsapAvailable) return;
        const items = document.querySelectorAll(".reveal");
        items.forEach((el) => {
            /* el hero ya tiene su propia coreografía de entrada */
            if (el.closest("#st-0")) return;
            gsap.fromTo(
                el,
                { opacity: 0, y: 24 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 88%",
                        once: true,
                    },
                }
            );
        });
    }

    /* --------------------------------------------------------
       MAPA — el trazo se dibuja como ruta
       -------------------------------------------------------- */
    function initMapDraw() {
        if (reduceMotion || !gsapAvailable) {
            const p = document.getElementById("mapPath");
            if (p) p.style.strokeDashoffset = "0";
            return;
        }
        const mapPath = document.getElementById("mapPath");
        if (!mapPath) return;
        const map = document.getElementById("st-2");
        gsap.fromTo(
            mapPath,
            { strokeDashoffset: 1 },
            {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: map,
                    start: "top 75%",
                    end: "bottom 65%",
                    scrub: 0.6,
                },
            }
        );
    }

    /* --------------------------------------------------------
       PARALLAX DE FONDO — las auroras derivan despacio mientras
       la disolución (mask) funde el paso entre estaciones
       -------------------------------------------------------- */
    function initStationParallax() {
        if (reduceMotion || !gsapAvailable) return;
        stations.forEach((s) => {
            const bg = s.querySelector(".station-bg");
            if (!bg) return;
            gsap.fromTo(
                bg,
                { yPercent: -3.5 },
                {
                    yPercent: 3.5,
                    ease: "none",
                    scrollTrigger: {
                        trigger: s,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.5,
                    },
                }
            );
        });
    }

    /* Si llegamos a una estación con teclado/rail antes de iniciar su reveal,
       refrescamos trggers de mapa ya cubiertos */
    function realignMapIfSection(min) {
        if (min < 2) return;
        if (gsapAvailable) ScrollTrigger.refresh();
    }

    /* --------------------------------------------------------
       RAIL — progreso (GSAP) + estación activa (IntersectionObserver)
       -------------------------------------------------------- */
    function initRailTriggers() {
        const activeFromProgress = (i) => {
            railDots.forEach((d, di) => d.classList.toggle("is-active", di === i));
            if (barStation) barStation.textContent = STATION_LABELS[i] || "";
            html.dataset.station = String(i);
        };

        if (!gsapAvailable || reduceMotion) {
            /* sin GSAP: estado según scroll normal */
            const onScroll = () => {
                let cur = 0;
                stations.forEach((s, i) => {
                    const r = s.getBoundingClientRect();
                    if (r.top <= window.innerHeight * 0.55) cur = i;
                });
                activeFromProgress(cur);
                const max = document.documentElement.scrollHeight - window.innerHeight;
                if (railFill) railFill.style.height = `${(window.scrollY / max) * 100}%`;
            };
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll();
            return;
        }

        /* progreso del trazo completo */
        ScrollTrigger.create({
            trigger: document.body,
            start: 0,
            end: "max",
            onUpdate: (self) => {
                if (railFill) railFill.style.height = `${self.progress * 100}%`;
            },
        });

        /* estación activa por franja central — ajeno a medidas de GSAP */
        const probe = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeFromProgress(Number(entry.target.dataset.station));
                    }
                });
            },
            { root: null, rootMargin: "-42% 0px -42% 0px", threshold: 0 }
        );
        stations.forEach((s) => probe.observe(s));
        activeFromProgress(0);

        ScrollTrigger.refresh();
    }

    /* --------------------------------------------------------
       SYSDASH — canvas en vivo (solo cuando se ve)
       -------------------------------------------------------- */
    const sysdash = (() => {
        const chartIDs = ["chartCpu", "chartRam", "chartDisk", "chartNet"];
        const charts = chartIDs.map((id) => document.getElementById(id)).filter(Boolean);
        if (!charts.length) return { start() {}, stop() {} };

        const cfg = {
            chartCpu: { min: 12, max: 92, speed: 0.55, color: "166,242,189" },
            chartRam: { min: 35, max: 78, speed: 0.32, color: "185,220,211" },
            chartDisk: { min: 30, max: 68, speed: 0.16, color: "166,242,189" },
            chartNet: { min: 0, max: 100, speed: 1.15, color: "255,118,95" },
        };

        const series = {};
        let raf = null;
        let last = 0;

        const setup = (canvas) => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = canvas.clientWidth || 340;
            const h = canvas.clientHeight || 90;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
            if (!series[canvas.id]) {
                const c = cfg[canvas.id];
                const base = (c.min + c.max) / 2;
                series[canvas.id] = Array.from({ length: 44 }, () => base + (Math.random() - 0.5) * (c.max - c.min) * 0.3);
            }
        };

        const tick = (t) => {
            if (!raf) return;
            if (t - last > 90) {
                last = t;
                charts.forEach((canvas) => {
                    const c = cfg[canvas.id];
                    const s = series[canvas.id];
                    const v = s[s.length - 1];
                    const drift = v + (Math.random() - 0.5) * c.speed * (c.max - c.min) * 0.35;
                    const next = Math.max(c.min, Math.min(c.max, drift));
                    s.push(next);
                    s.shift();
                    draw(canvas, s, c.color);
                });
            }
            raf = requestAnimationFrame(tick);
        };

        const draw = (canvas, data, rgb) => {
            const ctx = canvas.getContext("2d");
            const w = canvas.clientWidth || 340;
            const h = canvas.clientHeight || 90;
            ctx.clearRect(0, 0, w, h);
            const min = Math.min(...data);
            const max = Math.max(...data);
            const span = max - min || 1;
            ctx.beginPath();
            data.forEach((val, i) => {
                const x = (i / (data.length - 1)) * w;
                const y = h - ((val - min) / span) * (h - 14) - 7;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            });
            ctx.lineWidth = 1.6;
            ctx.strokeStyle = `rgba(${rgb},0.9)`;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.stroke();

            /* relleno inferior degradado */
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.fillStyle = `rgba(${rgb},0.06)`;
            ctx.fill();
        };

        return {
            start() {
                if (raf) return;
                charts.forEach(setup);
                raf = requestAnimationFrame(tick);
            },
            stop() {
                if (raf) cancelAnimationFrame(raf);
                raf = null;
            },
            drawOnce() {
                charts.forEach((canvas) => {
                    setup(canvas);
                    draw(canvas, series[canvas.id], cfg[canvas.id].color);
                });
            },
        };
    })();

    function initSysdash() {
        const station = document.getElementById("st-7");
        if (!station) return;
        if (reduceMotion) {
            sysdash.drawOnce();
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) sysdash.start();
                    else sysdash.stop();
                });
            },
            { threshold: 0.12 }
        );
        io.observe(station);
    }

    /* --------------------------------------------------------
       KATA — pestañas con capturas reales
       -------------------------------------------------------- */
    function initKata() {
        const img = document.getElementById("kataShot");
        const tabs = Array.from(document.querySelectorAll(".kata-tab"));
        const urlEl = document.querySelector(".kata-url");
        if (!img || !tabs.length) return;

        const URLS = {
            "kata-home.webp": "kata.app/espacios",
            "kata-search.webp": "kata.app/búsqueda",
            "kata-youtube.webp": "kata.app/reproducción",
        };

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
                const src = tab.dataset.kata;
                img.classList.add("swap");
                const swap = () => {
                    img.src = `assets/kata/${src}`;
                    if (urlEl) urlEl.textContent = URLS[src] || "";
                };
                if (reduceMotion) {
                    swap();
                    img.classList.remove("swap");
                    return;
                }
                window.setTimeout(() => {
                    swap();
                    img.onload = () => img.classList.remove("swap");
                    /* fallback si ya estaba en caché */
                    if (img.complete) img.classList.remove("swap");
                }, 220);
            });
        });
    }

    /* --------------------------------------------------------
       MISO — buscador federado simulado (funcional)
       -------------------------------------------------------- */
    function initMiso() {
        const input = document.getElementById("misoInput");
        const suggest = document.getElementById("misoSuggest");
        const grid = document.getElementById("misoGrid");
        if (!input || !grid) return;

        const LIBRARY = [
            { t: "El viaje de chihiro", s: "stream 01" },
            { t: "Parasite", s: "stream 02" },
            { t: "Dune: parte dos", s: "stream 03" },
            { t: "Interestelar", s: "+2 fuentes" },
            { t: "Spider-Man: A través del Spider-Verso", s: "stream 02" },
            { t: "La La Land", s: "stream 01" },
            { t: "Oppenheimer", s: "stream 03" },
            { t: "El laberinto del fauno", s: "+2 fuentes" },
        ];

        let marked = 0;

        const card = (item) => {
            const d = document.createElement("div");
            d.className = "miso-card";
            const thumb = document.createElement("span");
            thumb.className = "miso-thumb";
            thumb.setAttribute("aria-hidden", "true");
            const b = document.createElement("b");
            b.textContent = item.t;
            const small = document.createElement("small");
            small.className = "mono";
            small.textContent = item.s;
            d.append(thumb, b, small);
            return d;
        };

        const renderGrid = (items) => {
            grid.replaceChildren(...items.map(card));
            if (gsapAvailable && !reduceMotion) {
                gsap.from(grid.querySelectorAll(".miso-card"), {
                    opacity: 0,
                    y: 10,
                    duration: 0.35,
                    ease: "power2.out",
                    stagger: 0.05,
                    overwrite: "auto",
                });
            }
        };

        /* conmutador: demo interactiva / captura real */
        const shot = document.getElementById("misoShot");
        const demo = document.querySelector(".miso-body");
        const tabs = document.querySelectorAll(".miso-tab");
        if (shot && demo && tabs.length) {
            shot.addEventListener("load", () => ScrollTrigger.refresh());
            tabs.forEach((tab) => {
                tab.addEventListener("click", () => {
                    const view = tab.dataset.miso;
                    tabs.forEach((t) => {
                        const active = t === tab;
                        t.classList.toggle("is-active", active);
                        t.setAttribute("aria-selected", active ? "true" : "false");
                    });
                    demo.classList.toggle("is-hidden", view !== "demo");
                    shot.classList.toggle("is-visible", view === "shot");
                    ScrollTrigger.refresh();
                });
            });
        }

        const renderSuggest = (items) => {
            suggest.replaceChildren();
            if (!items.length) {
                const empty = document.createElement("li");
                empty.textContent = "sin resultados — inténtalo de nuevo";
                empty.style.color = "var(--muted)";
                suggest.append(empty);
            } else {
                items.forEach((item, i) => {
                    const li = document.createElement("li");
                    li.id = `mis-opt-${i}`;
                    li.setAttribute("role", "option");
                    li.innerHTML = `<b>${item.t}</b> <span>· ${item.s}</span>`;
                    li.dataset.title = item.t;
                    li.addEventListener("mouseenter", () => setMarked(i));
                    li.addEventListener("mousedown", (e) => {
                        e.preventDefault();
                        choose(item);
                    });
                    suggest.append(li);
                });
            }
            setMarked(0);
            input.setAttribute("aria-expanded", "true");
            suggest.classList.add("is-open");
        };

        const setMarked = (i) => {
            marked = i;
            Array.from(suggest.children).forEach((li, liI) => {
                const active = liI === i;
                li.classList.toggle("is-marked", active);
                if (li.id) li.setAttribute("aria-selected", active ? "true" : "false");
            });
            const activeLi = suggest.children[marked];
            if (activeLi && activeLi.id) input.setAttribute("aria-activedescendant", activeLi.id);
        };

        const choose = (item) => {
            input.value = item.t;
            suggest.classList.remove("is-open");
            input.setAttribute("aria-expanded", "false");
            renderGrid([item, ...LIBRARY.filter((x) => x.t !== item.t).slice(0, 3)]);
        };

        input.addEventListener("input", () => {
            const q = input.value.trim().toLowerCase();
            if (!q) {
                suggest.classList.remove("is-open");
                input.setAttribute("aria-expanded", "false");
                renderGrid(LIBRARY);
                return;
            }
            const hits = LIBRARY.filter((x) => x.t.toLowerCase().includes(q));
            renderSuggest(hits.slice(0, 5));
        });

        input.addEventListener("keydown", (e) => {
            const open = suggest.classList.contains("is-open");
            if (e.key === "ArrowDown" && open) {
                e.preventDefault();
                setMarked(Math.min(marked + 1, suggest.children.length - 1));
            } else if (e.key === "ArrowUp" && open) {
                e.preventDefault();
                setMarked(Math.max(marked - 1, 0));
            } else if (e.key === "Enter") {
                e.preventDefault();
                const li = suggest.children[marked];
                const title = li?.dataset?.title;
                const item = LIBRARY.find((x) => x.t === title);
                if (item) choose(item);
                else suggest.classList.remove("is-open");
            } else if (e.key === "Escape") {
                suggest.classList.remove("is-open");
                input.setAttribute("aria-expanded", "false");
            }
        });

        document.addEventListener("pointerdown", (e) => {
            if (!e.target.closest(".miso-body")) suggest.classList.remove("is-open");
        });
    }

    /* --------------------------------------------------------
       RESPLANDOR — un trazo de luz que sigue al cursor
       -------------------------------------------------------- */
    function initCursorGlow() {
        const glow = document.querySelector(".cursor-glow");
        if (!glow) return;
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        if (reduceMotion) return;

        let tx = window.innerWidth / 2;
        let ty = window.innerHeight / 2;
        let x = tx;
        let y = ty;
        let on = false;
        let currentStation = null;

        const loop = () => {
            x += (tx - x) * 0.14;
            y += (ty - y) * 0.14;
            glow.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
            requestAnimationFrame(loop);
        };

        window.addEventListener(
            "pointermove",
            (e) => {
                tx = e.clientX;
                ty = e.clientY;
                if (!on) {
                    on = true;
                    glow.classList.add("is-on");
                }
                const st = e.target && e.target.closest ? e.target.closest(".station") : null;
                if (st && st !== currentStation) {
                    currentStation = st;
                    const c = getComputedStyle(st).getPropertyValue("--glow").trim();
                    if (c) glow.style.setProperty("--glow", c);
                }
            },
            { passive: true }
        );

        document.addEventListener("mouseleave", () => glow.classList.remove("is-on"));
        document.addEventListener("mouseenter", () => glow.classList.add("is-on"));

        requestAnimationFrame(loop);
    }

    /* --------------------------------------------------------
       SALTOS (rail, CTAs) — animados salvo reduce/render
       -------------------------------------------------------- */
    function initJumps() {
        document.addEventListener("click", (e) => {
            const trigger = e.target.closest("[data-jump]");
            if (!trigger) return;
            e.preventDefault();
            const i = Number(trigger.dataset.jump);
            const target = stations[i] || document.getElementById("st-0");
            goTo(target);
        });
    }

    function goTo(target) {
        if (gsapAvailable && !reduceMotion) {
            gsap.to(window, {
                scrollTo: { y: target, autoKill: false },
                duration: 0.9,
                ease: "power3.inOut",
            });
        } else {
            target.scrollIntoView();
        }
    }

    /* --------------------------------------------------------
       TECLADO — navegar entre estaciones
       -------------------------------------------------------- */
    function initKeyboard() {
        document.addEventListener("keydown", (e) => {
            const tag = (document.activeElement && document.activeElement.tagName) || "";
            if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
            const cur = Number(html.dataset.station || 0);
            if (e.key === "ArrowDown" && cur < stations.length - 1) {
                e.preventDefault();
                goTo(stations[cur + 1]);
            } else if (e.key === "ArrowUp" && cur > 0) {
                e.preventDefault();
                goTo(stations[cur - 1]);
            } else if (e.key === "Home") {
                e.preventDefault();
                goTo(stations[0]);
            } else if (e.key === "End") {
                e.preventDefault();
                goTo(stations[stations.length - 1]);
            }
        });
    }

    /* --------------------------------------------------------
       INICIALIZACIÓN
       -------------------------------------------------------- */
    if (gsapAvailable) {
        gsap.registerPlugin(ScrollTrigger);
        if (!reduceMotion) {
            initReveals();
            initMapDraw();
            initStationParallax();
        }
    }
    initSysdash();
    initKata();
    initMiso();
    initCursorGlow();
    initJumps();
    initKeyboard();

    /* redibujar cuando las imágenes lazy cambian la altura del layout */
    if (gsapAvailable) {
        let refreshTimer = null;
        const refreshSoon = () => {
            if (refreshTimer) return;
            refreshTimer = window.setTimeout(() => {
                refreshTimer = null;
                ScrollTrigger.refresh();
            }, 120);
        };
        document.querySelectorAll(".win-frame img, .portrait-frame img").forEach((img) => {
            if (img.complete) return;
            img.addEventListener("load", refreshSoon);
        });

        window.addEventListener("load", () => {
            ScrollTrigger.refresh();
        });
    }
})();