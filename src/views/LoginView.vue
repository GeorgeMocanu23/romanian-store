<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Autentificare</h1>
        <p>Bine ai venit! Te rugăm să te autentifici pentru a continua.</p>
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

      <form @submit.prevent="login" class="auth-form">
        <div class="form-group">
          <label>
            <i class="field-icon">📧</i>
            Email
          </label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="Introdu adresa ta de email"
            required
          />
        </div>

        <div class="form-group">
          <label>
            <i class="field-icon">🔒</i>
            Parola
          </label>
          <div class="password-input">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'"
              placeholder="Introdu parola ta"
              required
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

        <div class="form-options">
          <label class="remember-me">
            <input 
              type="checkbox" 
              v-model="rememberMe"
            />
            <span>Ține-mă minte</span>
          </label>
          <a href="#" class="forgot-password">Ai uitat parola?</a>
        </div>

        <button 
          type="submit" 
          class="submit-btn"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-spinner">⚡</span>
          <span v-else>Autentificare</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>Nu ai cont încă?</p>
        <router-link to="/register" class="register-link">
          Creează unul acum
          <span class="arrow">→</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',

  setup() {
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
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

    const login = async () => {
      try {
        isLoading.value = true
        
        if (!email.value || !password.value) {
          showNotification('Te rugăm să completezi toate câmpurile', 'error')
          return
        }

        try {
          await authStore.login({
            email: email.value,
            password: password.value
          })
          
          showNotification('Autentificare reușită! Vei fi redirecționat...', 'success')
          
          // Redirecționare după un scurt delay
          setTimeout(() => {
            router.push('/products')
          }, 1500)
        } catch (error) {
          console.error('Eroare la autentificare:', error)
          showNotification(error.message || 'Eroare la autentificare. Verifică datele introduse.', 'error')
        }
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      password,
      rememberMe,
      showPassword,
      isLoading,
      authStore,
      notification,
      showNotification,
      hideNotification,
      togglePassword,
      login
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
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
  max-width: 480px;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: auto;
}

.forgot-password {
  color: #2577c8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #1b5a9d;
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
  animation: spin 1s infinite linear;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

.register-link {
  color: #2577c8;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.register-link:hover {
  color: #1b5a9d;
}

.register-link .arrow {
  transition: transform 0.3s ease;
}

.register-link:hover .arrow {
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

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
