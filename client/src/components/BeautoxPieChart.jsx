import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Label } from "recharts";
import axios from "axios";
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

// Updated chart configuration with your actual expense categories
const chartConfig = {
  salary: {
    label: "Salary",
    color: "#100524"
  },
  monthlypurchaseorder: {
    label: "Monthly Purchase Order",
    color: "#17082C"
  },
  businessphone: {
    label: "Business Phone",
    color: "#210D36"
  },
  internet: {
    label: "Internet",
    color: "#381B4C"
  },
  edittest1: {
    label: "Edit Test 1",
    color: "#7A4C93"
  },
  testii: {
    label: "Test II",
    color: "#9d71b1"
  },
  // Default for any other category
  other: {
    label: "Other",
    color: "#b794dc"
  }
};

// Custom colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const BeautoxPieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trend, setTrend] = useState(null);
  const [pastMonthTotal, setPastMonthTotal] = useState(0);
  const [monthlyData, setMonthlyData] = useState({
    currentMonth: "",
    currentYear: ""
  });

  useEffect(() => {
    // Get the current date for filtering
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear(); // YYYY

    // Get the previous month
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Set the month and year for display
    setMonthlyData({
      currentMonth: new Date(currentYear, currentMonth - 1).toLocaleString("default", {
        month: "long"
      }),
      currentYear
    });

    // Fetch expenses data from the server
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        console.log("Fetching expenses data...");
        const response = await axios.get("/expenses");
        console.log("API Response:", response);

        // Ensure we're working with an array
        const expenses = Array.isArray(response.data) ? response.data : [];

        // Process expenses data
        if (expenses.length > 0) {
          // Group by category for the current month (non-archived only)
          const currentMonthExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return (
              expenseDate.getMonth() + 1 === currentMonth &&
              expenseDate.getFullYear() === currentYear
            );
          });

          // Group by category for the previous month (non-archived only)
          const previousMonthExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return (
              expenseDate.getMonth() + 1 === previousMonth &&
              expenseDate.getFullYear() === previousYear
            );
          });

          // Calculate total expenses by category for current month
          const categoryTotals = {};

          currentMonthExpenses.forEach((expense) => {
            const category = expense.category.toLowerCase().replace(/\s+/g, "");
            if (!categoryTotals[category]) {
              categoryTotals[category] = 0;
            }
            categoryTotals[category] += parseFloat(expense.expense);
          });

          // Calculate total expenses for current month
          const currentMonthTotal = currentMonthExpenses.reduce(
            (sum, expense) => sum + parseFloat(expense.expense),
            0
          );

          // Calculate total expenses for previous month
          const prevMonthTotal = previousMonthExpenses.reduce(
            (sum, expense) => sum + parseFloat(expense.expense),
            0
          );

          // Transform data for recharts
          const transformedData = Object.keys(categoryTotals).map((key, index) => {
            // Find the known category or use the original key
            const categoryKey =
              Object.keys(chartConfig).find(
                (configKey) => configKey.toLowerCase() === key.toLowerCase()
              ) || "other";

            const categoryConfig = chartConfig[categoryKey] || chartConfig.other;
            
            // Use either the config color or a color from the COLORS array
            const fillColor = categoryConfig.color || COLORS[index % COLORS.length];

            return {
              category: categoryConfig.label || key.charAt(0).toUpperCase() + key.slice(1),
              value: categoryTotals[key],
              fill: fillColor
            };
          });

          // Sort data by value (largest to smallest) for better visualization
          transformedData.sort((a, b) => b.value - a.value);

          setChartData(transformedData);
          setTotalExpenses(currentMonthTotal);
          setPastMonthTotal(prevMonthTotal);

          // Calculate trend
          if (prevMonthTotal > 0) {
            const calculatedTrend =
              ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;
            setTrend(calculatedTrend);
          }
        }
      } catch (err) {
        console.error("Error fetching expense data:", err);
        setError("Failed to load expense data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <Card className="w-full h-full shadow-custom bg-ash-100">
        <CardHeader className="items-center pb-2">
          <CardTitle>MONTHLY EXPENSES</CardTitle>
          <CardDescription>Loading expense data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full shadow-custom bg-ash-100">
        <CardHeader className="items-center pb-2">
          <CardTitle>MONTHLY EXPENSES</CardTitle>
          <CardDescription>Error Loading Data</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64 text-error-500">
          {error}
        </CardContent>
      </Card>
    );
  }

  const isTrendingUp = trend > 0;

  return (
    <Card
      className="w-full h-full shadow-custom bg-ash-100"
      data-cy="beautox-pie-chart-card"
    >
      <CardHeader className="items-center pb-2" data-cy="card-header">
        <CardTitle data-cy="card-title">MONTHLY EXPENSES</CardTitle>
        <CardDescription data-cy="card-description">
          Breakdown of Expenses By Category
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0" data-cy="card-content">
        {chartData.length > 0 ? (
          <ChartContainer
            className="aspect-square w-full max-w-xs mx-auto"
            config={chartConfig}
            data-cy="chart-container"
          >
            <PieChart
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              width={300}
              height={300}
              data-cy="pie-chart"
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                data-cy="chart-tooltip"
              />
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
                data-cy="pie"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill} 
                  />
                ))}
                <Label
                  content={({ viewBox }) =>
                    viewBox && (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        data-cy="pie-label"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                          data-cy="total-expenses"
                        >
                          ₱
                          {totalExpenses.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 20}
                          className="fill-muted-foreground text-sm"
                          data-cy="total-expenses-label"
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
        ) : (
          <div
            className="flex flex-col justify-center items-center h-64 text-muted-foreground"
            data-cy="no-data-message"
          >
            <p className="mb-2">No expense data available for this month</p>
            <p className="text-sm text-gray-500">
              Try adding expenses with "archived = false" to see them on this chart
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm" data-cy="card-footer">
        {trend !== null && chartData.length > 0 && (
          <div
            className="flex items-center gap-2 font-medium leading-none"
            data-cy="trend-info"
          >
            {isTrendingUp ? (
              <>
                Trending up by {trend.toFixed(1)}%
                <TrendUpIcon
                  className="text-success-400"
                  data-cy="trend-up-icon"
                />{" "}
                this month compared to last month
              </>
            ) : (
              <>
                Trending down by {Math.abs(trend).toFixed(1)}%
                <TrendDownIcon
                  className="text-error-400"
                  data-cy="trend-down-icon"
                />{" "}
                this month compared to last month
              </>
            )}
          </div>
        )}
        <div
          className="leading-none text-muted-foreground"
          data-cy="footer-info"
        >
          Showing expenses for{" "}
          {monthlyData.currentMonth}{" "}
          {monthlyData.currentYear}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BeautoxPieChart;