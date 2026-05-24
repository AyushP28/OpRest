import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

// default empty form values
const emptyForm = {
  foodname: '',
  description: '',
  category: 'main',
  price: '',
  vegan: false,
  chicken: false,
  beef: false,
  pork: false
}

const categoryList = ['all', 'appetizer', 'main', 'side', 'dessert', 'beverage']

function MenuPage() {
  const [menuData, setMenuData] = useState([])
  const [displayedItems, setDisplayedItems] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // modal open/close + which item is being edited
  const [modalOpen, setModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  const { getToken } = useAuth()

  // loads menu items on page load
  useEffect(() => {
    loadMenuItems()
  }, [])

  // refilter the list whenever menu data or selected filter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setDisplayedItems(menuData)
    } else {
      setDisplayedItems(menuData.filter(item => item.category === activeFilter))
    }
  }, [menuData, activeFilter])

  async function loadMenuItems() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/menu')
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      setMenuData(data)
    } catch (err) {
      setError('Failed to load menu items. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  function openAddModal() {
    setItemToEdit(null)
    setFormData(emptyForm)
    setModalOpen(true)
  }

  function openEditModal(item) {
    setItemToEdit(item)
    setFormData({
      foodname:    item.foodname,
      description: item.description,
      category:    item.category,
      price:       item.price,
      vegan:       item.vegan,
      chicken:     item.chicken,
      beef:        item.beef,
      pork:        item.pork
    })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setItemToEdit(null)
    setFormData(emptyForm)
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // returns auth headers for protected requests
  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const itemPayload = { ...formData, price: parseFloat(formData.price) }

    try {
      if (itemToEdit) {
        const res = await fetch(`/api/menu/${itemToEdit._id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(itemPayload)
        })
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to update item')
        }
      } else {
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(itemPayload)
        })
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to add item')
        }
      }
      closeModal()
      loadMenuItems()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
      if (!res.ok) throw new Error('Failed to delete item')
      loadMenuItems()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <main className="page menu-page">
      <div className="container">

        {/* Header */}
        <div className="page-header">
          <h2>Our Menu</h2>
          <button className="btn btn-primary" onClick={openAddModal}>+ Add Item</button>
        </div>

        {/* Category filter buttons */}
        <div className="filter-bar">
          {categoryList.map(cat => (
            <button
              key={cat}
              className={`filter-btn${activeFilter === cat ? ' active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Status messages */}
        {loading && <p className="status-msg">Loading menu...</p>}
        {error   && <p className="status-msg error">{error}</p>}

        {/* Menu grid */}
        <div className="menu-grid">
          {displayedItems.map(item => (
            <div key={item._id} className="item-card">
              <div className="item-info">
                <div className="item-top">
                  <h4>{item.foodname}</h4>
                  <span className="cat-tag">{item.category}</span>
                </div>
                <p className="desc">{item.description}</p>
                <p className="price">${item.price.toFixed(2)}</p>
                <div className="food-tags">
                  {item.vegan   && <span className="tag">Vegan</span>}
                  {item.chicken && <span className="tag">Chicken</span>}
                  {item.beef    && <span className="tag">Beef</span>}
                  {item.pork    && <span className="tag">Pork</span>}
                </div>
                <div className="card-actions">
                  <button className="btn btn-sm"           onClick={() => openEditModal(item)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {!loading && !error && displayedItems.length === 0 && (
            <p className="status-msg">No items in this category.</p>
          )}
        </div>
      </div>

      {/* add/edit modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{itemToEdit ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input name="foodname" value={formData.foodname} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="appetizer">Appetizer</option>
                  <option value="main">Main Course</option>
                  <option value="side">Side</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" required />
              </div>
              <div className="form-group checkboxes">
                <label className="checkbox-label">
                  <input type="checkbox" name="vegan"   checked={formData.vegan}   onChange={handleChange} /> Vegan
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="chicken" checked={formData.chicken} onChange={handleChange} /> Contains Chicken
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="beef"    checked={formData.beef}    onChange={handleChange} /> Contains Beef
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" name="pork"    checked={formData.pork}    onChange={handleChange} /> Contains Pork
                </label>
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                {itemToEdit ? 'Save Changes' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default MenuPage
