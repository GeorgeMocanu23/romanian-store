<template>
  <div class="profile-container">
    <!-- Sidebar pentru dispozitive mari -->
    <aside class="profile-sidebar">
      <div class="sidebar-header">
        <i class="nav-icon">👤</i>
        <h2>Profilul meu</h2>
      </div>
      <nav class="sidebar-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['nav-item', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <i class="nav-icon">{{ tab.icon }}</i>
          <span>{{ tab.name }}</span>
        </button>
      </nav>
    </aside>

    <!-- Conținut principal -->
    <main class="profile-content">
      <!-- Header pentru dispozitive mici -->
      <div class="mobile-header">
        <button class="menu-toggle" @click="showMobileMenu = !showMobileMenu">
          <i class="nav-icon">☰</i>
        </button>
        <h2>Profilul meu</h2>
      </div>

      <!-- Meniu mobil -->
      <div v-if="showMobileMenu" class="mobile-menu">
        <nav class="mobile-nav">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['nav-item', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id; showMobileMenu = false"
          >
            <i class="nav-icon">{{ tab.icon }}</i>
            <span>{{ tab.name }}</span>
          </button>
        </nav>
      </div>

      <!-- Notificări -->
      <div v-if="notification.show" :class="['notification', `notification-${notification.type}`]">
        <div class="notification-icon">
          <i v-if="notification.type === 'success'">✓</i>
          <i v-else-if="notification.type === 'error'">✗</i>
          <i v-else>ℹ</i>
        </div>
        <div class="notification-content">
          <p>{{ notification.message }}</p>
        </div>
        <button class="notification-close" @click="hideNotification">×</button>
      </div>

      <!-- Mesaje de eroare și succes -->
      <div v-if="profileStore.error" class="alert alert-error">
        {{ profileStore.error }}
      </div>

      <!-- Conținut tab-uri -->
      <div class="tab-content">
        <!-- Informații personale -->
        <div v-if="activeTab === 'personal'" class="tab-pane">
          <h3>Informații personale</h3>
          <form @submit.prevent="handlePersonalInfoUpdate" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <input 
                  v-model="profileStore.userProfile.firstName" 
                  type="text" 
                  placeholder="Prenume"
                  required
                >
              </div>
              <div class="form-group">
                <input 
                  v-model="profileStore.userProfile.lastName" 
                  type="text" 
                  placeholder="Nume"
                  required
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <input 
                  v-model="profileStore.userProfile.email" 
                  type="email" 
                  placeholder="Email"
                  required
                >
              </div>
              <div class="form-group">
                <input 
                  v-model="profileStore.userProfile.phone" 
                  type="tel" 
                  placeholder="Telefon"
                  required
                >
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="profileStore.isLoading">
              <span v-if="profileStore.isLoading" class="loading-spinner"></span>
              Salvează modificările
            </button>
          </form>
        </div>

        <!-- Adresă -->
        <div v-if="activeTab === 'address'" class="tab-pane">
          <h3>Adresa de livrare</h3>
          <form @submit.prevent="handleAddressUpdate" class="profile-form">
            <div class="form-group">
              <input 
                v-model="profileStore.userProfile.address.street" 
                type="text" 
                placeholder="Stradă"
                required
              >
            </div>
            <div class="form-row">
              <div class="form-group">
                <input 
                  v-model="profileStore.userProfile.address.city" 
                  type="text" 
                  placeholder="Oraș"
                  required
                >
              </div>
              <div class="form-group">
                <input 
                  v-model="profileStore.userProfile.address.county" 
                  type="text" 
                  placeholder="Județ"
                  required
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <input 
                  v-model="profileStore.userProfile.address.postalCode" 
                  type="text" 
                  placeholder="Cod poștal"
                  required
                >
              </div>
              <div class="form-group">
                <input 
                  v-model="profileStore.userProfile.address.country" 
                  type="text" 
                  placeholder="Țară"
                  required
                >
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="profileStore.isLoading">
              <span v-if="profileStore.isLoading" class="loading-spinner"></span>
              Salvează adresa
            </button>
          </form>
        </div>

        <!-- Preferințe -->
        <div v-if="activeTab === 'preferences'" class="tab-pane">
          <h3>Preferințe de notificare</h3>
          <form @submit.prevent="handlePreferencesUpdate" class="profile-form">
            <div class="preferences-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="getPreferences.newsletter"
                >
                <span>Vreau să primesc newsletter-ul</span>
              </label>
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="getPreferences.emailNotifications"
                >
                <span>Notificări prin email</span>
              </label>
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="getPreferences.smsNotifications"
                >
                <span>Notificări prin SMS</span>
              </label>
            </div>
            <button type="submit" class="submit-btn" :disabled="profileStore.isLoading">
              <span v-if="profileStore.isLoading" class="loading-spinner"></span>
              Salvează preferințele
            </button>
          </form>
        </div>

        <!-- Securitate -->
        <div v-if="activeTab === 'security'" class="tab-pane">
          <h3>Securitate</h3>
          <form @submit.prevent="handlePasswordUpdate" class="profile-form">
            <div class="form-group">
              <input 
                v-model="getSecurity.currentPassword" 
                type="password" 
                placeholder="Parola actuală"
                required
              >
            </div>
            <div class="form-group">
              <input 
                v-model="getSecurity.newPassword" 
                type="password" 
                placeholder="Parola nouă"
                required
              >
            </div>
            <div class="form-group">
              <input 
                v-model="getSecurity.confirmPassword" 
                type="password" 
                placeholder="Confirmă parola nouă"
                required
              >
            </div>
            <button type="submit" class="submit-btn" :disabled="profileStore.isLoading">
              <span v-if="profileStore.isLoading" class="loading-spinner"></span>
              Actualizează parola
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const activeTab = ref('personal')
const showMobileMenu = ref(false)

// State pentru notificări
const notification = ref({
  show: false,
  message: '',
  type: 'success', // success, error, info
  timeout: null
})

// Funcție pentru afișarea notificărilor
const showNotification = (message, type = 'success') => {
  // Resetăm timeout-ul existent dacă există
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
  }
  
  // Setăm noua notificare
  notification.value = {
    show: true,
    message,
    type,
    timeout: setTimeout(() => {
      notification.value.show = false
    }, 5000) // Dispare după 5 secunde
  }
}

