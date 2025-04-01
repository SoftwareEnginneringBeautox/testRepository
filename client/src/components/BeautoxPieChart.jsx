import React from "react";
import { PieChart, Pie, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/Chart";

import TrendUpIcon from "@/assets/icons/TrendUpIcon";
import TrendDownIcon from "@/assets/icons/TrendDownIcon";

// Chart configuration
const chartConfig = {
  rent: {
    label: "Rent",
    color: "#100524"
  },
  utilities: {
    label: "Utilities",
    color: "#17082C"
  },
  salaries: {
    label: "Salaries",
    color: "#210D36"
  },
  supplies: {
    label: "Supplies",
    color: "#381B4C"
  },
  marketing: {
    label: "Marketing",
    color: "#7A4C93"
  }
};

// Sample data
const rawData = {
  rent: 2000,
  utilities: 800,
  salaries: 4000,
  supplies: 1200,
  marketing: 500
};

// Transform data for recharts
const chartData = Object.keys(rawData).map((key) => ({
  category: chartConfig[key]?.label || key,
  value: rawData[key],
  fill: chartConfig[key]?.color || "#ccc"
}));

const BeautoxPieChart = () => {
  // Calculate the total expenses
  const totalExpenses = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const pastMonthTotal = 10500;
  const trend = ((totalExpenses - pastMonthTotal) / pastMonthTotal) * 100;
  const isTrendingUp = trend > 0;

  return (
    <Card className="w-full h-full shadow-custom bg-ash-100">
      <CardHeader className="items-center pb-2">
        <CardTitle>MONTHLY EXPENSES</CardTitle>
        <CardDescription>Breakdown of Expenses By Category</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          className="aspect-square w-full max-w-xs mx-auto"
          config={chartConfig}
        >
          <PieChart
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            width={300}
            height={300}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={2}
              paddingAngle={1}
            >
              <Label
                content={({ viewBox }) =>
                  viewBox && (
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
                        y={viewBox.cy + 20}
                        className="fill-muted-foreground text-sm"
                      >
                        TOTAL EXPENSES
                      </tspan>
                    </text>
                  )
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {trend !== null && (
          <div className="flex items-center gap-2 font-medium leading-none">
            {isTrendingUp ? (
              <>
                Trending up by {trend.toFixed(1)}%
                <TrendUpIcon className="text-success-400" /> this month compared
                to last month
              </>
            ) : (
              <>
                Trending down by {Math.abs(trend).toFixed(1)}%
                <TrendDownIcon className="text-error-400" /> this month compared
                to last month
              </>
            )}
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing total expenses for current month
        </div>
      </CardFooter>
    </Card>
  );
};

export default BeautoxPieChart;
