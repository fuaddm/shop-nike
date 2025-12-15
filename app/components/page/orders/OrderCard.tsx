export function OrderCard({ img, status, name = '' }: { img: string; status: string; name: string }) {
  return (
    <div className="bg-surface-container rounded-md p-3">
      <div className="flex gap-4">
        <div className="bg-surface-container-high aspect-square w-40 overflow-hidden rounded-md">
          <img
            src={img}
            className="h-full w-full object-cover"
            alt=""
          />
        </div>
        <div className="flex flex-col">
          <div className="text-on-surface-variant text-sm font-medium">{status}</div>
          <div className="text-on-surface-variant text-sm font-medium">{name}</div>
        </div>
      </div>
    </div>
  );
}
