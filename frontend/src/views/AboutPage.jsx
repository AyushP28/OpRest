function AboutPage() {
  return (
    <main className="page about-page">
      <div className="container">
        <h1>About OpenRest</h1>

        <section>
          <h2>What We Do</h2>
          <p>
            OpenRest is a QR-based food ordering system that lets customers scan a code at
            their table, browse the menu on their phone, and place orders instantly —
            eliminating wait time and reducing pressure on serving staff.
          </p>
        </section>

        <section>
          <h2>How It Works</h2>
          <p>
            Each table has a unique QR code. Customers scan the code, browse the live
            menu, and place their order directly from their device. Orders appear in the
            system immediately, and staff can track and update order status in real time.
          </p>
        </section>

        <section>
          <h2>The Technology</h2>
          <p>
            OpenRest is built with the MERN stack — MongoDB, Express, React, and Node.js.
            The backend exposes a REST API that supports full CRUD operations for both menu
            items and orders. The frontend is a React + Vite single-page application using
            React Router for client-side navigation.
          </p>
        </section>

        <section>
          <h2>Benefits</h2>
          <p>
            Faster service, fewer order errors, and a seamless dining experience.
            No waiting for servers, no miscommunication — just scan, browse, and order.
          </p>
        </section>
      </div>
    </main>
  )
}

export default AboutPage
