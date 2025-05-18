"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import TrendUpIcon from "@/assets/icons/TrendUpIcon";
import TrendDownIcon from "@/assets/icons/TrendDownIcon";
import { Loader } from "@/components/ui/Loader";
import { cn } from "@/lib/utils";

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
import {
  InputContainer,
  InputLabel,
  InputIcon,
  InputTextField,
  Input
} from "./ui/Input";

import CalendarIcon from "@/assets/icons/CalendarIcon";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Calculate percentage change between current and previous week values
const calculatePercentageChange = (salesData) => {
  // Add better validation
  if (!salesData || !Array.isArray(salesData)) {
    console.warn("Invalid sales data provided to calculatePercentageChange");
    return 0;
  }

  // Ensure we have data to calculate
  if (salesData.length === 0) {
    console.warn("Empty sales data array");
    return 0;
  }

  const totalCurrent = salesData.reduce(
    (sum, entry) => sum + (Number(entry.currentWeek) || 0),
    0
  );
  const totalPrevious = salesData.reduce(
    (sum, entry) => sum + (Number(entry.previousWeek) || 0),
    0
  );

  if (totalPrevious === 0) return 0;
  return (((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(2);
};

const SalesChart = ({
  chartConfig,
  financialData: externalFinancialData,
  isFinancialOverview = false // Prop to check if the component is used in FinancialOverview
}) => {
  const { theme } = useTheme();
  // Move state declarations to the top
  const [salesData, setSalesData] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 6);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState({
    totalSales: 0,
    totalExpenses: 0,
    netIncome: 0
  });
  const [financialLoading, setFinancialLoading] = useState(
    !externalFinancialData
  );

  useEffect(() => {
    const fetchSalesData = async (start, end) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/sales?startDate=${start}&endDate=${end}`
        );
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
        setSalesData([]);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchSalesData(startDate, endDate);
    }
  }, [startDate, endDate]);

  // Initialize with default chart config if not provided
  const config = chartConfig || {
    currentWeek: { color: "#4CAF50" },
    previousWeek: { color: theme === "dark" ? "#F0D6F6" : "#FF9800" }
  };

  const [financialError, setFinancialError] = useState(null);

  // If external financial data is provided, use it
  useEffect(() => {
    if (externalFinancialData) {
      setFinancialData(externalFinancialData);
      setFinancialLoading(false);
    }
  }, [externalFinancialData]);

  // Fetch financial data if none is provided and we're showing the financial footer
  useEffect(() => {
    if (!externalFinancialData && !isFinancialOverview) {
      const fetchFinancialData = async () => {
        setFinancialLoading(true);
        setFinancialError(null);
        try {
          const response = await fetch(`${API_BASE_URL}/financial-overview`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setFinancialData({
            totalSales: data.totalSales || 0,
            totalExpenses: data.totalExpenses || 0,
            netIncome: data.netIncome || 0
          });
        } catch (error) {
          console.error("Error fetching financial data:", error);
          setFinancialError(error.message);
        } finally {
          setFinancialLoading(false);
        }
      };

      fetchFinancialData();
    }
    
  }, [externalFinancialData, isFinancialOverview]);

  const fetchSalesData = async (start, end) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/sales?startDate=${start}&endDate=${end}`
      );
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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const dateRangeLabel = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  return (
    <Card
      className="w-full bg-ash-100 shadow-custom"
      data-cy="sales-chart-card"
    >
      <CardHeader data-cy="card-header">
        <CardTitle data-cy="card-title">Weekly Sales Comparison</CardTitle>
        <CardDescription data-cy="card-description">
          Comparing current week's sales with the previous week
        </CardDescription>
      </CardHeader>
      <CardContent data-cy="card-content">
        {/* Date filter controls */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4"
          data-cy="date-filter-controls"
        >
          <InputContainer data-cy="start-date-control">
            <InputLabel
              className="text-sm font-medium"
              data-cy="start-date-label"
            >
              Set Start Date:
            </InputLabel>
            <InputTextField>
              <InputIcon>
                <CalendarIcon />
              </InputIcon>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-cy="start-date-input"
              />
            </InputTextField>
          </InputContainer>

          <InputContainer data-cy="end-date-control">
            <InputLabel
              htmlFor="endDate"
              className="text-sm font-medium"
              data-cy="end-date-label"
            >
              Set End Date:
            </InputLabel>
            <InputTextField>
              <InputIcon>
                <CalendarIcon />
              </InputIcon>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-cy="end-date-input"
              />
            </InputTextField>
          </InputContainer>
        </div>

        {error && (
          <div
            className="p-2 mb-4 bg-red-100 text-error-400 rounded"
            data-cy="error-message"
          >
            Error: {error}. Showing sample data instead.
          </div>
        )}

        <ChartContainer config={config} data-cy="chart-container">
          <div className="relative w-full h-0 pb-[55%]" data-cy="chart-wrapper">
            <div className="absolute w-full h-full">
              {loading ? (
                <div
                  className="flex items-center justify-center h-full"
                  data-cy="loading-indicator"
                >
                  <Loader />
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  data-cy="responsive-container"
                >
                  <AreaChart
                    data={salesData}
                    margin={{ left: 8, right: 8, top: 20, bottom: 20 }}
                    style={{
                      backgroundColor: "bg-ash-100 dark:bg-transparent"
                    }}
                    data-cy="area-chart"
                  >
                    <CartesianGrid
                      vertical={false}
                      stroke="#AAAAAA"
                      data-cy="cartesian-grid"
                    />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      data-cy="x-axis"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `₱${value}`}
                      domain={["dataMin - 100", "dataMax + 100"]}
                      data-cy="y-axis"
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                      data-cy="chart-tooltip"
                    />
                    <defs>
                      <linearGradient
                        id="fillCurrentWeek"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                        data-cy="gradient-current-week"
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
                        data-cy="gradient-previous-week"
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
                      data-cy="area-previous-week"
                    />
                    <Area
                      dataKey="currentWeek"
                      type="monotone"
                      fill="url(#fillCurrentWeek)"
                      fillOpacity={0.4}
                      stroke={config.currentWeek.color}
                      strokeWidth={2}
                      data-cy="area-current-week"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter data-cy="card-footer" className="flex flex-col gap-4">
        <div
          className="flex flex-col w-full items-start gap-2 text-sm"
          data-cy="footer-content"
        >
          <div className="grid gap-2">
            <div
              className="flex items-center gap-2 font-medium leading-none"
              data-cy="trend-info"
            >
              {isIncrease ? (
                <>
                  Current week up by {percentageChange}%
                  <TrendUpIcon
                    className="h-4 w-4"
                    fill="#4CAF50"
                    data-cy="trend-up-icon"
                  />
                </>
              ) : (
                <>
                  Current week down by {Math.abs(percentageChange)}%
                  <TrendDownIcon
                    className="h-4 w-4 error-400"
                    fill="#E74C3C"
                    data-cy="trend-down-icon"
                  />
                </>
              )}
            </div>
            <div
              className="flex items-center gap-2 leading-none text-customNeutral-400 dark:text-customNeutral-200"
              data-cy="date-range-label"
            >
              {dateRangeLabel}
            </div>
          </div>
        </div>
        {/* Show summary only when NOT in FinancialOverview */}
        {!isFinancialOverview && (
          <div
            className="w-full flex flex-row items-center justify-around gap-4 mt-3"
            data-cy="total-profit-container"
          >
            {financialLoading ? (
              <div className="w-full flex justify-center py-6">
                <Loader />
              </div>
            ) : financialError ? (
              <div className="w-full p-2 bg-red-100 text-error-400 rounded">
                Error loading financial data: {financialError}
              </div>
            ) : (
              <>
                <div
                  className="h-full flex-1 w-1/3 flex flex-col p-4 py-5 gap-2 bg-ash-200/50 dark:bg-customNeutral-400 rounded-lg"
                  data-cy="total-sales"
                >
                  <span className="font-semibold text-xs text-customNeutral-400 dark:text-customNeutral-200">
                    TOTAL SALES
                  </span>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold dark:text-customNeutral-100">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP"
                    }).format(financialData.totalSales)}
                  </p>
                </div>
                <div
                  className="h-full flex-1 w-1/3 flex flex-col p-4 py-5 gap-2 bg-ash-200/50 dark:bg-customNeutral-400 rounded-lg"
                  data-cy="total-expenses"
                >
                  <span className="font-semibold text-xs text-customNeutral-400 dark:text-customNeutral-200">
                    TOTAL EXPENSES
                  </span>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold dark:text-customNeutral-100">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP"
                    }).format(financialData.totalExpenses)}
                  </p>
                </div>
                <div
                  className="h-full flex-1 w-1/3 flex flex-col p-4 py-5 gap-2 bg-ash-200/50 dark:bg-customNeutral-400 rounded-lg"
                  data-cy="total-profit-loss"
                >
                  <span className="font-semibold text-xs text-customNeutral-400 dark:text-customNeutral-200">
                    {financialData.netIncome >= 0
                      ? "TOTAL PROFIT"
                      : "TOTAL LOSS"}
                  </span>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold",
                        financialData.netIncome >= 0
                          ? "text-success-500 dark:text-success-400"
                          : "text-error-500 dark:text-error-400"
                      )}
                    >
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP"
                      }).format(Math.abs(financialData.netIncome))}
                    </p>
                    {financialData.netIncome >= 0 ? (
                      <TrendUpIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-success-500 dark:text-success-400" />
                    ) : (
                      <TrendDownIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-error-500 dark:text-error-400" />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SalesChart;
