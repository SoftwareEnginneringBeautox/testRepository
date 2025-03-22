const FacebookIcon = ({ size = 24, fill = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect width="512" height="512" rx="60" ry="60" fill={fill} />
    <path
      d="M272 512h-80V352h-72v-80h72v-64c0-91 41-138 128-138 21 0 50 2 64 5v88c-10-1-26-2-40-2-44 0-56 16-56 56v56h96v80h-96v160z"
      fill="white"
    />
  </svg>
);

export default FacebookIcon;
