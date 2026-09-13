<template>
  <div class="month-calendar-container">
    <div class="month-header">
      <div class="month-title-wrap">
        <h3>📅 Månadsöversikt – {{ monthName }} {{ year }}</h3>
        <span class="month-subtitle">Kompakt läge: visar schemalagda ikoner per dag</span>
      </div>

      <div class="month-nav-controls">
        <button class="btn btn-secondary btn-sm" @click="prevMonth">← Föregående månad</button>
        <span class="month-label">{{ monthName }} {{ year }}</span>
        <button class="btn btn-secondary btn-sm" @click="nextMonth">Nästa månad →</button>
      </div>
    </div>

    <!-- Day of week headers (Mån-Sön) -->
    <div class="month-grid-header">
      <div v-for="d in daysOfWeek" :key="d.id" class="month-dow-cell">
        {{ d.short }}
      </div>
    </div>

    <!-- 35/42 Days Month Grid -->
    <div class="month-grid">
      <div 
        v-for="dayObj in monthDays" 
        :key="dayObj.dateStr" 
        class="month-day-cell"
        :class="{ 
          'other-month': !dayObj.isCurrentMonth,
          'is-today': dayObj.isToday
        }"
        @click="$emit('add-task-for-day', dayObj.dayOfWeekId)"
      >
        <div class="day-num-row">
          <span class="day-number" :class="{ 'today-num': dayObj.isToday }">
            {{ dayObj.dayNumber }}
          </span>
          <span v-if="dayObj.isToday" class="today-tag">Idag</span>
        </div>

        <!-- Task Icons List -->
        <div class="day-task-icons">
          <div 
            v-for="task in getTasksForDate(dayObj.dayOfWeekId)" 
            :key="task.id"
            class="task-icon-pill"
            :class="{ 'completed-pill': isTaskCompletedOnDate(task, dayObj.dateStr), [`prio-${task.priority}`]: true }"
            :title="`${task.name} (${task.time || '12:00'})`"
            @click.stop="$emit('select-task', task, dayObj.dateStr)"
          >
            <span class="pill-icon">{{ task.icon || getCategoryIcon(task.category) }}</span>
            <span class="pill-time">{{ task.time || '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { DAYS_OF_WEEK, formatLocalDateStr, isTaskCompletedOnDate } from '../utils/dateUtils.js';

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  currentYear: {
    type: Number,
    required: true
  },
  currentWeekNum: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['select-task', 'add-task-for-day']);

const daysOfWeek = DAYS_OF_WEEK;

const currentMonthDate = ref(new Date());

const year = computed(() => currentMonthDate.value.getFullYear());
const monthIndex = computed(() => currentMonthDate.value.getMonth());

const monthNames = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
const monthName = computed(() => monthNames[monthIndex.value]);

function prevMonth() {
  const d = new Date(currentMonthDate.value);
  d.setMonth(d.getMonth() - 1);
  currentMonthDate.value = d;
}

function nextMonth() {
  const d = new Date(currentMonthDate.value);
  d.setMonth(d.getMonth() + 1);
  currentMonthDate.value = d;
}

const monthDays = computed(() => {
  const y = year.value;
  const m = monthIndex.value;
  
  const firstDayOfMonth = new Date(y, m, 1);
  const lastDayOfMonth = new Date(y, m + 1, 0);

  // ISO weekday of 1st day (1=Mon, 7=Sun)
  let firstDow = firstDayOfMonth.getDay();
  if (firstDow === 0) firstDow = 7;

  const days = [];
  const todayStr = formatLocalDateStr(new Date());

  // Padding days from previous month
  const prevMonthLastDay = new Date(y, m, 0).getDate();
  for (let i = firstDow - 1; i > 0; i--) {
    const dObj = new Date(y, m - 1, prevMonthLastDay - i + 1);
    const dowIdx = (dObj.getDay() || 7) - 1;
    days.push({
      dateStr: formatLocalDateStr(dObj),
      dayNumber: dObj.getDate(),
      isCurrentMonth: false,
      isToday: formatLocalDateStr(dObj) === todayStr,
      dayOfWeekId: DAYS_OF_WEEK[dowIdx].id
    });
  }

  // Days of current month
  for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
    const dObj = new Date(y, m, d);
    const dowIdx = (dObj.getDay() || 7) - 1;
    days.push({
      dateStr: formatLocalDateStr(dObj),
      dayNumber: d,
      isCurrentMonth: true,
      isToday: formatLocalDateStr(dObj) === todayStr,
      dayOfWeekId: DAYS_OF_WEEK[dowIdx].id
    });
  }

  // Padding days for next month to complete 35 or 42 grid cells
  const remaining = 35 - days.length > 0 ? 35 - days.length : (42 - days.length > 0 ? 42 - days.length : 0);
  for (let i = 1; i <= remaining; i++) {
    const dObj = new Date(y, m + 1, i);
    const dowIdx = (dObj.getDay() || 7) - 1;
    days.push({
      dateStr: formatLocalDateStr(dObj),
      dayNumber: i,
      isCurrentMonth: false,
      isToday: formatLocalDateStr(dObj) === todayStr,
      dayOfWeekId: DAYS_OF_WEEK[dowIdx].id
    });
  }

  return days;
});

function getTasksForDate(dayOfWeekId) {
  return props.tasks.filter(t => t.day === dayOfWeekId);
}

function getCategoryIcon(cat) {
  switch (cat) {
    case 'Städning': return '🧹';
    case 'Tvätt': return '🧺';
    case 'Mat': return '🍝';
    case 'Avfall': return '🗑️';
    default: return '✨';
  }
}
</script>

