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
