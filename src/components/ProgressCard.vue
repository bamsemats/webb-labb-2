<template>
  <div class="progress-card">
    <div class="progress-header">
      <div class="progress-title-wrap">
        <h3>Veckans framsteg</h3>
        <span class="progress-subtitle">
          {{ completedCount }} av {{ totalCount }} sysslor klara ({{ percentCompleted }}%)
        </span>
      </div>

      <span class="progress-percentage-badge">
        {{ percentCompleted }}%
      </span>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bar-track">
      <div 
        class="progress-bar-fill"
        :style="{ width: percentCompleted + '%' }"
      ></div>
    </div>

    <!-- Statistics Summary Grid -->
    <div class="progress-stats-grid">
      <div class="stat-item">
        <span class="stat-label">Planerad tid</span>
        <span class="stat-value">⏱️ {{ formattedTotalDuration }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">Genomförd tid</span>
        <span class="stat-value text-success">✅ {{ formattedCompletedDuration }}</span>
      </div>

      <div class="stat-item">
        <span class="stat-label">Återstående</span>
        <span class="stat-value text-warning">⏳ {{ totalCount - completedCount }} sysslor</span>
      </div>
    </div>

    <!-- Motivational Callout -->
    <div class="progress-motivational" v-if="totalCount > 0">
      <span v-if="percentCompleted === 100">🎉 Fantastiskt jobbat! Alla veckans sysslor är avklarade!</span>
      <span v-else-if="percentCompleted >= 75">🚀 Du är nästan i mål! Bra driv den här veckan.</span>
      <span v-else-if="percentCompleted >= 50">👍 Mer än hälften är klart, fortsätt så!</span>
      <span v-else-if="percentCompleted > 0">💪 En bra start på veckan!</span>
      <span v-else>💡 Välj en syssla att starta med idag.</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { formatDuration, isTaskCompletedOnDate } from '../utils/dateUtils.js';

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  weekDays: {
    type: Array,
    default: () => []
  }
});

function isTaskDoneForWeek(task) {
  if (!props.weekDays || props.weekDays.length === 0) {
    return isTaskCompletedOnDate(task, null);
  }
  const dayObj = props.weekDays.find(d => d.id === task.day);
  return isTaskCompletedOnDate(task, dayObj ? dayObj.date : null);
}

const totalCount = computed(() => props.tasks.length);
const completedCount = computed(() => props.tasks.filter(t => isTaskDoneForWeek(t)).length);

const percentCompleted = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((completedCount.value / totalCount.value) * 100);
});

const totalDurationMinutes = computed(() => {
  return props.tasks.reduce((sum, t) => sum + (Number(t.duration) || 0), 0);
});

const completedDurationMinutes = computed(() => {
  return props.tasks
    .filter(t => isTaskDoneForWeek(t))
    .reduce((sum, t) => sum + (Number(t.duration) || 0), 0);
});

const formattedTotalDuration = computed(() => formatDuration(totalDurationMinutes.value));
const formattedCompletedDuration = computed(() => formatDuration(completedDurationMinutes.value));
</script>

