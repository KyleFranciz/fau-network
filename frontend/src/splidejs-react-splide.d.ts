declare module '@splidejs/react-splide' {
  import { Component, ReactNode } from 'react';

  export interface SplideProps {
    options?: Record<string, any>;
    className?: string;
    children?: ReactNode;
  }

  export interface SplideSlideProps {
    children?: ReactNode;
  }

  export const Splide: React.ComponentType<SplideProps>;
  export const SplideSlide: React.ComponentType<SplideSlideProps>;
}

declare module '@splidejs/react-splide/css' {
  const content: string;
  export default content;
}
