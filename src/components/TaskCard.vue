<template>
  <div 
    class="task-card"
    :class="[
      `priority-${task.priority}`,
      {
        'completed': isCompleted,
        'inactive': !task.active
      }
    ]"
    @click="$emit('select-task', task)"
  >
    <!-- Top Row: Title & 3-Dots Menu -->
    <div class="card-header">
      <h4 class="task-title" :class="{ 'line-through': isCompleted }">{{ task.name }}</h4>

      <div class="menu-wrap" @click.stop>
        <button class="btn-kebab" @click.stop="toggleMenu" title="Alternativ">
          ⋮
        </button>

        <div v-if="showMenu" class="kebab-dropdown" @click.stop>
          <button class="dropdown-item" @click.stop="handleToggle">
            <span>{{ isCompleted ? '☐ Ej klar' : '✓ Markera klar' }}</span>
          </button>
          <button class="dropdown-item" @click.stop="handleEdit">
            <span>✏️ Redigera</span>
          </button>
          <button class="dropdown-item danger" @click.stop="handleDelete">
            <span>🗑️ Ta bort</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Middle Row: Checkbox + Time (No clock emoji) -->
    <div class="card-time-row">
      <div class="task-checkbox-wrap" @click.stop="$emit('toggle-complete', task, dayDate)">
        <div class="checkbox" :class="{ checked: isCompleted }">
          <svg v-if="isCompleted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
      <span class="task-time-text">{{ task.time || '12:00' }}</span>
    </div>

    <!-- Bottom Row: Category Icon (bottom left) + Duration (No duration emoji) -->
    <div class="card-duration-row">
      <span class="task-icon">{{ task.icon || getCategoryIcon(task.category) }}</span>
      <span class="task-duration-text">{{ formattedDuration }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { formatDuration, isTaskCompletedOnDate } from '../utils/dateUtils.js';

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  dayDate: {
    type: String,
    default: null
  },
  viewMode: {
    type: String,
    default: 'standard'
  }
});

const emit = defineEmits(['select-task', 'toggle-complete', 'edit', 'delete']);

const showMenu = ref(false);

const isCompleted = computed(() => isTaskCompletedOnDate(props.task, props.dayDate));
const formattedDuration = computed(() => formatDuration(props.task.duration));

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function closeMenu() {
  showMenu.value = false;
}

function handleToggle() {
  closeMenu();
  emit('toggle-complete', props.task, props.dayDate);
}

function handleEdit() {
  closeMenu();
  emit('edit', props.task);
}

function handleDelete() {
  closeMenu();
  emit('delete', props.task.id);
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

function handleGlobalClick() {
  if (showMenu.value) {
    showMenu.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick);
});
</script>

