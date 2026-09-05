# Intern X — Login / Sign-Up UI

A modern, mobile-responsive authentication screen built with **React + Tailwind CSS (v4)**.

## Features

- 🔀 Toggle between **Login** and **Sign-Up** views (animated switch)
- ✉️ Email field with icon, 🔒 Password field with **eye-icon visibility toggle**
- 🟢 "Continue with Google" button — **UI only**, no logic attached (official multicolor "G" mark)
- 👤 **User Role** selector on Sign-Up: Student · Industry · Academician · Institution
  (radio-group behaviour styled as a 2×2 card grid — great on touch screens)
- 📱 Fully responsive: split-screen brand panel on desktop, single centered card on mobile
- ♿ Accessible: real labels, `aria` attributes on the password toggle, keyboard-focus rings

## Run it

```bash
npm install
npm run dev        # → http://localhost:5173
```

## File map

| File | Purpose |
| --- | --- |
| `src/components/AuthPage.jsx` | Page layout, view switching, Login + Sign-Up forms |
| `src/components/GoogleButton.jsx` | Dummy Google button (no OAuth logic) |
| `src/components/PasswordInput.jsx` | Password field + eye-icon toggle |
| `src/components/RoleSelect.jsx` | Role selector grid (4 roles) |
| `src/components/Icons.jsx` | All inline SVG icons (no icon library needed) |

## Dropping it into your own app

1. Copy the `src/components/` folder into your project.
2. Make sure Tailwind is configured, then render `<AuthPage />` anywhere.
3. Branding is plain Tailwind classes (`indigo-*`, name "Intern X", logo in
   `BrandPanel`) — search & replace to re-theme.
