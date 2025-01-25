const ChevronLeftIcon = ({ size = 24, fill = "currentColor" }) => (
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
    <g mask="url(#mask0_131_2104)">
      <path d="M10.8 12L14.7 15.9C14.8833 16.0833 14.975 16.3167 14.975 16.6C14.975 16.8833 14.8833 17.1167 14.7 17.3C14.5167 17.4833 14.2833 17.575 14 17.575C13.7167 17.575 13.4833 17.4833 13.3 17.3L8.69999 12.7C8.59999 12.6 8.52915 12.4917 8.48749 12.375C8.44582 12.2583 8.42499 12.1333 8.42499 12C8.42499 11.8667 8.44582 11.7417 8.48749 11.625C8.52915 11.5083 8.59999 11.4 8.69999 11.3L13.3 6.7C13.4833 6.51667 13.7167 6.425 14 6.425C14.2833 6.425 14.5167 6.51667 14.7 6.7C14.8833 6.88334 14.975 7.11667 14.975 7.4C14.975 7.68334 14.8833 7.91667 14.7 8.1L10.8 12Z" />
    </g>
  </svg>
);

export default ChevronLeftIcon;
