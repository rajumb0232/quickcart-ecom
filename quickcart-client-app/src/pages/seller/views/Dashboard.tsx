import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  TrendingUp, 
  ShoppingCart,
  DollarSign,
  Search,
  MoreVertical,
  ArrowUpRight,
} from 'lucide-react';

// Dummy Data
const dashboardData = {
  stats: {
    totalStores: 3,
    totalProducts: 248,
    todaySales: 45,
    weekSales: 312,
    monthSales: 1456,
    revenue: 56874,
    balance: 56874,
    balanceGrowth: 17,
    sales: 24575,
    salesGrowth: 23
  },
  weeklyUsers: {
    growth: 3.2,
    data: [
      { day: 'Mon', value: 12000 },
      { day: 'Tue', value: 24000 },
      { day: 'Wed', value: 33567 },
      { day: 'Thu', value: 18000 },
      { day: 'Fri', value: 11000 },
      { day: 'Sat', value: 30000 },
      { day: 'Sun', value: 25000 }
    ]
  },
  profitBreakdown: [
    { label: 'Giveaway', percentage: 60, color: '#A8C5A8' },
    { label: 'Affiliate', percentage: 24, color: '#F4D58D' },
    { label: 'Offline Sales', percentage: 16, color: '#8B9DC3' }
  ],
  recentSales: [
    { id: 1, customer: 'Steven Summer', amount: 52.00, time: '02 Minutes Ago', avatar: '👤' },
    { id: 2, customer: 'Jordan Maizee', amount: 83.00, time: '02 Minutes Ago', avatar: '👤' },
    { id: 3, customer: 'Jessica Alba', amount: 61.60, time: '05 Minutes Ago', avatar: '👤' },
    { id: 4, customer: 'Anna Armas', amount: 2351.00, time: '05 Minutes Ago', avatar: '👤' },
    { id: 5, customer: 'Angelina Boo', amount: 152.00, time: '10 Minutes Ago', avatar: '👤' },
    { id: 6, customer: 'Anastasia Koss', amount: 542.00, time: '12 Minutes Ago', avatar: '👤' }
  ],
  lastOrders: [
    { id: 1, customer: 'David Astee', amount: 1456, status: 'Chargeback', date: '11 Sep 2022', avatar: '👤' },
    { id: 2, customer: 'Maria Hulama', amount: 42.43, status: 'Completed', date: '11 Sep 2022', avatar: '👤' },
    { id: 3, customer: 'Arnold Swarz', amount: 3.41, status: 'Completed', date: '11 Sep 2022', avatar: '👤' }
  ]
};

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const maxValue = Math.max(...dashboardData.weeklyUsers.data.map(d => d.value));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Payments Updates</p>
          </div>
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-linear-to-br from-green-100 to-green-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-green-700" />
              <span className="text-sm font-medium text-green-700">Balance</span>
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-300 px-3 py-1 rounded-full">
              +{dashboardData.stats.balanceGrowth}%
            </span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-4">
            ${dashboardData.stats.balance.toLocaleString()}
          </div>
          <svg className="w-full h-12" viewBox="0 0 200 40">
            <path
              d="M 0 20 Q 25 10, 50 15 T 100 20 T 150 25 T 200 20"
              fill="none"
              stroke="rgba(34, 197, 94, 0.5)"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Sales Card */}
        <div className="bg-linear-to-br from-yellow-100 to-yellow-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-yellow-700" />
              <span className="text-sm font-medium text-yellow-700">Sales</span>
            </div>
            <span className="text-xs font-semibold text-yellow-700 bg-yellow-300 px-3 py-1 rounded-full">
              +{dashboardData.stats.salesGrowth}%
            </span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-4">
            ${dashboardData.stats.sales.toLocaleString()}
          </div>
          <svg className="w-full h-12" viewBox="0 0 200 40">
            <path
              d="M 0 25 Q 25 20, 50 18 T 100 15 T 150 20 T 200 15"
              fill="none"
              stroke="rgba(251, 191, 36, 0.5)"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Stores Card */}
        <div className="bg-linear-to-br from-blue-100 to-blue-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Store size={18} className="text-blue-700" />
            <span className="text-sm font-medium text-blue-700">Total Stores</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">
            {dashboardData.stats.totalStores}
          </div>
        </div>

        {/* Products Card */}
        <div className="bg-linear-to-br from-purple-100 to-purple-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-purple-700" />
            <span className="text-sm font-medium text-purple-700">Total Products</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">
            {dashboardData.stats.totalProducts}
          </div>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.todaySales}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Weekly Sales</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.weekSales}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Monthly Sales</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.monthSales}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <ShoppingCart className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* User Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">User in The Last Week</h2>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                +{dashboardData.weeklyUsers.growth}%
              </p>
            </div>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              See statistics for all time
            </button>
          </div>
          
          <div className="relative h-64">
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
              <span>40 K</span>
              <span>30 K</span>
              <span>20 K</span>
              <span>10 K</span>
              <span>0 K</span>
            </div>
            
            <div className="ml-12 h-full flex items-end justify-between gap-4">
              {dashboardData.weeklyUsers.data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full group">
                    {index === 2 && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-sm font-bold text-gray-900">${item.value.toLocaleString()}</p>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                          <div className="border-4 border-transparent border-t-white"></div>
                        </div>
                      </div>
                    )}
                    <div
                      className={`w-full rounded-t-xl transition-all ${
                        index === 2 ? 'bg-gray-900' : 'bg-gray-800'
                      }`}
                      style={{ height: `${(item.value / maxValue) * 200}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400 mt-3">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Profits */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Monthly Profits</h2>
            <button>
              <MoreVertical size={20} className="text-gray-400" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">Total Profit Growth of 26%</p>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="24"
                />
                {dashboardData.profitBreakdown.map((item, index) => {
                  const total = dashboardData.profitBreakdown.reduce((sum, i) => sum + i.percentage, 0);
                  const prevTotal = dashboardData.profitBreakdown
                    .slice(0, index)
                    .reduce((sum, i) => sum + i.percentage, 0);
                  const circumference = 2 * Math.PI * 80;
                  const offset = (prevTotal / total) * circumference;
                  const length = (item.percentage / total) * circumference;
                  
                  return (
                    <circle
                      key={index}
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="24"
                      strokeDasharray={`${length} ${circumference}`}
                      strokeDashoffset={-offset}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">$76,356</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {dashboardData.profitBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sales & Last Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Sales</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">See All</button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg">
                    {sale.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{sale.customer}</p>
                    <p className="text-xs text-gray-500">{sale.time}</p>
                  </div>
                </div>
                <p className="font-bold text-gray-900">+${sale.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Last Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Last Orders</h2>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                Data Updates Every 3 Hours
              </span>
              <button className="text-sm text-gray-500 hover:text-gray-700">View All Orders</button>
            </div>
          </div>
          <div className="space-y-4">
            {dashboardData.lastOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg">
                    {order.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${order.amount.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    order.status === 'Completed' 
                      ? 'bg-gray-100 text-gray-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;