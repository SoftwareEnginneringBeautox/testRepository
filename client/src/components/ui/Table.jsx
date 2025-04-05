import * as React from "react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const Table = React.forwardRef(({ className, children, ...props }, ref) => {
  const [rowCount, setRowCount] = React.useState(0);

  useEffect(() => {
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
    rowCount % 2 === 0
      ? "bg-faintingLight-100" // Even rows end with even bg
      : "bg-reflexBlue-100"; // Odd rows end with odd bg

  return (
    <div
      className={cn(
        "w-full rounded-md overflow-hidden", // Clip to maintain rounded corners
        className
      )}
    >
      <div
        className={cn(
          "w-full max-w-full overflow-x-auto flex-1",
          "pb-2.5", // Space for scrollbar
          scrollbarBgClass, // Dynamic background color
          "[&::-webkit-scrollbar]:h-2.5",
          "[&::-webkit-scrollbar-thumb]:bg-gray-400",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-track]:!bg-transparent",
          "[&::-webkit-scrollbar-thumb:hover]:bg-lavender-200"
        )}
      >
        <table
          ref={ref}
          className="w-full h-full border-collapse text-sm min-w-full"
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  );
});
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
