<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Creează cont nou</h1>
        <p>Alătură-te comunității noastre pentru a descoperi produse tradiționale românești autentice.</p>
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

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">
              <i class="field-icon">👤</i>
              Prenume
            </label>
            <input 
              type="text" 
              id="firstName" 
              v-model="formData.firstName" 
              required 
              placeholder="Ion"
              autocomplete="given-name"
            />
          </div>

          <div class="form-group">
            <label for="lastName">
              <i class="field-icon">👤</i>
              Nume
            </label>
            <input 
              type="text" 
              id="lastName" 
              v-model="formData.lastName" 
              required 
              placeholder="Popescu"
              autocomplete="family-name"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">
            <i class="field-icon">📧</i>
            Email
          </label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            required 
            placeholder="exemplu@email.com"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="phone">
            <i class="field-icon">📱</i>
            Telefon
          </label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone" 
            required 
            placeholder="07XX XXX XXX"
            pattern="[0-9]{10}"
            autocomplete="tel"
          />
        </div>

        <div class="form-group">
          <label for="password">
            <i class="field-icon">🔒</i>
            Parolă
          </label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="formData.password" 
              required 
              placeholder="Minim 8 caractere"
              autocomplete="new-password"
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="togglePassword"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">
            <i class="field-icon">🔒</i>
            Confirmă parola
          </label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="confirmPassword" 
              v-model="formData.confirmPassword" 
              required 
              placeholder="Reintrodu parola"
              autocomplete="new-password"
            />
          </div>
        </div>

        <div class="form-group terms">
          <label class="checkbox-label">
            <input type="checkbox" v-model="formData.acceptTerms" required>
            <span>Accept <a href="#" class="terms-link">Termenii și Condițiile</a> și <a href="#" class="terms-link">Politica de Confidențialitate</a></span>
          </label>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading || !formData.acceptTerms">
          <span v-if="!isLoading">Creează cont</span>
          <span v-else class="loading-spinner">⌛</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>Ai deja cont?</p>
        <router-link to="/login" class="login-link">
          Autentifică-te aici
          <span class="arrow">→</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterView',

  setup() {
    const formData = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })
    
    const showPassword = ref(false)
    const isLoading = ref(false)
    const authStore = useAuthStore()
    const router = useRouter()

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

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const handleRegister = async () => {
      if (!formData.acceptTerms) {
        showNotification('Trebuie să acceptați termenii și condițiile', 'error')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        showNotification('Parolele introduse nu coincid', 'error')
        return
      }

      if (formData.password.length < 8) {
        showNotification('Parola trebuie să conțină minim 8 caractere', 'error')
        return
      }

      isLoading.value = true

      try {
        await authStore.register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
        
        showNotification('Cont creat cu succes! Vei fi redirecționat către pagina de autentificare.', 'success')
        
        // Redirecționăm după un scurt delay
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (error) {
        console.error('Eroare la înregistrare:', error)
        showNotification(error.message || 'A apărut o eroare la înregistrare', 'error')
      } finally {
        isLoading.value = false
      }
    }

    return {
      formData,
      showPassword,
      isLoading,
      notification,
      showNotification,
      hideNotification,
      togglePassword,
      handleRegister
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  margin-top: 54px;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
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

.auth-card {
  width: 100%;
  max-width: 580px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  margin: 0 auto;
}

.auth-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.auth-header h1 {
  color: #2577c8;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.auth-header p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #444;
  font-weight: 500;
}

.field-icon {
  font-size: 1.2rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #2577c8;
  box-shadow: 0 0 0 4px rgba(37, 119, 200, 0.1);
  outline: none;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
  padding: 0.25rem;
}

.terms {
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #666;
  cursor: pointer;
  font-size: 0.95rem;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin-top: 0.25rem;
}

.terms-link {
  color: #2577c8;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #2577c8;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
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
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.auth-footer p {
  color: #666;
  margin-bottom: 0.5rem;
}

.login-link {
  color: #2577c8;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.login-link:hover {
  color: #1b5a9d;
}

.login-link .arrow {
  transition: transform 0.3s ease;
}

.login-link:hover .arrow {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }

  .auth-card {
    padding: 1.5rem;
  }

  .auth-header h1 {
    font-size: 1.75rem;
  }

  .auth-header p {
    font-size: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .checkbox-label {
    font-size: 0.9rem;
  }
}
</style>
