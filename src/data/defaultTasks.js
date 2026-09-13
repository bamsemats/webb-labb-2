// Library of predefined household chores with default values & recommended frequencies

export const PRESET_CATEGORIES = [
  { id: 'Städning', name: 'Städning', icon: '🧹' },
  { id: 'Tvätt', name: 'Tvätt', icon: '🧺' },
  { id: 'Mat', name: 'Mat', icon: '🍝' },
  { id: 'Avfall', name: 'Avfall', icon: '🗑️' },
  { id: 'Övrigt', name: 'Övrigt', icon: '✨' }
];

export const FREQUENCY_TYPES = [
  { value: 'daily', label: 'Dagligen', intervalDays: 1 },
  { value: '2-3_weekly', label: '2–3 gånger / vecka', intervalDays: 3 },
  { value: 'weekly', label: 'Varje vecka', intervalDays: 7 },
  { value: 'biweekly', label: 'Varannan vecka', intervalDays: 14 },
  { value: 'monthly', label: 'Varje månad', intervalDays: 30 }
];

export const PRESET_TASKS = [
  // Städning
  {
    name: 'Dammsuga',
    category: 'Städning',
    description: 'Dammsug alla golv, mattor och under möbler i bostaden.',
    duration: 30,
    frequency: 'weekly',
    priority: 'normal',
    icon: '🧹'
  },
  {
    name: 'Moppa golv',
    category: 'Städning',
    description: 'Våtmoppa alla hårdgolv med rengöringsmedel.',
    duration: 35,
    frequency: 'biweekly',
    priority: 'normal',
    icon: '🪣'
  },
  {
    name: 'Damma av ytor',
    category: 'Städning',
    description: 'Torka av hyllor, bord, tv-bänk och fönsterbrädor.',
    duration: 20,
    frequency: 'weekly',
    priority: 'low',
    icon: '🧽'
  },
  {
    name: 'Rengöra badrum',
    category: 'Städning',
    description: 'Skura handfat, toalettstol, dusch/badkar och speglar.',
    duration: 40,
    frequency: 'weekly',
    priority: 'high',
    icon: '🚿'
  },
  {
    name: 'Rengöra köksytor',
    category: 'Städning',
    description: 'Torka av diskbänk, spishäll, kakel och köksluckor.',
    duration: 25,
    frequency: 'daily',
    priority: 'high',
    icon: '✨'
  },
  {
    name: 'Putsa speglar',
    category: 'Städning',
    description: 'Putsa alla speglar och glasytor fria från fläckar.',
    duration: 15,
    frequency: 'monthly',
    priority: 'low',
    icon: '🪞'
  },
  {
    name: 'Byta sängkläder',
    category: 'Städning',
    description: 'Dra av påslakan och örngott och lägg på rena sängkläder.',
    duration: 20,
    frequency: 'biweekly',
    priority: 'normal',
    icon: '🛏️'
  },

  // Tvätt
  {
    name: 'Tvätta kläder',
    category: 'Tvätt',
    description: 'Sortera tvätt, starta maskinen och häng upp eller torktumla.',
    duration: 90,
    frequency: '2-3_weekly',
    priority: 'high',
    icon: '🧺'
  },
  {
    name: 'Vika och lägga in tvätt',
    category: 'Tvätt',
    description: 'Vika ren tvätt och sortera in i garderober och lådor.',
    duration: 25,
    frequency: '2-3_weekly',
    priority: 'normal',
    icon: '👕'
  },
  {
    name: 'Tvätta handdukar & lakan',
    category: 'Tvätt',
    description: 'Tvätta handdukar och sänglinne i 60°C.',
    duration: 75,
    frequency: 'biweekly',
    priority: 'normal',
    icon: '🧼'
  },

  // Mat
  {
    name: 'Laga middag',
    category: 'Mat',
    description: 'Tillaga hälsosam middag för hushållet.',
    duration: 45,
    frequency: 'daily',
    priority: 'high',
    icon: '🍝'
  },
  {
    name: 'Planera veckans mat',
    category: 'Mat',
    description: 'Gör en matsedel för veckans alla dagar och skriv inköpslista.',
    duration: 30,
    frequency: 'weekly',
    priority: 'high',
    icon: '📝'
  },
  {
    name: 'Handla mat',
    category: 'Mat',
    description: 'Handla alla råvaror och hushållsartiklar från inköpslistan.',
    duration: 60,
    frequency: 'weekly',
    priority: 'high',
    icon: '🛒'
  },
  {
    name: 'Förbereda matlådor',
    category: 'Mat',
    description: 'Preppa lunchlådor inför kommande arbetsvecka.',
    duration: 60,
    frequency: 'weekly',
    priority: 'normal',
    icon: '🍱'
  },

  // Avfall
  {
    name: 'Gå ut med sopor',
    category: 'Avfall',
    description: 'Töm hushållssoporna och matavfallspåsen.',
    duration: 10,
    frequency: '2-3_weekly',
    priority: 'high',
    icon: '🗑️'
  },
  {
    name: 'Återvinning (Plast/Papper/Glas)',
    category: 'Avfall',
    description: 'Sortera och lämna återvinningsförpackningar på miljöstationen.',
    duration: 20,
    frequency: 'weekly',
    priority: 'normal',
    icon: '♻️'
  },

  // Övrigt
  {
    name: 'Vattna växter',
    category: 'Övrigt',
    description: 'Vattna alla krukväxter och plocka bort vissna blad.',
    duration: 15,
    frequency: 'weekly',
    priority: 'low',
    icon: '🪴'
  },
  {
    name: 'Rengöra kylskåp',
    category: 'Övrigt',
    description: 'Torka ur hyllor i kylskåpet och rensa ut gamla varor.',
    duration: 30,
    frequency: 'monthly',
    priority: 'normal',
    icon: '🧊'
  },
  {
    name: 'Rengöra ugn',
    category: 'Övrigt',
    description: 'Spraya ugn och plåtar med ugnsrengöring och skura rent.',
    duration: 45,
    frequency: 'monthly',
    priority: 'low',
    icon: '🍳'
  },
  {
    name: 'Rengöra filter (Klädvård/Köksfläkt)',
    category: 'Övrigt',
    description: 'Rengör köksfläktens fettfilter och torktumlarens luddfilter.',
    duration: 20,
    frequency: 'monthly',
    priority: 'low',
    icon: '🌀'
  }
];

