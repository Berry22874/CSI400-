const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()
const DATA_FILE = path.join(__dirname, '..', 'data', 'withdrawalOrders.json')

// Helper functions
function readWithdrawalOrders() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = { withdrawalOrders: [] }
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8')
    return initialData
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    return { withdrawalOrders: [] }
  }
}

function writeWithdrawalOrders(orders) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(orders, null, 2), 'utf8')
}

// Get all withdrawal orders
router.get('/', (req, res) => {
  const orders = readWithdrawalOrders()
  res.json(orders)
})

// Create new withdrawal order
router.post('/', (req, res) => {
  try {
    const orders = readWithdrawalOrders()
    const body = req.body

    const newOrder = {
      id: `WO-${Date.now()}`,
      orderNumber: `WD${new Date().getFullYear()}${String(orders.withdrawalOrders.length + 1).padStart(3, '0')}`,
      department: body.department,
      purpose: body.purpose,
      requestedBy: body.requestedBy,
      createdAt: new Date().toISOString(),
      status: 'pending',
      items: body.items,
      notes: body.notes || null
    }

    orders.withdrawalOrders.push(newOrder)
    writeWithdrawalOrders(orders)
    
    res.status(201).json(newOrder)
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ error: 'Failed to create withdrawal order' })
  }
})

module.exports = router