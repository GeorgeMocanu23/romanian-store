<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Bine ai revenit!</h1>
        <p>Ne bucurăm să te revedem. Te rugăm să te autentifici pentru a continua.</p>
      </div>

      <form @submit.prevent="login" class="auth-form">
        <div class="form-group">
          <label for="email">
            <i class="field-icon">📧</i>
            Email
          </label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="exemplu@email.com"
            autocomplete="email"
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
              v-model="password" 
              required 
              placeholder="Introdu parola"
              autocomplete="current-password"
            />
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe">
            <span>Ține-mă minte</span>
          </label>
          <a href="#" class="forgot-password">Ai uitat parola?</a>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Autentificare</span>
          <span v-else class="loading-spinner">⌛</span>
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

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)

const login = async () => {
  try {
    isLoading.value = true
    const response = await axios.post('http://localhost:3000/login', {
      email: email.value,
      password: password.value
    })
    
    localStorage.setItem('token', response.data.token)
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true')
    }
    
    router.push('/products')
  } catch (error) {
    console.error('Eroare la autentificare:', error)
    if (error.response) {
      alert(error.response.data.message || 'Eroare la autentificare')
    } else if (error.request) {
      alert('Nu s-a putut contacta serverul. Verificați conexiunea.')
    } else {
      alert('A apărut o eroare neașteptată')
    }
  } finally {
    isLoading.value = false
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
