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
    if (el.classList.contains('experience') || el.classList.contains('project')) {
        const siblings = Array.from(el.parentElement.children)
            .filter(c => c.classList.contains('experience') || c.classList.contains('project'));
        const index = siblings.indexOf(el);
        el.style.transitionDelay = `${index * 0.08}s`;
    }
    revealObserver.observe(el);
});

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
