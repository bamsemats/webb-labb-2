<template>
  <div class="day-column" :class="{ 'is-today': day.isToday }">
    <div class="day-column-header">
      <div class="day-info">
        <span class="day-name">{{ day.name }}</span>
        <span class="day-date">{{ day.formattedDate }}</span>
      </div>

      <div class="header-badges">
        <span v-if="day.isToday" class="today-badge">Idag</span>
        <span class="count-badge" :class="{ 'all-done': tasks.length > 0 && completedCount === tasks.length }">
          {{ completedCount }}/{{ tasks.length }}
        </span>
      </div>
    </div>

    <!-- Task List for this day -->
    <div class="day-task-list">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :day-date="day.date"
        :view-mode="viewMode"
        @select-task="(task, date) => $emit('select-task', task, date || day.date)"
        @toggle-complete="(task, date) => $emit('toggle-complete', task, date || day.date)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />

      <!-- Empty state -->
      <div v-if="tasks.length === 0" class="empty-day-state">
        <span class="empty-icon">☕</span>
        <p>Inga sysslor planerade</p>
      </div>
    </div>

    <button 
      class="add-task-day-btn" 
      @click="$emit('add-task-for-day', day.id)"
      title="Välj eller lägg till syssla på denna dag"
    >
      + Lägg till
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import TaskCard from './TaskCard.vue';
import { isTaskCompletedOnDate } from '../utils/dateUtils.js';

const props = defineProps({
  day: {
    type: Object,
    required: true
  },
  tasks: {
    type: Array,
    default: () => []
  },
  viewMode: {
    type: String,
    default: 'standard'
  }
});

defineEmits(['select-task', 'toggle-complete', 'edit', 'delete', 'add-task-for-day']);

const completedCount = computed(() => {
  return props.tasks.filter(t => isTaskCompletedOnDate(t, props.day.date)).length;
});
</script>

