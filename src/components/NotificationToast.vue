<template>
  <transition name="toast-fade">
    <div v-if="message" class="toast-container" :class="type">
      <span class="toast-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else>ℹ️</span>
      </span>
      <span class="toast-message">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'success'
  }
});
</script>

