<template>
  <div class="filter-bar">
    <div class="filters-left">
      <!-- Category Filter -->
      <div class="filter-group">
        <label class="filter-label">Kategori:</label>
        <select 
          :value="category" 
          @change="$emit('update:category', $event.target.value)"
          class="filter-select"
        >
          <option value="all">Alla kategorier</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.icon }} {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Status Filter -->
      <div class="filter-group">
        <label class="filter-label">Status:</label>
        <select 
          :value="status" 
          @change="$emit('update:status', $event.target.value)"
          class="filter-select"
        >
          <option value="all">Alla statusar</option>
          <option value="pending">Ej klara</option>
          <option value="completed">Klara</option>
        </select>
      </div>

      <!-- Priority Filter -->
      <div class="filter-group">
        <label class="filter-label">Prioritet:</label>
        <select 
          :value="priority" 
          @change="$emit('update:priority', $event.target.value)"
          class="filter-select"
        >
          <option value="all">Alla prioriteter</option>
          <option value="high">🔴 Hög</option>
          <option value="normal">🟡 Normal</option>
          <option value="low">🟢 Låg</option>
        </select>
      </div>
    </div>

    <!-- View Mode Switcher -->
    <div class="view-mode-switcher">
      <span class="switcher-label">Visningsläge:</span>
      <div class="segmented-control">
        <button 
          class="btn-segment"
          :class="{ active: viewMode === 'standard' }"
          @click="$emit('update:viewMode', 'standard')"
          title="Standard: Veckoplanering med alla 7 dagar lika synliga"
        >
          📄 Standard
        </button>

        <button 
          class="btn-segment"
          :class="{ active: viewMode === 'compact' }"
          @click="$emit('update:viewMode', 'compact')"
          title="Kompakt: Månadsöversikt där sysslor visas som ikoner per dag"
        >
          🗜️ Kompakt (Månad)
        </button>

        <button 
          class="btn-segment focus-segment-btn"
          :class="{ active: viewMode === 'focus' }"
          @click="$emit('update:viewMode', 'focus')"
          title="Fokus: Framhäver dagens datum & tonar ner de 6 övriga dagarna"
        >
          🎯 Fokus (Idag)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PRESET_CATEGORIES } from '../data/defaultTasks.js';

const categories = PRESET_CATEGORIES;

defineProps({
  category: { type: String, default: 'all' },
  status: { type: String, default: 'all' },
  priority: { type: String, default: 'all' },
  viewMode: { type: String, default: 'standard' }
});

defineEmits(['update:category', 'update:status', 'update:priority', 'update:viewMode']);
</script>

