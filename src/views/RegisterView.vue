<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Creează cont nou</h1>
        <p>Alătură-te comunității noastre pentru a descoperi produse tradiționale românești autentice.</p>
      </div>

      <form @submit.prevent="register" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">
              <i class="field-icon">👤</i>
              Prenume
            </label>
            <input 
              type="text" 
              id="firstName" 
              v-model="firstName" 
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
              v-model="lastName" 
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
            v-model="email" 
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
            v-model="phone" 
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
              v-model="password" 
              required 
              placeholder="Minim 8 caractere"
              autocomplete="new-password"
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

        <div class="form-group terms">
          <label class="checkbox-label">
            <input type="checkbox" v-model="acceptTerms" required>
            <span>Accept <a href="#" class="terms-link">Termenii și Condițiile</a> și <a href="#" class="terms-link">Politica de Confidențialitate</a></span>
          </label>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading || !acceptTerms">
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

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const showPassword = ref(false)
const acceptTerms = ref(false)
const isLoading = ref(false)

const register = async () => {
  try {
    isLoading.value = true
    const response = await axios.post('http://localhost:3000/register', {
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value
    })
    
    localStorage.setItem('token', response.data.token)
    router.push('/products')
  } catch (error) {
    console.error('Error during registration:', error)
    if (error.response) {
      alert(error.response.data.message || 'Error during registration')
    } else if (error.request) {
      alert('Could not contact the server. Check your connection.')
    } else {
      alert('An unexpected error occurred')
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
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
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
