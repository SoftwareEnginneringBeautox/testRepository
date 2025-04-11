import * as React from "react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

import { PaginationWithPageCount } from "@/components/ui/Pagination";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-hidden rounded-lg">
    <div className="w-full overflow-x-auto relative">
      <table
        ref={ref}
        className={cn("w-full border-collapse text-sm relative", className)}
        {...props}
      />
    </div>
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "border-b bg-lavender-400 dark:bg-customNeutral-500",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "[&_tr:last-child]:border-0 text-customNeutral-600 dark:text-customNeutral-200",
      className
    )}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 text-customNeutral-600 dark:text-customNeutral-200",
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
      "border-b transition-colors odd:bg-reflexBlue-100 dark:odd:bg-customNeutral-400 even:bg-faintingLight-100 dark:even:bg-customNeutral-500 dark:border-customNeutral-300",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, isSticky, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 py-4 align-middle font-semibold text-xl bg-lavender-400 text-customNeutral-100 dark:bg-customNeutral-600 dark:text-customNeutral-100",
      isSticky &&
        "sticky right-0 z-50 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, isSticky, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle text-customNeutral-600 dark:text-customNeutral-100",
      isSticky &&
        "sticky right-0 z-40 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]",
      // Inherit background color from parent row instead of setting it directly
      isSticky && "bg-inherit",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-4 text-sm text-customNeutral-600 dark:text-customNeutral-100",
      className
    )}
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
