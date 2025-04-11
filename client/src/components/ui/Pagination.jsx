import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import ChevronLeftIcon from "@/assets/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/assets/icons/ChevronRightIcon";

import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center ", className)}
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
        "bg-lavender-400 text-customNeutral-100 hover:bg-lavender-500 active:bg-lavender-200 active:text-lavender-500 dark:bg-customNeutral-100 dark:text-lavender-400 dark:hover:bg-lavender-600 dark:active:bg-lavender-500":
          isActive,
        "text-lavender-400 hover:bg-lavender-100 active:bg-lavender-200 active:text-customNeutral-100 dark:text-customNeutral-100 dark:hover:bg-customNeutral-700 dark:active:bg-customNeutral-600 dark:active:text-white":
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

const PaginationPrevious = ({ className, disabled, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn(
      "gap-1 pl-2.5",
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      className
    )}
    disabled={disabled}
    {...props}
  >
    <ChevronLeftIcon className="pointer-events-none size-6 shrink-0" />
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, disabled, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn(
      "gap-1 pr-2.5",
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      className
    )}
    disabled={disabled}
    {...props}
  >
    <ChevronRightIcon className="pointer-events-none size-6 shrink-0" />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={cn(
      "flex h-9 w-9 items-center justify-center text-lavender-400 dark:text-customNeutral-100",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const PaginationLast = ({ className, page, disabled, ...props }) => (
  <PaginationLink
    aria-label="Go to last page"
    size="icon"
    className={cn(
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      className
    )}
    disabled={disabled}
    {...props}
  >
    {page}
  </PaginationLink>
);
PaginationLast.displayName = "PaginationLast";

// Enhanced pagination component for use with page count
const PaginationWithPageCount = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
  className
}) => {
  // Calculate page ranges to display
  const getPageRange = () => {
    const totalNumbers = siblingsCount * 2 + 3; // siblings + first + current + last + ellipsis
    const totalBlocks = totalNumbers + 2; // +2 for left and right ellipsis

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingsCount;
      return [
        ...Array.from({ length: leftItemCount }, (_, i) => i + 1),
        "ellipsis",
        totalPages
      ];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingsCount;
      return [
        1,
        "ellipsis",
        ...Array.from(
          { length: rightItemCount },
          (_, i) => totalPages - rightItemCount + i + 1
        )
      ];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      return [
        1,
        "ellipsis",
        ...Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        ),
        "ellipsis",
        totalPages
      ];
    }
  };

  const pages = getPageRange();

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {pages?.map((page, i) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationLast,
  PaginationWithPageCount
};
