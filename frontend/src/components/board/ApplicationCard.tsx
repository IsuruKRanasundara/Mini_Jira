import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Badge from '../common/Badge';

export type JobApplicationCardData = {
  id: string;
  companyLogo?: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  status: 'applied' | 'interviewing' | 'offered';
};

interface JobApplicationCardProps {
  card: JobApplicationCardData;
  onDragStart?: (e: React.DragEvent, cardId: string) => void;
  onClick?: () => void;
}

const statusConfig = {
  applied: { icon: '📄', color: 'info', label: 'Applied' },
  interviewing: { icon: '🎤', color: 'warning', label: 'Interviewing' },
  offered: { icon: '🎉', color: 'success', label: 'Offered' },
};

const JobApplicationCard: React.FC<JobApplicationCardProps> = ({
  card,
  onDragStart,
  onClick,
}) => {
  const status = statusConfig[card.status];

  return (
    <motion.div
      draggable
      onDragStart={(e) => onDragStart?.(e, card.id)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <Card hoverable clickable onClick={onClick} className="cursor-grab active:cursor-grabbing">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {card.companyLogo || card.companyName.charAt(0).toUpperCase()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {card.jobTitle}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{card.companyName}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(card.appliedDate).toLocaleDateString()}
              </span>
              <Badge variant={status.color as 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'} size="sm" icon={status.icon}>
                {status.label}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobApplicationCard;
