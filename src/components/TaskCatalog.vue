<template>
  <div class="catalog-container">
    <div class="catalog-header">
      <div class="catalog-title">
        <h2>📋 Mina sysslor & Bibliotek</h2>
        <p class="subtitle">Välj från färdiga hushållssysslor eller skapa egna unika sysslor.</p>
      </div>

      <button class="btn btn-primary" @click="$emit('open-create-modal')">
        ➕ Skapa ny egen syssla
      </button>
    </div>

    <!-- Search & Category Filters -->
    <div class="catalog-filters">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="form-control search-input" 
          placeholder="Sök bland sysslor (t.ex. Dammsuga, Tvätt, Ugn)..." 
        />
      </div>

      <div class="category-pills">
        <button 
          class="pill-btn" 
          :class="{ active: selectedCategory === 'all' }"
          @click="selectedCategory = 'all'"
        >
          Alla
        </button>

        <button 
          v-for="cat in categories" 
          :key="cat.id"
          class="pill-btn"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Preset Chores Library Grid -->
    <div class="catalog-grid">
      <div 
        v-for="task in filteredPresets" 
        :key="task.name" 
        class="catalog-card"
      >
        <div class="card-top">
          <span class="card-icon">{{ task.icon }}</span>
          <span class="badge badge-category">{{ task.category }}</span>
        </div>

        <h3 class="card-title">{{ task.name }}</h3>
        <p class="card-desc">{{ task.description }}</p>

        <div class="card-details">
          <span>⏱️ {{ formatDuration(task.duration) }}</span>
          <span>🔄 {{ getFrequencyLabel(task.frequency) }}</span>
        </div>

        <button 
          class="btn btn-secondary btn-sm add-preset-btn"
          @click="$emit('open-schedule-prompt', task)"
        >
          📅 Välj dag & Lägg till i mitt schema
        </button>
      </div>
    </div>

    <!-- Empty search result -->
    <div v-if="filteredPresets.length === 0" class="catalog-empty">
      <span class="empty-emoji">🔍</span>
      <h3>Inga sysslor hittades</h3>
      <p>Hittade inga fördefinierade sysslor som matchar din sökning.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { PRESET_TASKS, PRESET_CATEGORIES, FREQUENCY_TYPES } from '../data/defaultTasks.js';
import { formatDuration } from '../utils/dateUtils.js';

defineEmits(['open-create-modal', 'open-schedule-prompt']);

const searchQuery = ref('');
const selectedCategory = ref('all');

const categories = PRESET_CATEGORIES;

const filteredPresets = computed(() => {
  return PRESET_TASKS.filter(task => {
    const matchesCategory = selectedCategory.value === 'all' || task.category === selectedCategory.value;
    const q = searchQuery.value.toLowerCase();
    const matchesSearch = !q || task.name.toLowerCase().includes(q) || task.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
});

function getFrequencyLabel(freqVal) {
  const f = FREQUENCY_TYPES.find(item => item.value === freqVal);
  return f ? f.label : freqVal;
}
</script>

