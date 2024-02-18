"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Swiper,SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';

import Image1 from "./../../public/slider/image1.jpg";
import Image2 from "./../../public/slider/image2.jpg";
import Image3 from "./../../public/slider/image3.jpg";
import Image4 from "./../../public/slider/image4.jpg";
import Image5 from "./../../public/slider/image5.jpg";

const images = [
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
];

const ImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Swiper
      className="mySwiper"
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
    >
        {images.map((image, index) => (
        <SwiperSlide key={index}>
          <Image src={image} alt={`Slide ${index}`} />
        </SwiperSlide>
      ))}
      </Swiper>
  );
};

export default ImageSlider;
