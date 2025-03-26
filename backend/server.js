const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configurare multer pentru upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Asigurați-vă că acest director există
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limită de 5MB
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Doar fișiere imagine sunt permise!'), false);
    }
    cb(null, true);
  }
});

// Endpoint pentru upload imagine
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nu s-a încărcat niciun fișier' });
    }
    res.json({ 
      imageUrl: `http://localhost:3000/uploads/${req.file.filename}` 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Eroare la încărcarea imaginii' });
  }
});

// Middleware pentru verificarea token-ului
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token lipsă' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalid' });
    }
    req.user = user;
    next();
  });
};

// Middleware pentru verificarea rolului de admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acces interzis. Doar administratorii pot accesa această resursă.' });
  }
  next();
};

// Endpoint pentru obținerea tuturor produselor
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isAvailable: true
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Eroare la obținerea produselor' });
  }
});

// Endpoint pentru obținerea tuturor produselor (inclusiv cele indisponibile) - pentru admin
app.get('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Eroare la obținerea produselor' });
  }
});

// Endpoint pentru adăugarea unui produs nou
app.post('/api/products', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    // Obținem datele din body sau form data
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price ? parseFloat(req.body.price) : 0;
    const stock = req.body.stock ? parseInt(req.body.stock) : 0;
    const category = req.body.category;
    const isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
    
    // Verificăm dacă avem toate datele necesare
    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
      return res.status(400).json({ 
        error: 'Date lipsă sau invalide',
        received: {
          name,
          description,
          price: req.body.price,
          stock: req.body.stock,
          category
        }
      });
    }
    
    // Verificăm imaginea
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    // Creăm produsul în baza de date
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        category,
        image: imageUrl,
        isAvailable
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Eroare la adăugarea produsului', details: error.message });
  }
});

// Endpoint pentru actualizarea unui produs
app.put('/api/products/:id', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obținem datele din body sau form data
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price ? parseFloat(req.body.price) : 0;
    const stock = req.body.stock ? parseInt(req.body.stock) : 0;
    const category = req.body.category;
    const isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
    
    // Verificăm dacă avem toate datele necesare
    if (!name || !description || isNaN(price) || isNaN(stock) || !category) {
      return res.status(400).json({ 
        error: 'Date lipsă sau invalide',
        received: {
          name,
          description,
          price: req.body.price,
          stock: req.body.stock,
          category
        }
      });
    }
    
    // Verificăm imaginea
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    // Actualizăm produsul în baza de date
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price,
        stock,
        category,
        image: imageUrl,
        isAvailable
      }
    });
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Eroare la actualizarea produsului', details: error.message });
  }
});

// Endpoint pentru ștergerea unui produs
app.delete('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Eroare la ștergerea produsului' });
  }
});

// Endpoint for register
app.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role,
      },
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Endpoint for login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check the password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { 
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }});
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 