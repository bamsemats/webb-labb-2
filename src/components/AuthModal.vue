<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h3>👤 Användarkonto & Profil</h3>
        <button class="btn-icon" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <div class="auth-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: isLoginMode }"
            @click="isLoginMode = true"
          >
            Logga in
          </button>

          <button 
            class="tab-btn" 
            :class="{ active: !isLoginMode }"
            @click="isLoginMode = false"
          >
            Registrera ny användare
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group" v-if="!isLoginMode">
            <label for="reg-name">Namn *</label>
            <input 
              id="reg-name" 
              v-model.trim="form.name" 
              type="text" 
              class="form-control" 
              placeholder="Ditt för- och efternamn" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="auth-email">E-postadress *</label>
            <input 
              id="auth-email" 
              v-model.trim="form.email" 
              type="email" 
              class="form-control" 
              placeholder="anna@example.com" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="auth-password">Lösenord *</label>
            <input 
              id="auth-password" 
              v-model="form.password" 
              type="password" 
              class="form-control" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" class="btn btn-primary full-width">
            {{ isLoginMode ? '🔑 Logga in' : '✨ Skapa konto' }}
          </button>
        </form>

        <hr class="divider" />

        <div class="preset-profiles">
          <label class="profiles-label">Snabbinloggning med demo-profiler:</label>
          <div class="profile-buttons">
            <button 
              class="btn btn-secondary btn-sm"
              @click="loginDemoProfile('Anna (Ensamstående)', 'anna@demo.se')"
            >
              👩 Anna (Ensamstående)
            </button>
            <button 
              class="btn btn-secondary btn-sm"
              @click="loginDemoProfile('Erik & Maja (Familj)', 'familjen@demo.se')"
            >
              👨‍👩‍👧 Erik & Maja (Familj)
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const emit = defineEmits(['close', 'login']);

const isLoginMode = ref(true);

const form = reactive({
  name: '',
  email: '',
  password: ''
});

function handleSubmit() {
  const userName = isLoginMode.value 
    ? (form.email.split('@')[0] || 'Användare')
    : (form.name || 'Användare');

  emit('login', {
    id: `u-${Date.now()}`,
    name: userName.charAt(0).toUpperCase() + userName.slice(1),
    email: form.email,
    isLoggedIn: true
  });
}

function loginDemoProfile(name, email) {
  emit('login', {
    id: `u-${Date.now()}`,
    name: name,
    email: email,
    isLoggedIn: true
  });
}
</script>

