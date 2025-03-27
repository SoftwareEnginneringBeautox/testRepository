"use client";

import TrendUpIcon from "@/assets/icons/TrendUpIcon";
import TrendDownIcon from "@/assets/icons/TrendDownIcon";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/Card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/Chart";

const calculatePercentageChange = (salesData) => {
  if (!salesData || !Array.isArray(salesData)) {
    console.error("salesData is missing or not an array", salesData);
    return 0;
  }

  let totalCurrent = 0,
    totalPrevious = 0;

  salesData.forEach((entry) => {
    if (entry?.currentWeek === undefined || entry?.previousWeek === undefined) {
      console.warn("Entry missing currentWeek or previousWeek", entry);
      return;
    }
    totalCurrent += entry.currentWeek;
    totalPrevious += entry.previousWeek;
  });

  if (totalPrevious === 0) return 0;

  return (((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(2);
};

const SalesChart = ({ chartData, chartConfig }) => {
  const percentageChange = calculatePercentageChange(chartData);
  const isIncrease = percentageChange >= 0;

  return (
    <Card className="w-full bg-ash-100 shadow-custom">
      <CardHeader>
        <CardTitle>Weekly Sales Comparison</CardTitle>
        <CardDescription>
          Comparing current week's sales with the previous week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <div className="relative w-full h-0 pb-[55%]">
            <div className="absolute w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ left: 8, right: 8, top: 20, bottom: 20 }}
                  style={{ backgroundColor: "#F5F3F0" }} // Ash-100
                >
                  <CartesianGrid vertical={false} stroke="#AAAAAA" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `₱${value}`}
                    domain={["dataMin - 100", "dataMax + 100"]}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <defs>
                    <linearGradient
                      id="fillCurrentWeek"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartConfig.currentWeek.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.currentWeek.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="fillPreviousWeek"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartConfig.previousWeek.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.previousWeek.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="previousWeek"
                    type="monotone"
                    fill="url(#fillPreviousWeek)"
                    fillOpacity={0.4}
                    stroke={chartConfig.previousWeek.color}
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="currentWeek"
                    type="monotone"
                    fill="url(#fillCurrentWeek)"
                    fillOpacity={0.4}
                    stroke={chartConfig.currentWeek.color}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {isIncrease ? (
                <>
                  Current week up by {percentageChange}%
                  <TrendUpIcon className="h-4 w-4" fill="#4CAF50" />
                </>
              ) : (
                <>
                  Current week down by {Math.abs(percentageChange)}%
                  <TrendDownIcon
                    className="h-4 w-4 text-red-500"
                    fill="#ef4444"
                  />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-customNeutral-300">
              Week of July 10 - July 16, 2023
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SalesChart;
