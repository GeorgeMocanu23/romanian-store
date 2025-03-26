import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null,
    token: null
  }),

  getters: {
    userFirstName: (state) => state.user?.firstName || '',
    isAuthenticated: (state) => state.isLoggedIn,
    userRole: (state) => state.user?.role || null
  },

  actions: {
    setLoginStatus(user, token) {
      this.isLoggedIn = true
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
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
    },

    updateUserProfile(userData) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    }
  }
}) 