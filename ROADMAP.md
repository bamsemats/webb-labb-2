# 📌 HemPlan – Roadmap & Todo-lista

Denna roadmap sammanfattar genomförda optimeringar samt framtida rekommenderade vidareutvecklingssteg för HemPlan innan och efter kursinlämning.

---

## 🎯 Genomförda optimeringar

### 1. 🎨 Översyn & Optimering av Layout (Schema & Kort)
- **Status**: ✅ Genomförd
- **Åtgärd**: Sysslokorten har förenklats till en ren och vertikal hierarki (Titel överst, Checkbox + Tid i mitten, Ikon + Tidsåtgång längst ner, Prioritets-border på ovankanten). Fullständig detaljvy är flyttad till en interaktiv Side-Drawer panel samt snabbåtkomst via 3-punkters kebabmeny (`⋮`).

### 2. 💡 Omdefiniering av Visningslägen (Tydligt Syfte & UX-Värde)
- **Status**: ✅ Genomförd
- **Åtgärd**: De tre visningslägena erbjuder unika och unikt motiverade funktioner:
  - **Standard**: Veckoplanering med alla 7 dagar lika synliga.
  - **Kompakt**: Månadsöversikt (månadskalender) där sysslor visas som minimalistiska ikoner per dag.
  - **Fokus**: Veckoplanering där dagens datum framhävs med färg och skugga medan de sex övriga dagarna tonas ner (`opacity: 0.45`).

### 3. 📱 QA & Kvalitetssäkring av Media Queries (Mobil / Tablet / Desktop)
- **Status**: ✅ Genomförd
- **Åtgärd**: Satt en garanterad minsta bredd på `180px` per veckodagskolumn i veckogriden med mjuk horisontell overflow scroll på `.week-calendar-container`. Mobilvy har en anpassad dag-för-dag kortsvepare med snabb navigeringsbar.

### 4. 🎨 Modulär CSS-arkitektur & Städning av Stilfiler
- **Status**: ✅ Genomförd
- **Åtgärd**: Extraherat all inline/scoped CSS från samtliga 20 `.vue`-filer till en strukturerad och specifik CSS-mapp (`src/styles/` indelad i `base/` och `components/`). Raderat överflödiga dubblettfiler (`style.css` i roten).

---

## 🚀 Framtida Utvecklings- & Förbättringsmöjligheter

1. **⚡ Service Worker & Progressive Web App (PWA)**:
   - Lägga till `manifest.json` och service worker för att göra applikationen installerbar på mobiltelefoner och fungera helt offline utan nätverk.

2. **🧪 Enhetstester med Vitest / Vue Test Utils**:
   - Lägga till automatiserade enhetstester för datumfunktioner i `dateUtils.js` samt reaktiva filtreringstester i `Dashboard.vue`.

3. **🔄 OAuth2 Google / Apple Calendar API-Integration**:
   - Direkt synkronisering mot användarens riktiga kalenderkonto (istället för manuell nedladdning av `.ics`-filer).
