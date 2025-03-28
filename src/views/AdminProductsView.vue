<template>
  <div class="admin-products">
    <div class="admin-header">
      <h1>Administrare Produse</h1>
      <button @click="showForm = true" v-if="!showForm" class="add-product-btn">
        <i class="nav-icon">➕</i>
        Adaugă Produs Nou
      </button>
    </div>
    
    <!-- Formular pentru adăugare/editare produs -->
    <div class="product-form" v-if="showForm">
      <h2>{{ editingProduct ? 'Editare Produs' : 'Adăugare Produs Nou' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Nume Produs</label>
          <input type="text" id="name" v-model="form.name" required>
        </div>
        
        <div class="form-group">
          <label for="description">Descriere</label>
          <textarea id="description" v-model="form.description" required></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="price">Preț</label>
            <input type="number" id="price" v-model="form.price" step="0.01" required>
          </div>
          
          <div class="form-group">
            <label for="stock">Stoc</label>
            <input type="number" id="stock" v-model="form.stock" required>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="category">Categorie</label>
            <select id="category" v-model="form.category" required class="form-select">
              <option value="" disabled>Selectează o categorie</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="image">Imagine Produs</label>
            <div class="file-input-wrapper">
              <input 
                type="file" 
                id="image" 
                @change="handleImageChange" 
                accept="image/*"
                class="file-input"
              >
              <label for="image" class="file-label">
                <i class="nav-icon">📁</i>
                {{ form.image ? 'Schimbă Imaginea' : 'Alege Imagine' }}
              </label>
              <span v-if="form.image" class="file-name">{{ getFileName(form.image) }}</span>
              <img 
                v-if="form.image" 
                :src="typeof form.image === 'string' ? form.image : URL.createObjectURL(form.image)" 
                alt="Preview" 
                class="image-preview"
              >
            </div>
          </div>
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="form.isAvailable">
            Produs Disponibil
          </label>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ editingProduct ? 'Salvează Modificările' : 'Adaugă Produs' }}
          </button>
          <button type="button" class="cancel-btn" @click="cancelEdit" :disabled="isLoading">
            Anulează
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de produse -->
    <div class="products-list" v-if="!showForm">
      <div class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.image" :alt="product.name">
            <div 
              class="product-availability" 
              :class="{ 'available': product.isAvailable }"
              @click="toggleAvailability(product)"
              style="cursor: pointer;"
            >
              {{ product.isAvailable ? 'Disponibil' : 'Indisponibil' }}
            </div>
          </div>
          
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <div class="product-details">
              <span class="price">{{ product.price }} RON</span>
              <span class="stock">Stoc: {{ product.stock }}</span>
            </div>
            <span class="category">{{ product.category }}</span>
            <p class="description">{{ product.description }}</p>
            
            <div class="product-actions">
              <button class="edit-btn" @click="editProduct(product)">
                <i class="nav-icon">✏️</i>
                Editează
              </button>
              <button class="delete-btn" @click="confirmDelete(product)">
                <i class="nav-icon">🗑️</i>
                Șterge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAdminStore } from '@/stores/admin'

