# HemPlan – Veckoplanering för hushållssysslor

> **"Din vecka. Ditt hem. Din plan."**

HemPlan är en modern, användarvänlig och komplett Vue 3-applikation utformad för att hjälpa individer, par och familjer att planera, organisera, genomföra och följa upp alla hushållssysslor i vardagen.

Projektet är utvecklat som en individuell uppgift inom kursen för webbutveckling i form av en **modulär Vue 3 Single File Component (SFC) arkitektur** med fristående CSS-moduler byggd med Vite.

---

## 📂 Projektstruktur

```text
webb-labb-2/
├── BESKRIVNING.md              /* Ingående dokumentation för funktionalitet */
├── index.html                   /* Huvud-HTML med Vue-monteringspunkt (#app) */
├── package.json                 /* Beroenden & skript (npm run dev, npm run build) */
├── vite.config.js               /* Vite-konfiguration */
├── README.md                     /* Projekt- & betygskriteriedokumentation */
├── ROADMAP.md                   /* Framtida todo- och optimeringslista */
├── public/
│   └── favicon.svg              /* Applikationsikon */
└── src/
    ├── main.js                  /* Applikationsinitiering och CSS-inläsning */
    ├── styles/                  /* Modulär CSS-arkitektur */
    │   ├── main.css             /* Master-stilfil som importerar delmoduler */
    │   ├── base/                /* Variabler, reset, nollställning & utilities */
    │   │   ├── variables.css
    │   │   ├── reset.css
    │   │   └── utilities.css
    │   └── components/          /* Dedikerade stilfiler för varje komponent */
    │       ├── navbar.css
    │       ├── dashboard.css
    │       ├── week-calendar.css
    │       ├── month-calendar.css
    │       ├── mobile-day-view.css
    │       ├── day-column.css
    │       ├── task-card.css
    │       ├── task-detail-drawer.css
    │       ├── progress-card.css
    │       ├── filter-bar.css
    │       ├── task-catalog.css
    │       ├── modals.css
    │       └── toast.css
    ├── App.vue                  /* Rotkomponent */
    ├── data/
    │   └── defaultTasks.js      /* Fördefinierade sysslor (20+ st) och demo-data */
    ├── utils/
    │   ├── dateUtils.js         /* Veckoberäkning, nästa tillfälle & .ics-exportör */
    │   └── storage.js           /* LocalStorage persistence layer */
    └── components/
        ├── Navbar.vue           /* Logotyp, flikar, sök & profil/inställningar */
        ├── Dashboard.vue        /* Huvudvy för veckoschema, filter & dagens sysslor */
        ├── WeekCalendar.vue     /* Veckonavigering & 7-kolumns grid (180px min-width) */
        ├── MonthCalendar.vue    /* Månadsöversikt (Kompakt läge med ikoner) */
        ├── MobileDayView.vue    /* Mobilanpassad dag-för-dag vy */
        ├── DayColumn.vue        /* Dagskolumn med räknare & kortvy */
        ├── TaskCard.vue         /* Sysslokort med prio-border & kebab-meny */
        ├── TaskDetailDrawer.vue /* Side-Drawer panel för detaljvy & redigering */
        ├── TaskCatalog.vue      /* Sysslobibliotek med sök & kategorigrid */
        ├── TaskFormModal.vue    /* Formulär för skapa / redigera syssla */
        ├── SelectTaskModal.vue  /* Välj existerande syssla från biblioteket på en dag */
        ├── SchedulePromptModal.vue /* Schemaläggningsprompt vid tillägg från katalog */
        ├── ProgressCard.vue     /* Veckostatistik, framstegsbar & tidsräknare */
        ├── FilterBar.vue        /* Kategori-, status- & prioritetsfilter + lägesväxel */
        ├── SettingsModal.vue    /* Användarinställningar & återställning av data */
        ├── HistoryModal.vue     /* Historik över utförda sysslor med tidsstämplar */
        ├── AuthModal.vue        /* Registrering / Inloggning & demo-profiler */
        ├── ConfirmModal.vue     /* Bekräftelsedialog för radering */
        └── NotificationToast.vue /* Feedbackmeddelanden för användaråtgärder */
```

---

## 🚀 Funktioner

