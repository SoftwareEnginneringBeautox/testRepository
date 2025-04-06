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

// Simplified color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const BeautoxPieChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trend, setTrend] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [rawResponse, setRawResponse] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        console.log("Fetching expenses data...");
        
        // Record API request start time
        const startTime = new Date().getTime();
        
        // Make request with detailed error handling
        let response;
        try {
          // Use the new API endpoint with /api prefix
          // Add a cache-busting parameter to avoid any caching issues
          response = await axios.get(`/api/expenses?_cb=${Date.now()}`, {
            // Set a longer timeout
            timeout: 10000,
            // Add headers to help with debugging
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          
          // Record response time
          const endTime = new Date().getTime();
          console.log(`API response received in ${endTime - startTime}ms`);
          
          // Store the raw response for debugging
          setRawResponse(response);
          
          console.log("API Response status:", response.status);
          console.log("API Response headers:", response.headers);
          
          if (response.data) {
            console.log("API Response has data property");
            console.log("API Response data type:", typeof response.data);
            
            if (Array.isArray(response.data)) {
              console.log("API Response data is an array with length:", response.data.length);
              
              if (response.data.length > 0) {
                console.log("First item in array:", response.data[0]);
                console.log("Sample data:", response.data.slice(0, 3));
              } else {
                console.log("Array is empty");
              }
            } else {
              console.log("API Response data is not an array:", response.data);
            }
          } else {
            console.log("API Response has no data property");
          }
        } catch (axiosError) {
          console.error("Axios error details:", {
            message: axiosError.message,
            code: axiosError.code,
            response: axiosError.response ? {
              status: axiosError.response.status,
              statusText: axiosError.response.statusText,
              headers: axiosError.response.headers,
              data: axiosError.response.data
            } : 'No response',
            request: axiosError.request ? 'Request was made but no response received' : 'No request'
          });
          throw axiosError;
        }
        
        // Ensure we're working with an array
        const expenses = Array.isArray(response.data) ? response.data : [];
        
        console.log(`Processing ${expenses.length} expenses`);
        
        // Get current date for filtering
        const now = new Date();
        const currentMonth = 4;  // HARDCODED to April
        const currentYear = 2025; // HARDCODED to 2025
        
        console.log(`Filtering for month: ${currentMonth}, year: ${currentYear}`);
        
        // Filter current month expenses
        const currentMonthExpenses = expenses.filter(expense => {
          // Detailed logging for each expense
          console.log(`Checking expense:`, expense);
          
          if (!expense.date) {
            console.log(`- No date field for expense ID: ${expense.id}`);
            return false;
          }
          
          // Parse date from string (format: YYYY-MM-DD)
          const dateParts = expense.date.split('-');
          if (dateParts.length !== 3) {
            console.log(`- Invalid date format: ${expense.date}`);
            return false;
          }
          
          const expenseYear = parseInt(dateParts[0], 10);
          const expenseMonth = parseInt(dateParts[1], 10);
          
          const isCurrentMonth = expenseMonth === currentMonth && expenseYear === currentYear;
          console.log(`- Date: ${expense.date}, Month: ${expenseMonth}, Year: ${expenseYear}, Match: ${isCurrentMonth}`);
          
          return isCurrentMonth;
        });
        
        console.log(`Found ${currentMonthExpenses.length} expenses for ${currentMonth}/${currentYear}`);
        
        if (currentMonthExpenses.length === 0) {
          console.log("No expenses found for the current month and year");
          setChartData([]);
          setTotalExpenses(0);
          setDebugInfo({
            totalRecords: expenses.length,
            currentMonthRecords: 0,
            filterMonth: currentMonth,
            filterYear: currentYear,
            sampleDates: expenses.slice(0, 5).map(e => e.date)
          });
          return;
        }
        
        // Group expenses by category
        const categoryTotals = {};
        
        currentMonthExpenses.forEach(expense => {
          if (!expense.category) {
            console.log(`Expense ID ${expense.id} has no category`);
            return;
          }
          
          if (!expense.expense || isNaN(parseFloat(expense.expense))) {
            console.log(`Expense ID ${expense.id} has invalid expense amount: ${expense.expense}`);
            return;
          }
          
          const category = expense.category.toLowerCase().replace(/\s+/g, "");
          if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
          }
          
          categoryTotals[category] += parseFloat(expense.expense);
        });
        
        console.log("Category totals:", categoryTotals);
        
        // Create chart data
        const chartData = Object.keys(categoryTotals).map((category, index) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          value: categoryTotals[category],
          fill: COLORS[index % COLORS.length]
        }));
        
        // Sort by value (descending)
        chartData.sort((a, b) => b.value - a.value);
        
        console.log("Final chart data:", chartData);
        
        const totalExpenses = currentMonthExpenses.reduce(
          (sum, expense) => sum + parseFloat(expense.expense || 0), 
          0
        );
        
        setChartData(chartData);
        setTotalExpenses(totalExpenses);
        setDebugInfo({
          totalRecords: expenses.length,
          currentMonthRecords: currentMonthExpenses.length,
          categoriesFound: Object.keys(categoryTotals).length,
          totalExpensesCalculated: totalExpenses
        });
        
      } catch (err) {
        console.error("Error in fetchExpenses:", err);
        setError(`${err.message}. Please check console for details.`);
        setDebugInfo({
          error: err.message,
          stack: err.stack
        });
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
        <CardContent className="flex flex-col justify-center items-center h-64">
          <div className="text-error-500 mb-4">{error}</div>
          <div className="text-xs bg-gray-100 p-3 rounded w-full max-w-xs overflow-auto">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full shadow-custom bg-ash-100">
      <CardHeader className="items-center pb-2">
        <CardTitle>MONTHLY EXPENSES</CardTitle>
        <CardDescription>Breakdown of Expenses By Category</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {chartData.length > 0 ? (
          <ChartContainer className="aspect-square w-full max-w-xs mx-auto">
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }} width={300} height={300}>
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
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
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
          <div className="flex flex-col justify-center items-center h-64 text-muted-foreground">
            <p className="mb-2">No expense data available for April 2025</p>
            <div className="text-xs bg-gray-100 p-3 rounded w-full max-w-xs overflow-auto">
              <p className="font-bold">Debug Info:</p>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing expenses for April 2025
        </div>
      </CardFooter>
    </Card>
  );
};

export default BeautoxPieChart;