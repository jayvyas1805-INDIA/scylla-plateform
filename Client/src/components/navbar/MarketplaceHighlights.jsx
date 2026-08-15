import { useEffect, useState } from "react";
import { getMarketPlace } from "../../api/product.api";
import "./MarketplaceHighlights.css";

function MarketplaceHighlights() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      const res = await getMarketPlace();

      // ✅ Extract array safely
      let productList = [];

      if (Array.isArray(res.data)) {
        productList = res.data;
      } else if (Array.isArray(res.data.data)) {
        productList = res.data.data;
      } else if (Array.isArray(res.data.products)) {
        productList = res.data.products;
      }

      // ✅ ONLY HERE we apply slice
      setProducts(productList.slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch marketplace products", error);
      setProducts([]); // safety
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <section className="land-marketplace-highlights">
        <div className="land-container">
          <h2 className="land-section-title">Marketplace Highlights</h2>
          <p className="land-marketplace-loading">Loading marketplace…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="land-marketplace-highlights">
      <div className="land-container">
        <div className="land-marketplace-header">
          <h2 className="land-section-title">Marketplace Highlights</h2>
          <a href="/" className="land-explore-link">
            Explore Marketplace →
          </a>
        </div>

        {products.length > 0 ? (
          <div className="land-products-grid">
            {products.map((product) => {
              const isExpanded = expandedId === product._id;
              const description = product.description || '';
              const isLong = description.length > 80;

              return (
                <div key={product._id} className="land-product-card">
                  <div className="land-product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="land-product-image"
                      onError={(e) => {
                        e.target.src = "/fallback-product.png";
                      }}
                    />
                  </div>

                  <div className="land-product-content">
                    <div className="land-product-header">
                      <span
                        className="land-product-icon"
                        style={{ backgroundColor: "#ff4444" }}
                      >
                        ●
                      </span>
                    </div>

                    <h3 className="land-product-title">{product.name}</h3>
                    <p className="land-product-description">
                      {isExpanded || !isLong ? description : `${description.slice(0, 80)}...`}
                      {isLong && (
                        <button
                          type="button"
                          className="land-description-toggle"
                          onClick={() => toggleExpand(product._id)}
                        >
                          {isExpanded ? ' Show less' : ' Read more'}
                        </button>
                      )}
                    </p>

                    <button className="land-view-products-btn">
                      View Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="land-marketplace-empty">No products listed yet — check back soon.</p>
        )}
      </div>
    </section>
  );
}

export default MarketplaceHighlights;
