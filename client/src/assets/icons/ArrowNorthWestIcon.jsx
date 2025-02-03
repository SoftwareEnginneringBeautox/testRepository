const ArrowNorthWestIcon = ({ size = 24, fill = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <mask
      id="mask0_104_1233"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="24"
      height="24"
    >
      <rect y="0.477478" width="24" height="24" fill={fill} />
    </mask>
    <g mask="url(#mask0_104_1233)">
      <path d="M6.54473 8.32604L17.8688 19.6501C18.1021 19.8834 18.3989 20 18.7594 20C19.1199 20 19.4168 19.8834 19.6501 19.6501C19.8834 19.4168 20 19.1199 20 18.7594C20 18.3989 19.8834 18.1021 19.6501 17.8688L8.32604 6.54473H17.996C18.3565 6.54473 18.6587 6.4228 18.9026 6.17893C19.1465 5.93506 19.2684 5.63287 19.2684 5.27237C19.2684 4.91186 19.1465 4.60968 18.9026 4.36581C18.6587 4.12194 18.3565 4 17.996 4H5.27237C4.91186 4 4.60967 4.12194 4.3658 4.36581C4.12193 4.60968 4 4.91186 4 5.27237V17.996C4 18.3565 4.12193 18.6587 4.3658 18.9026C4.60967 19.1465 4.91186 19.2684 5.27237 19.2684C5.63287 19.2684 5.93506 19.1465 6.17893 18.9026C6.4228 18.6587 6.54473 18.3565 6.54473 17.996V8.32604Z" />
    </g>
  </svg>
);

export default ArrowNorthWestIcon;
