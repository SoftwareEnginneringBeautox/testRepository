"use client";

import { useEffect, useState } from "react";
import TrendUpIcon from "@/assets/icons/TrendUpIcon";
import TrendDownIcon from "@/assets/icons/TrendDownIcon";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/Card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/Chart";

// Calculate percentage change between current and previous week values
const calculatePercentageChange = (salesData) => {
  if (!salesData || !Array.isArray(salesData) || salesData.length === 0) {
    console.error("salesData is missing or not an array", salesData);
    return 0;
  }

  // Calculate totals
  const totalCurrent = salesData.reduce((sum, entry) => sum + (entry.currentWeek || 0), 0);
  const totalPrevious = salesData.reduce((sum, entry) => sum + (entry.previousWeek || 0), 0);

  // Avoid division by zero
  if (totalPrevious === 0) return 0;

  return (((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(2);
};

const SalesChart = ({ chartConfig }) => {
  // Initialize with default chart config if not provided
  const config = chartConfig || {
    currentWeek: { color: "#4CAF50" },
    previousWeek: { color: "#FF9800" }
  };
  
  // State for sales data and date filtering
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6); // Default to last 7 days
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalesData = async (start, end) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:4000/api/sales?startDate=${start}&endDate=${end}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received");
      }
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setError(error.message);
      // Fallback data
      setSalesData([
        { day: "Monday", currentWeek: 500, previousWeek: 400 },
        { day: "Tuesday", currentWeek: 600, previousWeek: 550 },
        { day: "Wednesday", currentWeek: 700, previousWeek: 650 },
        { day: "Thursday", currentWeek: 800, previousWeek: 750 },
        { day: "Friday", currentWeek: 900, previousWeek: 850 },
        { day: "Saturday", currentWeek: 1000, previousWeek: 950 },
        { day: "Sunday", currentWeek: 1100, previousWeek: 1050 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or the date range changes
  useEffect(() => {
    fetchSalesData(startDate, endDate);
  }, [startDate, endDate]);

  const percentageChange = calculatePercentageChange(salesData);
  const isIncrease = percentageChange >= 0;

  // Format the date range for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const dateRangeLabel = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  return (
    <Card className="w-full bg-ash-100 shadow-custom">
      <CardHeader>
        <CardTitle>Weekly Sales Comparison</CardTitle>
        <CardDescription>
          Comparing current week's sales with the previous week
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Date filter controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start Date:
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-1 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm font-medium">
              End Date:
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-1 rounded"
            />
          </div>
        </div>
        
        {error && (
          <div className="p-2 mb-4 bg-red-100 text-red-700 rounded">
            Error: {error}. Showing sample data instead.
          </div>
        )}
        
        <ChartContainer config={config}>
          <div className="relative w-full h-0 pb-[55%]">
            <div className="absolute w-full h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesData}
                    margin={{ left: 8, right: 8, top: 20, bottom: 20 }}
                    style={{ backgroundColor: "#F5F3F0" }}
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
                          stopColor={config.currentWeek.color}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={config.currentWeek.color}
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
                          stopColor={config.previousWeek.color}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={config.previousWeek.color}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="previousWeek"
                      type="monotone"
                      fill="url(#fillPreviousWeek)"
                      fillOpacity={0.4}
                      stroke={config.previousWeek.color}
                      strokeWidth={2}
                    />
                    <Area
                      dataKey="currentWeek"
                      type="monotone"
                      fill="url(#fillCurrentWeek)"
                      fillOpacity={0.4}
                      stroke={config.currentWeek.color}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
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
                  <TrendDownIcon className="h-4 w-4 text-red-500" fill="#ef4444" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-customNeutral-300">
              {dateRangeLabel}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SalesChart;