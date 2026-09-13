<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h3>⚙️ Inställningar</h3>
        <button class="btn-icon" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <!-- User Name -->
        <div class="form-group">
          <label for="user-name-input">Ditt namn</label>
          <input 
            id="user-name-input" 
            v-model="localSettings.name" 
            type="text" 
            class="form-control" 
            placeholder="Ditt namn..."
          />
        </div>

        <!-- View Mode Default -->
        <div class="form-group">
          <label for="default-view-mode">Standard visningsläge</label>
          <select id="default-view-mode" v-model="localSettings.viewMode" class="form-control">
            <option value="standard">📄 Standard (Veckoplanering med alla 7 dagar lika synliga)</option>
            <option value="compact">🗜️ Kompakt (Månadsöversikt där sysslor visas som ikoner)</option>
            <option value="focus">🎯 Fokus (Framhäver dagens datum & tonar ner övriga 6 dagar)</option>
          </select>
        </div>

        <!-- Show Completed Tasks -->
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="localSettings.showCompleted" style="display: none" />
            <div class="checkbox-custom">
              <span v-if="localSettings.showCompleted">✓</span>
            </div>
            <span>Visa klara sysslor i schemat</span>
          </label>
        </div>

        <!-- Time Format -->
        <div class="form-group">
          <label for="time-format">Tidsformat</label>
          <select id="time-format" v-model="localSettings.timeFormat" class="form-control">
            <option value="24h">24 timmar (17:30)</option>
            <option value="12h">12 timmar (5:30 PM)</option>
          </select>
        </div>

        <hr class="divider" />

        <!-- Reset Data -->
        <div class="reset-section">
          <h4>Data & Demo-återställning</h4>
          <p class="help-text">Om du vill nollställa alla ändringar och återgå till ursprunglig demo-data.</p>
          <button class="btn btn-danger btn-sm" @click="handleReset">
            🔄 Återställ till demo-data
          </button>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Avbryt</button>
        <button class="btn btn-primary" @click="save">Spara inställningar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save', 'reset-data']);

const localSettings = reactive({ ...props.settings });

onMounted(() => {
  Object.assign(localSettings, props.settings);
});

function save() {
  emit('save', { ...localSettings });
}

function handleReset() {
  if (confirm('Är du säker på att du vill återställa alla sysslor till ursprunglig demo-data?')) {
    emit('reset-data');
  }
}
</script>

