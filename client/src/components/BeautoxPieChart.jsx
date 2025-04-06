import React, { useState, useEffect } from "react";
import { PieChart, Pie, Label } from "recharts";
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

// Chart configuration with predefined colors for different categories
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
  },
<<<<<<< HEAD
  testii: {
    label: "Test II",
    color: "#9d71b1"
  },
  rent: {
    label: "Rent",
    color: "#6e4789"
  },
  utilities: {
    label: "Utilities",
    color: "#5d3e75"
  },
  officefurniture: {
    label: "Office Furniture",
    color: "#8a5ca3"
  },
  // Default for any other category
=======
  // Add more color mappings as needed for other categories
>>>>>>> parent of d3f6131 (Update BeautoxPieChart.jsx)
  other: {
    label: "Other",
    color: "#9d71b1"
  }
};

<<<<<<< HEAD
// Custom colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

// Modified to accept expensesData as a prop
const BeautoxPieChart = ({ expensesData = [] }) => {
=======
const BeautoxPieChart = () => {
>>>>>>> parent of d3f6131 (Update BeautoxPieChart.jsx)
  const [chartData, setChartData] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trend, setTrend] = useState(null);
  const [pastMonthTotal, setPastMonthTotal] = useState(0);

  // Get the current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear(); // YYYY

  // Get the previous month
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  useEffect(() => {
<<<<<<< HEAD
    // Get the current date for filtering
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear(); // YYYY

    // Get the previous month
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    console.log("Current filter date:", currentDate);
    console.log("Current month:", currentMonth, "Current year:", currentYear);

    // Set the month and year for display
    setMonthlyData({
      currentMonth: new Date(currentYear, currentMonth - 1).toLocaleString("default", {
        month: "long"
      }),
      currentYear
    });

    // Process expenses data
    const processData = () => {
      setLoading(true);
=======
    // Fetch expenses data from the server
    const fetchExpenses = async () => {
>>>>>>> parent of d3f6131 (Update BeautoxPieChart.jsx)
      try {
        // Use the passed expensesData prop instead of fetching
        console.log(`Processing ${expensesData.length} expenses`);

        if (expensesData.length > 0) {
          // Group by category for the current month
          const currentMonthExpenses = expensesData.filter((expense) => {
            try {
              // Safely parse the date
              const dateParts = expense.date.split('-');
              if (dateParts.length !== 3) {
                return false;
              }

<<<<<<< HEAD
              const expenseDate = new Date(
                parseInt(dateParts[0]), // year
                parseInt(dateParts[1]) - 1, // month (0-indexed in JS)
                parseInt(dateParts[2]) // day
              );
              
              return (
                expenseDate.getMonth() + 1 === currentMonth &&
                expenseDate.getFullYear() === currentYear
              );
            } catch (err) {
              return false;
            }
          });

          console.log(`Found ${currentMonthExpenses.length} expenses for ${currentMonth}/${currentYear}`);

          // Group by category for the previous month
          const previousMonthExpenses = expensesData.filter((expense) => {
            try {
              const dateParts = expense.date.split('-');
              if (dateParts.length !== 3) return false;
              
              const expenseDate = new Date(
                parseInt(dateParts[0]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[2])
              );
              
              return (
                expenseDate.getMonth() + 1 === previousMonth &&
                expenseDate.getFullYear() === previousYear
              );
            } catch (err) {
              return false;
            }
=======
        // Process expenses data
        if (expenses.length > 0) {
          // Group by category for the current month
          const currentMonthExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return (
              expenseDate.getMonth() + 1 === currentMonth &&
              expenseDate.getFullYear() === currentYear
            );
          });

          // Group by category for the previous month
          const previousMonthExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return (
              expenseDate.getMonth() + 1 === previousMonth &&
              expenseDate.getFullYear() === previousYear
            );
>>>>>>> parent of d3f6131 (Update BeautoxPieChart.jsx)
          });

          // Calculate total expenses by category for current month
          const categoryTotals = {};

          currentMonthExpenses.forEach((expense) => {
            if (!expense.category) {
              return;
            }
            
            const category = expense.category.toLowerCase().replace(/\s+/g, "");
            if (!categoryTotals[category]) {
              categoryTotals[category] = 0;
            }
            
            // Make sure expense is a number
            const expenseValue = parseFloat(expense.expense);
            if (!isNaN(expenseValue)) {
              categoryTotals[category] += expenseValue;
            }
          });

          console.log("Category totals:", categoryTotals);

          // Calculate total expenses for current month
          const currentMonthTotal = currentMonthExpenses.reduce(
            (sum, expense) => {
              const expenseValue = parseFloat(expense.expense);
              return !isNaN(expenseValue) ? sum + expenseValue : sum;
            },
            0
          );

          // Calculate total expenses for previous month
          const prevMonthTotal = previousMonthExpenses.reduce(
            (sum, expense) => {
              const expenseValue = parseFloat(expense.expense);
              return !isNaN(expenseValue) ? sum + expenseValue : sum;
            },
            0
          );

<<<<<<< HEAD
          // Transform data for recharts - using a safer pattern
          const transformedData = [];
          
          Object.keys(categoryTotals).forEach((key, index) => {
=======
          // Transform data for recharts
          const transformedData = Object.keys(categoryTotals).map((key) => {
>>>>>>> parent of d3f6131 (Update BeautoxPieChart.jsx)
            // Find the known category or use the original key
            const categoryKey =
              Object.keys(chartConfig).find(
                (configKey) => configKey.toLowerCase() === key.toLowerCase()
              ) || key;

            const categoryConfig = chartConfig[categoryKey] || {
              label: key.charAt(0).toUpperCase() + key.slice(1),
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
            };

<<<<<<< HEAD
            transformedData.push({
              category: categoryConfig.label || key.charAt(0).toUpperCase() + key.slice(1),
              value: categoryTotals[key],
              fill: fillColor
            });
          });

          // Sort data by value (largest to smallest) for better visualization
          transformedData.sort((a, b) => b.value - a.value);
          
          console.log("Final chart data:", transformedData);

=======
            return {
              category: categoryConfig.label,
              value: categoryTotals[key],
              fill: categoryConfig.color
            };
          });

>>>>>>> parent of d3f6131 (Update BeautoxPieChart.jsx)
          setChartData(transformedData);
          setTotalExpenses(currentMonthTotal);
          setPastMonthTotal(prevMonthTotal);

          // Calculate trend
          if (prevMonthTotal > 0) {
            const calculatedTrend =
              ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;
            setTrend(calculatedTrend);
          }
        } else {
          // No data - set empty chart
          setChartData([]);
          setTotalExpenses(0);
          console.log("No expense data found");
        }
      } catch (err) {
        console.error("Error processing expense data:", err);
        setError("Failed to process expense data. Please try again later.");
        setChartData([]);  // Ensure chartData is an empty array, not undefined
      } finally {
        setLoading(false);
      }
    };

<<<<<<< HEAD
    processData();
  }, [expensesData]); // Process data whenever expensesData changes
=======
    fetchExpenses();
  }, [currentMonth, currentYear, previousMonth, previousYear]);
