import { useState, useEffect, useRef } from 'react';
import { BsFillArchiveFill, BsSearch, BsGrid3X3Gap, BsListUl, BsPlus, BsX, BsUpload } from 'react-icons/bs';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
const [updateFormData, setUpdateFormData] = useState(null);
const [updating, setUpdating] = useState(false);
const [updateSelectedFile, setUpdateSelectedFile] = useState(null);
const [updatePreviewUrl, setUpdatePreviewUrl] = useState('');
const updateFileInputRef = useRef(null);
const [categories, setCategories] = useState(['all']);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    available: true,
    details: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const openUpdateModal = (product) => {
    setUpdateFormData({ ...product }); // shallow copy product fields for editing
    setShowUpdateModal(true);
  };
  
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories from separate endpoint
        const categoriesResponse = await fetch('http://localhost:3000/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();

        // Store the full category objects with their IDs
        const categoryList = [{ _id: 'all', name: 'all' }];
        if (Array.isArray(categoriesData)) {
          categoriesData.forEach(cat => {
            if (typeof cat === 'object' && cat._id) {
              categoryList.push(cat);
            }
          });
        }
        setCategories(categoryList);

        // Fetch products after categories loaded
        const productsResponse = await fetch('http://localhost:3000/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        setProducts(productsData);

      } catch (err) {
        setError(err.message);
        setProducts([]);
        setCategories([{ _id: 'all', name: 'all' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.category) {
      alert('Please fill in required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('available', formData.available);
      
      // Make sure category is an ID, not a name
      let categoryId = formData.category;
      if (categoryId && typeof categoryId === 'string') {
        // Find the category object with the matching name
        const selectedCategory = categories.find(cat => cat._id !== 'all' && cat.name === categoryId);
        if (selectedCategory) {
          categoryId = selectedCategory._id; // Use the category ID
        }
      }
      formDataToSend.append('category', categoryId);
      
      // Add details as JSON string
      formDataToSend.append('details', JSON.stringify(formData.details));
      
      // Add image file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }
      
      const response = await fetch('http://localhost:3000/products/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add product');
      }

      const newProduct = await response.json();
      
      // Add the new product to the list
      setProducts(prevProducts => [...prevProducts, newProduct]);
      
      // Close modal and reset form
      setShowAddModal(false);
      setFormData({
        name: '',
        category: '',
        description: '',
        image: '',
        available: true,
        details: []
      });
      
      // Optional: Show success message
      alert('Product added successfully!');
    } catch (err) {
      alert('Error adding product: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const addDetailField = () => {
    setFormData({
      ...formData,
      details: [...formData.details, { key: '', value: '' }]
    });
  };

  const removeDetailField = (index) => {
    setFormData({
      ...formData,
      details: formData.details.filter((_, i) => i !== index)
    });
  };

  const updateDetailField = (index, field, value) => {
    const updatedDetails = [...formData.details];
    updatedDetails[index][field] = value;
    setFormData({
      ...formData,
      details: updatedDetails
    });
  };

  const handleUpdateInputChange = e => {
    const { name, value, type, checked } = e.target;
    setUpdateFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleUpdateFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdateSelectedFile(file);
      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setUpdatePreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };
  
  // For details editing, add similar logic like in add
  const updateUpdateDetailField = (index, field, value) => {
    const updatedDetails = [...updateFormData.details];
    updatedDetails[index][field] = value;
    setUpdateFormData(prev => ({ ...prev, details: updatedDetails }));
  };
  
  const addUpdateDetailField = () => {
    setUpdateFormData(prev => ({ ...prev, details: [...prev.details, { key: '', value: '' }] }));
  };
  
  const removeUpdateDetailField = (index) => {
    setUpdateFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };
  
  const handleUpdateProductSubmit = async () => {
    if (!updateFormData.name || !updateFormData.category) {
      alert('Please fill in required fields');
      return;
    }
  
    try {
      setUpdating(true);
      
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      formDataToSend.append('name', updateFormData.name);
      formDataToSend.append('description', updateFormData.description || '');
      formDataToSend.append('available', updateFormData.available);
      
      // Make sure category is an ID, not a name
      let categoryId = updateFormData.category;
      if (categoryId && typeof categoryId === 'string') {
        // Find the category object with the matching name
        const selectedCategory = categories.find(cat => cat._id !== 'all' && cat.name === categoryId);
        if (selectedCategory) {
          categoryId = selectedCategory._id; // Use the category ID
        }
      }
      formDataToSend.append('category', categoryId);
      
      // Add details as JSON string
      formDataToSend.append('details', JSON.stringify(updateFormData.details || []));
      
      // Add image file if selected
      if (updateSelectedFile) {
        formDataToSend.append('image', updateSelectedFile);
      }
      
      const response = await fetch(`http://localhost:3000/products/${updateFormData._id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update product');
      }
  
      const resData = await response.json();
      const updatedProduct = resData.product || resData; // Handle different response formats
  
      setProducts(prev =>
        prev.map(p => (p._id === updatedProduct._id ? updatedProduct : p))
      );
  
      setShowUpdateModal(false);
      setUpdateFormData(null);
      alert('Product updated successfully!');
    } catch (err) {
      alert('Error updating product: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };
  
  

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
  
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
  
      // Remove the deleted product from state
      setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
  
      alert('Product deleted successfully!');
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };
  


  const filteredProducts = products
    .filter(p => filter === 'all' || p.category?.name === filter)
    .filter(p => p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <main className='main-container'>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-lg text-gray-600">Loading ...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className='main-container'>
        <div className="flex items-center justify-center h-full">
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-8 max-w-md shadow-lg">
            <h3 className="text-red-800 font-bold text-2xl mb-3">⚠️ Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='main-container'>
      <div className="main-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3><BsFillArchiveFill className='icon'/> PRODUCTS</h3>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px',
            background: '#aab5b3ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1e4fcc'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#2962ff'}
        >
          <BsPlus size={20} /> ADD PRODUCT
        </button>
      </div>

      <div className="main-cards">
        <div className="total">
          <div className="card-inner ">
            <h3>TOTAL</h3>
            <BsFillArchiveFill className='card_icon'/>
          </div>
          <h1>{products.length}</h1>
        </div>
        <div className="available">
          <div className="card-inner">
            <h3>AVAILABLE</h3>
            <BsFillArchiveFill className='card_icon'/>
          </div>
          <h1>{products.filter(p => p.available).length}</h1>
        </div>
        <div className="categories">
          <div className="card-inner">
            <h3>CATEGORIES</h3>
            <BsGrid3X3Gap className='card_icon'/>
          </div>
          <h1>{categories.length - 1}</h1>
        </div>
        <div className="out-of-stock">
          <div className="card-inner">
            <h3>OUT OF STOCK</h3>
            <BsFillArchiveFill className='card_icon'/>
          </div>
          <h1>{products.filter(p => !p.available).length}</h1>
        </div>
      </div>

      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex',
          gap: '15px',
          marginBottom: '15px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ 
            flex: '1',
            minWidth: '250px',
            position: 'relative'
          }}>
            <BsSearch style={{ 
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666'
            }}/>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 35px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2962ff'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '10px 15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                background: viewMode === 'grid' ? '#2962ff' : 'white',
                color: viewMode === 'grid' ? 'white' : '#666',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <BsGrid3X3Gap size={18}/>
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '10px 15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                background: viewMode === 'list' ? '#2962ff' : 'white',
                color: viewMode === 'list' ? 'white' : '#666',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <BsListUl size={18}/>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => setFilter(cat._id === 'all' ? 'all' : cat.name)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: filter === (cat._id === 'all' ? 'all' : cat.name) ? 'none' : '2px solid #e0e0e0',
                background: filter === (cat._id === 'all' ? 'all' : cat.name) ? '#2962ff' : 'white',
                color: filter === (cat._id === 'all' ? 'all' : cat.name) ? 'white' : '#666',
                fontWeight: filter === (cat._id === 'all' ? 'all' : cat.name) ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '14px'
              }}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div style={{ 
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '10px'
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>No products found</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
          gap: '20px'
        }}>
        {filteredProducts.map(product => (
  <div
    key={product._id}
    style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative', // Important for positioning buttons absolute relative to this div
      display: viewMode === 'list' ? 'flex' : 'block'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}
  >
              <div style={{
                height: viewMode === 'grid' ? '200px' : '150px',
                width: viewMode === 'list' ? '200px' : '100%',
                background: '#f5f5f5',
                overflow: 'hidden',
                position: 'relative',
                flexShrink: 0
              }}>
                {product.image ? (
                  <img 
                    src={product.image.startsWith('http') ? product.image : `http://localhost:3000${product.image}`} 
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '60px'
                  }}>
                    📦
                  </div>
                )}
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  background: product.available ? '#4caf50' : '#f44336',
                  color: 'white'
                }}>
                  {product.available ? 'AVAILABLE' : 'OUT OF STOCK'}
                </span>
              </div>

              <div style={{ padding: '20px', flex: 1 }}>
                <div style={{ marginBottom: '10px' }}>
                  <h3 style={{ 
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#263238'
                  }}>
                    {product.name}
                  </h3>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    background: '#e3f2fd',
                    color: '#2962ff'
                  }}>
                    {product.category?.name || ''}
                  </span>
                </div>

                {product.description && (
                  <p style={{
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    margin: '10px 0',
                    overflow: 'visible', // changed from hidden
                    display: 'block',    // changed from -webkit-box with clamp
                    WebkitLineClamp: 'none', // remove clamping
                    WebkitBoxOrient: 'unset'
                  }}>
                    {product.description}
                  </p>
                )}

