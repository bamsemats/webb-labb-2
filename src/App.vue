<template>
  <div id="app">
    <!-- Navigation Header -->
    <Navbar
      :current-tab="currentTab"
      :user-name="user.name"
      @change-tab="currentTab = $event"
      @open-settings="showSettingsModal = true"
      @open-history="showHistoryModal = true"
      @open-auth="showAuthModal = true"
      @export-ics="handleExportICS"
    />

    <!-- Main View Content -->
    <main class="app-container">
      <!-- Tab 1: Dashboard / Veckoschema -->
      <Dashboard
        v-if="currentTab === 'dashboard'"
        :user-name="user.name"
        :week-num="currentWeek.weekNum"
        :year="currentWeek.year"
        :week-days="weekDays"
        :tasks="tasks"
        :view-mode="settings.viewMode"
        @select-task="openTaskDrawer"
        @open-create-modal="openCreateModal()"
        @prev-week="prevWeek"
        @next-week="nextWeek"
        @go-today="goToday"
        @toggle-complete="toggleTaskComplete"
        @edit="openEditModal"
        @delete="confirmDeleteTask"
        @add-task-for-day="openSelectTaskModal($event)"
        @update:view-mode="updateViewMode"
      />

      <!-- Tab 2: Mina sysslor / Katalog -->
      <TaskCatalog
        v-else-if="currentTab === 'catalog'"
        @open-create-modal="openCreateModal()"
        @open-schedule-prompt="openSchedulePrompt"
      />
    </main>

    <!-- Side-Drawer for Task Details -->
    <TaskDetailDrawer
      :task="selectedTaskForDrawer"
      :day-date="selectedTaskDrawerDate"
      @close="selectedTaskForDrawer = null"
      @toggle-complete="toggleTaskComplete"
      @edit="handleEditFromDrawer"
      @delete="handleDeleteFromDrawer"
    />

    <!-- Modals -->
    <!-- Modal 1: Select Existing Task when clicking + Lägg till on a day -->
    <SelectTaskModal
      v-if="showSelectTaskModal"
      :day-id="selectedDayIdForPick"
      :day-name="selectedDayNameForPick"
      @close="showSelectTaskModal = false"
      @select-task="handleSelectExistingTask"
      @open-create-new="openCreateModalFromPick"
    />

    <!-- Modal 2: Schedule Prompt when adding from Catalog -->
    <SchedulePromptModal
      v-if="showSchedulePromptModal"
      :task="taskToSchedulePrompt"
      :days="weekDays"
      @close="showSchedulePromptModal = false"
      @confirm="handleConfirmSchedulePrompt"
    />

    <!-- Modal 3: Full Task Creation / Editing Modal -->
    <TaskFormModal
      v-if="showTaskModal"
      :task-to-edit="taskToEdit"
      :default-day="defaultDayForNewTask"
      @close="showTaskModal = false"
      @save="handleSaveTask"
      @delete="confirmDeleteTask"
    />

    <SettingsModal
      v-if="showSettingsModal"
      :settings="settings"
      @close="showSettingsModal = false"
      @save="handleSaveSettings"
      @reset-data="handleResetData"
    />

    <HistoryModal
      v-if="showHistoryModal"
      :history="history"
      @close="showHistoryModal = false"
      @clear-history="handleClearHistory"
    />

    <AuthModal
      v-if="showAuthModal"
      @close="showAuthModal = false"
      @login="handleLogin"
    />

    <ConfirmModal
      v-if="showConfirmModal"
      :task-name="taskToDelete ? taskToDelete.name : ''"
      @confirm="handleDeleteTask"
      @cancel="showConfirmModal = false"
    />

    <!-- Toast Feedback Banner -->
    <NotificationToast
      :message="toastMessage"
      :type="toastType"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import Navbar from './components/Navbar.vue';
import Dashboard from './components/Dashboard.vue';
import TaskCatalog from './components/TaskCatalog.vue';
import TaskDetailDrawer from './components/TaskDetailDrawer.vue';
import SelectTaskModal from './components/SelectTaskModal.vue';
import SchedulePromptModal from './components/SchedulePromptModal.vue';
import TaskFormModal from './components/TaskFormModal.vue';
import SettingsModal from './components/SettingsModal.vue';
import HistoryModal from './components/HistoryModal.vue';
import AuthModal from './components/AuthModal.vue';
import ConfirmModal from './components/ConfirmModal.vue';
import NotificationToast from './components/NotificationToast.vue';

