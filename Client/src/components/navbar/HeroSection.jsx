import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/landing-theme.css";
import "./HeroSection.css";
import { getAdminContent } from "../../api/admin.api";

function HeroSection() {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminContent = async () => {
      try {
        const res = await getAdminContent();
        setContent(res.data.content || []);
      } catch (error) {
        console.error("Failed to fetch admin content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminContent();
  }, []);

  // Play only the active slide's video, pause the rest.
  // Was previously querying ".carousel-slide video" — a class that
  // doesn't exist (the real class is "lp-carousel-slide"), so this
  // play/pause sync silently never ran.
  useEffect(() => {
    const videos = document.querySelectorAll(".lp-carousel-slide video");
    videos.forEach((video, index) => {
      if (index === currentIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % content.length);
    setAutoPlay(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + content.length) % content.length);
    setAutoPlay(false);
  };

  useEffect(() => {
    if (!autoPlay || content.length === 0) return;

    const currentItem = content[currentIndex];
    // Guard against an out-of-range index (e.g. content shrank) — this
    // used to read `currentItem.fileType` unconditionally, which threw
    // if content was ever empty and crashed the whole homepage.
    if (!currentItem) return;

    if (currentItem.fileType === "image") {
      const timer = setTimeout(() => {
        nextImage();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoPlay, content]);

  if (loading) {
    return (
      <section className="lp-hero-section lp-hero-loading">
        <div className="skeleton lp-hero-skeleton" />
      </section>
    );
  }

  return (
    <section className="lp-hero-section">
      <div className="lp-container lp-hero-inner">
        <div className="lp-hero-content">
          <span className="lp-eyebrow">Welcome to the platform</span>
          <h1 className="lp-hero-title">Scylla Racing Sport</h1>
          <p className="lp-hero-subtitle">
            One place to manage your team, connect with vendors, and follow the
            motorsports community.
          </p>
          <button className="lp-btn lp-btn-primary lp-btn-lg" onClick={() => navigate("/teams-directory")}>
            Explore Teams →
          </button>
        </div>

        {content.length > 0 ? (
          <>
            <div className="lp-hero-carousel">
              <button
                className="lp-carousel-nav lp-carousel-prev"
                onClick={prevImage}
                title="Previous image"
              >
                ‹
              </button>

              <div className="lp-carousel-wrapper lp-card">
                {content.map((item, index) => (
                  <div
                    key={item._id || index}
                    className={`lp-carousel-slide ${index === currentIndex ? "active" : ""}`}
                  >
                    {item.fileType === "image" && (
                      <img src={item.fileUrl} alt={item.title} />
                    )}

                    {item.fileType === "video" && (
                      <video
                        src={item.fileUrl}
                        muted
                        playsInline
                        preload="metadata"
                        className="lp-carousel-video"
                        ref={(el) => {
                          if (el && index === currentIndex) {
                            el.play().catch(() => {});
                          }
                        }}
                        onEnded={nextImage}
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                className="lp-carousel-nav lp-carousel-next"
                onClick={nextImage}
                title="Next image"
              >
                ›
              </button>
            </div>

            <div className="lp-carousel-indicators">
              {content.map((_, index) => (
                <button
                  key={index}
                  className={`lp-indicator ${index === currentIndex ? "active" : ""}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoPlay(false);
                  }}
                  title={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="lp-hero-placeholder lp-card">
            <span className="lp-hero-placeholder-icon">🏁</span>
            <p>Featured media coming soon</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroSection;
