export function MasterCard({ ...properties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...properties}
    >
      <g
        fill="none"
        fillRule="evenodd"
      >
        <circle
          cx="7"
          cy="12"
          r="7"
          fill="#EA001B"
        />
        <circle
          cx="17"
          cy="12"
          r="7"
          fill="#FFA200"
          fillOpacity=".8"
        />
      </g>
    </svg>
  );
}
