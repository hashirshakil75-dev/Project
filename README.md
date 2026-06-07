# BizCard Studio

![License](https://img.shields.io/badge/license-MIT-green)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![No Backend](https://img.shields.io/badge/backend-none-lightgrey)
![Storage](https://img.shields.io/badge/storage-localStorage-blue)

**BizCard Studio** is a lightweight, self-hosted business card generator that runs entirely in the browser. Design, preview, and export professional business cards in seconds — no server, no signup required to run, and no data ever leaves your device.

---

## Introduction

BizCard Studio lets you create polished business cards with a live preview editor. Choose from 6 unique templates, customize colors and fonts, auto-generate a QR code, and download a high-resolution PNG — all from a simple web interface. The app includes a full local authentication system (sign up / login / logout) so multiple users can save their own card designs independently.

Designed as a mid-term project, BizCard Studio is built with **pure HTML, CSS, and JavaScript** — no frameworks, no build tools, no dependencies beyond two CDN libraries.

---

## Screenshots

### Login Page
> Clean authentication UI with password strength meter and remember-me support.

### Card Designer
> Live 2-sided preview with template picker, style controls, and export options.

---

## Features

### 🎨 Card Designer
- **6 unique templates** — Minimal Mono, Dark Luxury, Bold Brutalist, Classic Editorial, Modern Split, Urdu Style
- Live front/back/both-sides preview
- Accent color and background color pickers
- Font scale control (Compact / Normal / Large)
- Real-time update on every keystroke

### 📇 QR Code
- Auto-generated QR linking to Phone, Email, Website, or full vCard
- Rendered on card back with your name

### 💾 Export Options
- **Download PNG** — 3.5× high-resolution via `html2canvas`
- **Copy to Clipboard** — paste anywhere
- **Print** — print-optimized layout, UI hidden automatically

### 🔐 Authentication
- Sign up / Login / Logout
- Password strength meter
- Remember Me (localStorage) vs session-only (sessionStorage)
- Per-user card state saved automatically
- Protected route — card designer redirects to login if no session

### 🌍 No Backend Required
- All data stored in browser `localStorage`
- Works offline after first load
- Zero server costs, zero setup

---

## Installation

No build step or server required.

**1. Download the project files**

```
index.html
signup.html
app.html
style.css
script.js
```

**2. Open in browser**

```bash
# Just open index.html in any modern browser
open index.html
```

Or serve locally for best results:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Then visit `http://localhost:8080`

---

## File Structure

```
BizCard-Studio/
├── index.html      # Login page (entry point)
├── signup.html     # Registration page
├── app.html        # Card designer (protected)
├── style.css       # All styles — auth, nav, designer, templates, responsive
└── script.js       # All logic — auth, rendering, QR, export, persistence
```

---

## How It Works

### Auth Flow

```
Sign Up  →  account saved to  localStorage["bizcardAccounts"]
Login    →  session saved to  localStorage / sessionStorage
app.html →  checks session on load, redirects if none found
Logout   →  session cleared,  redirect to index.html
```

### Card Rendering

Each template is a set of absolutely-positioned `div` elements rendered into a fixed `380×217px` container (standard 3.5×2 inch card ratio). On every input change, the state is read from the form, QR is regenerated, and the card HTML is rebuilt and injected.

### Data Persistence

Card state is saved per user under the key `bizcardState_{email}` in `localStorage`. Switching users loads their own saved design automatically.

---

## Templates

| # | Name | Style |
|---|------|-------|
| 1 | Minimal Mono | Clean left-bar accent, DM Sans |
| 2 | Dark Luxury | Dark background, italic serif, DM Serif Display |
| 3 | Bold Brutalist | Full-width name, Bebas Neue |
| 4 | Classic Editorial | Centered layout, corner brackets, Libre Baskerville |
| 5 | Modern Split | Color-blocked left panel, Josefin Sans |
| 6 | Urdu Style | Ornamental border frame, centered serif |

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 / CSS3 | Structure and styling |
| Vanilla JavaScript (ES5) | All app logic — no frameworks |
| [html2canvas 1.4.1](https://html2canvas.hertzen.com/) | PNG export and clipboard copy |
| [qrcodejs 1.0.0](https://github.com/davidshimjs/qrcodejs) | QR code generation |
| Google Fonts | DM Serif Display, DM Sans, Bebas Neue, Josefin Sans, Libre Baskerville |
| localStorage / sessionStorage | Auth sessions and card state |

---

## Browser Support

| Browser | Supported |
|---|---|
| Chrome 90+ | ✅ |
| Firefox 88+ | ✅ |
| Edge 90+ | ✅ |
| Safari 14+ | ✅ |
| Mobile Chrome/Safari | ✅ (responsive at ≤860px) |

---

## Known Limitations

- Passwords are stored in **plain text** in `localStorage` — suitable for local demo only, not production
- Card data is **browser-local** — clearing browser storage deletes all accounts and saved cards
- No account recovery — forgot password shows an info notice only
- QR rendering on PNG export may vary slightly across browsers
- Mobile layout hides some nav elements but the card designer is not fully optimized for small screens

---

## Project Info

| | |
|---|---|
| **Type** | Mid-Term Project |
| **Stack** | Pure HTML / CSS / JavaScript |
| **Backend** | None |
| **Storage** | Client-side only (`localStorage`) |
| **CDN Dependencies** | html2canvas, qrcodejs |
| **License** | MIT |

---

## License

MIT
