// Import Swiper styles
import { useCallback, useMemo, useRef } from 'react';
import { Button } from 'react-aria-components';
import { type Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { IProductImagesSliderProperties } from '@models/components/page/product/productImageSlider';

export function ProductImagesSlider({ images }: IProductImagesSliderProperties) {
  const swiperReference = useRef<SwiperType | null>(null);

  const swipeTo = useCallback((index: number) => {
    swiperReference.current?.slideTo(index);
  }, []);

  const computedColCount = useMemo(() => {
    if (images.length <= 4) return 4;
    else if (images.length < 6) return images.length;
    return 5;
  }, [images]);

  return (
    <div className="grid aspect-square h-fit w-full grid-rows-[1fr_max-content] gap-2 md:gap-3">
      <div className="bg-surface-container w-full overflow-hidden rounded-2xl">
        <Swiper
          spaceBetween={10}
          onSwiper={(swiper) => (swiperReference.current = swiper)}
          className="h-full"
        >
          {images.map((image) => (
            <SwiperSlide
              key={image.id}
              className="bg-surface-container h-full w-full rounded-2xl"
            >
              <img
                className="h-full w-full object-contain"
                src={image.src}
                alt={image.alt}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div
        className="grid grid-cols-5 gap-2 md:gap-3"
        style={{ gridTemplateColumns: `repeat(${computedColCount}, minmax(0, 1fr))` }}
      >
        {images.map((image, index) => (
          <Button
            key={image.id}
            onPress={() => swipeTo(index)}
            className="focus:outline-outline hover:outline-outline-variant bg-surface-container aspect-square w-full overflow-hidden rounded-2xl outline-2 outline-transparent transition"
          >
            <img
              className="h-full w-full object-contain"
              src={image.src}
              alt={image.alt}
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
