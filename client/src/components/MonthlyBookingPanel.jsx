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
  // Add more categories based on your data
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
  const [debugInfo, setDebugInfo] = useState({});
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

    // Logging for debugging
    console.log("Current date:", currentDate);
    console.log("Filter month:", currentMonth);
    console.log("Filter year:", currentYear);

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
        console.log("API Response received with", response.data.length, "records");

        // Add debugging for first 3 records
        if (response.data.length > 0) {
          console.log("Sample data:", response.data.slice(0, 3));
        }

        // Ensure we're working with an array
        const expenses = Array.isArray(response.data) ? response.data : [];

        // Debug information
        const debugData = {
          totalRecords: expenses.length,
          apiSuccess: true,
          dateSamples: expenses.slice(0, 3).map(e => e.date)
        };

        // Process expenses data
        if (expenses.length > 0) {
          // Group by category for the current month (non-archived only)
          const currentMonthExpenses = expenses.filter((expense) => {
            // More explicit date parsing to avoid timezone issues
            const dateParts = expense.date.split('-');
            const expenseDate = new Date(
              parseInt(dateParts[0]), // year
              parseInt(dateParts[1]) - 1, // month (0-indexed in JS)
              parseInt(dateParts[2]) // day
            );
            
            const match = (
              expenseDate.getMonth() + 1 === currentMonth &&
              expenseDate.getFullYear() === currentYear
            );
            
            // Extensive logging for the first few expenses
            if (expenses.indexOf(expense) < 5) {
              console.log(`Expense ${expenses.indexOf(expense)}: date=${expense.date}, parsed month=${expenseDate.getMonth() + 1}, expected month=${currentMonth}, match=${match}`);
            }
            
            return match;
          });

          console.log(`Found ${currentMonthExpenses.length} expenses for ${currentMonth}/${currentYear}`);
          debugData.currentMonthExpenses = currentMonthExpenses.length;

          // Group by category for the previous month (non-archived only)
          const previousMonthExpenses = expenses.filter((expense) => {
            const dateParts = expense.date.split('-');
            const expenseDate = new Date(
              parseInt(dateParts[0]),
              parseInt(dateParts[1]) - 1,
              parseInt(dateParts[2])
            );
            
            return (
              expenseDate.getMonth() + 1 === previousMonth &&
              expenseDate.getFullYear() === previousYear
            );
          });

          debugData.previousMonthExpenses = previousMonthExpenses.length;

          // Calculate total expenses by category for current month
          const categoryTotals = {};

          currentMonthExpenses.forEach((expense) => {
            const category = expense.category.toLowerCase().replace(/\s+/g, "");
            if (!categoryTotals[category]) {
              categoryTotals[category] = 0;
            }
            categoryTotals[category] += parseFloat(expense.expense);
          });

          debugData.categories = Object.keys(categoryTotals);
          console.log("Category totals:", categoryTotals);

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

          debugData.currentMonthTotal = currentMonthTotal;
          debugData.prevMonthTotal = prevMonthTotal;

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
          
          console.log("Final chart data:", transformedData);
          debugData.transformedDataLength = transformedData.length;

          setChartData(transformedData);
          setTotalExpenses(currentMonthTotal);
          setPastMonthTotal(prevMonthTotal);

          // Calculate trend
          if (prevMonthTotal > 0) {
            const calculatedTrend =
              ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;
            setTrend(calculatedTrend);
            debugData.trend = calculatedTrend;
          }
        }
        
        setDebugInfo(debugData);
      } catch (err) {
        console.error("Error fetching expense data:", err);
        setDebugInfo({
          error: err.message,
          apiSuccess: false
        });
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
              Found {debugInfo.totalRecords || 0} total records but none match current month filter
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Expected month: {monthlyData.currentMonth} {monthlyData.currentYear}
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