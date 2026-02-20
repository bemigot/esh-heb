# Biblical Hebrew Dictionary (Bible-Hebrew)

**⚠️ IMPORTANT: MANUAL DEPENDENCY MANAGEMENT**
Do not run `npm install` within this project unless you are the human owner. The AI agent will request dependency installations from you.

## Current Phase: 0 (Core Web App)

### 1. Initial Setup
Please run the following command to install the base dependencies:
```bash
npm install
```

### 2. Storage Dependency
We will use `idb` for a lightweight IndexedDB wrapper. Please install it:
```bash
npm install idb
```

---

## Project Overview
This project is an Angular-based Progressive Web App (PWA) for learning and working with Biblical Hebrew, focusing on an offline-first experience with a custom keyboard and OCR capabilities.

Detailed project goals, tech stack, and roadmap are maintained in [AGENTS.md](AGENTS.md).

## Development Commands

- **Start Dev Server:** `ng serve`
- **Build:** `ng build`
- **Test:** `ng test`

## Project Structure
- `src/app/core/`: Singleton services (Storage, Dictionary, OCR).
- `src/app/features/`: Main features (Dictionary, Keyboard, User-Dictionary).
- `src/app/shared/`: Reusable components and models.
