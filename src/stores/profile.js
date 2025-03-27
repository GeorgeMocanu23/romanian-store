import { defineStore } from 'pinia'
import axios from 'axios'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    userProfile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        county: '',
        postalCode: '',
        country: 'România'
      },
      preferences: {
        newsletter: false,
        emailNotifications: true,
        smsNotifications: false
      },
      security: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    isLoading: false,
    error: null,
    success: null
  }),

  actions: {
    async fetchUserProfile() {
      try {
        this.isLoading = true
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        // Asigurăm-ne că proprietățile security și preferences există
        if (!response.data.security) {
          response.data.security = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
        }
        
        if (!response.data.preferences) {
          response.data.preferences = {
            newsletter: false,
            emailNotifications: true,
            smsNotifications: false
          }
        }
        
        this.userProfile = response.data
        this.error = null
      } catch (error) {
        console.error('Eroare la încărcarea profilului:', error)
        this.error = 'Nu s-a putut încărca profilul'
      } finally {
        this.isLoading = false
      }
    },

    async updateProfile(profileData) {
      try {
        this.isLoading = true
        const response = await axios.put('http://localhost:3000/api/profile', profileData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.userProfile = response.data
        this.success = 'Profil actualizat cu succes!'
        this.error = null
      } catch (error) {
        this.error = error.response?.data?.message || 'Eroare la actualizarea profilului'
        this.success = null
      } finally {
        this.isLoading = false
      }
    },

    async updatePassword(passwordData) {
      try {
        this.isLoading = true
        await axios.put('http://localhost:3000/api/profile/password', passwordData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        this.success = 'Parola actualizată cu succes!'
        this.error = null
        // Resetăm câmpurile de parolă
        this.userProfile.security = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Eroare la actualizarea parolei'
        this.success = null
      } finally {
        this.isLoading = false
      }
    },

    clearMessages() {
      this.error = null
      this.success = null
    }
  }
}) 