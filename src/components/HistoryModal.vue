<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h3>📜 Historik över genomförda sysslor</h3>
        <button class="btn-icon" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <div v-if="history.length > 0" class="history-list">
          <div v-for="item in history" :key="item.id" class="history-item">
            <div class="history-item-left">
              <span class="check-icon">✓</span>
              <div>
                <h4 class="task-title">{{ item.taskName }}</h4>
                <span class="badge badge-category">{{ item.category }}</span>
              </div>
            </div>
            <div class="history-item-right">
              <span class="status-badge">Klar</span>
              <span class="timestamp">{{ item.formattedDate }}</span>
            </div>
          </div>
        </div>

        <div v-else class="history-empty">
          <span class="empty-emoji">📜</span>
          <h4>Ingen historik ännu</h4>
          <p>När du markerar sysslor som klara i veckoschemat sparas de här.</p>
        </div>
      </div>

      <div class="modal-footer">
        <button v-if="history.length > 0" class="btn btn-danger btn-sm" @click="$emit('clear-history')">
          🗑️ Rensa historik
        </button>
        <button class="btn btn-secondary" @click="$emit('close')">Stäng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  history: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close', 'clear-history']);
</script>

