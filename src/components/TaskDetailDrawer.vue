<template>
  <teleport to="body">
    <transition name="drawer-fade">
      <div v-if="task" class="drawer-overlay" @click.self="$emit('close')">
        <div class="drawer-panel">
          <!-- Drawer Header -->
          <div class="drawer-header">
            <div class="header-title-wrap">
              <span class="category-icon-bg">{{ task.icon || '✨' }}</span>
              <div>
                <span class="badge badge-category">{{ task.category }}</span>
                <h2 class="drawer-task-name" :class="{ 'line-through': isCompleted }">{{ task.name }}</h2>
              </div>
            </div>

            <button class="btn-icon close-btn" @click="$emit('close')" title="Stäng panel">✕</button>
          </div>

          <!-- Drawer Body -->
          <div class="drawer-body">
            <!-- Completion Status Toggle Card -->
            <div 
              class="completion-status-card" 
              :class="{ 'is-completed': isCompleted }"
              @click="$emit('toggle-complete', task, dayDate)"
            >
              <div class="big-checkbox" :class="{ checked: isCompleted }">
                <svg v-if="isCompleted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              <div class="status-text">
                <span class="status-label">{{ isCompleted ? '✓ Utförd syssla' : '☐ Ej utförd syssla' }}</span>
                <span class="status-sub">{{ isCompleted ? 'Klicka för att markera som ej klar' : 'Klicka för att markera som klar' }}</span>
              </div>
            </div>

            <!-- Details Section -->
            <div class="details-section">
              <h3 class="section-heading">Information & Schemaläggning</h3>

              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">📅 Veckodag & Tid</span>
                  <span class="detail-value">{{ dayLabel }} kl. {{ task.time || '12:00' }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">⏱️ Uppskattad tid</span>
                  <span class="detail-value">{{ formattedDuration }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">🔴 Prioritet</span>
                  <span class="detail-value">
                    <span class="badge" :class="'badge-priority-' + task.priority">
                      {{ priorityLabel }}
                    </span>
                  </span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">🔄 Frekvens</span>
                  <span class="detail-value">{{ frequencyLabel }}</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div v-if="task.description" class="description-section">
              <h3 class="section-heading">Beskrivning</h3>
              <p class="description-text">{{ task.description }}</p>
            </div>

            <!-- Next Occurrence Recommendation Banner -->
            <div v-if="nextOccurrenceText && task.completed" class="next-occurrence-card">
              <span class="next-icon">🔄</span>
              <div>
                <strong>Nästa rekommenderade tillfälle:</strong>
                <p>{{ nextOccurrenceText }}</p>
              </div>
            </div>
          </div>

          <!-- Drawer Footer Actions -->
          <div class="drawer-footer">
            <button class="btn btn-secondary" @click="$emit('edit', task)">
              ✏️ Redigera syssla
            </button>

            <button class="btn btn-danger" @click="$emit('delete', task.id)">
              🗑️ Ta bort
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue';
import { formatDuration, calculateNextOccurrence, DAYS_OF_WEEK, isTaskCompletedOnDate } from '../utils/dateUtils.js';
import { FREQUENCY_TYPES } from '../data/defaultTasks.js';

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  dayDate: {
    type: String,
    default: null
  }
});

defineEmits(['close', 'toggle-complete', 'edit', 'delete']);

const isCompleted = computed(() => isTaskCompletedOnDate(props.task, props.dayDate));
const formattedDuration = computed(() => props.task ? formatDuration(props.task.duration) : '');

const dayLabel = computed(() => {
  if (!props.task || !props.task.day) return 'Ej schemalagd';
  const d = DAYS_OF_WEEK.find(item => item.id === props.task.day);
  return d ? d.name : props.task.day;
});

const priorityLabel = computed(() => {
  if (!props.task) return '';
  switch (props.task.priority) {
    case 'high': return '🔴 Hög prioritet';
    case 'normal': return '🟡 Normal prioritet';
    case 'low': return '🟢 Låg prioritet';
    default: return 'Normal';
  }
});

const frequencyLabel = computed(() => {
  if (!props.task) return '';
  const f = FREQUENCY_TYPES.find(item => item.value === props.task.frequency);
  return f ? f.label : props.task.frequency || 'Engångs';
});

const nextOccurrenceText = computed(() => {
  if (!props.task || !props.task.frequency || props.task.frequency === 'none' || !isCompleted.value) return null;
  return calculateNextOccurrence(props.task, props.task.lastCompleted);
});
</script>

