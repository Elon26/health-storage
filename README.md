# health-storage

A commercial mobile application for planning and tracking medical procedures and medication intake.  
The app helps users manage medication schedules, dosage, and inventory, with reminders and visual statistics.

> Commercial project. Published on the App Store under a different name by the client’s request (public link is not available).

---

## 🏥 About the Project

The project is designed for users who need to manage medical routines and medication intake on a daily basis.  
It provides tools for scheduling medications and doctor visits, tracking adherence, and monitoring remaining medication supplies.

The app focuses on reliability, smooth user experience, and offline-first data storage.

---

## 🧰 Tech Stack

**Framework / Platform**
- React Native  
- TypeScript  

**State / Storage**
- react-native-mmkv (local storage, no backend)

**Infrastructure & Services**
- Firebase Storage
- Firebase Remote Config
- Sentry  
- Apphud  
- Facebook SDK  

**UI / UX**
- Tailwind (NativeWind)  
- react-native-reanimated  
- i18n (localization)

**Tooling**
- ESLint  
- Prettier  

---

## ✨ Key Features

- 💊 Medication & doctor management:
  - create and manage medication cards  
  - create and manage doctor profiles  
- 📅 Scheduling:
  - plan medication intake  
  - schedule doctor appointments  
  - calendar view for tracking  
- ✅ Medication adherence tracking:
  - mark doses as taken or missed  
  - view intake statistics and history  
- 📦 Medication inventory management:
  - automatic stock updates based on intake  
  - manual stock adjustments  
- 🖼 Device cleanup:
  - detect low-quality photos  
  - find duplicate photos  
  - clean up storage directly from the app  
- 👥 Duplicate contacts detection:
  - find contacts with similar names  
  - find contacts with duplicate phone numbers  
  - remove duplicates from the device  
- 🔐 Secure local vault:
  - store images, videos, and contacts  
  - restrict access from other apps  
- 🔑 Password generator & manager:
  - synced with the system password storage  
- 🌐 Internet speed test  
- 🔍 Search and filtering across multiple sections  
- 🎞 Smooth UI transitions and animated charts  
- 💾 Local-first data storage using MMKV (no backend)

---

## 👨‍💻 Role & Responsibilities

The project was implemented entirely by me:
- designed the application architecture;  
- implemented business logic for medication scheduling and inventory tracking;  
- built UI with complex animations and charts;  
- integrated notifications and calendar features;  
- connected third-party services (analytics, crash reporting, monetization);  
- prepared the app for production release.

---

## 🧠 Challenges & Technical Decisions

- Implemented a complex medication inventory system:
  - automatic stock updates based on medication intake;  
  - manual adjustments by the user;  
  - real-time recalculation when intake status changes (taken / missed).  
- Designed data flow to keep medication schedules, intake history, and inventory in sync.  
- Ensured UI performance with frequent state updates and animated charts.  
- Paid special attention to edge cases (skipped doses, manual corrections, partial intake).

---

## 🚀 Local Setup

The project cannot be started without a .env file because it contains confidential keys and tokens.

Installation and run:

- npm install
- npm run start

---

## 🧪 Code Quality

- ESLint and Prettier are configured  
- No automated tests (manual QA by a dedicated tester)  
- Multiple environment variables are used for service configuration  

---

## 📌 Notes

This repository is intended to demonstrate architecture, UI complexity, and development approach.  
The production version is published in the App Store under a different name according to the client’s requirements.
