import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  AlertCircle,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  Users,
  Stethoscope,
  Calendar as CalendarIcon,
  Pill,
  FileText,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Award,
  Star,
  Heart,
  Smile,
  Frown,
  Meh,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Wind,
  Droplet,
  Thermometer,
  Activity as ActivityIcon,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon,
  RefreshCw as RefreshCwIcon,
  AlertCircle as AlertCircleIcon,
  Calendar as CalendarIcon2,
  Filter as FilterIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Users as UsersIcon,
  Stethoscope as StethoscopeIcon,
  Calendar as CalendarIcon3,
  Pill as PillIcon,
  FileText as FileTextIcon,
  Activity as ActivityIcon2,
  DollarSign as DollarSignIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  ArrowUpRight as ArrowUpRightIcon,
  ArrowDownRight as ArrowDownRightIcon,
  Zap as ZapIcon,
  Target as TargetIcon,
  Award as AwardIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Smile as SmileIcon,
  Frown as FrownIcon,
  Meh as MehIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Cloud as CloudIcon,
  CloudRain as CloudRainIcon,
  Snowflake as SnowflakeIcon,
  Wind as WindIcon,
  Droplet as DropletIcon,
  Thermometer as ThermometerIcon,
  Activity as ActivityIcon3
} from 'lucide-react';
import { admin } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  Treemap,
  Sankey,
  Funnel,
  FunnelChart,
} from 'recharts';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('month');
  const [chartType, setChartType] = useState('bar');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Fetch analytics data
  const { data, isLoading, error, refetch } = useQuery(
    ['admin-analytics', dateRange],
    () => admin.getAnalytics({ period: dateRange }),
    {
      staleTime: 60000,
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Failed to load analytics</h3>
        <p className="text-gray-500 mt-2">Please try again later</p>
        <button onClick={() => refetch()} className="mt-4 btn-primary">
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  const analytics = data?.analytics || {};

  // Sample data for charts
  const appointmentData = analytics.appointmentTrends || [
    { date: 'Mon', appointments: 12, completed: 10, cancelled: 2 },
    { date: 'Tue', appointments: 15, completed: 13, cancelled: 2 },
    { date: 'Wed', appointments: 18, completed: 16, cancelled: 2 },
    { date: 'Thu', appointments: 14, completed: 12, cancelled: 2 },
    { date: 'Fri', appointments: 20, completed: 18, cancelled: 2 },
    { date: 'Sat', appointments: 8, completed: 7, cancelled: 1 },
    { date: 'Sun', appointments: 5, completed: 4, cancelled: 1 },
  ];

  const userGrowthData = analytics.userGrowth || [
    { date: 'Week 1', users: 100, active: 80, new: 20 },
    { date: 'Week 2', users: 150, active: 120, new: 30 },
    { date: 'Week 3', users: 180, active: 150, new: 40 },
    { date: 'Week 4', users: 220, active: 180, new: 50 },
    { date: 'Week 5', users: 250, active: 200, new: 60 },
    { date: 'Week 6', users: 300, active: 240, new: 70 },
  ];

  const revenueData = analytics.revenue || [
    { month: 'Jan', revenue: 5000, expenses: 3000, profit: 2000 },
    { month: 'Feb', revenue: 6000, expenses: 3500, profit: 2500 },
    { month: 'Mar', revenue: 7500, expenses: 4000, profit: 3500 },
    { month: 'Apr', revenue: 8000, expenses: 4500, profit: 3500 },
    { month: 'May', revenue: 9000, expenses: 5000, profit: 4000 },
    { month: 'Jun', revenue: 10000, expenses: 5500, profit: 4500 },
  ];

  const specializationData = analytics.popularSpecializations || [
    { name: 'Cardiology', value: 45 },
    { name: 'Dermatology', value: 30 },
    { name: 'Neurology', value: 25 },
    { name: 'Orthopedics', value: 20 },
    { name: 'Pediatrics', value: 15 },
    { name: 'Gynecology', value: 12 },
  ];

  const COLORS = ['#0A6E79', '#2D9CDB', '#27AE60', '#F2994A', '#EB5757', '#9B51E0'];

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#0A6E79" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#27AE60" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" fill="#EB5757" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ReLineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#0A6E79" strokeWidth={2} />
              <Line type="monotone" dataKey="active" stroke="#27AE60" strokeWidth={2} />
              <Line type="monotone" dataKey="new" stroke="#2D9CDB" strokeWidth={2} />
            </ReLineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={specializationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {specializationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RePieChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#0A6E79" fill="#0A6E79" fillOpacity={0.3} />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="#EB5757" fill="#EB5757" fillOpacity={0.3} />
              <Area type="monotone" dataKey="profit" stackId="1" stroke="#27AE60" fill="#27AE60" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📈 Advanced Analytics</h1>
          <p className="text-gray-500 mt-1">Deep insights into platform performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input py-2 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="btn-secondary text-sm">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button onClick={() => refetch()} className="btn-secondary text-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹5,43,200</p>
              <span className="inline-flex items-center gap-1 text-sm text-success-600">
                <ArrowUpRight className="w-4 h-4" />
                12.5%
              </span>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">User Growth</p>
              <p className="text-2xl font-bold text-gray-900">+23%</p>
              <span className="inline-flex items-center gap-1 text-sm text-success-600">
                <ArrowUpRight className="w-4 h-4" />
                8.2%
              </span>
            </div>
            <div className="w-12 h-12 bg-success-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">68%</p>
              <span className="inline-flex items-center gap-1 text-sm text-success-600">
                <ArrowUpRight className="w-4 h-4" />
                4.1%
              </span>
            </div>
            <div className="w-12 h-12 bg-secondary-50 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <span className="inline-flex items-center gap-1 text-sm text-danger-600">
                <ArrowDownRight className="w-4 h-4" />
                2.3%
              </span>
            </div>
            <div className="w-12 h-12 bg-warning-50 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                chartType === 'bar'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                chartType === 'line'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LineChart className="w-4 h-4 inline mr-1" />
              Line
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                chartType === 'pie'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <PieChart className="w-4 h-4 inline mr-1" />
              Pie
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                chartType === 'area'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Area
            </button>
          </div>
          <div className="flex-1"></div>
          <select className="input py-1.5 text-sm w-32">
            <option value="all">All Metrics</option>
            <option value="appointments">Appointments</option>
            <option value="users">Users</option>
            <option value="revenue">Revenue</option>
          </select>
        </div>
      </div>

      {/* Main Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {chartType === 'bar' && 'Appointment Trends'}
          {chartType === 'line' && 'User Growth Over Time'}
          {chartType === 'pie' && 'Specialization Distribution'}
          {chartType === 'area' && 'Revenue Analysis'}
        </h3>
        {renderChart()}
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Doctors</h3>
          <div className="space-y-3">
            {[
              { name: 'Dr. Sarah Johnson', rating: 4.9, patients: 128, revenue: 45000 },
              { name: 'Dr. Michael Chen', rating: 4.8, patients: 115, revenue: 42000 },
              { name: 'Dr. Emily Davis', rating: 4.7, patients: 98, revenue: 38000 },
              { name: 'Dr. James Wilson', rating: 4.6, patients: 85, revenue: 35000 },
              { name: 'Dr. Lisa Anderson', rating: 4.5, patients: 72, revenue: 32000 },
            ].map((doctor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{doctor.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {doctor.rating}
                      <span className="text-xs text-gray-400">•</span>
                      {doctor.patients} patients
                    </div>
                  </div>
                </div>
                <span className="font-medium text-primary-600">₹{doctor.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary-900">Growth Opportunity</h4>
                  <p className="text-sm text-primary-700 mt-1">
                    User engagement increased by 23% this month. Focus on retention strategies.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-success-50 rounded-xl border border-success-100">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-success-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-success-900">Top Performer</h4>
                  <p className="text-sm text-success-700 mt-1">
                    Dr. Sarah Johnson has the highest patient satisfaction rating of 4.9/5.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-warning-50 rounded-xl border border-warning-100">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-warning-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-warning-900">Action Required</h4>
                  <p className="text-sm text-warning-700 mt-1">
                    Appointment no-show rate is 15%. Consider implementing reminder system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;