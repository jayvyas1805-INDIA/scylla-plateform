import "./Marketplace.css";

function Events() {
  return (
    <div className="marketplace-grid">

      {[1,2,3,4,5,6].map(i => (
        <div className="marketplace-card" key={i}>

          <div className="marketplace-image">
            <img src="/images/speedometer-image.png" alt="event" />
          </div>

          <h3>Performance Tyre – 195/55 R16</h3>
          <p>High-performance racing compound</p>

          <div className="price-row">
            <span>₹8,499</span>
            <span className="stock in">In Stock</span>
          </div>

          <button className="neon-btn">Request Quote</button>

        </div>
      ))}

    </div>
  );
}

export default Events;
