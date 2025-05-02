import { useState, useEffect, useRef } from "react";
import concertImg from "../assets/images/concert.jpg";
import sportsImg from "../assets/images/sports.jpg";
import noticesImg from "../assets/images/notices.jpg";
import environmentclubImg from "../assets/images/environmentclub.jpg";
import liveeventsImg from "../assets/images/liveevents.jpg";
import pearImg from "../assets/images/pear.png";

const TutorialSlider = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const autoSlideIntervalRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const viewCount = parseInt(localStorage.getItem("tutorialViewCount") || "0");
      if (viewCount >= 3) {
        handleComplete();
        return;
      }
      localStorage.setItem("tutorialViewCount", (viewCount + 1).toString());
    }
  }, []);

  const slides = [
    {
      title: "Welcome to Pear Network",
      description: "Get started with Pear Network and connect with others.",
    },
    {
      title: "Create Posts",
      description: "Share your thoughts and experiences with the community.",
    },
    {
      title: "Join Communities",
      description: "Find and join communities that interest you.",
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => setScreenSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current);
    autoSlideIntervalRef.current = setInterval(() => { goToNextSlide(); }, 3000);
    return () => { if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current); };
  }, [currentSlide]);

  const goToNextSlide = () => {
    if (currentSlide >= slides.length - 1) handleComplete();
    else setCurrentSlide(currentSlide + 1);
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleComplete = () => { setIsVisible(false); setTimeout(() => { if (onComplete) onComplete(); }, 500); };

  if (!isVisible) return null;

  const isMobile = screenSize.width < 768;
  const cardWidth = isMobile ? Math.min(320, screenSize.width * 0.85) : Math.min(380, screenSize.width * 0.8);
  const cardHeight = isMobile ? Math.min(480, screenSize.height * 0.7) : Math.min(550, screenSize.height * 0.7);

  return (
    <div className="tutorial-slider">
      <div className="slider-content">
        <h2>{slides[currentSlide].title}</h2>
        <p>{slides[currentSlide].description}</p>
      </div>
      <div className="slider-controls">
        <button onClick={goToPreviousSlide} className="slider-button">Previous</button>
        <button onClick={goToNextSlide} className="slider-button">Next</button>
      </div>
    </div>
  );
};

export default TutorialSlider;