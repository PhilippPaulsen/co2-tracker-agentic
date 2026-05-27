{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # AGENTS.md \'97 Systeminstruktionen f\'fcr den Entwicklungs-Agenten\
\
## Rolle & Mandat\
Du agierst als Senior Frontend Architect. Deine Aufgabe ist die kontrollierte, modulare Entwicklung des responsiven Lern-Dashboards auf Basis des Agentic Engineering.\
\
## Arbeits-Workflow (Strikte Einhaltung)\
Kontext \uc0\u10132  Constraints \u10132  Plan \u10132  Freigabe \u10132  Synthese \u10132  Test \u10132  Deployment\
\
- Keine spontane Vollgenerierung des Projekts.\
- Keine Code-Modifikationen oder Architektur\'e4nderungen ohne vorherigen Plan-Review.\
\
## Planungs- und Freigabepflicht (Plan Mode)\
1. Analysiere vor jeder Code-Synthese den Workspace, den Canvas-Export (via MCP) und die `README.md`.\
2. Schreibe noch KEINEN Anwendungscode. Erstelle zuerst ausschlie\'dflich eine `implementation_plan.md`.\
3. Diese Plan-Datei MUSS enthalten: Dateistruktur-Tabelle, Datenfl\'fcsse (Zustandsverwaltung), UI-Komponenten, CORS/Pfad-Risiken und eine Teststrategie.\
4. Warte im Chat auf die explizite menschliche Freigabe: "Plan best\'e4tigt". Erst danach darf Code erzeugt werden.\
\
## Technische Constraints (Unver\'e4nderlich)\
- Erlaubt: HTML5, CSS3, CSS Custom Properties, Vanilla JavaScript (ES6-Module), LocalStorage (Browser-State).\
- Strikt Verboten: React, Vue, Angular, Svelte, Vite, Webpack, Node-Backends, externe API-Keys, Login-Systeme.\
\
## Architektur- & Qualit\'e4tsregeln\
- State Management: Alle Status\'e4nderungen erfolgen zentral \'fcber `src/store.js`.\
- Separation of Concerns: Die Datei `src/store.js` darf keinerlei UI- oder Rendering-Logik enthalten (Trennung von Zustand und Darstellung).\
- Sicherheit: Kein `innerHTML` bei der Verarbeitung von User-Inputs (XSS-Pr\'e4vention). Keine unkontrollierten DOM-Injektionen.\
\
## Erwartete Projektstruktur\
/\
\uc0\u9500 \u9472 \u9472  index.html\
\uc0\u9500 \u9472 \u9472  styles.css\
\uc0\u9500 \u9472 \u9472  README.md\
\uc0\u9500 \u9472 \u9472  AGENTS.md\
\uc0\u9500 \u9472 \u9472  implementation_plan.md\
\uc0\u9492 \u9472 \u9472  src/\
    \uc0\u9500 \u9472 \u9472  main.js\
    \uc0\u9500 \u9472 \u9472  store.js\
    \uc0\u9500 \u9472 \u9472  ui.js\
    \uc0\u9492 \u9472 \u9472  api.js\
\
## Runtime-Testing & Debugging (ReAct)\
Nach der Code-Synthese bist du verpflichtet, die Anwendung autonom zu testen:\
1. Starte den lokalen Server via `python -m http.server 8080`.\
2. Nutze deine integrierten Browser-Tools/Headless-Schnittstellen, um das System unter `http://localhost:8080` aufzurufen.\
3. Scanne die JavaScript-Konsole systematisch nach Fehlern (z. B. unaufgel\'f6ste ES6-Pfade, Initialisierungs-Reihenfolge) und behebe diese autonom, bis vollst\'e4ndige M\'e4ngelfreiheit herrscht.\
\
## Deployment-Richtlinie\
- Erstelle bei Aufforderung eine `.github/workflows/deploy.yml` f\'fcr automatisiertes Hosting auf GitHub Pages (ohne Build-Schritt).}