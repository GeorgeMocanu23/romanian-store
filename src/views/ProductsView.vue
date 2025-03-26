<template>
  <div class="products-container">
    <!-- Search and Filter Section -->
    <div class="search-section">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Caută produse..." 
          class="search-input"
        />
        <i class="search-icon">🔍</i>
      </div>
      <div class="category-filters">
        <button 
          v-for="category in categories" 
          :key="category"
          :class="['category-btn', selectedCategory === category ? 'active' : '']"
          @click="filterByCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="products-grid">
      <div v-for="product in filteredProducts" 
           :key="product.id" 
           class="product-card">
        <div class="product-image-container">
          <img :src="product.image" :alt="product.name">
          <span class="stock-badge" v-if="product.stock < 5">Stoc limitat</span>
        </div>
        
        <div class="product-details">
          <div class="product-header">
            <h3>{{ product.name }}</h3>
            <span class="price">{{ product.price }} RON</span>
          </div>
          
          <div class="product-info">
            <p class="description">{{ product.description }}</p>
            <div class="product-meta">
              <span class="stock-info">
                <i class="stock-icon">📦</i>
                În stoc: {{ product.stock }}
              </span>
              <span class="category-tag">{{ product.category }}</span>
            </div>
          </div>

          <div class="product-actions">
            <div class="quantity-controls">
              <button 
                class="quantity-btn" 
                @click="decreaseQuantity(product)"
                :disabled="product.quantity <= 0"
              >
                <i class="nav-icon">➖</i>
              </button>
              <span class="quantity-display">{{ product.quantity }}</span>
              <button 
                class="quantity-btn" 
                @click="increaseQuantity(product)"
                :disabled="product.quantity >= product.stock"
              >
                <i class="nav-icon">➕</i>
              </button>
            </div>
            <button 
              class="add-to-cart-btn"
              @click="addToCart(product)"
              :disabled="product.quantity === 0"
            >
              <i class="nav-icon">🛒</i>
              Adaugă în coș
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'

export default {
  name: 'ProductsView',

  data() {
    return {
      demoProducts: [
        {
          id: 1,
          name: 'Sarmale Tradiționale',
          description: 'Sarmale delicioase făcute după rețeta bunicii, cu carne de porc și vită, învelite în foi de varză murată și servite cu mămăligă caldă.',
          price: 35.99,
          stock: 20,
          category: 'Mâncare Gătită',
          image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7',
          quantity: 0
        },
        {
          id: 2,
          name: 'Cozonac cu Nucă',
          description: 'Cozonac proaspăt cu umplutură bogată de nucă, stafide și esență de rom. Perfect pentru momentele speciale alături de cei dragi.',
          price: 45.99,
          stock: 15,
          category: 'Patiserie',
          image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df',
          quantity: 0
        },
        {
          id: 3,
          name: 'Zacuscă de Vinete',
          description: 'Zacuscă autentică făcută din vinete coapte pe foc, ardei copți, ceapă și ulei de măsline. Perfect pentru un mic dejun tradițional.',
          price: 19.99,
          stock: 30,
          category: 'Conserve',
          image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7',
          quantity: 0
        },
        {
          id: 4,
          name: 'Plăcintă cu Brânză',
          description: 'Plăcintă tradițională cu brânză de oaie, mărar și ceapă verde, coaptă în cuptor pe vatră. Gust autentic românesc.',
          price: 28.99,
          stock: 12,
          category: 'Patiserie',
          image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
          quantity: 0
        },
        {
          id: 5,
          name: 'Tochitură Moldovenească',
          description: 'Tochitură cu carne de porc, cârnați afumați și mămăligă, servită cu ou ochi și brânză de oaie. O explozie de savoare.',
          price: 42.99,
          stock: 8,
          category: 'Mâncare Gătită',
          image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba',
          quantity: 0
        },
        {
          id: 6,
          name: 'Tochitură cu Mămăligă',
          description: 'Tochitură tradițională cu carne de porc, cârnați afumați și brânză de oaie, servită cu mămăligă caldă și ou ochi. O specialitate moldovenească autentică.',
          price: 32.99,
          stock: 25,
          category: 'Mâncare Gătită',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
          quantity: 0
        },
        {
          id: 7,
          name: 'Drob de Miel',
          description: 'Drob tradițional de miel cu verdeață proaspătă, ouă și condimente aromate. Perfect pentru masa de sărbătoare.',
          price: 25.99,
          stock: 35,
          category: 'Mâncare Gătită',
          image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db',
          quantity: 0
        },
        {
          id: 8,
          name: 'Ciorbă de Burtă',
          description: 'Ciorbă de burtă cremă, cu smântână, usturoi și ardei iute. Servită cu ardei iute proaspăt.',
          price: 27.99,
          stock: 18,
          category: 'Mâncare Gătită',
          image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
          quantity: 0
        },
        {
          id: 9,
          name: 'Dulceață de Trandafiri',
          description: 'Dulceață artizanală din petale de trandafir culese manual. Perfect pentru deserturi și ceaiuri.',
          price: 23.99,
          stock: 22,
          category: 'Conserve',
          image: 'https://images.unsplash.com/photo-1563778084459-859099e48677',
          quantity: 0
        },
        {
          id: 10,
          name: 'Pâine de Casă',
          description: 'Pâine de casă coaptă în cuptor cu lemne, din făină integrală. Rețetă transmisă din generație în generație.',
          price: 12.99,
          stock: 40,
          category: 'Patiserie',
          image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04',
          quantity: 0
        },
        {
          id: 11,
          name: 'Mici Tradiționali',
          description: 'Mici pregătiți după rețeta autentică românească, din amestec de carne de vită, porc și miel, cu usturoi și condimente.',
          price: 29.99,
          stock: 50,
          category: 'Mâncare Gătită',
          image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd',
          quantity: 0
        },
        {
          id: 12,
          name: 'Țuică de Prune',
          description: 'Țuică naturală de prune, dublu distilată, învechită în butoaie de stejar. Produs premium.',
          price: 89.99,
          stock: 10,
          category: 'Băuturi',
          image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
          quantity: 0
        }
      ],
      dbProducts: [],
      isLoading: false,
      error: null,
      searchQuery: '',
      selectedCategory: 'Toate',
      cartStore: useCartStore()
    }
  },

  computed: {
    allProducts() {
      return [...this.demoProducts, ...this.dbProducts];
    },
    filteredProducts() {
      let filtered = this.allProducts;
      
      // Filtrare după căutare
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }
      
      // Filtrare după categorie
      if (this.selectedCategory !== 'Toate') {
        filtered = filtered.filter(product => product.category === this.selectedCategory);
      }
      
      return filtered;
    },
    categories() {
      const uniqueCategories = new Set(this.allProducts.map(product => product.category));
      return ['Toate', ...Array.from(uniqueCategories)];
    }
  },

  methods: {
    async fetchProducts() {
      try {
        this.isLoading = true;
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) throw new Error('Eroare la obținerea produselor');
        this.dbProducts = await response.json();
      } catch (error) {
        console.error('Error:', error);
        this.error = 'Nu s-au putut încărca produsele. Vă rugăm să încercați din nou.';
      } finally {
        this.isLoading = false;
      }
    },

    filterByCategory(category) {
      this.selectedCategory = category
    },

    increaseQuantity(product) {
      if (product.quantity === undefined) product.quantity = 0
      if (product.quantity < product.stock) product.quantity++
    },

    decreaseQuantity(product) {
      if (product.quantity > 0) product.quantity--
    },

    addToCart(product) {
      if (product.quantity > 0 && product.quantity <= product.stock) {
        this.cartStore.addToCart(product, parseInt(product.quantity));
        product.quantity = 0;
      }
    }
  },

  mounted() {
    this.fetchProducts();
  }
}
</script>