>>>>>>> parent of d3f6131 (Update BeautoxPieChart.jsx)

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

  // Add fallback if chart data is empty or not an array
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <Card className="w-full h-full shadow-custom bg-ash-100">
        <CardHeader className="items-center pb-2">
          <CardTitle>MONTHLY EXPENSES</CardTitle>
          <CardDescription>Expense Breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-64 text-muted-foreground">
          <p className="mb-2">No expense data available for this month</p>
          <p className="text-sm text-gray-500">
            Try adding expenses with "archived = false" to see them on this chart
          </p>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Showing expenses for {monthlyData.currentMonth} {monthlyData.currentYear}
        </CardFooter>
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
<<<<<<< HEAD
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
=======
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
                <Label
                  content={({ viewBox }) =>
                    viewBox && (
                      <text
>>>>>>> parent of d3f6131 (Update BeautoxPieChart.jsx)
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-bold"
                        data-cy="total-expenses"
                      >
<<<<<<< HEAD
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
=======
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
            className="flex justify-center items-center h-64 text-muted-foreground"
            data-cy="no-data-message"
          >
            No expense data available for this month
          </div>
        )}
>>>>>>> parent of d3f6131 (Update BeautoxPieChart.jsx)
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm" data-cy="card-footer">
        {trend !== null && (
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
          Showing total expenses for{" "}
          {new Date(currentYear, currentMonth - 1).toLocaleString("default", {
            month: "long"
          })}{" "}
          {currentYear}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BeautoxPieChart;
