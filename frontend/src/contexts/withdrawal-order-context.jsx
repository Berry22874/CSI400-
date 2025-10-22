"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from 'axios'

const WithdrawalOrderContext = createContext(undefined)

export function WithdrawalOrderProvider({ children }) {
  const [withdrawalOrders, setWithdrawalOrders] = useState([])

  useEffect(() => {
    loadWithdrawalOrders()
  }, [])

  const loadWithdrawalOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/withdrawal-orders')
      if (response.data && response.data.withdrawalOrders) {
        setWithdrawalOrders(response.data.withdrawalOrders)
      }
    } catch (error) {
      console.error('Failed to load withdrawal orders:', error)
    }
  }

  const createWithdrawalOrder = async (orderData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/withdrawal-orders', orderData)
      if (response.data) {
        setWithdrawalOrders(prev => [...prev, response.data])
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to create withdrawal order:', error)
      return false
    }
  }

  return (
    <WithdrawalOrderContext.Provider value={{
      withdrawalOrders,
      createWithdrawalOrder,
    }}>
      {children}
    </WithdrawalOrderContext.Provider>
  )
}

export function useWithdrawalOrders() {
  const context = useContext(WithdrawalOrderContext)
  if (!context) {
    throw new Error("useWithdrawalOrders must be used within WithdrawalOrderProvider")
  }
  return context
}
