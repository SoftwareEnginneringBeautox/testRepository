import React from "react";

const ModalContainer = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center rounded-lg p-16",
      className
    )}
    {...props}
  />
));
ModalContainer.displayName = "ModalContainer";

const ModalTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-[2rem] leading-[2.8rem] font-semibold mb-4", className)}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

const ModalContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mb-4", className)} {...props} />
));
ModalContent.displayName = "ModalContent";

const ModalForm = React.forwardRef(({ className, ...props }, ref) => (
  <form
    ref={ref}
    className={cn("bg-white p-6 rounded-lg shadow-lg", className)}
    {...props}
  />
));
ModalForm.displayName = "ModalForm";

export { ModalContainer, ModalTitle, ModalContent, ModalForm };
