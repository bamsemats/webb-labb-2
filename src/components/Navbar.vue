<template>
  <header class="navbar">
    <div class="navbar-brand" @click="handleBrandClick">
      <div class="logo-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <div class="brand-text">
        <h1 class="app-title">HemPlan</h1>
        <span class="app-tagline">Din vecka. Ditt hem. Din plan.</span>
      </div>
    </div>

    <!-- Desktop Navigation Links (>1024px) -->
    <nav class="navbar-nav desktop-nav">
      <button 
        class="nav-item" 
        :class="{ active: currentTab === 'dashboard' }"
        @click="$emit('change-tab', 'dashboard')"
      >
        <span>📅</span> Veckoschema
      </button>

      <button 
        class="nav-item" 
        :class="{ active: currentTab === 'catalog' }"
        @click="$emit('change-tab', 'catalog')"
      >
        <span>📋</span> Mina sysslor
      </button>

      <button 
        class="nav-item" 
        @click="$emit('open-history')"
      >
        <span>📜</span> Historik
      </button>
    </nav>

    <!-- Desktop Actions (>1024px) -->
    <div class="navbar-actions desktop-actions">
      <button 
        class="btn btn-secondary btn-sm export-btn" 
        @click="$emit('export-ics')"
        title="Exportera din vecka till .ics-kalenderfil"
      >
        <span>📥</span> Exportera .ics
      </button>

      <button 
        class="btn btn-icon" 
        @click="$emit('open-settings')"
        title="Inställningar"
      >
        ⚙️
      </button>

      <div class="user-pill" @click="$emit('open-auth')">
        <div class="avatar">{{ userInitial }}</div>
        <span class="user-name">{{ userName }}</span>
      </div>
    </div>

    <!-- Mobile/Tablet Hamburger Toggle Button (<1024px) -->
    <div class="mobile-burger-wrap">
      <button 
        class="btn btn-icon hamburger-btn" 
        @click="toggleMobileMenu"
        :title="mobileMenuOpen ? 'Stäng meny' : 'Öppna meny'"
      >
        <span class="burger-icon" v-if="!mobileMenuOpen">☰</span>
        <span class="close-icon" v-else>✕</span>
      </button>
    </div>

    <!-- Mobile Dropdown Menu Panel (<1024px) -->
    <transition name="mobile-menu-fade">
      <div v-if="mobileMenuOpen" class="mobile-dropdown-menu">
        <div class="mobile-user-header" @click="triggerAction('open-auth')">
          <div class="avatar">{{ userInitial }}</div>
          <div class="user-info">
            <span class="user-name-mobile">{{ userName }}</span>
            <span class="user-sub-mobile">Hantera konto & profiler</span>
          </div>
        </div>

        <hr class="menu-divider" />

        <div class="mobile-nav-list">
          <button 
            class="mobile-menu-item"
            :class="{ active: currentTab === 'dashboard' }"
            @click="triggerTab('dashboard')"
          >
            <span class="item-icon">📅</span> Veckoschema
          </button>

          <button 
            class="mobile-menu-item"
            :class="{ active: currentTab === 'catalog' }"
            @click="triggerTab('catalog')"
          >
            <span class="item-icon">📋</span> Mina sysslor
          </button>

          <button 
            class="mobile-menu-item"
            @click="triggerAction('open-history')"
          >
            <span class="item-icon">📜</span> Historik
          </button>

          <button 
            class="mobile-menu-item"
            @click="triggerAction('export-ics')"
          >
            <span class="item-icon">📥</span> Exportera kalender (.ics)
          </button>

          <button 
            class="mobile-menu-item"
            @click="triggerAction('open-settings')"
          >
            <span class="item-icon">⚙️</span> Inställningar
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  currentTab: {
    type: String,
    default: 'dashboard'
  },
  userName: {
    type: String,
    default: 'Anna'
  }
});

const emit = defineEmits(['change-tab', 'open-settings', 'open-history', 'open-auth', 'export-ics']);

const mobileMenuOpen = ref(false);

const userInitial = computed(() => {
  return props.userName ? props.userName.charAt(0).toUpperCase() : 'A';
});

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

function handleBrandClick() {
  closeMobileMenu();
  emit('change-tab', 'dashboard');
}

function triggerTab(tab) {
  closeMobileMenu();
  emit('change-tab', tab);
}

function triggerAction(actionEvent) {
  closeMobileMenu();
  emit(actionEvent);
}
</script>