<style scoped>
.products-container {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  padding: 80px 5% 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Search Section Styles */
.search-section {
  max-width: 1400px;
  margin: 0 auto 2rem;
  padding: 1rem;
}

.search-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1.1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: white;
}

.search-input:focus {
  border-color: #2577c8;
  box-shadow: 0 0 0 4px rgba(37, 119, 200, 0.1);
  outline: none;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.category-filters {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  padding: 0.5rem 0;
}

.category-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid #2577c8;
  border-radius: 25px;
  background: white;
  color: #2577c8;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn.active {
  background: #2577c8;
  color: white;
}

/* Products Grid Styles */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.product-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  width: 100%;
  padding-top: 75%; /* Ratio 4:3 */
}

.product-image-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stock-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ff4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.product-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.product-header h3 {
  font-size: 1.25rem;
  color: #333;
  margin: 0;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2577c8;
}

.product-info {
  flex: 1;
}

.description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stock-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.category-tag {
  background: #e9ecef;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.875rem;
  color: #495057;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  padding: 0.25rem;
  border-radius: 8px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2577c8;
  transition: background-color 0.3s;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  min-width: 32px;
  text-align: center;
  font-weight: 500;
}

.add-to-cart-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #2577c8;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
}

.add-to-cart-btn:hover {
  background: #1b5a9d;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .products-container {
    padding: 60px 3% 1rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .product-card {
    flex-direction: column;
  }

  .product-image-container {
    padding-top: 66.67%; /* Ratio 3:2 for mobile */
  }

  .product-details {
    padding: 1rem;
  }

  .product-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .quantity-controls {
    width: 100%;
    justify-content: center;
  }

  .add-to-cart-btn {
    width: 100%;
  }
}

@media (min-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr); /* Fix to 3 columns for consistent layout */
    gap: 2rem;
    padding: 0 2rem;
  }

  .product-card {
    flex-direction: column;
    height: auto;
    max-width: 400px;
    margin: 0 auto;
    width: 100%;
  }

  .product-image-container {
    width: 100%;
    padding-top: 75%; /* Ratio 4:3 for images */
    position: relative;
  }

  .product-details {
    width: 100%;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .product-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .product-header h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .price {
    font-size: 1.75rem;
  }

  .description {
    font-size: 1rem;
    line-height: 1.6;
    margin: 1rem 0;
  }

  .product-actions {
    margin-top: auto;
  }
}

@media (min-width: 1600px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr); /* 4 columns for very large screens */
    max-width: 1800px;
    margin: 0 auto;
  }
}

@media (min-width: 2000px) {
  .products-grid {
    grid-template-columns: repeat(5, 1fr); /* 5 columns for ultra-wide screens */
  }
}
</style> 