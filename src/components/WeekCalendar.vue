<template>
  <div class="week-calendar-container">
    <div :class="['week-grid', `view-${viewMode}`]">
      <DayColumn
        v-for="day in weekDays"
        :key="day.id"
        :day="day"
        :tasks="getTasksForDay(day.id)"
        :view-mode="viewMode"
        @select-task="(task, date) => $emit('select-task', task, date)"
        @toggle-complete="(task, date) => $emit('toggle-complete', task, date)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @add-task-for-day="$emit('add-task-for-day', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import DayColumn from './DayColumn.vue';

const props = defineProps({
  weekDays: {
    type: Array,
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

function getTasksForDay(dayId) {
  return props.tasks.filter(task => task.day === dayId);
}
</script>

