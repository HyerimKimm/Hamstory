"use client";

export default function LoadingIndicator({
  width = 24,
  height = 24,
  color = "currentColor",
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .loading-spinner {
          animation: spin 1s linear infinite;
          transform-origin: center;
        }
      `}</style>
      <svg
        className="loading-spinner"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.25"
          d="M5 12C5 11.1716 4.32843 10.5 3.5 10.5C2.67157 10.5 2 11.1716 2 12C2 12.8284 2.67157 13.5 3.5 13.5C4.32843 13.5 5 12.8284 5 12Z"
          fill={color}
        />
        <path
          opacity="0.5"
          d="M5.93783 8.50003C6.35204 7.7826 6.10623 6.86521 5.38879 6.451C4.67135 6.03678 3.75397 6.2826 3.33975 7.00003C2.92554 7.71747 3.17135 8.63486 3.88879 9.04907C4.60623 9.46329 5.52361 9.21747 5.93783 8.50003Z"
          fill={color}
        />
        <path
          d="M8.5 5.93792C9.21744 5.52371 9.46325 4.60632 9.04903 3.88888C8.63482 3.17144 7.71744 2.92563 7 3.33984C6.28256 3.75406 6.03674 4.67144 6.45096 5.38888C6.86517 6.10632 7.78256 6.35213 8.5 5.93792Z"
          fill={color}
        />
      </svg>
    </>
  );
}
