const PadlockIcon = ({ size = 24, fill = "currentColor" }) => (
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
    <g mask="url(#mask0_274_1487)">
      <path d="M6 22C5.45 22 4.97917 21.8135 4.5875 21.4405C4.19583 21.0675 4 20.619 4 20.0952V10.5714C4 10.0476 4.19583 9.59921 4.5875 9.22619C4.97917 8.85317 5.45 8.66667 6 8.66667H7V6.7619C7 5.44444 7.4875 4.32143 8.4625 3.39286C9.4375 2.46429 10.6167 2 12 2C13.3833 2 14.5625 2.46429 15.5375 3.39286C16.5125 4.32143 17 5.44444 17 6.7619V8.66667H18C18.55 8.66667 19.0208 8.85317 19.4125 9.22619C19.8042 9.59921 20 10.0476 20 10.5714V20.0952C20 20.619 19.8042 21.0675 19.4125 21.4405C19.0208 21.8135 18.55 22 18 22H6ZM6 20.0952H18V10.5714H6V20.0952ZM12 17.2381C12.55 17.2381 13.0208 17.0516 13.4125 16.6786C13.8042 16.3056 14 15.8571 14 15.3333C14 14.8095 13.8042 14.3611 13.4125 13.9881C13.0208 13.6151 12.55 13.4286 12 13.4286C11.45 13.4286 10.9792 13.6151 10.5875 13.9881C10.1958 14.3611 10 14.8095 10 15.3333C10 15.8571 10.1958 16.3056 10.5875 16.6786C10.9792 17.0516 11.45 17.2381 12 17.2381ZM9 8.66667H15V6.7619C15 5.96825 14.7083 5.29365 14.125 4.7381C13.5417 4.18254 12.8333 3.90476 12 3.90476C11.1667 3.90476 10.4583 4.18254 9.875 4.7381C9.29167 5.29365 9 5.96825 9 6.7619V8.66667Z" />
    </g>
  </svg>
);

export default PadlockIcon;
