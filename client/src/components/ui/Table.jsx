import * as React from "react";
import { cn } from "@/lib/utils";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/Pagination";

const Table = React.forwardRef(
  (
    {
      className,
      children,
      // Pagination props
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      showPagination = false,
      ...props
    },
    ref
  ) => {
    // Use this state to count rows if you still want the dynamic background feature
    const [rowCount, setRowCount] = React.useState(0);

    // Count logic for row background
    React.useEffect(() => {
      // Find TableBody in children and count its direct tr children
      React.Children.forEach(children, (child) => {
        if (child?.type?.displayName === "TableBody") {
          let count = 0;
          React.Children.forEach(child.props.children, (row) => {
            if (
              React.isValidElement(row) &&
              row.type?.displayName === "TableRow"
            ) {
              count++;
            }
          });
          setRowCount(count);
        }
      });
    }, [children]);

    // Determine background color based on odd/even row count
    const scrollbarBgClass =
      rowCount % 2 === 0 ? "bg-faintingLight-100" : "bg-reflexBlue-100";

    // Function to handle pagination
    const paginate = (pageNumber) => {
      if (pageNumber > 0 && pageNumber <= totalPages && onPageChange) {
        onPageChange(pageNumber);
      }
    };

    // Generate pagination items
    const generatePaginationItems = () => {
      const items = [];
      const maxVisiblePages = 5;

      // Always show first page
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => paginate(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Calculate range of visible pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning or end
      if (currentPage <= 3) {
        endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 2);
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i}
                onClick={() => paginate(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2 && totalPages > maxVisiblePages) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page if there's more than one page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key="last">
            <PaginationLink
              isActive={currentPage === totalPages}
              onClick={() => paginate(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }

      return items;
    };

    return (
      <div className="w-full overflow-hidden rounded-lg">
        {/* Use a relative positioned container */}
        <div className="relative w-full">
          {/* Table container with scroll - modified for fixed scrollbar */}
          <div
            className={cn(
              "w-full overflow-x-auto",
              scrollbarBgClass,
              "pb-8", // Increased padding to ensure space for the scrollbar
              className
            )}
            style={{
              // Use CSS to ensure scrollbar is always at the bottom
              scrollbarWidth: "auto",
              scrollbarColor: "rgba(156, 163, 175, 0.5) transparent"
            }}
          >
            <table
              ref={ref}
              className="w-full border-collapse text-sm"
              {...props}
            >
              {children}
            </table>

            {/* Fixed scrollbar track - visible regardless of scroll position */}
            <div className="sticky left-0 right-0 bottom-0 h-2.5 bg-transparent mt-2 w-full">
              <div className="w-full h-full overflow-x-scroll overflow-y-hidden invisible">
                {/* This mimics the width of the table to ensure proper scrollbar width */}
                <div className="h-px" style={{ width: "200%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination outside the scroll container with matching background color */}
        {showPagination && (
          <div
            className={cn("w-full flex justify-center py-2", scrollbarBgClass)}
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => paginate(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {generatePaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => paginate(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    );
  }
);
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("border-b bg-lavender-400", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 odd:bg-reflexBlue-100 even:bg-faintingLight-100",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 py-4 align-middle font-semibold text-xl bg-lavender-400 text-customNeutral-100",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle ", className)} {...props} />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
};
