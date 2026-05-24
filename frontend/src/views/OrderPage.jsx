import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

const statusColors = {
  pending:   '#f59e0b',
  preparing: '#3b82f6',
  ready:     '#10b981',
  delivered: '#6b7280'
}

function OrderPage() {
  const [tab, setTab] = useState('order') 
  const [allMenuItems, setAllMenuItems]     = useState([])
  const [selectedItems, setSelectedItems]   = useState({})
  const [customerName, setCustomerName]     = useState('')
  const [menuLoading, setMenuLoading]       = useState(true)
  const [submittedOrder, setSubmittedOrder] = useState(null)
  const [orderStatus, setOrderStatus]       = useState('')

  // order history state
  const [orderHistory, setOrderHistory]     = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const socketRef = useRef(null)
  const { user, getToken } = useAuth()

  useEffect(() => {
    loadMenu()

    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:8080')

    socketRef.current.on('order_updated', ({ orderId, status }) => {
      // update the active tracking view
      setSubmittedOrder(prev => {
        if (prev && prev._id === orderId) {
          setOrderStatus(status)
          return { ...prev, status }
        }
        return prev
      })
      // update the history list too
      setOrderHistory(prev =>
        prev.map(o => o._id === orderId ? { ...o, status } : o)
      )
    })

    return () => socketRef.current.disconnect()
  }, [])

  // load history when switching to history tab
  useEffect(() => {
    if (tab === 'history') loadOrderHistory()
  }, [tab])

  async function loadMenu() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/menu`)
      if (!res.ok) throw new Error()
      setAllMenuItems(await res.json())
    } catch (err) {
      console.error('Failed to load menu items:', err)
    } finally {
      setMenuLoading(false)
    }
  }

  async function loadOrderHistory() {
    setHistoryLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      if (!res.ok) throw new Error()
      setOrderHistory(await res.json())
    } catch (err) {
      console.error('Failed to load order history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  function updateQty(itemId, newQty) {
    setSelectedItems(prev => {
      if (newQty <= 0) {
        const updated = { ...prev }
        delete updated[itemId]
        return updated
      }
      return { ...prev, [itemId]: newQty }
    })
  }

  function getSelectedItemsList() {
    return Object.entries(selectedItems)
      .map(([id, qty]) => {
        const menuItem = allMenuItems.find(m => m._id === id)
        return menuItem ? { ...menuItem, qty } : null
      })
      .filter(Boolean)
  }

  function calculateTotal() {
    return Object.entries(selectedItems).reduce((total, [id, qty]) => {
      const menuItem = allMenuItems.find(m => m._id === id)
      return menuItem ? total + menuItem.price * qty : total
    }, 0)
  }

  async function submitOrder(e) {
    e.preventDefault()
    const chosenItems = getSelectedItemsList()
    if (chosenItems.length === 0) {
      alert('Please add at least one item to your order.')
      return
    }
    const orderData = {
      customerName: customerName.trim() || user.username,
      tableNumber:  user.tableNumber,
      items: chosenItems.map(i => ({ foodname: i.foodname, price: i.price, qty: i.qty })),
      total: parseFloat(calculateTotal().toFixed(2))
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(orderData)
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to submit order')
      }
      const saved = await res.json()
      setSubmittedOrder(saved)
      setOrderStatus(saved.status)
      setSelectedItems({})
      setCustomerName('')
    } catch (err) {
      alert(err.message)
    }
  }

  const cartItems = getSelectedItemsList()
  const total = calculateTotal()

  // active order tracking view
  if (submittedOrder) {
    return (
      <main className="page order-page">
        <div className="container">
          <div className="order-tracking">
            <h2>Order Placed!</h2>
            <p className="tracking-table">Table {user.tableNumber}</p>
            <div className="tracking-status">
              <span className="status-badge" style={{ backgroundColor: statusColors[orderStatus] }}>
                {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
              </span>
              <p className="tracking-hint">
                {orderStatus === 'pending'   && 'Your order has been received and is waiting to be prepared.'}
                {orderStatus === 'preparing' && 'The kitchen is preparing your order!'}
                {orderStatus === 'ready'     && 'Your order is ready! A staff member will bring it to you.'}
                {orderStatus === 'delivered' && 'Your order has been delivered. Enjoy your meal!'}
              </p>
            </div>
            <div className="tracking-items">
              <h4>Your order:</h4>
              {submittedOrder.items.map((item, i) => (
                <div key={i} className="cart-row">
                  <span>{item.foodname} &times;{item.qty}</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="cart-total">
                <strong>Total: ${submittedOrder.total.toFixed(2)}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setSubmittedOrder(null)}>
                Place Another Order
              </button>
              <button className="btn btn-outline" onClick={() => { setSubmittedOrder(null); setTab('history') }}>
                View Order History
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page order-page">
      <div className="container">

        {/* Tab bar */}
        <div className="tab-bar">
          <button className={`tab-btn${tab === 'order' ? ' active' : ''}`} onClick={() => setTab('order')}>
            Place Order
          </button>
          <button className={`tab-btn${tab === 'history' ? ' active' : ''}`} onClick={() => setTab('history')}>
            My Orders
          </button>
        </div>

        {/* Place Order tab */}
        {tab === 'order' && (
          <div className="order-layout">
            <div className="menu-select-panel">
              <h3>Select Items</h3>
              {menuLoading ? <p>Loading menu...</p> : (
                <div className="menu-select-list">
                  {allMenuItems.map(item => (
                    <div key={item._id} className="menu-select-row">
                      <div className="menu-select-info">
                        <span className="menu-select-name">{item.foodname}</span>
                        <span className="menu-select-price">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => updateQty(item._id, (selectedItems[item._id] || 0) - 1)}>-</button>
                        <span className="qty-display">{selectedItems[item._id] || 0}</span>
                        <button className="qty-btn" onClick={() => updateQty(item._id, (selectedItems[item._id] || 0) + 1)}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="order-summary-panel">
              <h3>Your Order — Table {user.tableNumber}</h3>
              {cartItems.length === 0 ? (
                <p className="empty-cart">No items selected yet.</p>
              ) : (
                <div className="cart-list">
                  {cartItems.map(item => (
                    <div key={item._id} className="cart-row">
                      <span>{item.foodname} &times;{item.qty}</span>
                      <span>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="cart-total">
                    <strong>Total: ${total.toFixed(2)}</strong>
                  </div>
                </div>
              )}

              <form onSubmit={submitOrder} className="order-form">
                <h4>Your Info</h4>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder={user.username}
                  />
                </div>
                <div className="form-group">
                  <label>Table</label>
                  <input type="text" value={`Table ${user.tableNumber}`} disabled />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Submit Order
                </button>
              </form>
            </div>
          </div>
        )}

        {/* My Orders and History tab */}
        {tab === 'history' && (
          <div className="order-history-panel">
            <div className="history-header">
              <h3>My Orders — Table {user.tableNumber}</h3>
              <button className="btn btn-sm btn-outline" onClick={loadOrderHistory}>Refresh</button>
            </div>

            {historyLoading && <p className="status-msg">Loading orders...</p>}

            {!historyLoading && orderHistory.length === 0 && (
              <p className="status-msg">No orders yet. Go place one!</p>
            )}

            {!historyLoading && orderHistory.map(order => (
              <div key={order._id} className="history-card">
                <div className="history-card-top">
                  <div>
                    <span className="history-name">{order.customerName}</span>
                    <span className="history-time">
                      {new Date(order.createdAt).toLocaleString([], {
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span className="status-badge" style={{ backgroundColor: statusColors[order.status] }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="history-items">
                  {order.items.map((item, i) => (
                    <span key={i} className="history-item-chip">
                      {item.foodname} &times;{item.qty}
                    </span>
                  ))}
                </div>
                <div className="history-total">Total: <strong>${order.total.toFixed(2)}</strong></div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}

export default OrderPage
