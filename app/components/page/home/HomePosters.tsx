import { Link } from 'react-router';

export function HomePosters() {
  return (
    <div className="container grid grid-cols-2 gap-4">
      <Poster
        suptitle="Winter Wear"
        title="Layers For Chriller Days"
        image={'/images/winter-wear.avif'}
        to="/products"
      />
      <Poster
        suptitle="Nike United"
        title="Six Stars. Three Boots. One Wicked Ambition"
        image={'/images/three-boots.avif'}
        to="/products"
      />
      <Poster
        suptitle="RealTree Collection"
        title="Too Cool To Blend In"
        image={'/images/too-cool.avif'}
        to="/products"
      />
      <Poster
        suptitle="Build to Move Differently"
        title="Nike Ava Rover"
        image={'/images/jordans.avif'}
        to="/products"
      />
    </div>
  );
}

export function Poster({ image, suptitle, title, to }: { image: string; suptitle: string; title: string; to: string }) {
  return (
    <div className="bg-surface-container relative flex aspect-square items-end justify-start p-12">
      <div className="w-ful absolute top-0 left-0 h-full">
        <img
          className="h-full w-full object-cover"
          src={image}
          alt=""
        />
      </div>
      <div className="relative z-10 flex w-full flex-col gap-3 text-white">
        <div className="font-medium">{suptitle}</div>
        <div className="mb-2 w-full max-w-2/3 text-4xl font-medium">{title}</div>
        <Link
          to={to}
          className="block w-fit rounded-full bg-white px-5 py-1.5 font-semibold text-black"
        >
          Shop
        </Link>
      </div>
    </div>
  );
}
