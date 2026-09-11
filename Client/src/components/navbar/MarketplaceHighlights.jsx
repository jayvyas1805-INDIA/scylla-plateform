import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMarketPlace } from "../../api/product.api";
import "../../styles/landing-theme.css";
import "./MarketplaceHighlights.css";

function MarketplaceHighlights() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      const res = await getMarketPlace();

      let productList = [];
      if (Array.isArray(res.data)) {
        productList = res.data;
      } else if (Array.isArray(res.data.data)) {
        productList = res.data.data;
      } else if (Array.isArray(res.data.products)) {
        productList = res.data.products;
      }

      setProducts(productList.slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch marketplace products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <section className="lp-section">
        <div className="lp-container">
          <h2 className="lp-section-title">Marketplace Highlights</h2>
          <p className="lp-marketplace-loading">Loading marketplace…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="lp-section lp-marketplace-highlights">
      <div className="lp-container">
        <div className="lp-marketplace-header">
          <h2 className="lp-section-title">Marketplace Highlights</h2>
          <button className="lp-btn lp-btn-outline" onClick={() => navigate("/teams")}>
            Explore Marketplace →
          </button>
        </div>

        {products.length > 0 ? (
          <div className="lp-products-grid">
            {products.map((product) => {
              const isExpanded = expandedId === product._id;
              const description = product.description || '';
              const isLong = description.length > 80;

              return (
                <div key={product._id} className="lp-card lp-product-card">
                  <div className="lp-product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="lp-product-image"
                      onError={(e) => {
                        e.target.src = "/fallback-product.png";
                      }}
                    />
                  </div>

                  <div className="lp-product-content">
                    <h3 className="lp-product-title">{product.name}</h3>
                    <p className="lp-product-description">
                      {isExpanded || !isLong ? description : `${description.slice(0, 80)}...`}
                      {isLong && (
                        <button
                          type="button"
                          className="lp-description-toggle"
                          onClick={() => toggleExpand(product._id)}
                        >
                          {isExpanded ? ' Show less' : ' Read more'}
                        </button>
                      )}
                    </p>

                    <button
                      className="lp-btn lp-btn-primary lp-full-width"
                      onClick={() => navigate("/teams")}
                    >
                      View Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="lp-marketplace-empty">No products listed yet — check back soon.</p>
        )}
      </div>
    </section>
  );
}

export default MarketplaceHighlights;