// Funcție pentru ascunderea notificării
const hideNotification = () => {
  notification.value.show = false
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
  }
}

// Computed properties pentru a preveni erori de binding cu optional chaining
const getPreferences = computed(() => {
  if (!profileStore.userProfile.preferences) {
    profileStore.userProfile.preferences = {
      newsletter: false,
      emailNotifications: true,
      smsNotifications: false
    }
  }
  return profileStore.userProfile.preferences
})

const getSecurity = computed(() => {
  if (!profileStore.userProfile.security) {
    profileStore.userProfile.security = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  }
  return profileStore.userProfile.security
})

const tabs = [
  { id: 'personal', name: 'Informații personale', icon: '👤' },
  { id: 'address', name: 'Adresa de livrare', icon: '📍' },
  { id: 'preferences', name: 'Preferințe', icon: '⚙️' },
  { id: 'security', name: 'Securitate', icon: '🔒' }
]

onMounted(async () => {
  await profileStore.fetchUserProfile()
})

const handlePersonalInfoUpdate = async () => {
  try {
    const { firstName, lastName, email, phone } = profileStore.userProfile
    await profileStore.updateProfile({ firstName, lastName, email, phone })
    showNotification('Informațiile personale au fost actualizate cu succes!')
  } catch (error) {
    console.error('Eroare la actualizarea informațiilor:', error)
    showNotification('Eroare la actualizarea informațiilor. Vă rugăm să încercați din nou.', 'error')
  }
}

