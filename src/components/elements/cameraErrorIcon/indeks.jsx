
const CameraErrorIcon = ({ type }) => {
  const iconProps = {
    className: "h-12 w-12 mx-auto mb-4",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
  };

  switch (type) {
    case "permission":
      return (
        <svg {...iconProps} className={`${iconProps.className} text-warning`}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "holistic":
    case "model":
    case "generic":
      return (
        <svg {...iconProps} className={`${iconProps.className} text-error`}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
      );
  }
};

export default CameraErrorIcon;