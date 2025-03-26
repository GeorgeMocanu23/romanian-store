import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const userFirstName = ref('')

  function checkLoginStatus() {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    isLoggedIn.value = !!token
    if (user) {
      const userData = JSON.parse(user)
      userFirstName.value = userData.firstName
    }
  }

  function setLoginStatus(user) {
    isLoggedIn.value = true
    userFirstName.value = user.firstName
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')
    isLoggedIn.value = false
    userFirstName.value = ''
  }

  return {
    isLoggedIn,
    userFirstName,
    checkLoginStatus,
    setLoginStatus,
    logout
  }
}) 