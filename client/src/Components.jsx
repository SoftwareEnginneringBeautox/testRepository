// Buttons
export const CTAButton = ({ text, leftIcon, rightIcon, action, fullWidth }) => {
  const baseStyles =
    "bg-lavender-400 text-customNeutral-100 px-4 py-2 leading-6 rounded-lg gap-2 font-semibold hover:bg-lavender-500 active:bg-lavender-200 active:text-lavender-500 active:border-lavender-200 flex items-center justify-center text-center";
  const styles = fullWidth ? `w-full ${baseStyles}` : baseStyles;

  // For href button
  if (typeof action === "string") {
    return (
      <a href={action} className={styles}>
        {leftIcon}
        <span className="mt-1">{text}</span>
        {rightIcon}
      </a>
    );
  }

  // For onClick button
  return (
    <button onClick={action} className={styles}>
      {leftIcon}
      <span className="mt-1">{text}</span>
      {rightIcon}
    </button>
  );
};

export const OutlineButton = ({
  text,
  leftIcon,
  rightIcon,
  action,
  fullWidth
}) => {
  const baseStyles =
    "border-lavender-400 border-2 text-lavender-400 p-[0.5rem_1rem] leading-6 rounded-lg gap-2 font-semibold hover:bg-lavender-100 hover:border-lavender-100 active:bg-lavender-200 active:text-customNeutral-100 active:border-lavender-200 flex items-center justify-center text-center";
  const styles = fullWidth ? `w-full ${baseStyles}` : baseStyles;

  // For href button
  if (typeof action === "string") {
    return (
      <a href={action} className={styles}>
        {leftIcon}
        <span className="mt-1">{text}</span>
        {rightIcon}
      </a>
    );
  }

  // For onClick button
  return (
    <button onClick={action} className={styles}>
      {leftIcon}
      <span className="mt-1">{text}</span>
      {rightIcon}
    </button>
  );
};

// Pagination for Tables/Charts
export const Pagination = () => {
  return (
    <td colSpan="8" className="text-lavender-200 font-semibold">
      Page <span className="text-lavender-400">1</span> of{" "}
      <span className="text-lavender-400">10</span>
    </td>
  );
};
