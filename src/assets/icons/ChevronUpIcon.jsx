const ChevronUpIcon = ({ size = 24, fill = "currentColor" }) => (
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
    <g mask="url(#mask0_132_306)">
      <path d="M12 10.8L8.09999 14.7C7.91665 14.8833 7.68332 14.975 7.39999 14.975C7.11665 14.975 6.88332 14.8833 6.69999 14.7C6.51665 14.5167 6.42499 14.2833 6.42499 14C6.42499 13.7167 6.51665 13.4833 6.69999 13.3L11.3 8.69999C11.5 8.49999 11.7333 8.39999 12 8.39999C12.2667 8.39999 12.5 8.49999 12.7 8.69999L17.3 13.3C17.4833 13.4833 17.575 13.7167 17.575 14C17.575 14.2833 17.4833 14.5167 17.3 14.7C17.1167 14.8833 16.8833 14.975 16.6 14.975C16.3167 14.975 16.0833 14.8833 15.9 14.7L12 10.8Z" />
    </g>
  </svg>
);

export default ChevronUpIcon;
