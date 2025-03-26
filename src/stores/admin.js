import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    products: [],
    isLoading: false,
    error: null
  }),

  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === id)
    }
  },

  actions: {
    async fetchProducts() {
      try {
        this.isLoading = true;
        const response = await fetch('http://localhost:3000/api/admin/products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Eroare la obținerea produselor');
        this.products = await response.json();
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Nu s-au putut încărca produsele. Vă rugăm să încercați din nou.';
      } finally {
        this.isLoading = false;
      }
    },

    async addProduct(product) {
      try {
        this.isLoading = true;
        
        // Verificăm dacă product este FormData
        if (product instanceof FormData) {
          // Convertim valorile numerice explicit
          const price = parseFloat(product.get('price'));
          const stock = parseInt(product.get('stock'));
          
          // Creăm un nou FormData cu valorile convertite
          const formData = new FormData();
          formData.append('name', product.get('name'));
          formData.append('description', product.get('description'));
          formData.append('price', price);
          formData.append('stock', stock);
          formData.append('category', product.get('category'));
          formData.append('isAvailable', product.get('isAvailable') === 'true');
          
          if (product.get('image')) {
            formData.append('image', product.get('image'));
          }

          const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });

          if (!response.ok) throw new Error('Eroare la adăugarea produsului');
          const newProduct = await response.json();
          this.products.push(newProduct);
          return newProduct;
        } else {
          // Dacă primim un obiect normal, îl trimitem ca JSON
          const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(product)
          });

          if (!response.ok) throw new Error('Eroare la adăugarea produsului');
          const newProduct = await response.json();
          this.products.push(newProduct);
          return newProduct;
        }
      } catch (error) {
        console.error('Error adding product:', error);
        this.error = 'Nu s-a putut adăuga produsul. Vă rugăm să încercați din nou.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateProduct(id, data) {
      try {
        const token = localStorage.getItem('token');
        let requestData = data;

        // Verificăm dacă data este FormData sau obiect normal
        if (!(data instanceof FormData)) {
          requestData = new FormData();
          Object.keys(data).forEach(key => {
            if (key === 'image' && typeof data[key] === 'object') {
              requestData.append(key, data[key]);
            } else {
              requestData.append(key, data[key]);
            }
          });
        }

        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: requestData
        });

        if (!response.ok) {
          throw new Error('Eroare la actualizarea produsului');
        }

        const updatedProduct = await response.json();
        
        // Actualizăm produsul în lista locală
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }

        return updatedProduct;
      } catch (error) {
        console.error('\n Error updating product:', error);
        throw error;
      }
    },

    async deleteProduct(id) {
      try {
        this.isLoading = true;
        const response = await fetch(`http://localhost:3000/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Eroare la ștergerea produsului');
        this.products = this.products.filter(p => p.id !== id);
      } catch (error) {
        console.error('Error deleting product:', error);
        this.error = 'Nu s-a putut șterge produsul. Vă rugăm să încercați din nou.';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async uploadImage(file) {
      const formData = new FormData()
      formData.append('image', file)
      
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
        const data = await response.json()
        return data.imageUrl
      } catch (error) {
        this.error = 'Eroare la încărcarea imaginii'
        console.error('Error uploading image:', error)
        throw error
      }
    }
  }
}) 