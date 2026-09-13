# DOKUMENTATION – ANPASSNING FÖR MOBIL, TABLET OCH DESKTOP, PERSONLIGT VISNINGSLÄGE INOM HEMPLAN, SAMT FRAMTIDA UTVECKLINGSMÖJLIGHETER

## 1. Anpassning för mobil, tablet och desktop
Hemsidan anpassas dynamiskt utifrån den upplösning som viewport använder (brytpunkter på 640px, 768px och 1024px).

| Brytpunkt |	Enhet / Skärm |	Komponenter & Beteende |
| :--- | :--- | :--- |
| 1024px	| Surfplattor & Bärbara datorer |	• Växlar navbaren från horisontella länkknappar till Hamburgermeny (☰ / ✕).<br>• Sätter min-width: 180px per dagskolumn med mjuk horisontell scroll-container (overflow-x: auto) på 7-dagarsschemat för att förhindra ihoptryckta kort.	|
| 768px	| Mellanstora skärmar / Tablets i stående läge	| • Anpassar filterfältet (FilterBar.vue) från en rak rad till en flex-wrap layout så att rullgardinsmenyerna hamnar snyggt.|
| 640px	| Smartphones / Mobilvy	| • Slår om från 7-dagars grid till MobileDayView.vue (visar 1 dag i taget med dagväljare).<br>• Döljer "Dagens sysslor" i standard/fokus-läge för att undvika dubletter.<br>• Döljer "🎯 Fokus"-knappen i filterfältet (eftersom mobilen redan fokuserar på en dag).<br>• Kompaktifierar kort, framstegsbar (ProgressCard.vue) och månadsnät (MonthCalendar.vue).|


## 2. Beskrivning av visningslägesfunktion
Jag har utvecklat en anpassningsbar och reaktiv visningsfunktionalitet – **Personligt Visningsläge** – där användaren direkt i gränssnittet kan skifta hur hushållsplaneringen presenteras för att ge maximal nytta i olika situationer.

Funktionen erbjuder tre distinkta och ändamålsenliga lägen:
- **📄 Standard**: Veckoplanering med ett balanserat 7-kolumns veckoschema där alla sju dagar i veckan visas med lika visuell vikt.
- **🗜️ Kompakt**: En hel **månadsöversikt (månadskalender)** där schemalagda sysslor per dag visas som minimalistiska ikoner. Detta ger användaren ett fågelperspektiv/makroperspektiv över hela månaden.
- **🎯 Fokus**: Veckoplanering där **dagens datum (dagskolumnen för idag)** framhävs med stark färg, förhöjd skugga och 2.5px primärlinje, medan de sex övriga dagarna tonas ner (`opacity: 0.45; filter: grayscale(45%)`). Detta drar visuellt fokus direkt till det som ska göras just idag.

---

## 3. Syfte & UX-motivering
Planeringsbehov varierar beroende på situation:
- I början av veckan vill man se hela **veckans balanserade schema** (Standard).
- När man vill ha en övergripande månadsöversikt vill man se **makrobilden utan textrörighet** (Kompakt / Månadskalender).
- Under hektiska dagar vill man kunna fokusera på enbart **dagens aktiviteter** utan att bli distraherad av kommande dagar (Fokus).

Detta skapar ett genuint mervärde i användargränssnittet där varje läge fyller ett tydligt och unikt UX-syfte.

---

## 4. Användning i Gränssnittet
Användaren kan enkelt byta visningsläge på två ställen:
1. Via **Segmented Control-knapparna** i filterfältet högst upp på Dashboard (*Standard*, *Kompakt (Månad)*, *Fokus (Idag)*).
2. Via **Inställningsmodalen** (⚙️) där användaren kan välja vilket visningsläge som ska vara standard vid start.

---

## 5. Använda Vue.js-Tekniker & CSS-Arkitektur
Funktionen är byggd med reaktiva Vue 3-koncept och modulär CSS:
1. **Reaktivt Tillstånd (`ref` / `reactive`)**:
   `viewMode` lagras som en reaktiv sträng (`'standard'`, `'compact'`, eller `'focus'`) i `App.vue` och `settings`.
2. **Conditional Rendering (`v-if` / `v-else`)**:
   En villkorlig växel i `Dashboard.vue` renderar `MonthCalendar.vue` när `viewMode === 'compact'`, och `WeekCalendar.vue` i övriga lägen:
   ```html
   <template v-if="currentViewMode !== 'compact'">
     <WeekCalendar :view-mode="currentViewMode" ... />
   </template>
   <template v-else>
     <MonthCalendar :tasks="filteredTasks" ... />
   </template>
   ```
3. **Dynamic Class Binding (`:class`) & CSS Separation**:
   Värdet på `viewMode` appliceras på containerelementen för att aktivera specifika CSS-regler i `src/styles/base/utilities.css`:
   ```css
   .view-focus .day-column:not(.is-today) {
     opacity: 0.45;
     filter: grayscale(45%);
     background-color: var(--bg-subtle);
     border-color: var(--border-color);
     transition: all var(--transition-normal);
   }

   .view-focus .day-column.is-today {
     opacity: 1;
     border: 2.5px solid var(--primary);
     box-shadow: 0 8px 24px rgba(79, 70, 229, 0.2);
     transform: translateY(-2px);
   }
   ```

---

## 6. Dokumenterad Framtida Förbättring

### Automatiserad Direkt Kalendersynkronisering (Google / Apple Calendar API)
**Beskrivning**:
I dagsläget erbjuder HemPlan en `.ics`-fil-export där användaren manuellt kan ladda ner sina veckosysslor och importera dem i valfritt kalenderprogram. 

**Framtida utveckling**:
En framtida förbättring är att integrera applikationen mot **Google Calendar API** och **Apple iCloud Calendar API** via OAuth2. När en användare lägger till, flyttar eller slutför en syssla i HemPlan skickas en bakgrundsförfrågan via REST API för att automatiskt uppdatera händelsen i användarens riktiga telefonkalender i realtid. Detta eliminerar det manuella steget att ladda ner filer och gör HemPlan ännu mer integrerat i användarens dagliga liv.
