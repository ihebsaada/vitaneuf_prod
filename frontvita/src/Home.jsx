import React, { useState, useEffect, useMemo } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        setLoadingProducts(true);
        const productsResponse = await fetch('http://localhost:3000/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setLoadingProducts(false);

        // Fetch categories
        setLoadingCategories(true);
        const categoriesResponse = await fetch('http://localhost:3000/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        setLoadingCategories(false);
      } catch (err) {
        setError(err.message);
        setLoadingProducts(false);
        setLoadingCategories(false);
      }
    };
    fetchData();
  }, []);

  // Prepare data for product availability pie chart
  const availabilityData = useMemo(() => {
    const available = products.filter(p => p.available).length;
    const unavailable = products.length - available;
    return [
      { name: 'Available', value: available },
      { name: 'Out of Stock', value: unavailable }
    ];
  }, [products]);

  // Prepare data for products per category chart
  const categoryProductData = useMemo(() => {
    if (!categories.length || !products.length) return [];
    
    return categories.map(category => ({
      name: category.name,
      count: products.filter(p => p.category && p.category._id === category._id).length
    })).filter(item => item.count > 0);
  }, [categories, products]);

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalAvailable = products.filter(p => p.available).length;
  const totalOutOfStock = totalProducts - totalAvailable;

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      {loadingProducts && <p>Loading product data...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loadingProducts && !error && (
        <div className='main-cards'>
          <div className='total'>
            <div className='card-inner'>
              <h3>PRODUCTS</h3>
              <BsFillArchiveFill className='card_icon' />
            </div>
            <h1>{totalProducts}</h1>
          </div>
          <div className='categories'>
            <div className='card-inner'>
              <h3>CATEGORIES</h3>
              <BsFillGrid3X3GapFill className='card_icon' />
            </div>
            <h1>{totalCategories}</h1>
          </div>
          <div className='available'>
            <div className='card-inner'>
              <h3>AVAILABLE</h3>
              <BsPeopleFill className='card_icon' />
            </div>
            <h1>{totalAvailable}</h1>
          </div>
          <div className='out-of-stock'>
            <div className='card-inner'>
              <h3>OUT OF STOCK</h3>
              <BsFillBellFill className='card_icon' />
            </div>
            <h1>{totalOutOfStock}</h1>
          </div>
        </div>
      )}

      <div className='charts'>
        {/* Bar Chart for Products per Category */}
        <div className="chart-container">
          <h3 className="chart-title">Products per Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryProductData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                interval={0}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
              <Legend />
              <Bar dataKey="count" name="Products" fill="#8884d8">
                {categoryProductData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Product Availability */}
        <div className="chart-container">
          <h3 className="chart-title">Product Availability</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={availabilityData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {availabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Home;
