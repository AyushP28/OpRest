import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

const statusOptions = ['pending', 'preparing', 'ready', 'delivered']

const statusColors = {
  pending:   '#f59e0b',
  preparing: '#3b82f6',
  ready:     '#10b981',
  delivered: '#6b7280'
}

function KitchenPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('active') 
  const socketRef = useRef(null)
  const { getToken } = useAuth()

  useEffect(() => {
    loadOrders()

    // connect to socket and listen for real time order events
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:8080')

    socketRef.current.on('new_order', (order) => {
      setOrders(prev => [order, ...prev])
    })

    socketRef.current.on('order_updated', ({ orderId, status }) => {
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, status } : o)
      )
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  async function loadOrders() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(orderId, newStatus) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update status')
      
    } catch (err) {
      alert(err.message)
    }
  }

  const displayedOrders = filter === 'active'
    ? orders.filter(o => o.status !== 'delivered')
    : orders

  return (
    <main className="page kitchen-page">
      <div className="container">
        <div className="page-header">
          <h2>Kitchen Dashboard</h2>
          <div className="kitchen-controls">
            <button
              className={`filter-btn${filter === 'active' ? ' active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active Orders
            </button>
            <button
              className={`filter-btn${filter === 'all' ? ' active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Orders
            </button>
          </div>
        </div>

        <p className="kitchen-hint">New orders appear here automatically in real time.</p>

        {loading && <p className="status-msg">Loading orders...</p>}

        {!loading && displayedOrders.length === 0 && (
          <p className="status-msg">No orders yet. Waiting for customers...</p>
        )}

        <div className="kitchen-grid">
          {displayedOrders.map(order => (
            <div key={order._id} className="kitchen-card">
              <div className="kitchen-card-header">
                <div>
                  <h4>Table {order.tableNumber}</h4>
                  <span className="kitchen-customer">{order.customerName}</span>
                </div>
                <span
                  className="status-badge"
                  style={{ backgroundColor: statusColors[order.status] }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="kitchen-items">
                {order.items.map((item, i) => (
                  <div key={i} className="kitchen-item-row">
                    <span>{item.foodname}</span>
                    <span>&times;{item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="kitchen-footer">
                <span className="kitchen-total">${order.total.toFixed(2)}</span>
                <div className="kitchen-actions">
                  {statusOptions
                    .filter(s => s !== order.status)
                    .map(s => (
                      <button
                        key={s}
                        className="btn btn-sm"
                        style={{ borderColor: statusColors[s], color: statusColors[s] }}
                        onClick={() => updateStatus(order._id, s)}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))
                  }
                </div>
              </div>

              <div className="kitchen-time">
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default KitchenPage
