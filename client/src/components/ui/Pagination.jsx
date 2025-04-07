import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";

import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center my-2", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("rounded-full p-2", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, size = "icon", ...props }) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "cursor-pointer flex items-center justify-center rounded-full transition-colors",
      {
        "bg-lavender-400 text-customNeutral-100 hover:bg-lavender-500 active:bg-lavender-200 active:text-lavender-500":
          isActive,
        "text-lavender-400 hover:bg-lavender-100 active:bg-lavender-200 active:text-customNeutral-100":
          !isActive,
        "disabled:pointer-events-none disabled:opacity-50": true,
        "h-9 px-3": size === "sm",
        "h-12 px-4 py-2": size === "default",
        "h-11 px-8": size === "lg",
        "h-10 w-10": size === "icon"
      },
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeftIcon className="pointer-events-none size-6 shrink-0" />
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <ChevronRightIcon className="pointer-events-none size-6 shrink-0" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const PaginationLast = ({ className, pageNumber, currentPage, ...props }) => (
  <PaginationLink
    aria-label={`Go to page ${pageNumber}`}
    size="default"
    isActive={currentPage === pageNumber}
    className={cn(className)}
    {...props}
  >
    {pageNumber}
  </PaginationLink>
);
PaginationLast.displayName = "PaginationLast";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationLast
};
