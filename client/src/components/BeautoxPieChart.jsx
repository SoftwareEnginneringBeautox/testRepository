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
  // Add more color mappings as needed for other categories
  other: {
    label: "Other",
    color: "#9d71b1"
  }
};

const BeautoxPieChart = () => {
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
          // Group by category for the current month
          const currentMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() + 1 === currentMonth && 
                   expenseDate.getFullYear() === currentYear;
          });

          // Group by category for the previous month
          const previousMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() + 1 === previousMonth && 
                   expenseDate.getFullYear() === previousYear;
          });

          // Calculate total expenses by category for current month
          const categoryTotals = {};
          
          currentMonthExpenses.forEach(expense => {
            const category = expense.category.toLowerCase().replace(/\s+/g, '');
            if (!categoryTotals[category]) {
              categoryTotals[category] = 0;
            }
            categoryTotals[category] += parseFloat(expense.expense);
          });

          // Calculate total expenses for current month
          const currentMonthTotal = currentMonthExpenses.reduce(
            (sum, expense) => sum + parseFloat(expense.expense), 0
          );
          
          // Calculate total expenses for previous month
          const prevMonthTotal = previousMonthExpenses.reduce(
            (sum, expense) => sum + parseFloat(expense.expense), 0
          );
          
          // Transform data for recharts
          const transformedData = Object.keys(categoryTotals).map(key => {
            // Find the known category or use the original key
            const categoryKey = Object.keys(chartConfig).find(
              configKey => configKey.toLowerCase() === key.toLowerCase()
            ) || key;
            
            const categoryConfig = chartConfig[categoryKey] || {
              label: key.charAt(0).toUpperCase() + key.slice(1),
              color: `#${Math.floor(Math.random()*16777215).toString(16)}`
            };
            
            return {
              category: categoryConfig.label,
              value: categoryTotals[key],
              fill: categoryConfig.color
            };
          });

          setChartData(transformedData);
          setTotalExpenses(currentMonthTotal);
          setPastMonthTotal(prevMonthTotal);
          
          // Calculate trend
          if (prevMonthTotal > 0) {
            const calculatedTrend = ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;
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
  }, [currentMonth, currentYear, previousMonth, previousYear]);

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
    <Card className="w-full h-full shadow-custom bg-ash-100">
      <CardHeader className="items-center pb-2">
        <CardTitle>MONTHLY EXPENSES</CardTitle>
        <CardDescription>Breakdown of Expenses By Category</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {chartData.length > 0 ? (
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
                          ₱{totalExpenses.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
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
        ) : (
          <div className="flex justify-center items-center h-64 text-muted-foreground">
            No expense data available for this month
          </div>
        )}
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
          Showing total expenses for {new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' })} {currentYear}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BeautoxPieChart;