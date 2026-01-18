declare module 'swiper/element/bundle' {
    export const register: () => void;
}

declare namespace JSX {
    interface IntrinsicElements {
        'swiper-container': any;
        'swiper-slide': any;
    }
}
