<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-container confirm-modal">
      <div class="modal-header">
        <h3>⚠️ Bekräfta borttagning</h3>
        <button class="btn-icon" @click="$emit('cancel')">✕</button>
      </div>

      <div class="modal-body">
        <p class="confirm-message">
          Vill du verkligen ta bort sysslan <strong>"{{ taskName }}"</strong>?
        </p>
        <p class="sub-message">Åtgärden går inte att ångra.</p>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('cancel')">Avbryt</button>
        <button class="btn btn-danger" @click="$emit('confirm')">🗑️ Ta bort</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  taskName: {
    type: String,
    default: ''
  }
});

defineEmits(['confirm', 'cancel']);
</script>

