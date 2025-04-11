import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import { useTheme } from "./ThemeProvider";
import { Loader } from "@/components/ui/Loader";

const BeautoxPieChart = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expensesData, setExpensesData] = useState([]);

  // Dynamic color palettes based on theme
  const LIGHT_COLORS = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0"];
  const DARK_COLORS = ["#80b1ff", "#9b72ff", "#cf8eff", "#ff9ed2", "#8df3ff"];

  // Select color palette based on theme
  const COLORS = theme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  // Fetch expenses data when component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        // Get the current month (April 2025)
        const currentMonth = 4; // April
        const currentYear = 2025;

        // Use the expenses-by-month endpoint with month and year filtering
        const response = await fetch(
          `http://localhost:4000/api/expenses-by-month?month=${currentMonth}&year=${currentYear}`
        );

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched expenses data:", data);

        if (data.success && data.expenses && data.expenses.length > 0) {
          // Group expenses by category
          const categorySums = {};

          data.expenses.forEach((expense) => {
            if (expense.category && expense.expense) {
              if (!categorySums[expense.category]) {
                categorySums[expense.category] = 0;
              }
              categorySums[expense.category] += parseFloat(expense.expense);
            }
          });

          // Convert to array format for the chart
          const chartData = Object.keys(categorySums).map((category) => ({
            name: category,
            value: categorySums[category]
          }));

          setExpensesData(chartData);
        } else {
          throw new Error("No expense data available");
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError(err.message);
        // Set empty data instead of using demo data
        setExpensesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Filter out rows with null for critical data fields
  const filteredData = expensesData.filter(
    (item) => item.name !== null && item.value !== null
  );

  // Process the filtered data to include color fill
  const chartData = filteredData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  // Calculate total from the filtered chart data
  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  // Format currency
  const formatCurrency = (value) => {
    return `₱${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Custom tooltip for displaying data on hover
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="text-base p-4 rounded-lg dark:bg-customNeutral-500 dark:text-customNeutral-100 bg-ash-100 border border-customNeutral-200 dark:border-customNeutral-300">
          <p className="font-semibold">{data.name}</p>
          <div className="flex flex-row justify-between items-center gap-4">
            <p>{formatCurrency(data.value)}</p>
            <p>{((data.value / totalExpenses) * 100).toFixed(1)}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend formatter to include percentages
  const renderLegendText = (value, entry) => {
    const item = chartData.find((d) => d.name === value);
    const percentage = item
      ? ((item.value / totalExpenses) * 100).toFixed(0)
      : 0;

    return (
      <span className="dark:text-customNeutral-100 font-semibold">
        {value} ({percentage}%)
      </span>
    );
  };

  return (
    <Card
      className={`w-full h-full shadow-custom bg-ash-100 dark:bg-customNeutral-500 dark:text-customNeutral-100 flex flex-col items-center justify-evenly`}
    >
      <CardHeader className="items-center pb-2">
        <CardTitle className="dark:text-customNeutral-100 ">
          MONTHLY EXPENSES
        </CardTitle>
        <CardDescription className="dark:text-customNeutral-100">
          April 2025
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 w-full flex-1 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div
            className={`px-3 py-2 ${
              theme === "dark"
                ? "bg-red-900 border-red-700 text-red-200"
                : "bg-red-50 border-error-200 text-error-400"
            } border rounded text-xs mb-4`}
          >
            Error loading data: {error}
          </div>
        ) : chartData.length === 0 ? (
          <div
            className={`flex flex-col justify-center items-center h-64 ${
              theme === "dark" ? "text-gray-400" : "text-gray-400"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <p className="mt-4 text-lg font-medium">No expense data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={renderLegendText}
                wrapperStyle={{ paddingBottom: "20px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-center mt-4">
          <div className="text-2xl font-bold ">
            {formatCurrency(totalExpenses)}
          </div>
          <div className="text-sm bg-transparent">TOTAL EXPENSES</div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BeautoxPieChart;
