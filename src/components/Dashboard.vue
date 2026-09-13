<template>
  <div class="dashboard-container">
    <!-- User Greeting Banner -->
    <div class="greeting-banner">
      <div class="greeting-text">
        <h2>Hej {{ userName }}! 👋</h2>
        <p class="greeting-sub">
          Här är din hemplanering för <strong>Vecka {{ weekNum }}</strong> ({{ weekRangeStr }}).
        </p>
      </div>

      <button class="btn btn-primary" @click="$emit('open-create-modal')">
        ➕ Lägg till syssla
      </button>
    </div>

    <!-- Progress Card -->
    <ProgressCard :tasks="filteredTasks" :week-days="weekDays" />

    <!-- Filter & View Mode Bar -->
    <FilterBar 
      v-model:category="filterCategory"
      v-model:status="filterStatus"
      v-model:priority="filterPriority"
      v-model:view-mode="currentViewMode"
    />

    <!-- Week Navigation Header (Shown in Standard & Focus modes) -->
    <div v-if="currentViewMode !== 'compact'" class="week-nav-bar">
      <div class="week-controls">
        <button class="btn btn-secondary btn-sm" @click="$emit('prev-week')">
          ← Föregående vecka
        </button>

        <span class="current-week-title">Vecka {{ weekNum }}, {{ year }}</span>

        <button class="btn btn-secondary btn-sm" @click="$emit('next-week')">
          Nästa vecka →
        </button>

        <button class="btn btn-secondary btn-sm today-btn" @click="$emit('go-today')">
          Idag
        </button>
      </div>

      <div class="active-count-indicator">
        Visar {{ filteredTasks.length }} sysslor
      </div>
    </div>

    <!-- VIEW MODE 1 & 3: Standard & Focus Mode Calendar (Week Grid) -->
    <template v-if="currentViewMode !== 'compact'">
      <!-- Desktop & Tablet Calendar View (7 Columns) -->
      <div class="desktop-only">
        <WeekCalendar
          :week-days="weekDays"
          :tasks="filteredTasks"
          :view-mode="currentViewMode"
          @select-task="(task, date) => $emit('select-task', task, date)"
          @toggle-complete="$emit('toggle-complete', $event)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @add-task-for-day="$emit('add-task-for-day', $event)"
        />
      </div>

      <!-- Mobile Calendar View (1 Day at a time slider) -->
      <div class="mobile-only">
        <MobileDayView
          :week-days="weekDays"
          :tasks="filteredTasks"
          :view-mode="currentViewMode"
          @select-task="(task, date) => $emit('select-task', task, date)"
          @toggle-complete="$emit('toggle-complete', $event)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @add-task-for-day="$emit('add-task-for-day', $event)"
        />
      </div>
    </template>

    <!-- VIEW MODE 2: Compact Mode (Monthly overview where only icons are shown in small cards) -->
    <template v-else>
      <MonthCalendar
        :tasks="filteredTasks"
        :current-year="year"
        :current-week-num="weekNum"
        @select-task="(task, date) => $emit('select-task', task, date)"
        @add-task-for-day="$emit('add-task-for-day', $event)"
      />
    </template>

    <!-- Today's Tasks Section (Hidden on mobile in non-compact view modes) -->
    <div class="todays-tasks-section" :class="{ 'mobile-hide-today-section': currentViewMode !== 'compact' }">
      <div class="section-title">
        <h3>📅 Dagens sysslor ({{ todayDateStr }})</h3>
      </div>

      <div v-if="unfinishedTodayTasks.length > 0" class="today-task-grid">
        <p class="today-status-alert">
          Du har <strong>{{ unfinishedTodayTasks.length }}</strong> sysslor kvar att göra idag.
        </p>

        <div class="cards-wrapper" :class="[`view-${currentViewMode}`]">
          <TaskCard
            v-for="task in todayTasks"
            :key="task.id"
            :task="task"
            :day-date="todayObj?.date"
            :view-mode="currentViewMode"
            @select-task="(task, date) => $emit('select-task', task, date || todayObj?.date)"
            @toggle-complete="(task, date) => $emit('toggle-complete', task, date || todayObj?.date)"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
          />
        </div>
      </div>

      <div v-else-if="todayTasks.length > 0 && unfinishedTodayTasks.length === 0" class="today-all-done-banner">
        <span class="celebrate-emoji">🎉</span>
        <div>
          <h4>Snyggt jobbat!</h4>
          <p>Alla dagens sysslor är avklarade!</p>
        </div>
      </div>

      <div v-else class="today-empty-banner">
        <span>☕ Inga sysslor schemalagda för idag. Njut av dagen!</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProgressCard from './ProgressCard.vue';
import FilterBar from './FilterBar.vue';
import WeekCalendar from './WeekCalendar.vue';
import MobileDayView from './MobileDayView.vue';
import MonthCalendar from './MonthCalendar.vue';
import TaskCard from './TaskCard.vue';
import { isTaskCompletedOnDate } from '../utils/dateUtils.js';

const props = defineProps({
  userName: { type: String, default: 'Anna' },
  weekNum: { type: Number, required: true },
  year: { type: Number, required: true },
  weekDays: { type: Array, required: true },
  tasks: { type: Array, default: () => [] },
  viewMode: { type: String, default: 'standard' }
});

const emit = defineEmits([
  'select-task',
  'open-create-modal', 
  'prev-week', 
  'next-week', 
  'go-today', 
  'toggle-complete', 
  'edit', 
  'delete',
  'add-task-for-day',
  'update:viewMode'
]);

const filterCategory = ref('all');
const filterStatus = ref('all');
const filterPriority = ref('all');

const currentViewMode = computed({
  get: () => props.viewMode,
  set: (val) => emit('update:viewMode', val)
});

const weekRangeStr = computed(() => {
  if (!props.weekDays || props.weekDays.length < 7) return '';
  const first = props.weekDays[0].formattedDate;
  const last = props.weekDays[6].formattedDate;
  return `${first} – ${last}`;
});

const filteredTasks = computed(() => {
  return props.tasks.filter(task => {
    if (!task.active) return false;
    if (filterCategory.value !== 'all' && task.category !== filterCategory.value) return false;

    const dayObj = props.weekDays.find(d => d.id === task.day);
    const isCompletedThisWeek = isTaskCompletedOnDate(task, dayObj ? dayObj.date : null);

    if (filterStatus.value === 'pending' && isCompletedThisWeek) return false;
    if (filterStatus.value === 'completed' && !isCompletedThisWeek) return false;
    if (filterPriority.value !== 'all' && task.priority !== filterPriority.value) return false;
    return true;
  });
});

const todayObj = computed(() => props.weekDays.find(d => d.isToday));

const todayDateStr = computed(() => todayObj.value ? `${todayObj.value.name} ${todayObj.value.formattedDate}` : 'Idag');

const todayTasks = computed(() => {
  if (!todayObj.value) return [];
  return filteredTasks.value.filter(t => t.day === todayObj.value.id);
});

const unfinishedTodayTasks = computed(() => {
  const tDate = todayObj.value?.date;
  return todayTasks.value.filter(t => !isTaskCompletedOnDate(t, tDate));
});
</script>

