# 15-Puzzle Game (Lab 1: Standardization & Best Practices)

A visually stunning, glassmorphic 15-Puzzle game built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS (v4)**. This project demonstrates best practices in project organization, licensing audits, GDPR compliance, automated API documentation, and component catalogs (Storybook).

---

## 👤 Authorship
- **Author**: Andrii Ihnatiuk
- **Group**: ZTU (another)
- **Lab Assignment**: Laboratory Work #1 - Standardization, Compliance, and Tools

---

## 🛠️ Tech Stack & Key Integrations
- **Core Framework**: React 19, TypeScript 5, Vite 8, Tailwind CSS v4
- **Routing & State**: React Router 7, Zustand 5, React Hook Form 7
- **Compliance & Auditing**: GDPR Cookie Consent, License-Checker
- **Documentation**: TypeDoc (JSDoc/TSDoc to HTML)
- **Component Catalog**: Storybook 10 (React-Vite)

---

## ⚙️ Configuration & Local Setup

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) installed on your machine.

### Installation
Clone the repository and install dependencies:
```bash
npm install
```

---

## 🚀 Development Scripts

Here are the basic commands to run, build, and audit the application:

### Run the App Locally
Launches the local development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Build for Production
Compiles TypeScript and bundles files for production:
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

### Run Linter
Executes ESLint with typescript-eslint rules:
```bash
npm run lint
```

### Preview Production Build
Runs a local web server serving the `dist/` folder:
```bash
npm run preview
```

---

## 📖 Codebase Documentation (TypeDoc)
We use **TypeDoc** to generate type-safe HTML documentation from TSDoc comments in the codebase.

### Generate Documentation
To generate the latest HTML documentation:
```bash
npx typedoc
```
The output will be placed in the [docs/](./docs) folder. Open [docs/index.html](./docs/index.html) in your browser to explore the API.

---

## 🎨 Storybook (Component Catalog)
We use **Storybook** to document, preview, and test our UI components in isolation. We have structured stories for `Button` (basic component) and `Board` (complex component).

### Run Storybook
Starts the interactive Storybook dashboard locally:
```bash
npm run storybook
```
Open `http://localhost:6006` in your browser.

### Build Storybook
Builds a static, deployable site for Storybook:
```bash
npm run build-storybook
```
Generated files are placed in the `storybook-static/` directory.

---

## 🛡️ GDPR Compliance & Cookie Banner
This application is fully compliant with General Data Protection Regulation (GDPR) standards:
- **No Remote Tracking**: All settings and high scores are stored client-side in `localStorage`.
- **Granular Cookie Consent Popup**: On first visit, users are presented with a glassmorphic consent banner to accept, reject, or customize storage settings.
- **Preferences Modal**: Users can toggle between *Necessary* (always on), *Analytics* (scores tracking), and *Marketing* (currently unused) categories.

Learn more in our [Privacy Policy & EULA](./PRIVACY_POLICY.md).

---

## 📄 Licensing & Audits
- The project is licensed under the [MIT License](./LICENSE).
- All dependencies have been audited using `license-checker` to ensure open-source compatibility.
- You can review the generated third-party license report here: [license-report.md](./license-report.md).