{product.details && product.details.length > 0 && (
  <div style={{
    borderTop: '1px solid #e0e0e0',
    paddingTop: '12px',
    marginTop: '12px',
  }}>
    <h4 style={{
      fontSize: '11px',
      fontWeight: 'bold',
      color: '#666',
      marginBottom: '8px',
      letterSpacing: '0.5px'
    }}>
      SPECIFICATIONS
    </h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {product.details.map((detail, idx) => (
        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: '#666' }}>{detail.key}:</span>
          <span style={{ color: '#263238', fontWeight: '600' }}>{detail.value}</span>
        </div>
      ))}
    </div>
  </div>
)}
       <div style={{
      position: 'absolute',
      bottom: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px',
      width: '90%',
      justifyContent: 'center',
      padding: '10px 0',
      background: 'rgba(255,255,255,0.9)',
      borderTop: '1px solid #eee',
      borderRadius: '0 0 12px 12px'
    }}>
      <button
        onClick={() => openUpdateModal(product)}
        style={{
          padding: '8px 16px',
          background: '#58ced0ff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          flex: 1
        }}
      >
        Update
      </button>
      <button
        onClick={() => handleDeleteProduct(product._id)}
        style={{
          padding: '8px 16px',
          background: '#e0827bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          flex: 1
        }}
      >
        Delete
      </button>
    </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px',
                color: '#666'
              }}
            >
              <BsX />
            </button>

            <h2 style={{ marginBottom: '20px', color: '#263238' }}>Add New Product</h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
                Category *
              </label>
              <select
  name="category"
  value={formData.category}
  onChange={handleInputChange}
  required
  style={{
    width: '100%',
    padding: '10px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box'
  }}
