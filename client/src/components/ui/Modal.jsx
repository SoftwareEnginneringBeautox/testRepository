import React from "react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const ModalContainer = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      {...props}
    >
      <ModalOverlay />

      <div
        className={cn(
          "relative z-50 bg-ash-100 dark:bg-customNeutral-400 p-8 rounded-lg shadow-lg min-w-[40%] max-h-[90vh] overflow-y-auto",
          // Scrollbar-specific styling
          "[&::-webkit-scrollbar]:w-2",
          "[&::-webkit-scrollbar-thumb]:bg-gray-400",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb:hover]:bg-lavender-400",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
);
ModalContainer.displayName = "ModalContainer";

const ModalOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-40 bg-black/80 transition-opacity duration-300",
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

const ModalIcon = ({ children }) => {
  return <div className="[&_svg]:size-8 [&_svg]:shrink-0">{children}</div>;
};
ModalIcon.displayName = "ModalIcon";

const ModalTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn(
      "text-[2rem] leading-[2.8rem] font-semibold dark:text-customNeutral-100",
      className
    )}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

const ModalHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn(
        "flex items-center gap-4 mb-4 dark:text-customNeutral-100",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);
ModalHeader.displayName = "ModalHeader";

const ModalBody = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-4 dark:text-customNeutral-100", className)}
    {...props}
  />
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
