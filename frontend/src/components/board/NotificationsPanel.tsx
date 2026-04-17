import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Badge from '../common/Badge';

export type Notification = {
  id: string;
  type: 'interview' | 'application' | 'offer' | 'reminder' | 'update';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  icon?: string;
};

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

const typeConfig = {
  interview: { icon: '🎤', color: 'warning', label: 'Interview' },
  application: { icon: '📝', color: 'info', label: 'Application' },
  offer: { icon: '🎉', color: 'success', label: 'Offer' },
  reminder: { icon: '⏰', color: 'primary', label: 'Reminder' },
  update: { icon: '📢', color: 'info', label: 'Update' },
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <motion.div className="space-y-3">
        {notifications.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          </Card>
        ) : (
          notifications.map((notification, idx) => {
            const config = typeConfig[notification.type];
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => !notification.read && onMarkAsRead?.(notification.id)}
                className="cursor-pointer"
              >
                <Card
                  className={`transition-colors duration-200 ${
                    !notification.read
                      ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
                      : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Icon Circle */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center text-2xl">
                        {config.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <motion.div
                            className="w-2 h-2 rounded-full bg-blue-600"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant={config.color as 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'} size="sm" icon={config.icon}>
                          {config.label}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
};

export default NotificationsPanel;
