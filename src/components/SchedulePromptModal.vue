<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container prompt-modal">
      <div class="modal-header">
        <h3>📅 Schemalägg "{{ task ? task.name : 'Syssla' }}"</h3>
        <button class="btn-icon" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body" v-if="task">
        <div class="task-summary-banner">
          <span class="summary-icon">{{ task.icon || '✨' }}</span>
          <div>
            <h4>{{ task.name }}</h4>
            <p>{{ task.category }} · ⏱️ {{ task.duration }} min</p>
          </div>
        </div>

        <div class="form-group margin-top">
          <label for="schedule-day">Välj veckodag *</label>
          <select id="schedule-day" v-model="selectedDay" class="form-control">
            <option v-for="d in days" :key="d.id" :value="d.id">
              {{ d.name }} {{ d.formattedDate }} {{ d.isToday ? '(Idag)' : '' }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="schedule-time">Klockslag *</label>
          <input 
            id="schedule-time" 
            v-model="selectedTime" 
            type="time" 
            class="form-control" 
          />
        </div>

        <div class="form-group">
          <label for="schedule-priority">Prioritet</label>
          <select id="schedule-priority" v-model="selectedPriority" class="form-control">
            <option value="high">🔴 Hög</option>
            <option value="normal">🟡 Normal</option>
            <option value="low">🟢 Låg</option>
          </select>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Avbryt</button>
        <button class="btn btn-primary" @click="confirmSchedule">
          ➕ Lägg till i schemat
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  task: { type: Object, default: null },
  days: { type: Array, required: true }
});

const emit = defineEmits(['close', 'confirm']);

const selectedDay = ref(props.days[0]?.id || 'monday');
const selectedTime = ref('12:00');
const selectedPriority = ref(props.task?.priority || 'normal');

function confirmSchedule() {
  if (!props.task) return;
  emit('confirm', {
    ...props.task,
    day: selectedDay.value,
    time: selectedTime.value,
    priority: selectedPriority.value
  });
}
</script>

