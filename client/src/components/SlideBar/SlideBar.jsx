import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import style from './SlideBar.module.sass';
import carouselConstants from '../../carouselConstants';
import 'swiper/css';
import 'swiper/css/navigation';

const {
  MAIN_SLIDER,
  EXAMPLE_SLIDER,
  FEEDBACK_SLIDER,
  EXAMPLE_SLIDER_TEXT,
  FEEDBACK_SLIDER_TEXT,
} = carouselConstants;

const containerStyleName = {
  MAIN_SLIDER: style.mainCarousel,
  EXAMPLE_SLIDER: style.exampleCarousel,
  FEEDBACK_SLIDER: style.feedbackCarousel,
};

const getSwiperSettings = (carouselType) => {
  switch (carouselType) {
    case MAIN_SLIDER:
      return {
        breakpoints: {
          950: { slidesPerView: 3, centeredSlides: true, spaceBetween: 30 },
          480: { slidesPerView: 2, centeredSlides: false, spaceBetween: 20 },
          0: { slidesPerView: 1, spaceBetween: 0 },
        },
      };
    case EXAMPLE_SLIDER:
      return {
        breakpoints: {
          950: { slidesPerView: 3, centeredSlides: true, spaceBetween: 30 },
          480: { slidesPerView: 2, centeredSlides: false, spaceBetween: 20 },
          0: { slidesPerView: 1, spaceBetween: 0 },
        },
      };
    case FEEDBACK_SLIDER:
      return {
        centeredSlides: true,
        breakpoints: {
          950: { slidesPerView: 4, spaceBetween: 30 },
          680: { slidesPerView: 3, spaceBetween: 20 },
          480: { slidesPerView: 2, spaceBetween: 20, centeredSlides: true },
          0: { slidesPerView: 1, centeredSlides: false, spaceBetween: 0 },
        },
      };
    default:
      return { slidesPerView: 1, centeredSlides: false };
  }
};

const renderSlides = ({ carouselType, images }) => {
  switch (carouselType) {
    case MAIN_SLIDER:
      return Object.keys(images).map((key, index) => (
        <SwiperSlide key={index}>
          <img
            src={images[key]}
            alt="slide"
            className={style.carouselCell}
            loading="lazy"
          />
        </SwiperSlide>
      ));
    case EXAMPLE_SLIDER:
      return Object.keys(images).map((key, index) => (
        <SwiperSlide key={index}>
          <div className={style.exampleCell}>
            <img src={images[key]} alt="slide" loading="lazy" />
            <p>{EXAMPLE_SLIDER_TEXT[index]}</p>
          </div>
        </SwiperSlide>
      ));
    case FEEDBACK_SLIDER:
      return Object.keys(images).map((key, index) => (
        <SwiperSlide key={index} style={{ display: 'flex', height: 'auto' }}>
          <div className={style.feedbackCell}>
            <img src={images[key]} alt="slide" loading="lazy" />
            <p>{FEEDBACK_SLIDER_TEXT[index].feedback}</p>
            <span>{FEEDBACK_SLIDER_TEXT[index].name}</span>
          </div>
        </SwiperSlide>
      ));
    default:
      return null;
  }
};

const SliderBar = ({ carouselType, images }) => {
  const swiperSettings = getSwiperSettings(carouselType);

  return (
    <Swiper
      {...swiperSettings}
      loop={true}
      navigation={true}
      spaceBetween={30}
      autoplay={{ delay: 2500, disableOnInteraction: true }}
      lazy={true}
      modules={[Autoplay, Navigation]}
      className={containerStyleName[carouselType]}
    >
      {renderSlides({ carouselType, images })}
    </Swiper>
  );
};

export default SliderBar;
