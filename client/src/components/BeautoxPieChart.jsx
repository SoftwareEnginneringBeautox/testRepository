import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

// Simple color palette
const COLORS = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];

// Demo data - only shown if API fails
const DEMO_DATA = [
  { name: "Office Supplies", value: 15000 },
  { name: "Utilities", value: 32000 },
  { name: "Rent", value: 45000 },
  { name: "Salaries", value: 83000 },
  { name: "Marketing", value: 27500 },
  // Example row with null data - will be ignored:
  { name: null, value: 10000 }
];

const MinimalExpensesChart = () => {
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
        const response = await fetch(`http://localhost:4000/api/expenses-by-month?month=${currentMonth}&year=${currentYear}`);
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched expenses data:", data);
        
        if (data.success && data.expenses && data.expenses.length > 0) {
          // Group expenses by category
          const categorySums = {};
          
          data.expenses.forEach(expense => {
            if (expense.category && expense.expense) {
              if (!categorySums[expense.category]) {
                categorySums[expense.category] = 0;
              }
              categorySums[expense.category] += parseFloat(expense.expense);
            }
          });
          
          // Convert to array format for the chart
          const chartData = Object.keys(categorySums).map(category => ({
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
        // Fall back to demo data on error
        setExpensesData(DEMO_DATA);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, []);
  
  // Filter out rows with null for critical data fields
  const filteredData = (expensesData.length > 0 ? expensesData : DEMO_DATA)
    .filter(item => item.name !== null && item.value !== null);

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
  
  return (
    <Card className="w-full h-full shadow-md bg-white">
      <CardHeader className="items-center pb-2">
        <CardTitle>MONTHLY EXPENSES</CardTitle>
        <CardDescription>
          April 2025
          {expensesData.length === 0 && <span className="text-amber-500 ml-2">(Demo Data)</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading expenses data...</p>
          </div>
        ) : error ? (
          <div className="px-3 py-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs mb-4">
            Error loading data: {error}. Showing demo data instead.
          </div>
        ) : expensesData.length === 0 ? (
          <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-xs mb-4">
            This is a demo visualization while API issues are being resolved.
          </div>
        ) : null}
        
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
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
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
          <div className="text-sm text-gray-500">
            TOTAL EXPENSES
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalExpensesChart;