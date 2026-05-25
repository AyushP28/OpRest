import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const STATUSES = ['pending', 'preparing', 'ready', 'delivered']
const STATUS_COLORS = {
  pending:   '#f59e0b',
  preparing: '#6366f1',
  ready:     '#22c55e',
  delivered: '#4a4a4a',
}
const STATUS_LABELS = {
  pending:   'Pending',
  preparing: 'Preparing',
  ready:     'Ready to serve',
  delivered: 'Delivered',
}

function DemoCard() {
  const [status, setStatus] = useState('pending')

  useEffect(() => {
    const id = setInterval(() => {
      setStatus(prev => STATUSES[(STATUSES.indexOf(prev) + 1) % STATUSES.length])
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="demo-card">
      <div className="demo-card-top">
        <div>
          <span className="demo-table">Table 3</span>
          <span className="demo-customer">James K.</span>
        </div>
        <span className="demo-age">just now</span>
      </div>
      <div className="demo-items">
        <div className="demo-item-row"><span>Cheeseburger</span><span>×2</span></div>
        <div className="demo-item-row"><span>Fries</span><span>×1</span></div>
        <div className="demo-item-row"><span>Lemonade</span><span>×2</span></div>
      </div>
      <div className="demo-card-footer">
        <span className="demo-total">$34.50</span>
        <span className="demo-status" style={{ color: STATUS_COLORS[status] }}>
          <span className="demo-dot" style={{ background: STATUS_COLORS[status] }} />
          {STATUS_LABELS[status]}
        </span>
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <main className="home-page">

      <div className="hero">
        <div className="hero-glow" />
        <div className="container">
          <div className="hero-inner">
            <div className="hero-content">
              <p className="hero-label">QR-based ordering</p>
              <h1>Order from<br />your table.</h1>
              <p className="hero-sub">
                Customers scan a QR code, browse the menu, and place orders
                from their phone. Staff manage everything from a live kitchen
                dashboard — no waiting, no miscommunication.
              </p>
              <div className="hero-btns">
                <Link to="/login" className="btn btn-primary">Sign in</Link>
                <Link to="/about" className="btn btn-outline">About</Link>
              </div>
            </div>
            <div className="hero-visual">
              <DemoCard />
            </div>
          </div>
        </div>
      </div>

      <section className="features">
        <div className="container">
          <div className="feature-row">
            <span className="feature-num">01</span>
            <span className="feature-name">QR ordering</span>
            <p className="feature-desc">Each table has a unique QR code. Customers scan it, log in with table credentials, and place an order instantly — no app install, no friction.</p>
          </div>
          <div className="feature-row">
            <span className="feature-num">02</span>
            <span className="feature-name">Real-time kitchen</span>
            <p className="feature-desc">Orders appear on the kitchen dashboard the moment they're submitted via WebSockets. Status updates (pending → preparing → ready) push back to the customer live.</p>
          </div>
          <div className="feature-row">
            <span className="feature-num">03</span>
            <span className="feature-name">Menu management</span>
            <p className="feature-desc">Staff can add, edit, or remove menu items in real time with full CRUD. Category filtering, price editing, and dietary tags are all supported.</p>
          </div>
        </div>
      </section>

    </main>
  )
}

export default HomePage