>
  <option value="">Select Category</option>
  {categories.filter(cat => cat._id !== 'all').map(cat => (
    <option key={cat._id} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
                Product Image
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '8px 16px',
                    background: '#2962ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <BsUpload /> Choose Image
                </button>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {selectedFile ? selectedFile.name : 'No file chosen'}
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}
                />
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontWeight: 'bold', color: '#666' }}>Product Available</span>
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontWeight: 'bold', color: '#666' }}>
                  Specifications
                </label>
                <button
                  type="button"
                  onClick={addDetailField}
                  style={{
                    padding: '5px 12px',
                    background: '#2962ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Spec
                </button>
              </div>

              {formData.details.map((detail, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="Key"
                    value={detail.key}
                    onChange={(e) => updateDetailField(index, 'key', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={detail.value}
                    onChange={(e) => updateDetailField(index, 'value', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeDetailField(index)}
                    style={{
                      padding: '8px 12px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <BsX size={18} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: '12px 24px',
                  background: '#e0e0e0',
                  color: '#666',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProduct}
                disabled={submitting}
                style={{
                  padding: '12px 24px',
                  background: submitting ? '#ccc' : '#2962ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}


{showUpdateModal && updateFormData && (
  <div style={modalOverlayStyle} onClick={() => setShowUpdateModal(false)}>
    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
      <button 
        style={closeButtonStyle} 
        onClick={() => setShowUpdateModal(false)}
        aria-label="Close update modal"
      >
        <BsX />
      </button>

      <h2 style={{ marginBottom: 20, color: '#263238' }}>Update Product</h2>

      <input
        type="text"
        name="name"
        value={updateFormData.name}
        onChange={handleUpdateInputChange}
        placeholder="Product Name"
        style={inputStyle}
      />

      <select
        name="category"
        value={updateFormData.category?.name || updateFormData.category || ""}
        onChange={handleUpdateInputChange}
        style={inputStyle}
      >
        <option value="">Select Category</option>
        {categories.filter(cat => cat._id !== 'all').map(cat => (
          <option key={cat._id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <textarea
        name="description"
        value={updateFormData.description || ''}
        onChange={handleUpdateInputChange}
        placeholder="Description"
        rows={3}
        style={inputStyle}
      />

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold', color: '#666' }}>
          Product Image
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <button
            type="button"
            onClick={() => updateFileInputRef.current?.click()}
            style={{
              padding: '8px 16px',
              background: '#2962ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <BsUpload /> Choose Image
          </button>
          <span style={{ fontSize: '14px', color: '#666' }}>
            {updateSelectedFile ? updateSelectedFile.name : 'No new file chosen'}
          </span>
          <input
            type="file"
            ref={updateFileInputRef}
            onChange={handleUpdateFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
        {updatePreviewUrl ? (
          <img 
            src={updatePreviewUrl} 
            alt="Preview" 
            style={{
              maxWidth: '100%',
              maxHeight: '200px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}
          />
        ) : updateFormData.image ? (
                  <img 
                    src={updateFormData.image.startsWith('http') ? updateFormData.image : `http://localhost:3000${updateFormData.image}`} 
                    alt="Current" 
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}
                  />
        ) : null}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
        <input
          type="checkbox"
          name="available"
          checked={updateFormData.available || false}
          onChange={handleUpdateInputChange}
          style={{ width: 18, height: 18 }}
        />
        <span style={{ fontWeight: 'bold', color: '#666' }}>Product Available</span>
      </label>

      <div style={{ marginBottom: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ fontWeight: 'bold', color: '#666' }}>Specifications</label>
          <button
            type="button"
            onClick={addUpdateDetailField}
            style={{ ...buttonStyle, padding: '6px 12px', fontSize: 12, marginLeft: 0 }}
          >
            + Add Spec
          </button>
        </div>

        {updateFormData.details && updateFormData.details.map((detail, index) => (
          <div key={index} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Key"
              value={detail.key}
              onChange={(e) => updateUpdateDetailField(index, 'key', e.target.value)}
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            />
            <input
              type="text"
              placeholder="Value"
              value={detail.value}
              onChange={(e) => updateUpdateDetailField(index, 'value', e.target.value)}
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => removeUpdateDetailField(index)}
              style={{ background: '#f44336', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', padding: '8px 12px' }}
            >
              <BsX size={18} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => setShowUpdateModal(false)}
          style={{ ...buttonStyle, background: '#e0e0e0', color: '#666' }}
          disabled={updating}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleUpdateProductSubmit}
          style={{ ...buttonStyle, background: '#2962ff', color: 'white' }}
          disabled={updating}
        >
          {updating ? 'Updating...' : 'Update Product'}
        </button>
      </div>
    </div>
  </div>
)}


    </main>
  );
};

export default Products;

const modalOverlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 20,
    overflowY: 'auto'
  };
  
  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    maxWidth: 600,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  };
  
  const closeButtonStyle = {
    position: 'absolute',
    top: 15,
    right: 15,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: 24,
    color: '#666'
  };
  
  const inputStyle = {
    width: '100%',
    padding: 10,
    border: '2px solid #e0e0e0',
    borderRadius: 8,
    fontSize: 14,
    boxSizing: 'border-box',
    marginBottom: 15
  };
  
  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    marginLeft: 10
  };
  