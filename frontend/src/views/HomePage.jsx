import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <main className="home-page">

      {/* Hero */}
      <div className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">QR-based ordering system</div>
            <h1>
              Order from your<br />
              <em>table, instantly.</em>
            </h1>
            <p>
              OpenRest lets customers scan a QR code, browse the live menu, and
              place orders from their phone — no waiting, no miscommunication.
              Staff manage everything in real time.
            </p>
            <div className="hero-btns">
              <Link to="/login" className="btn btn-primary">Try it now</Link>
              <Link to="/about" className="btn btn-outline">Learn more</Link>
            </div>

            <div className="hero-stats">
              <div>
                <span className="hero-stat-value">5</span>
                <span className="hero-stat-label">Table accounts</span>
              </div>
              <div>
                <span className="hero-stat-value">15</span>
                <span className="hero-stat-label">Menu items</span>
              </div>
              <div>
                <span className="hero-stat-value">Live</span>
                <span className="hero-stat-label">Real-time orders</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="features">
        <div className="container">
          <p className="section-label">What it does</p>
          <h2 className="section-title">Everything a restaurant needs</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">&#x1F4F1;</div>
              <h3>Scan & Order</h3>
              <p>Each table gets a unique QR code. Customers scan it, log in, and browse the full menu — no app install required.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#x26A1;</div>
              <h3>Real-time Kitchen</h3>
              <p>Orders appear on the kitchen dashboard the moment they're placed via WebSockets — no refresh needed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#x270F;&#xFE0F;</div>
              <h3>Live Menu CRUD</h3>
              <p>Staff can add, edit, or remove menu items in real time. Changes reflect immediately for all customers.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#x1F4CA;</div>
              <h3>Order Tracking</h3>
              <p>Customers see their order status update live — pending, preparing, ready, delivered — right on their phone.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#x1F512;</div>
              <h3>Role-based Access</h3>
              <p>JWT auth with two roles: staff accounts access the kitchen dashboard and menu manager, table accounts can only order.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">&#x1F30D;</div>
              <h3>REST API</h3>
              <p>Full CRUD API for menus and orders. Documented routes, protected endpoints, and clean Express architecture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <p className="section-label">Flow</p>
          <h2 className="section-title">How it works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Scan QR code</h3>
              <p>Customer scans the QR code at their table — it links directly to the ordering app.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Log in</h3>
              <p>Each table has its own account. Customer logs in with the credentials on their table card.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Browse & order</h3>
              <p>Customer browses the live menu, adds items to cart, and submits their order.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Kitchen receives</h3>
              <p>Order appears instantly on the kitchen dashboard. Staff update status as it's prepared and delivered.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech strip */}
      <div className="tech-strip">
        <div className="tech-strip-inner">
          <span className="tech-label">Built with</span>
          <div className="tech-badges">
            <span className="tech-badge">MongoDB</span>
            <span className="tech-badge">Express</span>
            <span className="tech-badge">React</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">Socket.io</span>
            <span className="tech-badge">JWT Auth</span>
            <span className="tech-badge">Vite</span>
          </div>
        </div>
      </div>

    </main>
  )
}

export default HomePage
