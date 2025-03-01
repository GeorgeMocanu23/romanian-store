import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const app = express()
const prisma = new PrismaClient()
const SECRET_KEY = 'your_secret_key'

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

// Endpoint for register
app.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: 'CUSTOMER',
      },
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Endpoint for login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' })
    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Endpoint for create user
app.post('/users', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        role: 'CUSTOMER', // Set default role to 'CUSTOMER'
      },
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Endpoint for get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(5173, () => {
  console.log('Server is running on http://localhost:5173')
})
