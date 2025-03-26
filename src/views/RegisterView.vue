<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Înregistrare</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Nume complet</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            required 
            placeholder="Introduceți numele complet"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            required 
            placeholder="Introduceți adresa de email"
          />
        </div>

        <div class="form-group">
          <label for="password">Parolă</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="formData.password" 
              required 
              placeholder="Introduceți parola"
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
          <label for="confirmPassword">Confirmare parolă</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="confirmPassword" 
              v-model="formData.confirmPassword" 
              required 
              placeholder="Confirmați parola"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="phone">Telefon</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone" 
            required 
            placeholder="Introduceți numărul de telefon"
          />
        </div>

        <div class="form-group">
          <label for="address">Adresă</label>
          <textarea 
            id="address" 
            v-model="formData.address" 
            required 
            placeholder="Introduceți adresa completă"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="formData.terms" 
              required
            />
            Sunt de acord cu <a href="#" class="terms-link">Termenii și condițiile</a>
          </label>
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button 
          type="submit" 
          class="register-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Se înregistrează...' : 'Înregistrare' }}
        </button>

        <div class="login-link">
          Aveți deja un cont? <router-link to="/login">Autentificați-vă</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'RegisterView',

  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        terms: false
      },
      showPassword: false,
      isLoading: false,
      errorMessage: '',
      authStore: useAuthStore()
    }
  },

  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },

    async handleRegister() {
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = 'Parolele nu coincid'
        return
      }

      if (!this.formData.terms) {
        this.errorMessage = 'Trebuie să acceptați termenii și condițiile'
        return
      }

      this.isLoading = true
      this.errorMessage = ''

      try {
        await this.authStore.register({
          name: this.formData.name,
          email: this.formData.email,
          password: this.formData.password,
          phone: this.formData.phone,
          address: this.formData.address
        })
        
        this.$router.push('/login')
      } catch (error) {
        this.errorMessage = error.message || 'A apărut o eroare la înregistrare'
      } finally {
        this.isLoading = false
      }
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
