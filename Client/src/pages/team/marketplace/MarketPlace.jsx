import { getMarketPlace } from "../../../api/product.api";
import { useState, useEffect } from 'react';
import "./Marketplace.css";

function Marketplace() {
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await getMarketPlace();
        setProduct(res.data);
      } catch (err) {
        alert(err.message + " " + err.status)
        console.log("Error fetching marketplace products:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);


  return (
    <div className="marketplace-grid">

      {products.map((product) => (
        <div className="marketplace-card large" key={product._id}>

          <img
            src={product.images[0]}
            alt={product.title}
            className="product-img"
          />

          <h3> {product.title} </h3>
          <p>{product.description || "description not available"}</p>

          <div className="tags">
            <span>{product.category}</span>
            {/* <span>Telemetry</span> */}
          </div>

          <div className="price-row">
            <span>{product.price}</span>
            <span className="stock limited"> Limited</span>
          </div>

          <button className="neon-btn">Request Quote</button>

        </div>
      ))}

    </div>
  );
}

export default Marketplace;
