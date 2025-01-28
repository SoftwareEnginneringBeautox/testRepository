import React, { useMemo } from "react";
import { PieChart, Pie, Label } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/Card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/Chart";
import TrendUpIcon from "@/assets/icons/TrendUpIcon";

const chartData = [
  { category: "Rent", amount: 2000, fill: "#381B4C" },
  { category: "Utilities", amount: 500, fill: "#002B7F" },
  { category: "Salaries", amount: 5000, fill: "#F0D6F6" },
  { category: "Supplies", amount: 1000, fill: "#E5EEFF" },
  { category: "Marketing", amount: 1500, fill: "#F5F3F0" }
];

const chartConfig = {
  amount: {
    label: "Amount"
  },
  rent: {
    label: "Rent",
    color: "#381B4C" // lavender-400
  },
  utilities: {
    label: "Utilities",
    color: "#002B7F" // reflexBlue-400
  },
  salaries: {
    label: "Salaries",
    color: "#F0D6F6" // lavender-100
  },
  supplies: {
    label: "Supplies",
    color: "#E5EEFF" // reflexBlue-100
  },
  marketing: {
    label: "Marketing",
    color: "#F5F3F0" // ash-100
  }
};

const BeautoxPieChart = () => {
  const totalExpenses = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, []);

  return (
    <Card className="w-full h-full shadow-custom">
      <CardHeader className="items-center pb-2">
        <CardTitle>MONTHLY EXPENSES</CardTitle>
        <CardDescription>Breakdown of Expenses By Category</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full max-w-xs mx-auto"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          ₱{totalExpenses.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          Total Expenses
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2%
          <TrendUpIcon size={16} fill={"success-400"} /> this month
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expenses for current month
        </div>
      </CardFooter>
    </Card>
  );
};

export default BeautoxPieChart;
