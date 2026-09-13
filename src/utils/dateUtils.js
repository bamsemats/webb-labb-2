// Date calculation, frequency analysis, and .ics export utilities

export const DAYS_OF_WEEK = [
  { id: 'monday', name: 'Måndag', short: 'Mån', order: 1 },
  { id: 'tuesday', name: 'Tisdag', short: 'Tis', order: 2 },
  { id: 'wednesday', name: 'Onsdag', short: 'Ons', order: 3 },
  { id: 'thursday', name: 'Torsdag', short: 'Tor', order: 4 },
  { id: 'friday', name: 'Fredag', short: 'Fre', order: 5 },
  { id: 'saturday', name: 'Lördag', short: 'Lör', order: 6 },
  { id: 'sunday', name: 'Söndag', short: 'Sön', order: 7 }
];

export function formatLocalDateStr(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isTaskCompletedOnDate(task, dateStr) {
  if (!task) return false;
  if (dateStr && Array.isArray(task.completedDates)) {
    return task.completedDates.includes(dateStr);
  }
  return !!task.completed;
}

export function getCurrentISOWeek() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { year: d.getFullYear(), weekNum: weekNo };
}

export function getMondayOfISOWeek(year, week) {
  const jan4 = new Date(year, 0, 4);
  const dayOfJan4 = jan4.getDay() || 7;
  const monWeek1 = new Date(jan4);
  monWeek1.setDate(jan4.getDate() - (dayOfJan4 - 1));
  const monday = new Date(monWeek1);
  monday.setDate(monWeek1.getDate() + (week - 1) * 7);
  return monday;
}

export function getWeekDays(year, weekNum) {
  const monday = getMondayOfISOWeek(year, weekNum);
  const todayStr = formatLocalDateStr(new Date());

  return DAYS_OF_WEEK.map((dayMeta, index) => {
    const dateObj = new Date(monday);
    dateObj.setDate(monday.getDate() + index);
    const dateStr = formatLocalDateStr(dateObj);
    const formattedDate = dateObj.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });

    return {
      ...dayMeta,
      date: dateStr,
      formattedDate,
      fullDate: dateObj,
      isToday: dateStr === todayStr
    };
  });
}

export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0 min';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) {
    return `${hrs} h ${mins} min`;
  } else if (hrs > 0) {
    return `${hrs} h`;
  }
  return `${mins} min`;
}

export function calculateNextOccurrence(task, fromDateStr = null) {
  const baseDate = fromDateStr ? new Date(fromDateStr) : new Date();
  const nextDate = new Date(baseDate);

  switch (task.frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case '2-3_weekly':
      nextDate.setDate(nextDate.getDate() + 3);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 7);
  }

  const dayNames = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

  const dayName = dayNames[nextDate.getDay()];
  const dayNum = nextDate.getDate();
  const monthName = monthNames[nextDate.getMonth()];

  return `${dayName} ${dayNum} ${monthName} kl. ${task.time || '12:00'}`;
}

export function exportToICS(tasks, year, weekNum) {
  const days = getWeekDays(year, weekNum);

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HemPlan//Hushallsplanering//SV',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  tasks.forEach(task => {
    const dayObj = days.find(d => d.id === task.day);
    if (!dayObj) return;

    const [hours, mins] = (task.time || '12:00').split(':').map(Number);
    const startDate = new Date(dayObj.fullDate);
    startDate.setHours(hours, mins, 0, 0);

    const endDate = new Date(startDate.getTime() + (task.duration || 30) * 60000);

    const formatDateICS = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:hemplan-${task.id}-${startDate.getTime()}@hemplan.app`);
    icsContent.push(`SUMMARY:${task.name} (${task.category})`);
    icsContent.push(`DESCRIPTION:${(task.description || 'Hushållssyssla i HemPlan').replace(/\n/g, ' ')}`);
    icsContent.push(`DTSTART:${formatDateICS(startDate)}`);
    icsContent.push(`DTEND:${formatDateICS(endDate)}`);
    icsContent.push(`PRIORITY:${task.priority === 'high' ? 1 : task.priority === 'normal' ? 5 : 9}`);
    icsContent.push('STATUS:CONFIRMED');
    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');

  const fileData = icsContent.join('\r\n');
  const blob = new Blob([fileData], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `HemPlan_Vecka_${weekNum}_${year}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
