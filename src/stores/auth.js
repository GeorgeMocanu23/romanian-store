import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null,
    token: null
  }),

  getters: {
    userFirstName: (state) => state.user?.firstName || '',
    isAuthenticated: (state) => state.isLoggedIn,
    userRole: (state) => state.user?.role || null,
    isAdmin: (state) => state.user?.role === 'ADMIN'
  },

  actions: {
    async register(userData) {
      try {
        const dataWithRole = {
          ...userData,
          role: 'CUSTOMER'
        }
        
        const response = await axios.post('http://localhost:3000/register', dataWithRole)
        return response.data
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.error || 'Eroare la înregistrare')
        }
        throw new Error('Eroare de conexiune la server')
      }
    },

    async login(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/login', credentials)
        this.setLoginStatus(response.data.user, response.data.token)
        return response.data
      } catch (error) {
        if (error.response) {
          throw new Error(error.response.data.error || 'Autentificare eșuată')
        }
        throw new Error('Eroare de conexiune la server')
      }
    },

    setLoginStatus(user, token) {
      this.isLoggedIn = true
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('isAdmin', user.role === 'ADMIN')
    },

    checkLoginStatus() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        this.isLoggedIn = true
        this.token = token
        this.user = JSON.parse(user)
      }
    },

    logout() {
      this.isLoggedIn = false
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')
      localStorage.removeItem('isAdmin')
    },

    updateUserProfile(userData) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    }
  }
}) 