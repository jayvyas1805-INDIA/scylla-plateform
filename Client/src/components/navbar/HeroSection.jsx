import { useState, useEffect } from "react";
import "./HeroSection.css";
import { getAdminContent } from "../../api/admin.api";

function HeroSection() {
  const [content, setContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminContent();
  }, []);

  const fetchAdminContent = async () => {
    try {
      const res = await getAdminContent();
      setContent(res.data.content);
    } catch (error) {
      console.error("Failed to fetch admin content", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const videos = document.querySelectorAll(".carousel-slide video");
    videos.forEach((video, index) => {
      if (index === currentIndex) {
        video.play().catch(() => { });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex]);


  useEffect(() => {
  if (!autoPlay || content.length === 0) return;

  const currentItem = content[currentIndex];

  // If image → auto change after 4s
  if (currentItem.fileType === "image") {
    const timer = setTimeout(() => {
      nextImage();
    }, 4000);

    return () => clearTimeout(timer);
  }

  // If video → wait until video ends (handled by onEnded)
}, [currentIndex, autoPlay, content]);


  if (loading) return null;
  if (content.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % content.length);
    setAutoPlay(false);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + content.length) % content.length
    );
    setAutoPlay(false);
  };



  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Scylla Racing Sport
        </h1>

        <p className="hero-subtitle">
          welcome to our website
        </p>

        <button className="hero-button">Explore Team</button>
      </div>

      <div className="hero-carousel">
        <button
          className="carousel-nav carousel-prev"
          onClick={prevImage}
          title="Previous image"
        >
          ‹
        </button>

        <div className="carousel-wrapper">
          {content.map((item, index) => (
            <div
              key={item._id || index}
              className={`carousel-slide ${index === currentIndex ? "active" : ""
                }`}
            >
              {/* SHOW IMAGE ONLY */}
              {item.fileType === "image" && (
                <img src={item.fileUrl} alt={item.title} />
              )}

              {/* OPTIONAL: VIDEO SUPPORT */}
              {item.fileType === "video" && (
                <video
                  src={item.fileUrl}
                  muted
                  playsInline
                  preload="metadata"
                  className="carousel-video"
                  ref={(el) => {
                    if (el && index === currentIndex) {
                      el.play().catch(() => { });
                    }
                  }}
                  onEnded={nextImage}
                />
              )}


            </div>
          ))}
        </div>

        <button
          className="carousel-nav carousel-next"
          onClick={nextImage}
          title="Next image"
        >
          ›
        </button>
      </div>

      <div className="carousel-indicators">
        {content.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""
              }`}
            onClick={() => {
              setCurrentIndex(index);
              setAutoPlay(false);
            }}
            title={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="autoplay-toggle">
        <button
          className="autoplay-btn"
          onClick={() => setAutoPlay(!autoPlay)}
          title={autoPlay ? "Pause auto-play" : "Resume auto-play"}
        >
          {autoPlay ? "⏸" : "▶"}
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
