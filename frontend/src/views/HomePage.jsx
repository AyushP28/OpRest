import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="home-page">
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Order from your table</h1>
            <p>
              OpenRest is a QR-based restaurant ordering system. Customers scan a
              code at their table, browse the live menu, and place orders instantly
              — no waiting for a server.
            </p>
            <div className="hero-btns">
              <Link to="/menu"  className="btn btn-primary">View Menu</Link>
              <Link to="/order" className="btn btn-secondary">Place Order</Link>
              <Link to="/about" className="btn btn-outline">About Us</Link>
            </div>
          </div>
        </div>
      </div>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <h3>Fast Service</h3>
              <p>Browse the full menu, select your items, and submit your order in seconds — all from your phone.</p>
            </div>
            <div className="feature-card">
              <h3>QR Code Ordering</h3>
              <p>Each table has a unique QR code. Scan it and start ordering immediately, no app install required.</p>
            </div>
            <div className="feature-card">
              <h3>Live Menu Management</h3>
              <p>Staff can add, edit, or remove menu items in real time using the full CRUD menu manager.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
