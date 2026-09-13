<template>
  <div class="mobile-day-view">
    <!-- Day Navigation Bar -->
    <div class="mobile-day-nav">
      <button class="btn btn-icon" @click="prevDay" title="Föregående dag">
        ◀
      </button>

      <div class="current-day-selector">
        <select v-model="selectedDayId" class="day-select">
          <option v-for="d in weekDays" :key="d.id" :value="d.id">
            {{ d.name }} {{ d.formattedDate }} {{ d.isToday ? '(Idag)' : '' }}
          </option>
        </select>
      </div>

      <button class="btn btn-icon" @click="nextDay" title="Nästa dag">
        ▶
      </button>
    </div>

    <!-- Active Day Header -->
    <div class="active-day-header" v-if="activeDayObj">
      <div class="title-wrap">
        <h2>{{ activeDayObj.name }}</h2>
        <span class="date-text">{{ activeDayObj.formattedDate }}</span>
      </div>
      <span v-if="activeDayObj.isToday" class="today-badge">Idag</span>
    </div>

    <!-- Task Cards Container -->
    <div :class="['mobile-tasks-container', `view-${viewMode}`]">
      <TaskCard
        v-for="task in activeDayTasks"
        :key="task.id"
        :task="task"
        :day-date="activeDayObj?.date"
        :view-mode="viewMode"
        @select-task="(task, date) => $emit('select-task', task, date || activeDayObj?.date)"
        @toggle-complete="(task, date) => $emit('toggle-complete', task, date || activeDayObj?.date)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />

      <div v-if="activeDayTasks.length === 0" class="mobile-empty-state">
        <span class="empty-emoji">🎉</span>
        <h3>Inga sysslor planerade</h3>
        <p>Du har inga schemalagda sysslor för den här dagen.</p>
        <button class="btn btn-primary btn-sm" @click="$emit('add-task-for-day', selectedDayId)">
          + Lägg till syssla
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import TaskCard from './TaskCard.vue';

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

const emit = defineEmits(['select-task', 'toggle-complete', 'edit', 'delete', 'add-task-for-day']);

const defaultDayId = computed(() => {
  const todayObj = props.weekDays.find(d => d.isToday);
  return todayObj ? todayObj.id : props.weekDays[0]?.id || 'monday';
});

const selectedDayId = ref(defaultDayId.value);

watch(defaultDayId, (newVal) => {
  if (newVal) selectedDayId.value = newVal;
});

const activeDayObj = computed(() => {
  return props.weekDays.find(d => d.id === selectedDayId.value);
});

const activeDayTasks = computed(() => {
  return props.tasks.filter(t => t.day === selectedDayId.value);
});

function prevDay() {
  const idx = props.weekDays.findIndex(d => d.id === selectedDayId.value);
  if (idx > 0) {
    selectedDayId.value = props.weekDays[idx - 1].id;
  }
}

function nextDay() {
  const idx = props.weekDays.findIndex(d => d.id === selectedDayId.value);
  if (idx < props.weekDays.length - 1) {
    selectedDayId.value = props.weekDays[idx + 1].id;
  }
}
</script>

