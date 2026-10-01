const email = 'georgesyouhannna@hotmail.com';
const menuToggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('#main-nav');

if (menuToggle && nav) {
    const desktop = window.matchMedia('(min-width: 768px)');
    const setMenu = (open) => {
        menuToggle.setAttribute('aria-expanded', String(open));
        nav.hidden = !desktop.matches && !open;
    };
    menuToggle.hidden = false;
    setMenu(false);
    menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            menuToggle.focus();
        }
    });
    desktop.addEventListener('change', () => setMenu(false));
}

document.querySelectorAll('[data-year]').forEach((element) => { element.textContent = new Date().getFullYear(); });

if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('main > section[id]');
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            document.querySelectorAll('.nav-link').forEach((link) => {
                if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        }
    }, { rootMargin: '-15% 0px -60% 0px' });
    sections.forEach((section) => observer.observe(section));
}

const filters = document.querySelector('#project-filters');
if (filters) {
    filters.hidden = false;
    filters.addEventListener('click', (event) => {
        const button = event.target.closest('[data-filter]');
        if (!button) return;
        const category = button.dataset.filter;
        let count = 0;
        filters.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        document.querySelectorAll('[data-category]').forEach((card) => {
            card.hidden = category !== 'all' && card.dataset.category !== category;
            if (!card.hidden) count += 1;
        });
        document.querySelector('#filter-status').textContent = `${count} project${count === 1 ? '' : 's'} shown.`;
    });
}

const copyButton = document.querySelector('#copy-email');
if (copyButton && navigator.clipboard) {
    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
        const status = document.querySelector('#copy-status');
        try {
            await navigator.clipboard.writeText(email);
            status.textContent = 'Email address copied.';
        } catch {
            status.textContent = 'Copy unavailable. Select the email address above to copy it.';
        }
    });
}

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.hidden = false;
    contactForm.addEventListener('input', (event) => {
        event.target.setCustomValidity('');
        document.querySelector('#contact-result').hidden = true;
    });
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const fields = ['name', 'email', 'subject', 'message'];
        for (const name of fields) {
            const field = contactForm.elements.namedItem(name);
            const value = field.value.trim();
            const controls = name === 'message' ? /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/ : /[\x00-\x1F\x7F]/;
            field.setCustomValidity(!value ? 'Please complete this field.' : controls.test(value) ? 'Please remove unsupported control characters.' : '');
        }
        if (!contactForm.reportValidity()) return;
        const values = Object.fromEntries(new FormData(contactForm));
        const body = `From: ${values.name.trim()} <${values.email.trim()}>\r\n\r\n${values.message.trim()}`;
        document.querySelector('#email-draft').href = `mailto:${email}?subject=${encodeURIComponent(values.subject.trim())}&body=${encodeURIComponent(body)}`;
        document.querySelector('#contact-result').hidden = false;
        document.querySelector('#contact-status').textContent = 'Your draft is ready — it has not been sent. Open it below, then review and send it in your email app.';
    });
}

const terminal = document.querySelector('#terminal');
if (terminal) {
    terminal.hidden = false;
    const output = document.querySelector('#terminal-output');
    const input = document.querySelector('#terminal-input');
    const history = [];
    let historyIndex = 0;
    const responses = {
        help: 'Commands: about, skills, projects, certs, contact, github, linkedin, clear. Use ↑ / ↓ for command history.',
        about: 'Georges Youkhanna — cybersecurity-focused developer based in Lebanon. Security mindset. Developer’s craft.',
        skills: 'Security operations · Digital forensics · Backend development. Explore the Expertise section for more.',
        projects: 'ShadowWatch — SOC training simulator\nTRACEZERO — in development, Phase 06\nCrypto Scalping Bot — research and simulation',
        certs: 'Cisco Networking Academy: Introduction to Cybersecurity\nLetsDefend: Web Attack Investigator\nRed Team Leaders: Game Hacking Development\nSecurity Blue Team: Vulnerability Management',
        contact: `${email}\n+961 3369352 · Lebanon`,
    };
    const profiles = { github: 'https://github.com/dodogeuser', linkedin: 'https://www.linkedin.com/in/george-youkhanna-a9a16b3a1/' };
    const append = (text, className) => {
        const line = document.createElement('p');
        line.className = className;
        line.style.whiteSpace = 'pre-line';
        line.textContent = text;
        output.append(line);
        while (output.children.length > 60) output.firstElementChild.remove();
        output.scrollTop = output.scrollHeight;
    };
    document.querySelector('#terminal-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const raw = input.value.trim();
        if (!raw) return;
        const command = raw.toLowerCase();
        history.push(raw);
        if (history.length > 50) history.shift();
        historyIndex = history.length;
        input.value = '';
        if (command === 'clear') {
            output.replaceChildren();
            append('Terminal cleared. Type help to explore.', 'text-muted');
            return;
        }
        append(`~ $ ${raw}`, 'text-accent');
        if (Object.hasOwn(profiles, command)) {
            const link = document.createElement('a');
            link.href = profiles[command];
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'block text-accent underline';
            link.textContent = `Open ${command} ↗`;
            output.append(link);
            output.scrollTop = output.scrollHeight;
        } else {
            append(Object.hasOwn(responses, command) ? responses[command] : `Unknown command: ${raw}. Type help for available commands.`, 'text-muted');
        }
    });
    input.addEventListener('keydown', (event) => {
        if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        historyIndex = Math.max(0, Math.min(history.length, historyIndex + (event.key === 'ArrowUp' ? -1 : 1)));
        input.value = history[historyIndex] || '';
    });
}
