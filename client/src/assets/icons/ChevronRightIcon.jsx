const ChevronRightIcon = ({ size = 24, fill = "currentColor" }) => (
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
    <g mask="url(#mask0_132_305)">
      <path d="M12.6 12L8.69999 8.1C8.51665 7.91667 8.42499 7.68334 8.42499 7.4C8.42499 7.11667 8.51665 6.88334 8.69999 6.7C8.88332 6.51667 9.11665 6.425 9.39999 6.425C9.68332 6.425 9.91665 6.51667 10.1 6.7L14.7 11.3C14.8 11.4 14.8708 11.5083 14.9125 11.625C14.9542 11.7417 14.975 11.8667 14.975 12C14.975 12.1333 14.9542 12.2583 14.9125 12.375C14.8708 12.4917 14.8 12.6 14.7 12.7L10.1 17.3C9.91665 17.4833 9.68332 17.575 9.39999 17.575C9.11665 17.575 8.88332 17.4833 8.69999 17.3C8.51665 17.1167 8.42499 16.8833 8.42499 16.6C8.42499 16.3167 8.51665 16.0833 8.69999 15.9L12.6 12Z" />
    </g>
  </svg>
);

export default ChevronRightIcon;
