"use client";

export default function PencilIcon({
  width = 52,
  height = 52,
  color = "currentColor",
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.25 14.0834L37.9167 22.7501M8.66669 43.3334H17.3334L40.0834 20.5834C40.6524 20.0144 41.1038 19.3388 41.4118 18.5953C41.7198 17.8518 41.8783 17.0549 41.8783 16.2501C41.8783 15.4453 41.7198 14.6484 41.4118 13.9049C41.1038 13.1614 40.6524 12.4858 40.0834 11.9168C39.5143 11.3477 38.8387 10.8963 38.0952 10.5883C37.3517 10.2803 36.5548 10.1218 35.75 10.1218C34.9452 10.1218 34.1484 10.2803 33.4048 10.5883C32.6613 10.8963 31.9857 11.3477 31.4167 11.9168L8.66669 34.6668V43.3334Z"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