export const INITIAL_DEMO_TASKS = [
  {
    id: 'demo-1',
    name: 'Laga middag',
    category: 'Mat',
    description: 'Laga krämig pasta med soltorkade tomater.',
    duration: 45,
    frequency: 'daily',
    day: 'monday',
    time: '17:30',
    priority: 'high',
    completed: true,
    active: true,
    lastCompleted: new Date().toISOString(),
    nextOccurrence: null,
    icon: '🍝'
  },
  {
    id: 'demo-2',
    name: 'Gå ut med sopor',
    category: 'Avfall',
    description: 'Töm restavfall och källsortering.',
    duration: 10,
    frequency: '2-3_weekly',
    day: 'monday',
    time: '19:00',
    priority: 'high',
    completed: true,
    active: true,
    lastCompleted: new Date().toISOString(),
    nextOccurrence: null,
    icon: '🗑️'
  },
  {
    id: 'demo-3',
    name: 'Tvätta kläder',
    category: 'Tvätt',
    description: 'Kör en maskin kulörtvätt 40°C.',
    duration: 90,
    frequency: '2-3_weekly',
    day: 'tuesday',
    time: '18:00',
    priority: 'high',
    completed: false,
    active: true,
    lastCompleted: null,
    nextOccurrence: null,
    icon: '🧺'
  },
  {
    id: 'demo-4',
    name: 'Laga middag',
    category: 'Mat',
    description: 'Laga ugnslax med färskpotatis och romsås.',
    duration: 45,
    frequency: 'daily',
    day: 'wednesday',
    time: '17:30',
    priority: 'high',
    completed: false,
    active: true,
    lastCompleted: null,
    nextOccurrence: null,
    icon: '🍝'
  },
  {
    id: 'demo-5',
    name: 'Dammsuga',
    category: 'Städning',
    description: 'Dammsug hela lägenheten inför helgen.',
    duration: 30,
    frequency: 'weekly',
    day: 'wednesday',
    time: '18:30',
    priority: 'normal',
    completed: false,
    active: true,
    lastCompleted: null,
    nextOccurrence: null,
    icon: '🧹'
  },
  {
    id: 'demo-6',
    name: 'Återvinning',
    category: 'Avfall',
    description: 'Gå till miljöstationen med papper och kartong.',
    duration: 15,
    frequency: 'weekly',
    day: 'thursday',
    time: '17:00',
    priority: 'normal',
    completed: false,
    active: true,
    lastCompleted: null,
    nextOccurrence: null,
    icon: '♻️'
  },
  {
    id: 'demo-7',
    name: 'Rengöra kök',
    category: 'Städning',
    description: 'Skura spishäll och avtorkning av alla bänkar.',
    duration: 25,
    frequency: 'daily',
    day: 'friday',
    time: '18:00',
    priority: 'high',
    completed: false,
    active: true,
    lastCompleted: null,
    nextOccurrence: null,
    icon: '✨'
  },
  {
    id: 'demo-8',
    name: 'Handla mat',
    category: 'Mat',
    description: 'Storhandla inför nästa vecka.',
    duration: 60,
    frequency: 'weekly',
    day: 'saturday',
    time: '11:00',
    priority: 'high',
    completed: false,
    active: true,
    lastCompleted: null,
    nextOccurrence: null,
    icon: '🛒'
  },
  {
    id: 'demo-9',
    name: 'Byta sängkläder',
    category: 'Städning',
    description: 'Rebädda sängen med rena lakan.',
    duration: 20,
    frequency: 'biweekly',
    day: 'sunday',
    time: '14:00',
    priority: 'normal',
    completed: false,
    active: true,
    lastCompleted: null,
    nextOccurrence: null,
    icon: '🛏️'
  },
  {
    id: 'demo-10',
    name: 'Planera veckans mat',
    category: 'Mat',
    description: 'Sätt ihop veckosedel för vecka 38.',
    duration: 30,
    frequency: 'weekly',
    day: 'sunday',
    time: '16:00',
    priority: 'high',
    completed: false,
    active: true,
    lastCompleted: null,
    nextOccurrence: null,
    icon: '📝'
  }
];
