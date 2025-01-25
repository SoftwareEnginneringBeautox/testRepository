"use client";

import { TrendingUp } from "lucide-react";
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

const chartData = [
  { day: "Mon", currentWeek: 1300, previousWeek: 1100 },
  { day: "Tue", currentWeek: 1400, previousWeek: 1150 },
  { day: "Wed", currentWeek: 1500, previousWeek: 1200 },
  { day: "Thu", currentWeek: 1600, previousWeek: 1250 },
  { day: "Fri", currentWeek: 1700, previousWeek: 1300 },
  { day: "Sat", currentWeek: 1800, previousWeek: 1350 },
  { day: "Sun", currentWeek: 1900, previousWeek: 1400 }
];

const chartConfig = {
  currentWeek: {
    label: "Current Week",
    color: "#381B4C" // Lavender-400
  },
  previousWeek: {
    label: "Previous Week",
    color: "#002B7F" // ReflexBlue-400
  }
};

const SalesChart = () => {
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
          <div
            style={{
              width: "100%",
              height: "0",
              paddingBottom: "50%",
              position: "relative"
            }}
          >
            <div
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 8,
                    right: 8,
                    top: 20,
                    bottom: 20
                  }}
                  style={{ backgroundColor: "#F5F3F0" }} // Ash-100
                >
                  <CartesianGrid vertical={false} stroke="#AAAAAA" />{" "}
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
                      <stop offset="5%" stopColor="#381B4C" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#381B4C"
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
                      <stop offset="5%" stopColor="#002B7F" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#002B7F"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="previousWeek"
                    type="monotone"
                    fill="url(#fillPreviousWeek)"
                    fillOpacity={0.4}
                    stroke="#002B7F"
                    strokeWidth={2}
                  />
                  <Area
                    dataKey="currentWeek"
                    type="monotone"
                    fill="url(#fillCurrentWeek)"
                    fillOpacity={0.4}
                    stroke="#381B4C"
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
              Current week up by 35.7%{" "}
              <TrendingUp className="h-4 w-4 text-success-400" />
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
