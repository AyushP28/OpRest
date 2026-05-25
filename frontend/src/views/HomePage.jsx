import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="home-page">

      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Order from your table.</h1>
            <p>
              OpenRest is a QR-based restaurant ordering system. Customers scan a code,
              browse the menu, and place orders from their phone. Staff manage
              everything from a live kitchen dashboard.
            </p>
            <div className="hero-btns">
              <Link to="/login" className="btn btn-primary">Sign in</Link>
              <Link to="/about" className="btn btn-outline">About</Link>
            </div>
          </div>
        </div>
      </div>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <h3>QR ordering</h3>
              <p>Each table has a unique QR code. Customers scan it, log in, and order instantly — no app install required.</p>
            </div>
            <div className="feature-card">
              <h3>Real-time kitchen</h3>
              <p>Orders appear on the kitchen dashboard the moment they're placed via WebSockets. Status updates push back to the customer live.</p>
            </div>
            <div className="feature-card">
              <h3>Menu management</h3>
              <p>Staff can add, edit, or remove items in real time. Full CRUD with category filtering and dietary tags.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

export default HomePage
