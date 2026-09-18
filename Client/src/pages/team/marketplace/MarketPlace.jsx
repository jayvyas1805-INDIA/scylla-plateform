import { getMarketPlace, getMyProduct } from "../../../api/product.api";
import { useState, useEffect } from 'react';
import "./Marketplace.css";
import NavBar from '../../../components/team/MarketPlaceNavbar';

function Marketplace() {
  const [products, setProduct] = useState([]);
  const [publicProducts, setPublicProducts] = useState([]);
  const [ownProducts, setOwnProducts] = useState([]);
  const [catalogView, setCatalogView] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const [marketplaceResponse, ownResponse] = await Promise.all([
          getMarketPlace(),
          getMyProduct(),
        ]);
        const publicProducts = marketplaceResponse.data.data || [];
        const ownProducts = (ownResponse.data.products || []).map((product) => ({
          _id: product._id,
          title: product.title,
          category: product.category,
          description: product.description,
          price: product.price,
          images: product.images || [],
          status: product.status,
          isOwn: true,
        }));
        setPublicProducts(publicProducts);
        setOwnProducts(ownProducts);
        setProduct(publicProducts);
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
    <>
      <NavBar />
      <div className="marketplace-view-tabs">
        <button className={catalogView === 'all' ? 'active' : ''} onClick={() => { setCatalogView('all'); setProduct(publicProducts); }}>
          All Products
        </button>
        <button className={catalogView === 'mine' ? 'active' : ''} onClick={() => { setCatalogView('mine'); setProduct(ownProducts); }}>
          My Products
        </button>
      </div>
      <div className="marketplace-grid">
        {products.map((product) => (
          <div className="marketplace-card large" key={product._id} >

            <img
              src={product.images[0]}
              alt={product.title}
              className="product-img"
              // style={{border:'1px solid white', margin:"0px 3px", borderRadius:"20px"}}
            />

            <h3> {product.title} </h3>
            {product.isOwn && (
              <span className={`marketplace-own-status marketplace-own-status-${product.status || "pending"}`}>
                Your listing · {product.status || "pending"}
              </span>
            )}
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
    </>

  );
}

export default Marketplace;