import { getCurrentISOWeek, getWeekDays, exportToICS, calculateNextOccurrence, formatLocalDateStr, isTaskCompletedOnDate } from './utils/dateUtils.js';
import { loadTasks, saveTasks, loadSettings, saveSettings, loadHistory, saveHistory, loadUser, saveUser, resetAllData } from './utils/storage.js';

// Reactive State
const currentTab = ref('dashboard');
const currentWeek = reactive(getCurrentISOWeek());

const user = reactive(loadUser());
const settings = reactive(loadSettings());
const tasks = ref(loadTasks(user.id));
const history = ref(loadHistory(user.id));

// Side Drawer state
const selectedTaskForDrawer = ref(null);
const selectedTaskDrawerDate = ref(null);

// Modals state
const showSelectTaskModal = ref(false);
const showSchedulePromptModal = ref(false);
const showTaskModal = ref(false);
const showSettingsModal = ref(false);
const showHistoryModal = ref(false);
const showAuthModal = ref(false);
const showConfirmModal = ref(false);

const selectedDayIdForPick = ref('monday');
const selectedDayNameForPick = ref('Måndag');
const taskToSchedulePrompt = ref(null);

const taskToEdit = ref(null);
const taskToDeleteId = ref(null);
const defaultDayForNewTask = ref('monday');

// Toast feedback state
const toastMessage = ref('');
const toastType = ref('success');
let toastTimer = null;

function showToast(msg, type = 'success') {
  toastMessage.value = msg;
  toastType.value = type;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastMessage.value = '';
  }, 3500);
}

// Computed 7-days array for active week
const weekDays = computed(() => {
  return getWeekDays(currentWeek.year, currentWeek.weekNum);
});

const taskToDelete = computed(() => {
  return tasks.value.find(t => t.id === taskToDeleteId.value);
});

// Watchers for persistent storage (scoped per user)
watch(tasks, (newVal) => saveTasks(newVal, user.id), { deep: true });
watch(settings, (newVal) => saveSettings(newVal), { deep: true });
watch(history, (newVal) => saveHistory(newVal, user.id), { deep: true });

// Side Drawer Handlers
function openTaskDrawer(task, date = null) {
  selectedTaskForDrawer.value = task;
  if (date) {
    selectedTaskDrawerDate.value = date;
  } else if (task && task.day) {
    const dayObj = weekDays.value.find(d => d.id === task.day);
    selectedTaskDrawerDate.value = dayObj ? dayObj.date : null;
  } else {
    selectedTaskDrawerDate.value = null;
  }
}

function handleEditFromDrawer(task) {
  selectedTaskForDrawer.value = null;
  openEditModal(task);
}

function handleDeleteFromDrawer(taskId) {
  selectedTaskForDrawer.value = null;
  confirmDeleteTask(taskId);
}

// Functions
function updateViewMode(newMode) {
  settings.viewMode = newMode;
  showToast(`Visningsläge ändrat till: ${newMode.toUpperCase()}`, 'info');
}

function prevWeek() {
  if (currentWeek.weekNum > 1) {
    currentWeek.weekNum--;
  } else {
    currentWeek.year--;
    currentWeek.weekNum = 52;
  }
}

function nextWeek() {
  if (currentWeek.weekNum < 52) {
    currentWeek.weekNum++;
  } else {
    currentWeek.year++;
    currentWeek.weekNum = 1;
  }
}

function goToday() {
  const now = getCurrentISOWeek();
  currentWeek.year = now.year;
  currentWeek.weekNum = now.weekNum;
}

function openSelectTaskModal(dayId) {
  const dayObj = weekDays.value.find(d => d.id === dayId);
  selectedDayIdForPick.value = dayId;
  selectedDayNameForPick.value = dayObj ? `${dayObj.name} (${dayObj.formattedDate})` : dayId;
  showSelectTaskModal.value = true;
}

function handleSelectExistingTask(selectedPresetTask) {
  const newTask = {
    ...selectedPresetTask,
    id: `task-${Date.now()}`,
    time: '12:00',
    active: true,
    completed: false,
    lastCompleted: null,
    nextOccurrence: null
  };
  tasks.value.push(newTask);
  showSelectTaskModal.value = false;
  showToast(`✓ "${selectedPresetTask.name}" har lagts till på ${selectedDayNameForPick.value}!`);
}

function openCreateModalFromPick(dayId) {
  showSelectTaskModal.value = false;
  openCreateModal(dayId);
}

