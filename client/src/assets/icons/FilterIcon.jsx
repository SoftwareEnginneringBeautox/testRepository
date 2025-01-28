const FilterIcon = ({ size = 24, fill = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <mask
      id="mask0_104_1246"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="24"
      height="24"
    >
      <rect y="0.477478" width="24" height="24" fill={fill} />
    </mask>
    <g mask="url(#mask0_104_1235)">
      <path d="M10.7532 22.749C10.4 22.749 10.1038 22.6276 9.86487 22.3847C9.6259 22.1419 9.50642 21.841 9.50642 21.482V13.8802L2.27503 4.50463C1.96333 4.0823 1.91658 3.63887 2.13476 3.17431C2.35295 2.70976 2.73218 2.47748 3.27246 2.47748H20.7275C21.2678 2.47748 21.647 2.70976 21.8652 3.17431C22.0834 3.63887 22.0367 4.0823 21.725 4.50463L14.4936 13.8802V21.482C14.4936 21.841 14.3741 22.1419 14.1351 22.3847C13.8962 22.6276 13.6 22.749 13.2468 22.749H10.7532ZM12 12.9933L18.1716 5.01141H5.82838L12 12.9933Z" />
    </g>
  </svg>
);

export default FilterIcon;