- 📅 **Veckoschema (Desktop & Mobil)**: Interaktiv 7-kolumns veckovy för desktop/tablet (med garanterad `180px` minsta bredd per dag och mjuk horisontell scroll) samt en smidig dag-för-dag kortsvepare för mobil.
- 📋 **Sysslobibliotek**: Ett färdigt bibliotek med över 20 standardiserade hushållssysslor indelade i *Städning*, *Tvätt*, *Mat*, *Avfall* och *Övrigt*.
- 🎯 **Personligt visningsläge (VG-funktion)**: Växla dynamiskt mellan **Standard**, **Kompakt (Månadsöversikt)** och **Fokus (Framhäver idag)** för att anpassa gränssnittet efter dina behov.
- 🖼️ **Side-Drawer Detaljpanel**: Klicka på vilket sysslokort som helst för att öppna en ren side-drawer med fullständig information, återkommande frekvens, statusväxlare och redigeringsmöjligheter.
- ⏱️ **Frekvens & Nästa tillfälle**: Automatisk beräkning och förslag på nästa rekommenderade tillfälle när återkommande sysslor markeras som klara.
- 📊 **Veckostatistik & Framsteg**: Dynamisk progress-bar med realtidsprocent och tidsuppskattning (planerad tid vs genomförd tid).
- 📥 **Kalenderexport (.ics)**: Exportera veckans schema till standard `.ics`-fil för import i Google Calendar, Apple Calendar eller Outlook.
- 📜 **Historikvy**: Tidsstämplad logg över tidigare utförda sysslor.
- ⚙️ **Användarinställningar**: Personanpassat namn, preferenser för klara sysslor och återställning av demo-data.
- 👤 **Simulerad Autentisering (Bonus)**: Logga in eller växla mellan gäst- och familjeprofiler.

---

## 🛠️ Teknikstack

- **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API med `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Modulär Vanilla CSS3 med design tokens (CSS-variabler), Flexbox, CSS Grid, media queries och ren filseparation (`src/styles/`)
- **Typografi**: Google Fonts (Inter)
- **Data & Persistence**: Reaktiv state-hantering med `localStorage` persistence layer
- **Standarder**: HTML5 semantic markup, iCalendar specification (RFC 5545) för `.ics`-filgenerering

---

## 📦 Installation och Körning

### Förutsättningar
- Node.js (v18 eller senare)
- npm (v9 eller senare)

### Steg-för-steg

1. **Installera beroenden**:
   ```bash
   npm install
   ```

2. **Starta utvecklingsservern**:
   ```bash
   npm run dev
   ```
   Öppna din webbläsare på `http://localhost:3000`.

3. **Bygg för produktion**:
   ```bash
   npm run build
   ```

---

## 🎓 Demonstrerade Vue.js-Tekniker (Kurskrav)

Projektet uppfyller alla krav i kursens betygskriterier:

| Vue-funktion | Beskrivning & Användningsområde i HemPlan |
| :--- | :--- |
| `v-if` / `v-else-if` / `v-else` | Styr conditional rendering (t.ex. visning av modaler, drawer-paneler, tomma listtillstånd, samt firandebannern när alla dagens sysslor är klara). |
| `v-for` | Renderar listor dynamiskt för veckans 7 dagar, månadens 35/42 dagar, sysslor per dag, kategoriefilter, fördefinierade sysslor samt historikloggen. |
| `v-model` | Tvåvägs databindning i alla formulärfält (namn, kategori, prioritet, frekvens, tidsåtgång, dag, tid och sökfilter). |
| **Events** (`@click`, `@submit`, `$emit`) | Hanterar användarinteraktioner och kommunikation mellan komponenter (klicka på statuskryss, öppna drawer, skicka formulär, byta vecka, radera syssla). |
| **Class Binding** (`:class`) | Ändrar dynamiskt utseende på sysslokort baserat på valda visningslägen (`standard`, `compact`, `focus`), prioritet (`high`, `normal`, `low`) och utförd-status. |
| **Style Binding** (`:style`) | Används för dynamiska CSS-beräkningar, t.ex. bredden på progress-baren utifrån avklarad procent (`:style="{ width: percentCompleted + '%' }"`). |

---

## 🌟 VG-Funktion: Personligt Visningsläge

UX-funktionalitet där användaren direkt i gränssnittet kan skifta mellan tre olika visningslägen för schemat:

1. **📄 Standard**: 7-dagars veckoplanering där alla sju dagar i veckan visas med lika stor visuell vikt.
2. **🗜️ Kompakt**: En månadsöversikt (månadskalender) där schemalagda sysslor per dag visas som minimalistiska ikoner.
3. **🎯 Fokus**: Veckoplanering där dagens datum (dagskolumnen för idag) framhävs med primär linje, förhöjd skugga och färg, medan de sex övriga dagarna tonas ner (`opacity: 0.45; filter: grayscale(45%)`).

Läs en ingående teknisk och UX-mässig redogörelse i [BESKRIVNING.md](BESKRIVNING.md).
