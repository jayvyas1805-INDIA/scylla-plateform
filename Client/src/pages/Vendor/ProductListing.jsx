import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/vendor/Header';
import AddProductForm from "./AddProductForm";
import { getMarketPlace, addProduct } from '../../api/product.api';
// import '../../index.css'
import '../../../globle.css'
import './ProductListing.css';
import '../../styles/product-card.css';
import { useNavigate } from 'react-router-dom';

const ProductListing = () => {
  const location = useLocation();
  const navigate = useNavigate()
    const [vendor,setVendor] = useState("");
  const [selectedFilter, setSelectedFilter] = useState('all');

  /* ================= ADD FORM STATE ================= */
  const [showAddForm, setShowAddForm] = useState(false);

  const [products, setProducts] = useState([]);

 const getTagColor = (tag) => {
  const tagColors = {
    'Premium': '#6366f1',
    'Limited': '#ec4899',
    'Fast Shipping': '#f59e0b',
    'Certified': '#10b981',
    'Best Deal': '#06b6d4',
    'Trending': '#8b5cf6',
  };

  return tagColors[tag] || '#6b7280';
};


const ProductCard = ({ product }) => {
  const conditions = {
    'new': { label: 'New', color: '#10b981' },
    'refurbished': { label: 'Refurbished', color: '#f59e0b' },
    'used': { label: 'Used', color: '#ef4444' }
  };
  const conditionInfo = conditions[product.condition] || conditions['new'];
   return (
      <div className="product-card-item">
        <div className="product-card-image-wrapper">
          <img
            src={product?.image} // backend sends images[]
            alt={product.name}
            className="product-card-image"
          />
          <div
            className="product-card-condition"
            style={{ backgroundColor: conditionInfo.color }}
          >
            {conditionInfo.label}
          </div>
        </div>

        <div className="product-card-content">
          <h3>{product.name}</h3>
          {product.model && <p>Model: {product.model}</p>}
          {product.brand && <p>Brand: {product.brand}</p>}
          {product.year && <p>Year: {product.year}</p>}
          {product.description && (
            <p>{product.description.length > 80
                ? product.description.substring(0, 80) + "..."
                : product.description
              }
            </p>
          )}
          {product.category && <span>{product.category}</span>}
          {product.tags && product.tags.length > 0 && (
          <div className="product-card-tags">
              {product.tags.map((tag, i) => (
                <span key={i} style={{ backgroundColor: getTagColor(tag) }}>{tag}</span>
              ))}
          </div>
            )}
          <div className="product-card-footer">
            <span className="product-card-price">₹{Number(product.price || 0).toFixed(2)}</span>
            <button className="product-card-btn">View Details</button>
          </div>
        </div>
      </div>
    );
}

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const res = await getMarketPlace();

        if (res.data.success) {
          setProducts(res.data.data); // 👈 important
        }
      } catch (err) {
        console.error("Marketplace fetch error", err);
      }
    };

    fetchMarketplace();
  }, []);

  
  const handleAddProduct = async (formData) => {
  try {
    const res = await addProduct(formData);

    if (res.data.success) {
      const newProduct = res.data.data;

      // Ensure we pick the first image from Cloudinary
      const formattedProduct = {
        _id: newProduct._id,
        name: newProduct.title,
        category: newProduct.category,
        description: newProduct.description,
        price: newProduct.price,
        image: newProduct.images?.[0] || "", // ✅ use real URL
        condition: newProduct.condition || "new",
        tags: newProduct.tags || []
      };

      setProducts(prev => [formattedProduct, ...prev]);
      setShowAddForm(false);
    }
  } catch (error) {
    console.error("Add product error:", error);
    alert("Failed to add product");
  }
};


return(
  <div className="product-listing-page">
      <Header currentPath={location.pathname} />

      <main className="product-listing-main">
        <section className="tyre-catalog card">
          <div className="catalog-header">
            <h2 className="section-title">Product Shop</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              + Add New / Old Product
            </button>
          </div>

          <div className="products-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>

        {showAddForm && (
          <AddProductForm
            onClose={() => setShowAddForm(false)}
            onAdd={handleAddProduct}
          />
        )}
      </main>
    </div>
  );

};

export default ProductListing;
