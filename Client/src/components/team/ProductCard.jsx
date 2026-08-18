import React from 'react';
import '../../styles/product-card.css';


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
    <div className="product-card"style={{border:'1.5px solid white', padding:'8px',margin:"0px 10px", borderRadius:"20px"}}>
      <div className="product-card-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
          style={{border:'1px solid white', margin:"0px 3px", borderRadius:"20px"}}
        />


        <div
          className="product-card-condition"
          style={{ backgroundColor: conditionInfo.color }}
        >
          {conditionInfo.label}
        </div>
      </div>

      <div className="product-card-content"style={{margin:"5px"}}>
        <h3 className="product-card-title">{product.name}</h3>

        {product.model && (
          <p className="product-card-model">Model: {product.model}</p>
        )}

        {product.brand && (
          <p className="product-card-brand">Brand: {product.brand}</p>
        )}

        {product.year && (
          <p className="product-card-year">Year: {product.year}</p>
        )}

        {product.description && (
          <p className="product-card-description">
            {product.description.length > 80
              ? product.description.substring(0, 80) + '...'
              : product.description
            }
          </p>
        )}

        {product.category && (
          <span className="product-card-category">{product.category}</span>
        )}

        {product.tags && product.tags.length > 0 && (
          <div className="product-card-tags">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="product-card-tag"
                style={{ backgroundColor: getTagColor(tag),borderRadius:"20px", padding:"4px", fontSize:"12px"  }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="product-card-footer"style={{borderTop:"1px solid"}}>
          <span className="product-card-price"style={{color:"#53b738"}}>
            ₹{Number(product.price || 0).toFixed(2)}
          </span>
          <button className="product-card-btn"style={{color:"#f1f1f6c8",backgroundColor:"#0080ff"}}>View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
