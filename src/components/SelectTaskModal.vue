<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <div>
          <h3>➕ Välj syssla för {{ dayName }}</h3>
          <p class="subtitle">Välj en existerande syssla från ditt bibliotek eller skapa en ny.</p>
        </div>
        <button class="btn-icon" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <button class="btn btn-secondary create-new-banner" @click="$emit('open-create-new', dayId)">
          ✨ Skapa en helt ny syssla från grunden
        </button>

        <div class="search-box margin-v">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control search-input" 
            placeholder="Sök bland dina sparade sysslor..." 
          />
        </div>

        <div class="preset-pick-list">
          <div 
            v-for="task in filteredTasks" 
            :key="task.name" 
            class="preset-pick-item"
            @click="selectTask(task)"
          >
            <div class="item-left">
              <span class="item-icon">{{ task.icon || '✨' }}</span>
              <div>
                <h4 class="item-name">{{ task.name }}</h4>
                <span class="item-meta">{{ task.category }} · ⏱️ {{ task.duration }} min</span>
              </div>
            </div>

            <button class="btn btn-primary btn-sm">
              + Välj
            </button>
          </div>
        </div>

        <div v-if="filteredTasks.length === 0" class="empty-pick">
          <p>Inga matchande sysslor hittades.</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Stäng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { PRESET_TASKS } from '../data/defaultTasks.js';

const props = defineProps({
  dayId: { type: String, required: true },
  dayName: { type: String, default: 'veckodagen' }
});

const emit = defineEmits(['close', 'select-task', 'open-create-new']);

const searchQuery = ref('');

const filteredTasks = computed(() => {
  const q = searchQuery.value.toLowerCase();
  if (!q) return PRESET_TASKS;
  return PRESET_TASKS.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
});

function selectTask(task) {
  emit('select-task', {
    ...task,
    day: props.dayId
  });
}
</script>