const handleAddressUpdate = async () => {
  try {
    await profileStore.updateProfile({ address: profileStore.userProfile.address })
    showNotification('Adresa a fost actualizată cu succes!')
  } catch (error) {
    console.error('Eroare la actualizarea adresei:', error)
    showNotification('Eroare la actualizarea adresei. Vă rugăm să încercați din nou.', 'error')
  }
}

const handlePreferencesUpdate = async () => {
  try {
    await profileStore.updateProfile({ preferences: getPreferences.value })
    showNotification('Preferințele au fost actualizate cu succes!')
  } catch (error) {
    console.error('Eroare la actualizarea preferințelor:', error)
    showNotification('Eroare la actualizarea preferințelor. Vă rugăm să încercați din nou.', 'error')
  }
}

const handlePasswordUpdate = async () => {
  try {
    if (!getSecurity.value.currentPassword || !getSecurity.value.newPassword || !getSecurity.value.confirmPassword) {
      return showNotification('Vă rugăm să completați toate câmpurile pentru parolă.', 'error')
    }
    
    if (getSecurity.value.newPassword !== getSecurity.value.confirmPassword) {
      return showNotification('Parolele nu coincid!', 'error')
    }
    
    await profileStore.updatePassword({ currentPassword: getSecurity.value.currentPassword, newPassword: getSecurity.value.newPassword })
    showNotification('Parola a fost actualizată cu succes!')
    
    // Resetăm câmpurile de parolă
    getSecurity.value.currentPassword = ''
    getSecurity.value.newPassword = ''
    getSecurity.value.confirmPassword = ''
  } catch (error) {
    console.error('Eroare la actualizarea parolei:', error)
    showNotification('Eroare la actualizarea parolei. Vă rugăm să încercați din nou.', 'error')
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  padding: 80px 2rem 2rem;
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

/* Sidebar */
.profile-sidebar {
  width: 280px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
  position: fixed;
  top: 100px;
  left: max(2rem, calc((100% - 1400px) / 2 + 2rem));
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
}

.sidebar-header h2 {
  color: #2577c8;
  font-size: 1.5rem;
  margin: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  border-radius: 8px;
  color: #555;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: rgba(37, 119, 200, 0.1);
  color: #2577c8;
}

.nav-item.active {
  background: #2577c8;
  color: white;
}

/* Conținut principal */
.profile-content {
  flex: 1;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-left: 300px;
  min-height: calc(100vh - 120px);
}

/* Header mobil */
.mobile-header {
  display: none;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #2577c8;
}

.mobile-header h2 {
  color: #2577c8;
  font-size: 1.5rem;
  margin: 0;
}

/* Meniu mobil */
.mobile-menu {
  display: none;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

/* Formulare */
.tab-pane {
  max-width: 700px;
  margin: 0 auto;
}

.tab-pane h3 {
  color: #2577c8;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input::placeholder {
  color: #666;
  opacity: 0.8;
}

.form-group input:focus {
  border-color: #2577c8;
  box-shadow: 0 0 0 4px rgba(37, 119, 200, 0.1);
  outline: none;
  background: white;
}

.preferences-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #555;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
}

.submit-btn {
  padding: 1rem;
  background: #2577c8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover {
  background: #1b5a9d;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-container {
    padding: 80px 1rem 1rem;
  }

  .profile-sidebar {
    display: none;
  }

  .profile-content {
    margin-left: 0;
    padding: 1.5rem;
  }

  .mobile-header {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .nav-item span {
    display: block;
  }

  .profile-content {
    padding: 1rem;
  }
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.alert-error {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Stiluri pentru notificări */
.notification {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  animation: slideIn 0.3s ease-out;
  position: relative;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.notification-success {
  background-color: #d1fae5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.notification-error {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.notification-info {
  background-color: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 0.75rem;
  font-weight: bold;
}

.notification-content {
  flex: 1;
}

.notification-content p {
  margin: 0;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.notification-close:hover {
  opacity: 1;
}
</style> 