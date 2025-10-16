import React, { useState, useEffect } from 'react';
import './Categories.css';
import vitaneufLogo from './assets/vitalogo.png';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Category name is required');
      return;
    }
    try {
      setSaving(true);
      const response = await fetch('http://localhost:3000/categories/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (!response.ok) throw new Error('Failed to add category');
      const created = await response.json();
      setCategories(prev => [...prev, created]);
      setNewCategoryName('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const response = await fetch(`http://localhost:3000/categories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete category');
      setCategories(prev => prev.filter(cat => cat._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const startEditing = (category) => {
    setEditingCategory({ ...category });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
  };

  const handleEditInputChange = (e) => {
    setEditingCategory(prev => ({ ...prev, name: e.target.value }));
  };

  const saveEditedCategory = async () => {
    if (!editingCategory.name.trim()) {
      alert('Category name is required');
      return;
    }
    try {
      setSaving(true);
      const response = await fetch(`http://localhost:3000/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategory.name.trim() }),
      });
      if (!response.ok) throw new Error('Failed to update category');
      const updated = await response.json();
      setCategories(prev => prev.map(cat => (cat._id === updated._id ? updated : cat)));
      setEditingCategory(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="loading-message">Loading categories...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className='categories-wrapper'>
    <div className="categories-container">
      <div className="categories-header">
        <img src={vitaneufLogo} alt="Vitaneuf Logo" className="categories-logo" />
        <h2 className="categories-title">Category Management</h2>
        <p className="categories-subtitle">Manage your Vitaneuf product categories</p>
      </div>

      {/* Add Category */}
      <div className="add-category-form">
        <input
          type="text"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          disabled={saving}
          className="category-input"
        />
        <button
          onClick={handleAddCategory}
          disabled={saving}
          className="btn-add"
        >
          {saving ? 'Adding...' : 'Add Category'}
        </button>
      </div>

      {/* Category List */}
      <ul className="categories-list">
        {categories.map((cat, i) => (
          <li key={cat._id} className="category-item">
            {editingCategory && editingCategory._id === cat._id ? (
              <>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={handleEditInputChange}
                  disabled={saving}
                  autoFocus
                  className="edit-input"
                />
                <button
                  onClick={saveEditedCategory}
                  disabled={saving}
                  className="btn-edit"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={cancelEditing}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="category-name">{i + 1}. {cat.name}</span>
                <div className="category-actions">
                  <button
                    onClick={() => startEditing(cat)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Categories;
