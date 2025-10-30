
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

import { useNavigate } from 'react-router';

interface EventSlide {
  id: number;
  image: string;
  date: string;
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
}

// Place holder images from unsplash, will be replaced with actual events via the backend

const eventSlides: EventSlide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    date: 'Fri, Oct 23, 7:00 PM EDT',
    title: 'October Festival at the Garden',
    subtitle: 'Live Concert at the Stadium',
    buttonText: 'Check it out',
    link: '/events/1'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    date: 'Sat, Nov 15, 8:00 PM EDT',
    title: 'Summer Music Festival',
    subtitle: 'Outdoor Arena Experience',
    buttonText: 'Get Tickets',
    link: '/events/2'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    date: 'Sun, Dec 8, 6:30 PM EDT',
    title: 'Winter Concert Series',
    subtitle: 'Indoor Theater Show',
    buttonText: 'Learn More',
    link: '/events/3'
  }
];

export default function Hero() {
  const navigate = useNavigate();

  
  const handleClick = (link: string) => {
    navigate(link);
  };

  return (
    <div className="w-full">
      <Splide
        options={{
          type: 'loop',
          autoplay: true,
          interval: 5000,
          pauseOnHover: true,
          arrows: false,
          pagination: true,
          drag: true,
          speed: 800,
          gap: '1rem',
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          height: 'auto',
        }}
        className="hero-slider w-full"
      >
        {eventSlides.map((slide) => (
          <SplideSlide key={slide.id}>
            <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-3xl">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40" />
                
                <div className="absolute bottom-8 left-8 text-white z-10">
                  <p className="text-sm md:text-base font-medium mb-2 opacity-90">
                    {slide.date}
                  </p>
                  
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-2 leading-tight">
                    {slide.title}
                  </h1>
                  
                  <p className="text-base md:text-lg mb-6 opacity-90">
                    {slide.subtitle}
                  </p>
                  
                  <button onClick={() => handleClick(slide.link)} className="bg-black cursor-pointer hover:bg-gray-800 text-white px-10 py-2 rounded-2xl font-medium transition-colors duration-200 ease-in-out">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}