import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'react-aria-components';
import { type Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ProductCard } from '@components/page/shared/ProductCard';
import { SkeletonProductCard } from '@components/page/shared/SkeletonProductCard';

import { cn } from '@libs/cn';

import type { IProduct } from '@models/product';

export function ProductSlider({
  products,
  isLoading = false,
  swipeButtons = 'center',
}: {
  products: IProduct[];
  isLoading?: boolean;
  swipeButtons?: 'center' | 'top';
}) {
  const swiperReference = useRef<SwiperType | null>(null);
  const [beginAndEnd, setBeginAndEnd] = useState({
    isBeginning: true,
    isEnd: false,
  });

  const swipePrevious = useCallback(() => {
    swiperReference.current?.slidePrev();
  }, []);

  const swipeNext = useCallback(() => {
    swiperReference.current?.slideNext();
  }, []);

  function slideChanged(swiper: SwiperType) {
    setBeginAndEnd({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  }

  useEffect(() => {
    if (swiperReference.current) {
      setBeginAndEnd({
        isBeginning: swiperReference.current.isBeginning,
        isEnd: swiperReference.current.isEnd,
      });
    }
  }, [swiperReference]);

  return (
    <div className="relative z-0">
      {swipeButtons === 'center' && (
        <>
          <Button
            onPress={swipePrevious}
            className={cn({
              'bg-surface-container-highest absolute top-1/2 left-0 z-10 -translate-x-[calc(50%-8px)] -translate-y-1/2 rounded-full transition': true,
              'opacity-40': beginAndEnd.isBeginning,
            })}
          >
            <ChevronLeft className="stroke-on-surface box-content h-4 w-4 py-3 ps-2 pe-2.5 md:h-6 md:w-6" />
          </Button>
          <Button
            onPress={swipeNext}
            className={cn({
              'bg-surface-container-highest absolute top-1/2 right-0 z-10 translate-x-[calc(50%-8px)] -translate-y-1/2 rounded-full transition': true,
              'opacity-40': beginAndEnd.isEnd,
            })}
          >
            <ChevronRight className="stroke-on-surface box-content h-4 w-4 py-3 ps-2.5 pe-2 md:h-6 md:w-6" />
          </Button>
        </>
      )}
      {swipeButtons === 'top' && (
        <div className="absolute right-0 bottom-[calc(100%+8px)] z-10 flex gap-2">
          <Button
            onPress={swipePrevious}
            className={cn({
              'bg-surface-container-highest grid h-13 w-13 place-items-center rounded-full transition': true,
              'hover:bg-surface-container-high': !beginAndEnd.isBeginning,
              'opacity-40': beginAndEnd.isBeginning,
            })}
          >
            <ChevronLeft
              strokeWidth="1"
              className="stroke-on-surface box-content h-4 w-4 pe-0.5 md:h-6 md:w-6"
            />
          </Button>
          <Button
            onPress={swipeNext}
            className={cn({
              'bg-surface-container-highest grid h-13 w-13 place-items-center rounded-full transition': true,
              'hover:bg-surface-container-high': !beginAndEnd.isEnd,
              'opacity-40': beginAndEnd.isEnd,
            })}
          >
            <ChevronRight
              strokeWidth="1"
              className="stroke-on-surface box-content h-4 w-4 ps-0.5 md:h-6 md:w-6"
            />
          </Button>
        </div>
      )}
      <Swiper
        spaceBetween={8}
        slidesPerView={2.1}
        onSlideChange={slideChanged}
        resistanceRatio={0}
        onSwiper={(swiper) => (swiperReference.current = swiper)}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
      >
        {isLoading && (
          <>
            <SwiperSlide className="!h-auto">
              <SkeletonProductCard />
            </SwiperSlide>
            <SwiperSlide className="!h-auto">
              <SkeletonProductCard />
            </SwiperSlide>
            <SwiperSlide className="!h-auto">
              <SkeletonProductCard />
            </SwiperSlide>
            <SwiperSlide className="!h-auto">
              <SkeletonProductCard />
            </SwiperSlide>
            <SwiperSlide className="!h-auto">
              <SkeletonProductCard />
            </SwiperSlide>
            <SwiperSlide className="!h-auto">
              <SkeletonProductCard />
            </SwiperSlide>
          </>
        )}
        {!isLoading &&
          products.map((item) => {
            return (
              <SwiperSlide
                key={item.id}
                className="!h-auto"
              >
                <ProductCard {...item} />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}
