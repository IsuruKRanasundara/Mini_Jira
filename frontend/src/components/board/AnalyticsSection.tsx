import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

interface Analytics {
  totalApplications: number;
  totalInterviews: number;
  totalOffers: number;
  applicationsTrend: number;
  interviewsTrend: number;
  offersTrend: number;
}

interface AnalyticsSectionProps {
  data: Analytics;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ data }) => {
  const metrics = [
    {
      title: 'Applications Sent',
      value: data.totalApplications,
      trend: data.applicationsTrend,
      icon: '📝',
      color: 'info',
    },
    {
      title: 'Interviews Scheduled',
      value: data.totalInterviews,
      trend: data.interviewsTrend,
      icon: '🎤',
      color: 'warning',
    },
    {
      title: 'Offers Received',
      value: data.totalOffers,
      trend: data.offersTrend,
      icon: '🎉',
      color: 'success',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">Track your job search progress</p>
      </div>

      {/* Metrics Grid */}
      <motion.div
        className="grid grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {metrics.map((metric, idx) => (
          <motion.div key={metric.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {metric.title}
                  </p>
                  <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                    {metric.value}
                  </h3>
                </div>
                <div className="text-3xl">{metric.icon}</div>
              </div>

              {/* Trend */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-lg ${metric.trend >= 0 ? '📈 text-green-600' : '📉 text-red-600'}`}
                >
                  {metric.trend >= 0 ? '↑' : '↓'}
                </span>
                <span
                  className={`font-semibold ${
                    metric.trend >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {Math.abs(metric.trend)}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Success Rate Chart */}
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Application Success Rate</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Interviews / Applications</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {Math.round((data.totalInterviews / data.totalApplications) * 100) || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((data.totalInterviews / data.totalApplications) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Offers / Interviews</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {Math.round((data.totalOffers / Math.max(data.totalInterviews, 1)) * 100) || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((data.totalOffers / Math.max(data.totalInterviews, 1)) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Status Distribution */}
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Status Distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'Applied', value: data.totalApplications - data.totalInterviews - data.totalOffers, icon: '📄', color: 'from-blue-400 to-blue-600' },
              { label: 'Interviewing', value: data.totalInterviews - data.totalOffers, icon: '🎤', color: 'from-yellow-400 to-yellow-600' },
              { label: 'Offers', value: data.totalOffers, icon: '🎉', color: 'from-green-400 to-green-600' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.value > 0 ? item.value : '-'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`bg-gradient-to-r ${item.color} h-full`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.max((item.value / data.totalApplications) * 100, 5)}%`,
                    }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsSection;
