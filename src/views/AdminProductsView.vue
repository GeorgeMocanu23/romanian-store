<template>
  <div class="admin-products">
    <div class="admin-header">
      <h1>Administrare Produse</h1>
      <div class="header-actions">
        <div class="view-selector" v-if="!showForm">
          <select v-model="viewMode" class="view-select">
            <option value="grid">Vizualizare Grid</option>
            <option value="table">Vizualizare Tabel</option>
          </select>
        </div>
        <button @click="showForm = true" v-if="!showForm" class="add-product-btn">
          <i class="nav-icon">➕</i>
          Adaugă Produs Nou
        </button>
      </div>
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
                :src="typeof form.image === 'string' ? form.image : imagePreviewUrl" 
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
      <!-- Vizualizare Grid -->
      <div class="products-grid" v-if="viewMode === 'grid'">
        <div v-for="product in products" :key="product.id" class="product-card" :class="{
          'product-limited': product.stock > 0 && product.stock < 5,
          'product-unavailable': product.stock === 0
        }">
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
            <span class="stock-badge indisponibil" v-if="product.stock === 0">Indisponibil</span>
            <span class="stock-badge stoc-limitat" v-else-if="product.stock < 5">Stoc limitat</span>
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

      <!-- Vizualizare Tabel -->
      <div class="products-table" v-else>
        <table>
          <thead>
            <tr>
              <th>Imagine</th>
              <th 
                @click="handleSort('name')"
                class="sortable"
                :class="{ 
                  'sorted': sortColumn === 'name',
                  'desc': sortColumn === 'name' && sortDirection === 'desc'
                }"
              >
                Nume
                <span class="sort-icon" v-if="sortColumn === 'name'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="handleSort('price')"
                class="sortable"
                :class="{ 
                  'sorted': sortColumn === 'price',
                  'desc': sortColumn === 'price' && sortDirection === 'desc'
                }"
              >
                Preț
                <span class="sort-icon" v-if="sortColumn === 'price'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="handleSort('stock')"
                class="sortable"
                :class="{ 
                  'sorted': sortColumn === 'stock',
                  'desc': sortColumn === 'stock' && sortDirection === 'desc'
                }"
              >
                Stoc
                <span class="sort-icon" v-if="sortColumn === 'stock'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="handleSort('category')"
                class="sortable"
                :class="{ 
                  'sorted': sortColumn === 'category',
                  'desc': sortColumn === 'category' && sortDirection === 'desc'
                }"
              >
                Categorie
                <span class="sort-icon" v-if="sortColumn === 'category'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th 
                @click="handleSort('isAvailable')"
                class="sortable"
                :class="{ 
                  'sorted': sortColumn === 'isAvailable',
                  'desc': sortColumn === 'isAvailable' && sortDirection === 'desc'
                }"
              >
                Disponibilitate
                <span class="sort-icon" v-if="sortColumn === 'isAvailable'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" :class="{
              'row-limited': product.stock > 0 && product.stock < 5,
              'row-unavailable': product.stock === 0
            }">
              <td class="table-image">
                <div class="image-container">
                  <img :src="product.image" :alt="product.name">
                  <span class="table-stock-badge indisponibil" v-if="product.stock === 0">0</span>
                  <span class="table-stock-badge stoc-limitat" v-else-if="product.stock < 5">{{ product.stock }}</span>
                </div>
              </td>
              <td>
                <div class="table-product-name">{{ product.name }}</div>
                <div class="table-product-description">{{ product.description }}</div>
              </td>
              <td>{{ product.price }} RON</td>
              <td>{{ product.stock }}</td>
              <td>{{ product.category }}</td>
              <td>
                <span 
                  class="availability-badge" 
                  :class="{ 'available': product.isAvailable }"
                  @click="toggleAvailability(product)"
                >
                  {{ product.isAvailable ? 'Disponibil' : 'Indisponibil' }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="table-actions">
                  <button class="edit-btn" @click="editProduct(product)">
                    <i class="nav-icon">✏️</i>
                  </button>
                  <button class="delete-btn" @click="confirmDelete(product)">
                    <i class="nav-icon">🗑️</i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal confirmare ștergere -->
    <div class="delete-modal" v-if="showDeleteModal">
      <div class="modal-content">
        <h3>Confirmare ștergere</h3>
        <p>Ești sigur că vrei să ștergi produsul <strong>{{ productToDelete?.name }}</strong>?</p>
        <div class="modal-actions">
          <button @click="confirmDeleteProduct" class="delete-btn" :disabled="isLoading">
            {{ isLoading ? 'Se șterge...' : 'Da, șterge' }}
          </button>
          <button @click="cancelDelete" class="cancel-btn">Nu, anulează</button>
        </div>
      </div>
    </div>

    <!-- Modal confirmare disponibilitate -->
    <div class="availability-modal" v-if="showAvailabilityModal">
      <div class="modal-content">
        <h3>Confirmare modificare disponibilitate</h3>
        <p>Ești sigur că vrei să 
          <strong>{{ productToToggle?.isAvailable ? 'dezactivezi' : 'activezi' }}</strong> 
          produsul <strong>{{ productToToggle?.name }}</strong>?
        </p>
        <div class="modal-actions">
          <button @click="confirmToggleAvailability" class="confirm-btn" :disabled="isLoading">
            {{ isLoading ? 'Se procesează...' : 'Da, confirmă' }}
          </button>
          <button @click="cancelToggleAvailability" class="cancel-btn">Nu, anulează</button>
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
      showDeleteModal: false,
      showAvailabilityModal: false,
      editingProduct: null,
      productToDelete: null,
      productToToggle: null,
      viewMode: 'grid',
      sortColumn: '',
      sortDirection: 'asc',
      imagePreviewUrl: null,
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
      let sortedProducts = [...this.adminStore.products];
      
      if (this.sortColumn) {
        sortedProducts.sort((a, b) => {
          let aValue = a[this.sortColumn];
          let bValue = b[this.sortColumn];
          
          // Convertim în numere pentru coloanele numerice
          if (this.sortColumn === 'price' || this.sortColumn === 'stock') {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
          } else {
            // Pentru text, convertim la lowercase pentru comparare case-insensitive
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
          }
          
          if (this.sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }
      
      return sortedProducts;
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
        // Eliberăm URL-ul anterior dacă există
        if (this.imagePreviewUrl) {
          URL.revokeObjectURL(this.imagePreviewUrl)
        }
        this.form.image = file
        // Salvăm noul URL pentru revocare ulterioară
        this.imagePreviewUrl = URL.createObjectURL(file)
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
      // Eliberăm URL-ul dacă există
      if (this.imagePreviewUrl) {
        URL.revokeObjectURL(this.imagePreviewUrl)
        this.imagePreviewUrl = null
      }
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
      this.editingProduct = null
    },

    editProduct(product) {
      this.editingProduct = product
      this.form = { ...product }
      this.showForm = true
    },

    confirmDelete(product) {
      this.productToDelete = product;
      this.showDeleteModal = true;
    },

    cancelDelete() {
      this.productToDelete = null;
      this.showDeleteModal = false;
    },

    async confirmDeleteProduct() {
      try {
        this.isLoading = true;
        await this.adminStore.deleteProduct(this.productToDelete.id);
        this.showDeleteModal = false;
        this.productToDelete = null;
      } catch (error) {
        alert('Eroare la ștergerea produsului');
      } finally {
        this.isLoading = false;
      }
    },

    toggleAvailability(product) {
      this.productToToggle = product;
      this.showAvailabilityModal = true;
    },

    cancelToggleAvailability() {
      this.productToToggle = null;
      this.showAvailabilityModal = false;
    },

    async confirmToggleAvailability() {
      try {
        this.isLoading = true;
        const formData = new FormData();
        formData.append('name', this.productToToggle.name);
        formData.append('description', this.productToToggle.description);
        formData.append('price', this.productToToggle.price);
        formData.append('stock', this.productToToggle.stock);
        formData.append('category', this.productToToggle.category);
        formData.append('image', this.productToToggle.image);
        formData.append('isAvailable', !this.productToToggle.isAvailable);

        await this.adminStore.updateProduct(this.productToToggle.id, formData);
        this.showAvailabilityModal = false;
        this.productToToggle = null;
      } catch (error) {
        console.error('Error toggling availability:', error);
        alert('Eroare la actualizarea disponibilității produsului');
      } finally {
        this.isLoading = false;
      }
    },

    handleSort(column) {
      if (this.sortColumn === column) {
        // Dacă coloana este deja sortată, schimbăm direcția
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        // Dacă sortăm o nouă coloană, setăm direcția ascendentă
        this.sortColumn = column;
        this.sortDirection = 'asc';
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
  text-align: center;
  width: 100%;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.view-selector {
  position: relative;
}

.view-select {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-select:focus {
  outline: none;
  border-color: #2577c8;
  box-shadow: 0 0 0 2px rgba(37, 119, 200, 0.1);
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
  white-space: nowrap;
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

/* Stilizare Tabel */
.products-table {
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: middle;
}

th {
  background-color: #f8f9fa;
  font-weight: 500;
  color: #333;
}

.table-image {
  position: relative;
  width: 80px;
}

.table-image .image-container {
  position: relative;
  display: inline-block;
}

.table-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.table-stock-badge {
  position: absolute;
  top: -8px;
  left: -8px;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.table-stock-badge.indisponibil {
  background: #dc3545; /* Roșu pentru indisponibil */
}

.table-stock-badge.stoc-limitat {
  background: #ff9800; /* Portocaliu pentru stoc limitat */
}

.table-product-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.table-product-description {
  font-size: 0.875rem;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  line-clamp: 2;
}

.availability-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #ff4444;
  color: white;
  cursor: pointer;
}

.availability-badge.available {
  background: #00C851;
}

.actions-cell {
  width: 120px;
  text-align: center;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.table-actions button {
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.table-actions .edit-btn {
  background: #2577c8;
  color: white;
}

.table-actions .delete-btn {
  background: #dc3545;
  color: white;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .view-select {
    width: 100%;
  }

  .products-table {
    /* margin: 0 -1rem; */
    border-radius: 0;
  }

  table {
    font-size: 0.875rem;
  }

  th, td {
    padding: 0.75rem;
  }

  .table-image {
    width: 60px;
  }

  .table-image img {
    width: 40px;
    height: 40px;
  }

  .table-product-description {
    max-width: 200px;
  }
}

.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-right: 1.5rem;
}

.sortable:hover {
  background-color: #e9ecef;
}

.sort-icon {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.sorted {
  background-color: #f1f8ff;
}

.sorted .sort-icon {
  color: #2577c8;
}

.desc.sorted {
  background-color: #f8f1ff;
}

/* Stilizare Modal */
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  color: #333;
  margin: 0 0 1rem;
  font-size: 1.25rem;
}

.modal-content p {
  color: #666;
  margin-bottom: 1.5rem;
}

.modal-content strong {
  color: #333;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-actions .delete-btn {
  background: #dc3545;
  color: white;
}

.modal-actions .delete-btn:hover {
  background: #c82333;
}

.modal-actions .delete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.modal-actions .cancel-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.modal-actions .cancel-btn:hover {
  background: #e9ecef;
}

/* Stilizare Modal Disponibilitate */
.availability-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-actions .confirm-btn {
  background: #2577c8;
  color: white;
}

.modal-actions .confirm-btn:hover {
  background: #1b5a9d;
}

.modal-actions .confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.product-card.product-limited {
  border: 4px solid #ff9800;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(255, 152, 0, 0.2);
}

.product-card.product-unavailable {
  border: 4px solid #dc3545;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2);
  opacity: 0.8;
}

.stock-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 20;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.stock-badge.indisponibil {
  background: #dc3545; /* Roșu pentru indisponibil */
}

.stock-badge.stoc-limitat {
  background: #ff9800; /* Portocaliu pentru stoc limitat */
}

.row-limited {
  background-color: rgba(255, 153, 0, 0.368);
}

.row-limited:hover {
  background-color: rgba(255, 153, 0, 0.737);
}

.row-unavailable {
  background-color: rgba(220, 53, 70, 0.372);
}

.row-unavailable:hover {
  background-color: rgba(220, 53, 70, 0.737);
}
</style> 