export default {
  name: 'AdminProductsView',

  data() {
    return {
      adminStore: useAdminStore(),
      showForm: false,
      editingProduct: null,
      categories: [
        'Băuturi',
        'Dulciuri',
        'Conserve',
        'Condimente',
        'Produse de panificație',
        'Mezeluri',
        'Lactate',
        'Snacks-uri'
      ],
      form: {
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: '',
        isAvailable: true
      },
      isLoading: false
    }
  },

  mounted() {
    // Încărcăm lista de produse când componenta este montată
    this.loadProducts();
  },

  computed: {
    products() {
      return this.adminStore.products
    }
  },

  methods: {
    async loadProducts() {
      try {
        await this.adminStore.fetchProducts();
      } catch (error) {
        console.error('Eroare la încărcarea produselor:', error);
        alert('Nu s-au putut încărca produsele. Te rugăm să reîncerci.');
      }
    },

    handleImageChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.image = file
      }
    },

    getFileName(image) {
      if (typeof image === 'string') {
        return image.split('/').pop()
      }
      return image.name
    },

    async handleSubmit() {
      try {
        this.isLoading = true
        const formData = new FormData()
        
        // Adăugăm toate câmpurile în FormData
        Object.keys(this.form).forEach(key => {
          if (key === 'image' && typeof this.form[key] === 'object') {
            formData.append(key, this.form[key])
          } else {
            formData.append(key, this.form[key])
          }
        })

        if (this.editingProduct) {
          await this.adminStore.updateProduct(this.editingProduct.id, formData)
        } else {
          await this.adminStore.addProduct(formData)
        }
        this.showForm = false
      } catch (error) {
        alert('Eroare la salvarea produsului')
      } finally {
        this.isLoading = false
      }
    },

    cancelEdit() {
      this.showForm = false
      this.form = {
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: '',
        isAvailable: true
      }
    },

    editProduct(product) {
      this.editingProduct = product
      this.form = { ...product }
      this.showForm = true
    },

    confirmDelete(product) {
      this.editingProduct = product
      this.showForm = true
    },

    async deleteProduct() {
      try {
        await this.adminStore.deleteProduct(this.editingProduct.id)
        this.showForm = false
      } catch (error) {
        alert('Eroare la ștergerea produsului')
      }
    },

    async toggleAvailability(product) {
      try {
        // Pregătim datele pentru actualizare
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('category', product.category);
        formData.append('image', product.image);
        formData.append('isAvailable', !product.isAvailable);

        // Actualizăm produsul
        await this.adminStore.updateProduct(product.id, formData);
      } catch (error) {
        console.error('Error toggling availability:', error);
        alert('Eroare la actualizarea disponibilității produsului');
      }
    }
  }
}
</script>

<style scoped>
.admin-products {
  padding: 0;
  margin: 0;
  margin-top: 60px;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.admin-header {
  padding: 1rem;
  margin-bottom: 1rem;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  color: #2577c8;
  margin: 0;
  font-size: 1.5rem;
}

.add-product-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #2577c8;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-product-btn:hover {
  background: #1b5a9d;
}

.products-list {
  margin: 0;
  padding: 0 1rem;
}

.products-grid {
  display: grid;
  gap: 1px;
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  margin-top: 0.75rem;
  overflow: hidden;
  gap: 0.5rem;
  width: 100%;
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-availability {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #ff4444;
  color: white;
}

.product-availability.available {
  background: #00C851;
}

.product-info {
  padding: 1.25rem;
}

.product-info h3 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.1rem;
  font-weight: 500;
}

.product-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.75rem 0;
}

.price {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2577c8;
}

.stock {
  color: #666;
  font-size: 0.9rem;
}

.category {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e9ecef;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #495057;
  margin-bottom: 0.5rem;
}

.description {
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.product-actions {
  display: flex;
  gap: 0.75rem;
  padding: 0 1.25rem 1.25rem;
  justify-content: center;
}

.edit-btn,
.delete-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  max-width: 200px;
}

.edit-btn {
  background: #2577c8;
  color: white;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

/* Product Form */
.product-form {
  background: white;
  padding: 1.5rem;
  margin: 0 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-form h2 {
  color: #2577c8;
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2577c8;
  box-shadow: 0 0 0 2px rgba(37, 119, 200, 0.1);
}

.form-row {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin: 0;
}

.checkbox-group input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
  accent-color: #2577c8;
  cursor: pointer;
}

.image-preview {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  margin-top: 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn,
.cancel-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn {
  background: #2577c8;
  color: white;
}

.submit-btn:hover {
  background: #1b5a9d;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #dee2e6;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.submit-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.file-input-wrapper {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #2577c8;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.file-label:hover {
  background: #1b5a9d;
}

.file-name {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #2577c8;
  box-shadow: 0 0 0 2px rgba(37, 119, 200, 0.1);
}

@media (min-width: 768px) {
  .admin-products {
    padding: 1rem 5%;
    max-width: 1400px;
    margin: 60px auto 0;
    width: 100%;
  }

  .admin-header {
    padding: 0;
    margin-bottom: 2rem;
    background: transparent;
  }

  .products-list {
    padding: 0;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    background: transparent;
  }

  .product-card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  .product-image {
    border-radius: 12px 12px 0 0;
  }

  .product-info {
    padding: 1.5rem;
  }

  .product-actions {
    padding: 0 1.5rem 1.5rem;
  }

  .product-form {
    max-width: 800px;
    margin: 0 auto 2rem;
    padding: 2rem;
  }

  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1600px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style> 