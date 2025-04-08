import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { Loader } from "@/components/ui/Loader";

// Simple color palette
const COLORS = ["#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0"];

const BeautoxPieChart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expensesData, setExpensesData] = useState([]);

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

  // Custom label renderer for external labels to avoid overlap
  const renderCustomizedLabel = ({
    name,
    percent,
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index
  }) => {
    // Truncate long category names
    const shortenedName =
      name.length > 10 ? `${name.substring(0, 8)}...` : name;
    const RADIAN = Math.PI / 180;

    // Position labels outside the pie chart
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Get the segment's color
    const fill = COLORS[index % COLORS.length];

    // Determine if label should be on left or right side for text anchor
    const textAnchor = x > cx ? "start" : "end";

    return (
      <g>
        {/* Draw line from segment to label */}
        <path
          d={`M${cx + outerRadius * Math.cos(-midAngle * RADIAN)},${
            cy + outerRadius * Math.sin(-midAngle * RADIAN)
          }L${x},${y}`}
          stroke={fill}
          fill="none"
        />
        {/* Draw the text label */}
        <text
          x={x}
          y={y}
          fill={fill}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fontSize="12"
          fontWeight="bold"
        >
          {`${shortenedName}: ${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  return (
    <Card className="w-full h-full shadow-md bg-white">
      <CardHeader className="items-center pb-2">
        <CardTitle>MONTHLY EXPENSES</CardTitle>
        <CardDescription>April 2025</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs mb-4">
            Error loading data: {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 text-gray-400">
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
          <>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  labelLine={true}
                  label={renderCustomizedLabel}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div className="text-center mt-4">
              <div className="text-2xl font-bold">
                {formatCurrency(totalExpenses)}
              </div>
              <div className="text-sm text-gray-500">TOTAL EXPENSES</div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BeautoxPieChart;
