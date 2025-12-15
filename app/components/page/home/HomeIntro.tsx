import { Link } from 'react-router';

import { Poster } from '@components/page/home/HomePosters';

export function HomeIntro() {
  return (
    <div className="mb-12">
      <div className="h-[65vh] w-full">
        <div className="relative h-full w-full">
          <video
            autoPlay={true}
            preload="none"
            muted
            loop
            className="h-full w-full object-cover"
          >
            <source
              src="/air-max.webm"
              type="video/webm"
            />
          </video>
          <div className="absolute top-0 left-0 h-full w-full bg-black/20"></div>
          <div className="absolute bottom-20 left-1/2 w-full -translate-x-1/2 text-center">
            <div className="text-2xl leading-tight font-black text-white md:text-[80px]">GIVE SPORT</div>
            <div className="mb-4 font-medium text-white">
              Gift your favourite athletes the gear to make next year their greatest.
            </div>
            <Link
              to="/products"
              className="mx-auto w-fit rounded-full bg-white px-5 py-1.5 font-semibold text-black"
            >
              Shop
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <Poster
          suptitle="Nike Tech Woven"
          title="Built to Move Different"
          image={'/images/golden-teeth.avif'}
          to="/products"
        />
        <Poster
          suptitle="Vomero 18 GORE-TEX"
          title="Run Anyway"
          image={'/images/jordan-green.avif'}
          to="/products"
        />
      </div>
    </div>
  );
}
