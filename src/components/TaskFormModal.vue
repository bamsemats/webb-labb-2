<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ isEditing ? '✏️ Redigera syssla' : '➕ Ny syssla' }}</h3>
        <button class="btn-icon" @click="$emit('close')">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div v-if="errorMessage" class="error-banner">
          ⚠️ {{ errorMessage }}
        </div>

        <!-- Name -->
        <div class="form-group">
          <label for="task-name">Namn på sysslan *</label>
          <input 
            id="task-name" 
            v-model.trim="formData.name" 
            type="text" 
            class="form-control" 
            placeholder="t.ex. Dammsuga vardagsrum" 
            required 
          />
        </div>

        <!-- Category & Priority Row -->
        <div class="form-row">
          <div class="form-group">
            <label for="task-category">Kategori</label>
            <select id="task-category" v-model="formData.category" class="form-control">
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="task-priority">Prioritet</label>
            <select id="task-priority" v-model="formData.priority" class="form-control">
              <option value="high">🔴 Hög</option>
              <option value="normal">🟡 Normal</option>
              <option value="low">🟢 Låg</option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="task-description">Beskrivning (valfritt)</label>
          <textarea 
            id="task-description" 
            v-model="formData.description" 
            class="form-control" 
            rows="2" 
            placeholder="Tilläggsinformation..."
          ></textarea>
        </div>

        <!-- Frequency & Duration Row -->
        <div class="form-row">
          <div class="form-group">
            <label for="task-frequency">Frekvens</label>
            <select id="task-frequency" v-model="formData.frequency" class="form-control">
              <option v-for="freq in frequencyTypes" :key="freq.value" :value="freq.value">
                {{ freq.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="task-duration">Uppskattad tid (minuter)</label>
            <input 
              id="task-duration" 
              v-model.number="formData.duration" 
              type="number" 
              min="5" 
              max="480" 
              step="5" 
              class="form-control" 
            />
          </div>
        </div>

        <!-- Scheduled Day & Time Row -->
        <div class="form-row">
          <div class="form-group">
            <label for="task-day">Planerad veckodag</label>
            <select id="task-day" v-model="formData.day" class="form-control">
              <option value="none">🚫 Ingen dag (Inaktiv / Ej schemalagd)</option>
              <option v-for="day in daysOfWeek" :key="day.id" :value="day.id">
                {{ day.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="task-time">Klockslag</label>
            <input 
              id="task-time" 
              v-model="formData.time" 
              type="time" 
              class="form-control" 
            />
          </div>
        </div>

        <!-- Active Toggle -->
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="formData.active" style="display: none" />
            <div class="checkbox-custom">
              <span v-if="formData.active">✓</span>
            </div>
            <span>Aktiv syssla (visas i schemat)</span>
          </label>
        </div>

        <button type="submit" style="display: none"></button>
      </form>

      <div class="modal-footer">
        <button 
          v-if="isEditing" 
          class="btn btn-danger btn-sm" 
          @click="handleRemoveFromDay"
          title="Ta bort denna syssla helt från schemat"
        >
          🗑️ Ta bort från denna dag
        </button>

        <div class="right-actions">
          <button class="btn btn-secondary" @click="$emit('close')">Avbryt</button>
          <button class="btn btn-primary" @click="handleSubmit">
            {{ isEditing ? 'Spara ändringar' : 'Spara syssla' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { PRESET_CATEGORIES, FREQUENCY_TYPES } from '../data/defaultTasks.js';
import { DAYS_OF_WEEK } from '../utils/dateUtils.js';

const props = defineProps({
  taskToEdit: {
    type: Object,
    default: null
  },
  defaultDay: {
    type: String,
    default: 'monday'
  }
});

const emit = defineEmits(['close', 'save', 'delete']);

const categories = PRESET_CATEGORIES;
const frequencyTypes = FREQUENCY_TYPES;
const daysOfWeek = DAYS_OF_WEEK;

const isEditing = computed(() => !!props.taskToEdit);
const errorMessage = ref('');

const formData = reactive({
  id: null,
  name: '',
  category: 'Städning',
  description: '',
  duration: 30,
  frequency: 'weekly',
  priority: 'normal',
  day: props.defaultDay || 'monday',
  time: '12:00',
  active: true,
  completed: false,
  lastCompleted: null
});

onMounted(() => {
  if (props.taskToEdit) {
    Object.assign(formData, props.taskToEdit);
  }
});

function handleRemoveFromDay() {
  if (confirm(`Vill du ta bort "${formData.name}" från denna dag?`)) {
    emit('delete', formData.id);
    emit('close');
  }
}

function handleSubmit() {
  if (!formData.name) {
    errorMessage.value = 'Vänligen ange ett namn på sysslan.';
    return;
  }

  if (formData.duration <= 0) {
    errorMessage.value = 'Ange en giltig tidsåtgång i minuter.';
    return;
  }

  if (formData.day === 'none') {
    formData.active = false;
  }

  errorMessage.value = '';
  emit('save', { ...formData });
}
</script>

