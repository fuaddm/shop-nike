import { Link } from 'react-router';

export function Spotlight() {
  return (
    <div className="container pb-20">
      <div className="mb-2 text-center font-[Fugaz_One] text-6xl font-extrabold">SPOTLIGHT</div>
      <div className="mb-16 text-center">
        Classic silhouettes and cutting-edge innovation to build your game from the ground up.
      </div>
      <div className="mx-auto flex max-w-[1000px] flex-wrap gap-12">
        <Link
          to="/products?search=air+jordan"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/air-jordan.png"
              alt=""
            />
          </div>
          <div className="text-center text-sm font-medium">Air Jordan</div>
        </Link>
        <Link
          to="/products?search=air+max"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/air-max.png"
              alt=""
            />
          </div>
          <div className="text-center text-sm font-medium">Air Max</div>
        </Link>
        <Link
          to="/products?search=graphictrees"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/graphictrees.png"
              alt=""
            />
          </div>
          <div className="text-center text-sm font-medium">Graphic Tees</div>
        </Link>
        <Link
          to="/products?search=dunk"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/dunk.png"
              alt=""
            />
          </div>
          <div className="text-center text-sm font-medium">Dunk</div>
        </Link>
        <Link
          to="/products?search=air+force"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/air-force.png"
              alt=""
            />
          </div>
          <div className="text-center text-sm font-medium">Air Force</div>
        </Link>
        <Link
          to="/products?search=collection"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/collection.png"
              alt=""
            />
          </div>
          <div className="text-center text-sm font-medium">Collection</div>
        </Link>
        <Link
          to="/products?search=vomero"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/vomero.png"
              alt=""
            />
          </div>
          <div className="text-center text-sm font-medium">Vomero</div>
        </Link>
        <Link
          to="/products?search=shox"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/shox.png"
              alt=""
            />
          </div>
          <div className="text-center text-sm font-medium">Shox</div>
        </Link>
        <Link
          to="/products?search=acg"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/acg.png"
              alt=""
            />
          </div>
          <div className="text-center text-sm font-medium">ACG</div>
        </Link>
        <Link
          to="/products?search=vomero+plus"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/vomero-plus.png"
              alt=""
            />
          </div>
          <div className="text-center text-sm font-medium">Vomero Plus</div>
        </Link>
        <Link
          to="/products?search=pegasus"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/pegasus.png"
              alt=""
            />
          </div>
          <div className="max-w-[72px] text-center text-sm font-medium">Pegasus Premium</div>
        </Link>
        <Link
          to="/products?search=fan+gear"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/fan-gear.png"
              alt=""
            />
          </div>
          <div className="max-w-[72px] text-center text-sm font-medium">Fan Gear</div>
        </Link>
        <Link
          to="/products?search=jordan+retro"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/jordan-retro.png"
              alt=""
            />
          </div>
          <div className="max-w-[72px] text-center text-sm font-medium">Jordan Retro</div>
        </Link>
        <Link
          to="/products?search=sabrina"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/sabrina-3.png"
              alt=""
            />
          </div>
          <div className="max-w-[72px] text-center text-sm font-medium">Sabrina 3</div>
        </Link>
        <Link
          to="/products?search=rejuven8"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/rejuven8.png"
              alt=""
            />
          </div>
          <div className="max-w-[72px] text-center text-sm font-medium">Rejuven8</div>
        </Link>
        <Link
          to="/products?search=tatum"
          className="flex w-fit flex-col gap-1 transition ease-out hover:opacity-60"
        >
          <div className="aspect-square w-18 overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src="/images/spotlight/tatum.png"
              alt=""
            />
          </div>
          <div className="max-w-[72px] text-center text-sm font-medium">Tatum 4</div>
        </Link>
      </div>
    </div>
  );
}
