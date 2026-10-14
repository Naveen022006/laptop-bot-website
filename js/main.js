// Laptop Control Bot — site interactions
(function () {
    'use strict';

    document.documentElement.classList.add('js');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Navigation ---------- */
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav-toggle');

    if (nav) {
        const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (nav && navToggle) {
        const setOpen = (open) => {
            nav.classList.toggle('is-open', open);
            navToggle.setAttribute('aria-expanded', String(open));
            navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };
        navToggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
        nav.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setOpen(false);
        });
    }

    /* ---------- Reveal on scroll ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    /* ---------- Copy to clipboard ---------- */
    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
            ta.remove();
            return ok;
        }
    }

    document.querySelectorAll('[data-copy]').forEach((btn) => {
        const label = btn.querySelector('.copy-label');
        btn.addEventListener('click', async () => {
            let text = btn.getAttribute('data-copy');
            if (!text) {
                const target = btn.closest('.terminal')?.querySelector('pre');
                if (target) {
                    // Copy commands only: skip comments, prompts and sample output
                    text = Array.from(target.querySelectorAll('[data-line]'))
                        .map((line) => line.textContent.trim())
                        .join('\n') || target.textContent.trim();
                }
            }
            if (!text) return;
            const ok = await copyText(text);
            if (!ok) return;
            btn.classList.add('is-copied');
            if (label) label.textContent = 'Copied';
            clearTimeout(btn._t);
            btn._t = setTimeout(() => {
                btn.classList.remove('is-copied');
                if (label) label.textContent = 'Copy';
            }, 1600);
        });
    });

    /* ---------- Tabs ---------- */
    document.querySelectorAll('.tabs').forEach((tabs) => {
        const buttons = tabs.querySelectorAll('[role="tab"]');
        const panels = tabs.querySelectorAll('[role="tabpanel"]');
        const select = (btn) => {
            buttons.forEach((b) => {
                const on = b === btn;
                b.setAttribute('aria-selected', String(on));
                b.tabIndex = on ? 0 : -1;
            });
            panels.forEach((p) => { p.hidden = p.id !== btn.getAttribute('aria-controls'); });
        };
        buttons.forEach((btn, i) => {
            btn.addEventListener('click', () => select(btn));
            btn.addEventListener('keydown', (e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                const next = buttons[(i + (e.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length];
                next.focus();
                select(next);
            });
        });
        // Default to macOS/Linux instructions on non-Windows machines
        const platform = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase();
        if (platform && !platform.includes('win')) {
            const unix = tabs.querySelector('[data-os="unix"]');
            if (unix) select(unix);
        }
    });

    /* ---------- Table of contents highlight ---------- */
    const tocLinks = document.querySelectorAll('.toc a');
    if (tocLinks.length && 'IntersectionObserver' in window) {
        const map = new Map();
        tocLinks.forEach((a) => {
            const section = document.querySelector(a.getAttribute('href'));
            if (section) map.set(section, a);
        });
        const visible = new Set();
        const tocIO = new IntersectionObserver((entries) => {
            entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
            const first = [...map.keys()].find((s) => visible.has(s));
            if (first) tocLinks.forEach((a) => a.classList.toggle('is-active', a === map.get(first)));
        }, { rootMargin: '-80px 0px -55% 0px' });
        map.forEach((_, section) => tocIO.observe(section));
    }

    /* ---------- Command reference filter ---------- */
    const search = document.getElementById('cmd-search');
    const chips = document.querySelectorAll('.chip[data-filter]');
    const groups = document.querySelectorAll('.cmd-group');
    const empty = document.getElementById('cmd-empty');
    const countEl = document.getElementById('cmd-count');

    if (groups.length) {
        let activeFilter = 'all';

        const totalCommands = document.querySelectorAll('.cmd').length;
        document.querySelectorAll('[data-command-total]').forEach((el) => { el.textContent = totalCommands; });

        const apply = () => {
            const q = (search?.value || '').trim().toLowerCase();
            let shown = 0;
            groups.forEach((group) => {
                const inCategory = activeFilter === 'all' || group.dataset.category === activeFilter;
                let groupShown = 0;
                group.querySelectorAll('.cmd').forEach((cmd) => {
                    const match = inCategory && (!q || cmd.textContent.toLowerCase().includes(q));
                    cmd.hidden = !match;
                    if (match) groupShown++;
                });
                group.hidden = groupShown === 0;
                shown += groupShown;
            });
            if (empty) empty.hidden = shown !== 0;
            if (countEl) countEl.textContent = shown === totalCommands ? `${totalCommands} commands` : `${shown} of ${totalCommands} commands`;
        };

        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                activeFilter = chip.dataset.filter;
                chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
                apply();
            });
        });
        search?.addEventListener('input', apply);
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && search && document.activeElement !== search && !/input|textarea/i.test(document.activeElement.tagName)) {
                e.preventDefault();
                search.focus();
            }
        });
        apply();
    }

    /* ---------- Hero Discord demo ---------- */
    const demo = document.querySelector('.discord[data-demo]');
    if (demo && !prefersReducedMotion) runDemo(demo);

    function runDemo(root) {
        const feed = root.querySelector('.discord-feed');
        const input = root.querySelector('.discord-input-text');
        const inputBox = root.querySelector('.discord-input');
        const typing = root.querySelector('.typing');
        const avatar = root.dataset.avatar;
        const MAX_MESSAGES = 6;

        const time = () => {
            const d = new Date();
            return `Today at ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
        };

        const userMsg = (cmd) => `
            <div class="msg-avatar user" aria-hidden="true">N</div>
            <div>
                <div class="msg-head"><span class="msg-name">naveen</span><span class="msg-time">${time()}</span></div>
                <div class="msg-body"><span class="msg-cmd">${cmd}</span></div>
            </div>`;

        const botMsg = (body) => `
            <img class="msg-avatar" src="${avatar}" alt="" width="40" height="40">
            <div>
                <div class="msg-head"><span class="msg-name bot">Laptop Bot</span><span class="msg-tag">APP</span><span class="msg-time">${time()}</span></div>
                <div class="msg-body">${body}</div>
            </div>`;

        const rand = (min, max) => Math.round(min + Math.random() * (max - min));

        const script = [
            {
                cmd: '!sysinfo',
                reply: () => {
                    const cpu = rand(8, 34), ram = rand(41, 68), disk = rand(52, 61);
                    return `<div class="embed">
                        <div class="embed-title">💻 System status</div>
                        <div class="embed-grid">
                            <div class="embed-field"><b>CPU</b><span>${cpu}%</span><div class="meter"><i style="width:${cpu}%"></i></div></div>
                            <div class="embed-field"><b>RAM</b><span>${ram}%</span><div class="meter"><i style="width:${ram}%"></i></div></div>
                            <div class="embed-field"><b>Disk</b><span>${disk}%</span><div class="meter"><i style="width:${disk}%"></i></div></div>
                        </div>
                    </div>`;
                },
            },
            { cmd: '!screenshot', reply: () => 'Here’s your screen 📸<div class="shot" role="img" aria-label="Screenshot preview"></div>' },
            { cmd: '!vol_set 35', reply: () => '<div class="embed mint"><div class="embed-title">🔊 Volume set to 35%</div></div>' },
            { cmd: '!play Blinding Lights', reply: () => '<div class="embed pink"><div class="embed-title">🎵 Now playing</div>Blinding Lights — The Weeknd</div>' },
            { cmd: '!speak "Dinner is ready"', reply: () => '🗣️ Speaking: “Dinner is ready”' },
            { cmd: '!lock', reply: () => '<div class="embed"><div class="embed-title">🔒 Workstation locked</div></div>' },
        ];

        const wait = (ms) => new Promise((r) => setTimeout(r, ms));

        const push = (html) => {
            const el = document.createElement('div');
            el.className = 'msg';
            el.innerHTML = html;
            feed.appendChild(el);
            while (feed.children.length > MAX_MESSAGES) feed.firstElementChild.remove();
        };

        let visible = true;
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(root);
        }
        const whenVisible = async () => {
            while (!visible || document.hidden) await wait(400);
        };

        (async function loop() {
            let i = 0;
            await wait(1600);
            for (;;) {
                const step = script[i % script.length];
                await whenVisible();

                inputBox.classList.add('has-text');
                for (let c = 1; c <= step.cmd.length; c++) {
                    input.textContent = step.cmd.slice(0, c);
                    await wait(rand(45, 95));
                }
                await wait(350);
                input.textContent = '';
                inputBox.classList.remove('has-text');
                input.textContent = 'Message #laptop';
                push(userMsg(step.cmd));

                await wait(450);
                typing.hidden = false;
                await wait(rand(800, 1300));
                typing.hidden = true;
                push(botMsg(step.reply()));

                await wait(2600);
                i++;
            }
        })();
    }
})();