function openSchedulePrompt(task) {
  taskToSchedulePrompt.value = task;
  showSchedulePromptModal.value = true;
}

function handleConfirmSchedulePrompt(scheduledTaskData) {
  const dayObj = weekDays.value.find(d => d.id === scheduledTaskData.day);
  const dayName = dayObj ? dayObj.name : scheduledTaskData.day;
  
  const newTask = {
    ...scheduledTaskData,
    id: `task-${Date.now()}`,
    active: true,
    completed: false,
    lastCompleted: null,
    nextOccurrence: null
  };

  tasks.value.push(newTask);
  showSchedulePromptModal.value = false;
  showToast(`✓ "${scheduledTaskData.name}" har schemalagts på ${dayName} kl. ${scheduledTaskData.time}!`);
}

function openCreateModal(dayId = 'monday') {
  taskToEdit.value = null;
  defaultDayForNewTask.value = dayId;
  showTaskModal.value = true;
}

function openEditModal(task) {
  taskToEdit.value = { ...task };
  showTaskModal.value = true;
}

function confirmDeleteTask(taskId) {
  taskToDeleteId.value = taskId;
  showConfirmModal.value = true;
}

function handleDeleteTask() {
  if (!taskToDeleteId.value) return;
  const deletedTask = taskToDelete.value;
  tasks.value = tasks.value.filter(t => t.id !== taskToDeleteId.value);
  showConfirmModal.value = false;
  taskToDeleteId.value = null;
  showToast(`✓ "${deletedTask ? deletedTask.name : 'Sysslan'}" har tagits bort.`);
}

function handleSaveTask(formData) {
  if (formData.id) {
    const idx = tasks.value.findIndex(t => t.id === formData.id);
    if (idx !== -1) {
      tasks.value[idx] = { ...formData };
      showToast(`✓ "${formData.name}" har uppdaterats.`);
    }
  } else {
    const newTask = {
      ...formData,
      id: `task-${Date.now()}`,
      completed: false,
      active: true,
      lastCompleted: null,
      nextOccurrence: null
    };
    tasks.value.push(newTask);
    showToast(`✓ "${formData.name}" har lagts till i din vecka!`);
  }
  showTaskModal.value = false;
}

function toggleTaskComplete(task, targetDate = null) {
  let dateStr = targetDate;
  if (!dateStr) {
    const dayObj = weekDays.value.find(d => d.id === task.day);
    dateStr = dayObj ? dayObj.date : formatLocalDateStr(new Date());
  }

  if (!Array.isArray(task.completedDates)) {
    task.completedDates = task.completed ? [dateStr] : [];
  }

  const idx = task.completedDates.indexOf(dateStr);
  const isNowCompleted = idx === -1;

  if (isNowCompleted) {
    task.completedDates.push(dateStr);
    task.completed = true;
    const nowIso = new Date().toISOString();
    task.lastCompleted = nowIso;

    history.value.unshift({
      id: `hist-${Date.now()}`,
      taskName: task.name,
      category: task.category,
      completedAt: nowIso,
      formattedDate: `${dateStr} kl. ${new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}`
    });

    const nextOcc = calculateNextOccurrence(task, nowIso);
    showToast(`✓ Bra jobbat! "${task.name}" är klar. (Nästa: ${nextOcc})`, 'success');
  } else {
    task.completedDates.splice(idx, 1);
    task.completed = task.completedDates.length > 0;
    showToast(`"${task.name}" markerad som ej klar (${dateStr}).`, 'info');
  }
}

function handleSaveSettings(newSettings) {
  Object.assign(settings, newSettings);
  user.name = newSettings.name;
  saveUser(user);
  showSettingsModal.value = false;
  showToast('✓ Inställningarna har sparats!');
}

function handleResetData() {
  resetAllData();
  location.reload();
}

function handleClearHistory() {
  history.value = [];
  showToast('Historiken har rensats.', 'info');
}

function handleLogin(userData) {
  Object.assign(user, userData);
  settings.name = userData.name;
  saveUser(user);
  tasks.value = loadTasks(user.id);
  history.value = loadHistory(user.id);
  showAuthModal.value = false;
  showToast(`👋 Välkommen ${user.name}!`);
}

function handleExportICS() {
  exportToICS(tasks.value, currentWeek.year, currentWeek.weekNum);
  showToast('📥 Kalenderfil (.ics) exporterad!', 'success');
}
</script>


