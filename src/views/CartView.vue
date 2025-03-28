<template>
  <div class="cart-container">
    <div class="cart-content">
      <div class="cart-header">
        <h1>Coșul tău de cumpărături</h1>
        <p v-if="cartStore.isEmpty" class="empty-cart-message">
          Coșul tău este gol. Hai să îl umplem cu produse delicioase!
        </p>
      </div>

      <div v-if="!cartStore.isEmpty" class="cart-items">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-image">
            <img :src="item.image" :alt="item.name">
          </div>
          
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-description">{{ item.description }}</p>
            <div class="item-price">{{ item.price }} RON</div>
          </div>

          <div class="item-quantity">
            <div class="quantity-controls">
              <button class="quantity-btn" @click="decreaseQuantity(item)">
                <i class="nav-icon">➖</i>
              </button>
              <span class="quantity-display">{{ item.quantity }}</span>
              <button class="quantity-btn" @click="increaseQuantity(item)">
                <i class="nav-icon">➕</i>
              </button>
            </div>
          </div>

          <div class="item-total">
            {{ (item.price * item.quantity).toFixed(2) }} RON
          </div>

          <button class="remove-item" @click="removeItem(item)">
            <i class="nav-icon">🗑️</i>
          </button>
        </div>
      </div>

      <div v-if="!cartStore.isEmpty" class="cart-summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>{{ subtotal.toFixed(2) }} RON</span>
        </div>
        <div class="summary-row">
          <span>Livrare</span>
          <span>Gratuită</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>{{ subtotal.toFixed(2) }} RON</span>
        </div>
        <div v-if="requiresAuth" class="auth-message">
          <p>Te rugăm să te autentifici pentru a finaliza comanda</p>
        </div>
        <button class="checkout-btn" @click="handleCheckout">
          <i class="nav-icon">💳</i>
          {{ requiresAuth ? 'Autentificare pentru checkout' : 'Finalizează comanda' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'CartView',
  
  data() {
    return {
      cartStore: useCartStore(),
      authStore: useAuthStore()
    }
  },

  computed: {
    hasItems() {
      return !this.cartStore.isEmpty
    },
    
    subtotal() {
      return this.cartStore.subtotal
    },
    
    requiresAuth() {
      return this.cartStore.requiresAuth
    }
  },

  methods: {
    increaseQuantity(item) {
      this.cartStore.increaseQuantity(item.id)
    },

    decreaseQuantity(item) {
      this.cartStore.decreaseQuantity(item.id)
    },

    removeItem(item) {
      this.cartStore.removeFromCart(item.id)
    },

    handleCheckout() {
      if (this.requiresAuth) {
        this.$router.push('/login')
      } else {
        // Aici vom implementa logica de checkout
        console.log('Proceeding to checkout...')
      }
    }
  }
}
</script>

<style scoped>
.cart-container {
  min-height: 100vh;
  padding: 100px 2rem 2rem;
  /* background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); */
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.cart-content {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.cart-header {
  text-align: center;
  margin-bottom: 2rem;
}

.cart-header h1 {
  color: #2577c8;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.empty-cart-message {
  color: #666;
  font-size: 1.1rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 2fr 1fr 1fr auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.cart-item:hover {
  transform: translateY(-2px);
}

.item-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details h3 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.item-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.item-price {
  color: #2577c8;
  font-weight: 600;
  font-size: 1.1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.25rem;
  border-radius: 8px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2577c8;
  transition: background-color 0.3s;
}

.quantity-btn:hover {
  background: #e9ecef;
}

.quantity-display {
  min-width: 32px;
  text-align: center;
  font-weight: 500;
}

.item-total {
  font-weight: 600;
  font-size: 1.2rem;
  color: #2577c8;
}

.remove-item {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #dc3545;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.remove-item:hover {
  transform: scale(1.1);
  background-color: #fee2e2;
}

.cart-summary {
  border-top: 2px solid #f8f9fa;
  padding-top: 2rem;
  margin-top: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2577c8;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #f8f9fa;
}

.checkout-btn {
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
  margin-top: 2rem;
}

.checkout-btn:hover {
  background: #1b5a9d;
  transform: translateY(-2px);
}

.auth-message {
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background: #fff3cd;
  border-radius: 8px;
  color: #856404;
}

.auth-message p {
  margin: 0;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .cart-container {
    padding: 80px 0.5rem 1rem;
  }

  .cart-content {
    padding: 1rem;
    margin: 0 0.5rem;
    border-radius: 15px;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 1rem;
    position: relative;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-details {
    text-align: center;
  }

  .quantity-controls {
    justify-content: center;
  }

  .item-total {
    text-align: center;
  }

  .remove-item {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
  }

  .cart-header h1 {
    font-size: 1.75rem;
  }
}
</style> 