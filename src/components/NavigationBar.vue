<template>
  <header class="header">
    <nav class="navbar">
      <router-link to="/" class="logo-container">
        <img alt="Magazin Romanesc logo" class="logo" :src="logo" />
        <span class="brand-name">Magazin Românesc</span>
      </router-link>

      <div class="nav-content">
        <div class="nav-links">
          <RouterLink to="/" class="nav-link">
            <i class="nav-icon">🏠</i>
            <span>Acasă</span>
          </RouterLink>
          
          <RouterLink to="/about" class="nav-link">
            <i class="nav-icon">ℹ️</i>
            <span>Despre</span>
          </RouterLink>
          
          <RouterLink to="/products" class="nav-link">
            <i class="nav-icon">🛍️</i>
            <span>Produse</span>
          </RouterLink>
        </div>

        <div class="auth-section">
          <RouterLink v-if="!authStore.isLoggedIn" to="/login" class="auth-btn login-btn">
            <i class="nav-icon">👤</i>
            <span>Autentificare</span>
          </RouterLink>
          
          <div v-else class="user-section">
            <div class="user-dropdown">
              <button class="user-menu-btn" @click="showDropdown = !showDropdown">
                <i class="nav-icon">👤</i>
                {{ authStore.user?.firstName || 'Cont' }}
                <i class="nav-icon">▼</i>
              </button>
              
              <div v-if="showDropdown" class="dropdown-menu">
                <button @click="handleNavigation('/profile')" class="dropdown-item">
                  <i class="nav-icon">👤</i>
                  Profil
                </button>
                <button v-if="authStore.isAdmin" @click="handleNavigation('/admin/products')" class="dropdown-item">
                  <i class="nav-icon">⚙️</i>
                  Admin Panel
                </button>
                <button @click="handleLogout" class="dropdown-item">
                  <i class="nav-icon">🚪</i>
                  Deconectare
                </button>
              </div>
            </div>
          </div>

          <RouterLink to="/cart" class="cart-btn">
            <i class="nav-icon">🛒</i>
            <span v-if="cartStore.itemCount > 0" class="cart-count">{{ cartStore.itemCount }}</span>
          </RouterLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { onMounted, watch, ref } from 'vue'
import logo from '@/assets/romanian-flag.svg'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const showDropdown = ref(false)

onMounted(() => {
  authStore.checkLoginStatus()
  cartStore.setAuthenticated(authStore.isAuthenticated)
})

// Sincronizăm starea de autentificare între store-uri
watch(() => authStore.isAuthenticated, (newValue) => {
  cartStore.setAuthenticated(newValue)
})

const handleLogout = () => {
  authStore.logout()
  cartStore.setAuthenticated(false)
  router.push('/login')
  showDropdown.value = false
}

const handleNavigation = (route) => {
  router.push(route)
  showDropdown.value = false
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: transform 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.logo-container:hover {
  transform: translateY(-2px);
  background: none;
}

.logo-container:focus {
  outline: none;
}

.logo {
  height: 40px;
  width: auto;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2577c8;
  letter-spacing: 0.5px;
  user-select: none;
}

.brand-name:hover {
  color: #2577c8;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #555;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(37, 119, 200, 0.1);
  color: #2577c8;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: #2577c8;
  color: white;
}

.nav-icon {
  font-size: 1.2rem;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.login-btn {
  background: transparent;
  color: #2577c8;
  text-decoration: none;
  border: none;
}

.login-btn:hover {
  background: rgba(37, 119, 200, 0.1);
  color: #1b5a9d;
  transform: translateY(-2px);
}

.login-btn.router-link-active {
  background: #2577c8;
  color: white;
}

.logout-btn {
  background: #dc3545;
  color: white;
}

.logout-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.cart-btn {
  position: relative;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  background: transparent;
  color: #2577c8;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-btn:hover {
  background: rgba(37, 119, 200, 0.1);
  color: #1b5a9d;
  transform: translateY(-2px);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-section {
  position: relative;
}

.user-dropdown {
  position: relative;
  display: inline-block;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
  background: transparent;
  color: #2577c8;
}

.user-menu-btn:hover {
  background: rgba(37, 119, 200, 0.1);
  transform: translateY(-2px);
}

.dropdown-menu {
  display: none;
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  background: white;
  min-width: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

/* Adăugăm un pseudo-element pentru a acoperi spațiul */
.user-dropdown::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 0.5rem;
  background: transparent;
}

.user-dropdown:hover .dropdown-menu {
  display: block;
}

.user-dropdown:hover::after {
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #555;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(37, 119, 200, 0.1);
  color: #2577c8;
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.5rem 1rem;
    flex-direction: row;
    gap: 0.5rem;
  }

  .nav-content {
    width: auto;
    flex-direction: row;
    gap: 0.5rem;
  }

  .logo-container {
    gap: 0.5rem;
  }

  .brand-name {
    display: none;
  }

  .logo {
    height: 25px;
  }

  .nav-links {
    gap: 0.25rem;
  }

  .nav-link {
    padding: 0.4rem;
  }

  .nav-link span {
    display: none;
  }

  .auth-section {
    gap: 0.25rem;
  }

  .auth-btn {
    padding: 0.4rem;
  }

  .auth-btn span {
    display: none;
  }

  .cart-btn {
    padding: 0.4rem;
  }

  .nav-icon {
    font-size: 1.1rem;
  }

  .user-menu-btn span {
    display: none;
  }
  
  .dropdown-menu {
    min-width: 160px;
  }
  
  .dropdown-item span {
    display: block;
  }
}

@media (min-width: 1600px) {
  .navbar {
    max-width: 1600px;
  }
}
</style>
