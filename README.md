# 🪪 BizCard Studio
![License](https://img.shields.io/badge/license-MIT-green)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![No Backend](https://img.shields.io/badge/backend-none-lightgrey)
![Storage](https://img.shields.io/badge/storage-localStorage-blue)

A professional, multi-page **Business Card Generator** built with pure HTML, CSS, and JavaScript. No frameworks, no build tools — just open and run.

---

## 📁 File Structure

```
bizcard/
├── index.html      ← Login page (entry point)
├── signup.html     ← Sign Up page
├── app.html        ← Main card designer app
├── style.css       ← Shared stylesheet (all pages)
├── script.js       ← Shared JavaScript (all pages)
└── README.md       ← You are here
```

---

## 🚀 Getting Started

1. Download or clone all files into a single folder.
2. Open **`index.html`** in your browser.
3. Sign up for a free account (data is stored locally).
4. Start designing your business card!

> ⚠️ All files must be in the **same folder** for the app to work correctly.

---

## 🔐 Auth System

| Page | Purpose |
|------|---------|
| `index.html` | Login form — entry point of the app |
| `signup.html` | New account registration |
| `app.html` | Protected designer — redirects to login if no session |

**How it works:**
- Accounts are saved in `localStorage` (browser storage).
- On login, a session is created in `localStorage` (remember me) or `sessionStorage` (tab only).
- `app.html` checks for a valid session on load — if none found, it redirects back to `index.html`.
- Logout clears the session and redirects to `index.html`.

> 🔒 **Note:** This is a demo/local app. Passwords are stored in plain text in localStorage. Do **not** use real passwords — not intended for production use.

---

## 🎨 Features

### 6 Business Card Templates
| # | Template | Style |
|---|----------|-------|
| 1 | Minimal Mono | Clean left accent bar, serif text |
| 2 | Dark Luxury | Dark background, italic serif name |
| 3 | Bold Brutalist | Thick stripe, giant Bebas Neue font |
| 4 | Classic Editorial | Centered layout, corner bracket ornaments |
| 5 | Modern Split | Colored left panel with large initials |
| 6 | Urdu Inspired | Ornamental border, italic centered name |

### Card Customization
- ✏️ Full Name, Designation, Company
- 📞 Phone, Email, Website
- 🎨 Accent color picker
- 🖼️ Card background color picker
- 🔠 Font scale (Compact / Normal / Large)
- 📱 QR code (links to Phone, Email, Website, or full vCard)

### Preview Modes
- **Front** — front face of the card
- **Back (QR)** — back side with large QR code
- **Both Sides** — front and back side by side

### Export Options
- ⬇️ **Download PNG** — high-resolution (3.5× scale, ~300 DPI, print quality)
- 📋 **Copy to Clipboard** — paste directly into other apps
- 🖨️ **Print** — browser print dialog, controls hidden automatically

---

## 💾 Data Persistence

- Card design data is saved automatically to `localStorage` per user account.
- Multiple accounts on the same browser each get their own saved card state.
- Resetting the card clears the saved data for the current user.

---

## 🛠️ Technologies Used

| Library | Version | Purpose |
|---------|---------|---------|
| [html2canvas](https://html2canvas.hertzen.com/) | 1.4.1 | PNG export & clipboard copy |
| [QRCode.js](https://github.com/davidshimjs/qrcodejs) | 1.0.0 | QR code generation |
| [Google Fonts](https://fonts.google.com/) | — | DM Sans, DM Serif Display, Bebas Neue, Josefin Sans, Libre Baskerville |

No npm, no bundler, no framework — everything loaded via CDN.

---

## 📐 Card Dimensions

| Property | Value |
|----------|-------|
| Screen size | 380 × 217 px |
| Real-world size | 3.5 × 2 inches (standard business card) |
| Export resolution | 1330 × 760 px (~300 DPI) |

---

## 🗂️ Page Flow

```
index.html (Login)
    │
    ├── Already logged in? ──────────────────► app.html
    │
    ├── Login success ───────────────────────► app.html
    │
    └── No account? ──────► signup.html
                                │
                                └── Signup success ──► app.html
                                                           │
                                                       Logout ──► index.html
```

---

## 📱 Responsive Design

- Works on desktop and mobile browsers.
- On screens narrower than 860px, the two-column layout stacks vertically.
- Card size scales down slightly on mobile (320 × 183 px).

---

## 🖨️ Print Support

When printing (`Ctrl+P` or the Print button):
- Navigation bar, left panel, and preview bar are hidden automatically.
- Only the business card is printed.

---

## 🔄 Resetting the App

To fully reset everything (all accounts + card data):

Open browser DevTools → Application → Local Storage → clear all keys starting with `bizcard`.

Or click the **↺ Reset Card** button inside the app to reset only the current card design.

---

## 📄 License

Free to use for personal and commercial projects.
