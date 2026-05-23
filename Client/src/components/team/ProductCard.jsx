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
    <div className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={product.image}
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
                style={{ backgroundColor: getTagColor(tag) }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="product-card-footer">
          <span className="product-card-price">
            ₹{Number(product.price || 0).toFixed(2)}
          </span>
          <button className="product-card-btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
