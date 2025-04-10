const ChevronDownIcon = ({
  size = 24,
  fill = "currentColor",
  className = ""
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    className={className}
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
    <g mask="url(#mask0_131_2103)">
      <path d="M12 14.975C11.8667 14.975 11.7417 14.9542 11.625 14.9125C11.5083 14.8708 11.4 14.8 11.3 14.7L6.69999 10.1C6.51665 9.91667 6.42499 9.68334 6.42499 9.4C6.42499 9.11667 6.51665 8.88334 6.69999 8.7C6.88332 8.51667 7.11665 8.425 7.39999 8.425C7.68332 8.425 7.91665 8.51667 8.09999 8.7L12 12.6L15.9 8.7C16.0833 8.51667 16.3167 8.425 16.6 8.425C16.8833 8.425 17.1167 8.51667 17.3 8.7C17.4833 8.88334 17.575 9.11667 17.575 9.4C17.575 9.68334 17.4833 9.91667 17.3 10.1L12.7 14.7C12.6 14.8 12.4917 14.8708 12.375 14.9125C12.2583 14.9542 12.1333 14.975 12 14.975Z" />
    </g>
  </svg>
);

export default ChevronDownIcon;
