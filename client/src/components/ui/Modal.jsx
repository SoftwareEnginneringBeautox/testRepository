import React from "react";
import { cn } from "@/lib/utils";

const ModalContainer = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-16",
        className
      )}
      {...props}
    >
      <ModalOverlay />
      <div className="relative z-50 bg-white p-6 rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  )
);
ModalContainer.displayName = "ModalContainer";

const ModalOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className={cn("fixed inset-0 z-40 bg-black/80", className)}
    {...props}
    ref={ref}
  />
));
ModalOverlay.displayName = "ModalOverlay";

const ModalIcon = ({ children }) => {
  return <div className="[&_svg]:size-6 [&_svg]:shrink-0">{children}</div>;
};
ModalIcon.displayName = "ModalIcon";

const ModalTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-[2rem] leading-[2.8rem] font-semibold", className)}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

const ModalHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn("flex items-center gap-2 mb-4", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);
ModalHeader.displayName = "ModalHeader";

const ModalBody = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mt-4", className)} {...props} />
));
ModalBody.displayName = "ModalBody";

export {
  ModalContainer,
  ModalOverlay,
  ModalIcon,
  ModalTitle,
  ModalHeader,
  ModalBody
};
