# Laptop Control Bot — Website

The website for [Laptop Control Bot](https://github.com/Naveen022006/laptop-control-application), an open-source, self-hosted Discord bot that lets you control your own laptop from any Discord chat: screenshots, webcam, live screen streaming, volume, apps, Apple Music, text-to-speech, file downloads and system stats.

The site explains what the bot does, documents every command, and walks new users through setting up their own copy.

## Pages

| Page | What it's for |
| --- | --- |
| `index.html` | Landing page: live Discord-style demo, how it works, capabilities, security model, quick start |
| `pages/features.html` | Searchable, filterable command reference with copy buttons |
| `pages/setup.html` | Step-by-step setup guide (Windows / macOS / Linux tabs), troubleshooting, extras |
| `pages/contact.html` | Contact options, how to get help, FAQ |

## Structure

```
├── index.html
├── pages/
│   ├── features.html
│   ├── setup.html
│   └── contact.html
├── css/main.css        # Single design system: tokens, components, responsive rules
├── js/main.js          # Nav menu, scroll reveal, copy buttons, tabs, command filter, hero demo
└── image/
    ├── logo.svg        # Brand mark + favicon
    ├── bot-avatar.webp # Small avatar used in the hero chat demo
    └── bot-character.png
```

Plain HTML, CSS and JavaScript — no build step and no dependencies. Fonts load from Google Fonts (Bricolage Grotesque, Geist, Geist Mono).

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Updating content

- **Add a command:** copy an `<article class="cmd">` block in `pages/features.html` into the right category. The command count updates automatically.
- **Change colours or spacing:** edit the CSS variables at the top of `css/main.css`.
- **Change the hero demo:** edit the `script` array in `runDemo()` inside `js/main.js`.

## Accessibility & performance

- Respects `prefers-reduced-motion` (the hero demo and scroll animations are turned off).
- Keyboard friendly: skip link, visible focus states, accessible mobile menu and tabs, `/` focuses command search.
- Fully responsive from 320px phones up to wide desktops.

## Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub Pages and Vercel.

## Credits

Built by **Naveen K** — [GitHub](https://github.com/Naveen022006) · [Portfolio](https://naveenhub.dev) · kanagunaveen@gmail.com
