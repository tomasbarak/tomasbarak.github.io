// =============================================
// FRUTIGER AERO — Interactive polish layer
// =============================================

// ——— Scroll progress bar ———
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
}, { passive: true });

// ——— Parallax background orbs on scroll ———
(function () {
    const orbs = document.querySelectorAll('.atmo-orb');
    if (!orbs.length) return;

    const speeds = [0.03, -0.02, 0.015, -0.025, 0.02];

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            orbs.forEach((orb, i) => {
                const speed = speeds[i] || 0.02;
                orb.style.transform = `translateY(${scrollY * speed}px)` +
                    (i === 2 ? ` translateX(-50%)` : '');
            });
            ticking = false;
        });
    }, { passive: true });
})();

// ——— Cursor glow ———
(function () {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let active = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!active) {
            active = true;
            glow.classList.add('active');
            requestAnimationFrame(animate);
        }
    });

    document.addEventListener('mouseleave', () => {
        active = false;
        glow.classList.remove('active');
    });

    function animate() {
        if (!active) return;
        // Smooth follow with easing
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animate);
    }
})();

// ——— Interactive card glow (cursor-following light) ———
(function () {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('[data-glow]');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--glow-x', x + 'px');
            card.style.setProperty('--glow-y', y + 'px');
        });
    });
})();

// ——— Scroll reveal ———
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.section-divider').forEach(d => d.classList.add('visible'));
} else {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => {
        // Stagger cards within their grid
        if (el.classList.contains('glass-card') || el.closest('.cards-grid')) {
            const parent = el.closest('.cards-grid') || el.parentElement;
            const siblings = Array.from(parent.children).filter(c =>
                c.classList.contains('reveal') || c.classList.contains('glass-card')
            );
            const index = siblings.indexOf(el);
            if (index > 0) {
                el.style.transitionDelay = `${index * 0.1}s`;
            }
        }
        revealObserver.observe(el);
    });

    // Divider reveal
    const dividerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                dividerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });

    document.querySelectorAll('.section-divider').forEach(d => dividerObserver.observe(d));
}

// ——— Active nav link on scroll ———
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, {
    threshold: 0.25,
    rootMargin: '-80px 0px -30% 0px'
});

sections.forEach(section => navObserver.observe(section));

// ——— Mobile menu ———
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

const toggleMobileMenu = (open) => {
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
};

hamburger.addEventListener('click', () => {
    toggleMobileMenu(!mobileMenu.classList.contains('open'));
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
    }
});

// ——— Interactive Terminal ———
(function () {
    const outputEl = document.getElementById('terminal-output');
    const inputEl = document.getElementById('terminal-input');
    const windowEl = document.getElementById('terminal-window');

    if (!outputEl || !inputEl) return;

    const cmdHistory = [];
    let histIdx = -1;

    function makeLine(text, cls) {
        const el = document.createElement('span');
        el.className = 'terminal-line ' + cls;
        el.textContent = text;
        return el;
    }

    function makeGap() {
        const el = document.createElement('span');
        el.className = 'terminal-gap';
        return el;
    }

    function makeLinkLine(prefix, href, linkText) {
        const el = document.createElement('span');
        el.className = 'terminal-line t-out';
        if (prefix) el.appendChild(document.createTextNode(prefix));
        const a = document.createElement('a');
        a.href = href;
        if (!href.startsWith('mailto')) {
            a.target = '_blank';
            a.rel = 'noopener';
        }
        a.textContent = linkText;
        el.appendChild(a);
        return el;
    }

    const COMMANDS = {
        help() {
            return [
                makeLine('Available commands:', 't-strong'),
                makeLine('  whoami      — about me', 't-out'),
                makeLine('  projects    — selected work', 't-out'),
                makeLine('  skills      — technical stack', 't-out'),
                makeLine('  contact     — get in touch', 't-out'),
                makeLine('  clear       — clear terminal', 't-out'),
            ];
        },
        whoami() {
            return [
                makeLine('Tomás Barak', 't-strong'),
                makeLine('AI Engineer & Software Developer', 't-out'),
                makeLine('Buenos Aires, Argentina', 't-out'),
            ];
        },
        projects() {
            const data = [
                ['FacuamigoAR',          'https://facuamigo.ar',              'facuamigo.ar'],
                ['Macgyver Shop',         'https://shop.macgyver.com.ar',      'shop.macgyver.com.ar'],
                ['Perfect Product Pics',  'https://perfectproductpics.com',    'perfectproductpics.com'],
                ['Polifaces',             null,                                null],
            ];
            const nodes = [makeLine('Selected Work', 't-strong')];
            data.forEach(([name, href, label], i) => {
                const num = String(i + 1).padStart(2, '0');
                const prefix = '  ' + num + '  ' + name.padEnd(24);
                if (href) {
                    nodes.push(makeLinkLine(prefix, href, label));
                } else {
                    nodes.push(makeLine(prefix, 't-out'));
                }
            });
            return nodes;
        },
        skills() {
            return [
                makeLine('Technical Stack', 't-strong'),
                makeLine('  Python · TypeScript · NodeJS · Apache Kafka', 't-out'),
                makeLine('  GCP / Vertex AI · Nuxt.js · PostgreSQL · MongoDB · Redis', 't-out'),
            ];
        },
        contact() {
            return [
                makeLine('Get In Touch', 't-strong'),
                makeLinkLine('  ', 'mailto:hola@tomasbarak.com', 'hola@tomasbarak.com'),
                makeLinkLine('  ', 'https://github.com/tomasbarak', 'github.com/tomasbarak'),
            ];
        },
        ls() {
            return [makeLine('experience/   work/   skills/   terminal/   contact/', 't-out')];
        },
        sudo() {
            return [makeLine('Permission denied.', 't-err')];
        },
        cat() {
            return [
                makeLine('Building intelligent systems and digital products', 't-out'),
                makeLine('with clean code and thoughtful design.', 't-out'),
            ];
        },
    };

    function run(raw) {
        const trimmed = raw.trim();
        outputEl.appendChild(makeLine(trimmed, 't-cmd'));

        if (!trimmed) { scroll(); return; }

        const lower = trimmed.toLowerCase();

        if (lower === 'clear') {
            outputEl.innerHTML = '';
            return;
        }

        const spaceIdx = trimmed.indexOf(' ');
        const cmd = lower.split(' ')[0];
        let nodes = [];

        if (cmd === 'echo') {
            const rest = spaceIdx !== -1 ? trimmed.slice(spaceIdx + 1) : '';
            nodes = [makeLine(rest, 't-out')];
        } else if (COMMANDS[cmd]) {
            nodes = COMMANDS[cmd]();
        } else {
            nodes = [makeLine('command not found: ' + cmd + '  (try help)', 't-err')];
        }

        nodes.forEach(n => outputEl.appendChild(n));
        outputEl.appendChild(makeGap());
        scroll();
    }

    function scroll() {
        outputEl.scrollTop = outputEl.scrollHeight;
    }

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = inputEl.value;
            run(val);
            if (val.trim()) {
                cmdHistory.unshift(val.trim());
                histIdx = -1;
            }
            inputEl.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (histIdx < cmdHistory.length - 1) {
                histIdx++;
                inputEl.value = cmdHistory[histIdx];
                setTimeout(() => inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length), 0);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx > 0) {
                histIdx--;
                inputEl.value = cmdHistory[histIdx];
            } else if (histIdx === 0) {
                histIdx = -1;
                inputEl.value = '';
            }
        }
    });

    if (windowEl) {
        windowEl.addEventListener('click', () => inputEl.focus());
    }
})();
