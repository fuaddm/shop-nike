export function SkeletonProductCard() {
  return (
    <div className="bg-surface-container-low group flex h-full flex-col justify-between rounded-md p-2 md:px-3 md:py-4">
      <div>
        <div className="bg-surface-container-high mb-2 block aspect-square animate-pulse overflow-hidden rounded-md"></div>
        <div className="bg-on-surface-variant mb-2 block w-fit animate-pulse rounded-md ps-1 text-base font-bold text-transparent md:text-lg">
          Name of product Name of product
        </div>
      </div>
      <div className="mb-2 grid grid-cols-4 gap-3 md:mb-4"></div>
      <div className="ps-1">
        <div className="mb-2 flex items-start text-base font-bold md:mb-4 md:text-xl md:font-black">
          <div className="bg-on-surface-variant animate-pulse rounded-md text-transparent">100.00</div>
        </div>
      </div>
    </div>
  );
}
