// ——— Theme toggle ———
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

const setTheme = (theme) => {
    if (theme === 'light') {
        html.setAttribute('data-theme', 'light');
    } else {
        html.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
};

themeToggle.addEventListener('click', () => {
    const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Initialize from localStorage or system preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

// ——— Scroll progress bar ———
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
}, { passive: true });

// ——— Scroll reveal ———
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('hr').forEach(hr => hr.classList.add('visible'));
} else {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Stagger list items within each section
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.classList.contains('entry')) {
            const siblings = Array.from(el.parentElement.children)
                .filter(c => c.classList.contains('entry'));
            const index = siblings.indexOf(el);
            el.style.transitionDelay = `${index * 0.08}s`;
        }
        revealObserver.observe(el);
    });

    // ——— HR draw-in animation ———
    const dividerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                dividerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });

    document.querySelectorAll('hr').forEach(hr => dividerObserver.observe(hr));
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
    threshold: 0.3,
    rootMargin: '-60px 0px -30% 0px'
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
