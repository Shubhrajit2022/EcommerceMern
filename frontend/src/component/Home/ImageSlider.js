import { useState } from "react";
import {AiOutlineRight,AiOutlineLeft} from 'react-icons/ai'
import {BsDot} from 'react-icons/bs'
const slideStyles = {
  width: "100%",
  height: "100%",
  borderRadius: "10px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const rightArrowStyles = {
  display: "flex",
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
  right: "32px",
  fontSize: "45px",
  color: "#fff",
  zIndex: 1,
  cursor: "pointer",
  border: "1px solid white",
  padding: "2px",
};

const leftArrowStyles = {
  display: "flex",
  border: "1px solid white",
  padding: "2px",
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
  left: "32px",
  fontSize: "45px",
  color: "#fff",
  zIndex: 1,
  cursor: "pointer",
};

const sliderStyles = {
  position: "relative",
  height: "100%",
  justifyContent:"center",
  alignItems:"center"
};

const dotsContainerStyles = {
  display: "flex",
  justifyContent: "center",
  position: "absolute",
  alignItems : "center",
    bottom: "10px",
};

const dotStyle = {
//   margin: "0 0.5px",
  cursor: "pointer",
  fontSize: "30px",
//   color: "black"
};

const ImageSlider = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  const slideStylesWidthBackground = {
    ...slideStyles,
    backgroundImage: `url(${slides[currentIndex].url})`,
  };

  return (
    <div style={sliderStyles}>
      <div>
        <div onClick={goToPrevious} style={leftArrowStyles}>
          <AiOutlineLeft/>
        </div>
        <div onClick={goToNext} style={rightArrowStyles}>
        <AiOutlineRight/>
        </div>
      </div>
      <div style={slideStylesWidthBackground}>
      <div style={dotsContainerStyles}>
        {slides.map((slide, slideIndex) => (
          <div
            style={dotStyle}
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
          >
            <BsDot/>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;