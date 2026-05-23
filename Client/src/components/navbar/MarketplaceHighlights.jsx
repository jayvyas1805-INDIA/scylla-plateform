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


  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  
};

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading marketplace...</p>;
  }

  return (
    <section className="marketplace-highlights">
      <div className="container">
        <div className="marketplace-header">
          <h2 className="section-title">Marketplace Highlights</h2>
          <a href="/" className="explore-link">
            Explore Marketplace →
          </a>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = "/fallback-product.png";
                  }}
                />
              </div>

              <div className="product-content">
                <div className="product-header">
                  <span
                    className="product-icon"
                    style={{ backgroundColor: "#ff4444" }}
                  >
                    ●
                  </span>
                </div>

                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">
                  {product.description?.slice(0, 80)}...
                </p>

                <button className="view-products-btn">
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MarketplaceHighlights;
