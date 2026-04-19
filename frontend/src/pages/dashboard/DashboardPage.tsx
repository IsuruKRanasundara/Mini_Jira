import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../../components/layout/MainLayout';
import KanbanBoard from '../../components/board/KanbanBoard';
import JobFeed from '../../components/board/JobFeed';
import NotificationsPanel from '../../components/board/NotificationsPanel';
import AnalyticsSection from '../../components/board/AnalyticsSection';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import type { JobApplicationCardData } from '../../components/board/ApplicationCard';
import { type JobOpportunity } from '../../components/board/JobFeed';
import {type Notification } from '../../components/board/NotificationsPanel';

type ApplicationStatus = JobApplicationCardData['status'];

type KanbanColumn = {
  id: ApplicationStatus;
  title: string;
  icon: string;
  color: string;
  cards: JobApplicationCardData[];
};

const isApplicationStatus = (value: string): value is ApplicationStatus =>
  value === 'applied' || value === 'interviewing' || value === 'offered';

// Sample Data
const initialKanbanColumns: KanbanColumn[] = [
  {
    id: 'applied' as const,
    title: 'Applied',
    icon: '📄',
    color: 'info',
    cards: [
      {
        id: '1',
        companyName: 'Google',
        jobTitle: 'Software Engineer',
        appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'applied' as const,
      },
      {
        id: '2',
        companyName: 'Microsoft',
        jobTitle: 'Full Stack Developer',
        appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'applied' as const,
      },
      {
        id: '3',
        companyName: 'Meta',
        jobTitle: 'React Developer',
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'applied' as const,
      },
    ],
  },
  {
    id: 'interviewing' as const,
    title: 'Interviewing',
    icon: '🎤',
    color: 'warning',
    cards: [
      {
        id: '4',
        companyName: 'Amazon',
        jobTitle: 'Backend Engineer',
        appliedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'interviewing' as const,
      },
      {
        id: '5',
        companyName: 'Apple',
        jobTitle: 'iOS Developer',
        appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'interviewing' as const,
      },
    ],
  },
  {
    id: 'offered' as const,
    title: 'Offered',
    icon: '🎉',
    color: 'success',
    cards: [
      {
        id: '6',
        companyName: 'Netflix',
        jobTitle: 'Senior Engineer',
        appliedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'offered' as const,
      },
    ],
  },
];

const jobOpportunities: JobOpportunity[] = [
  {
    id: '101',
    company: 'Google',
    role: 'Product Manager',
    location: 'Mountain View, CA',
    type: 'full-time',
    experience: 'mid',
    remote: true,
    salary: '$150k - $180k',
    description: 'Join Googles innovative product team...',
  },
  {
    id: '102',
    company: 'Microsoft',
    role: 'Cloud Architect',
    location: 'Seattle, WA',
    type: 'full-time',
    experience: 'senior',
    remote: false,
    salary: '$170k - $210k',
    description: 'Design and implement cloud solutions...',
  },
  {
    id: '103',
    company: 'Meta',
    role: 'Data Scientist',
    location: 'Remote',
    type: 'full-time',
    experience: 'mid',
    remote: true,
    salary: '$140k - $170k',
    description: 'Work with cutting-edge ML models...',
  },
  {
    id: '104',
    company: 'Amazon',
    role: 'DevOps Engineer',
    location: 'Austin, TX',
    type: 'full-time',
    experience: 'entry',
    remote: true,
    salary: '$120k - $140k',
    description: 'Build and maintain AWS infrastructure...',
  },
  {
    id: '105',
    company: 'Apple',
    role: 'UX Designer',
    location: 'Cupertino, CA',
    type: 'full-time',
    experience: 'mid',
    remote: false,
    salary: '$130k - $160k',
    description: 'Design next-generation Apple products...',
  },
  {
    id: '106',
    company: 'Netflix',
    role: 'Content Creator',
    location: 'Los Gatos, CA',
    type: 'full-time',
    experience: 'mid',
    remote: true,
    salary: '$125k - $155k',
    description: 'Create engaging content for millions...',
  },
];

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'interview',
    title: 'Interview Scheduled',
    description: 'Google wants to schedule an interview for the Software Engineer position',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
  },
  {
    id: 'n2',
    type: 'application',
    title: 'Application Submitted',
    description: 'Your application for Full Stack Developer at Microsoft has been submitted',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'n3',
    type: 'offer',
    title: 'Offer Received',
    description: 'Netflix has sent you an offer for the Senior Engineer position',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'n4',
    type: 'update',
    title: 'Status Update',
    description: 'Your application at Amazon has moved to the next round',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

const DashboardPage: React.FC = () => {
  const [kanbanColumns, setKanbanColumns] = useState(initialKanbanColumns);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedCard, setSelectedCard] = useState<JobApplicationCardData | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'feed' | 'analytics'>('pipeline');

  const handleCardMove = (cardId: string, fromColumn: string, toColumn: string) => {
    if (!isApplicationStatus(fromColumn) || !isApplicationStatus(toColumn) || fromColumn === toColumn) {
      return;
    }

    setKanbanColumns((cols) => {
      let movedCard: JobApplicationCardData | null = null;

      const withoutSourceCard = cols.map((col) => {
        if (col.id !== fromColumn) {
          return col;
        }

        const cardToMove = col.cards.find((c) => c.id === cardId);
        if (!cardToMove) {
          return col;
        }

        movedCard = { ...cardToMove, status: toColumn };
        return {
          ...col,
          cards: col.cards.filter((c) => c.id !== cardId),
        };
      });

      if (!movedCard) {
        return cols;
      }

      const cardToInsert = movedCard;

      return withoutSourceCard.map((col) =>
        col.id === toColumn
          ? {
              ...col,
              cards: [...col.cards, cardToInsert],
            }
          : col,
      );
    });
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((notifs) =>
      notifs.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((notifs) => notifs.map((n) => ({ ...n, read: true })));
  };

  const handleApplyJob = (jobId: string) => {
    const job = jobOpportunities.find((j) => j.id === jobId);
    if (job) {
      alert(`Applied to ${job.role} at ${job.company}!`);
    }
  };

  const totalApplications = kanbanColumns.reduce((sum, col) => sum + col.cards.length, 0);
  const totalInterviews = kanbanColumns.find((c) => c.id === 'interviewing')?.cards.length || 0;
  const totalOffers = kanbanColumns.find((c) => c.id === 'offered')?.cards.length || 0;

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, John Doe 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your job applications and manage your career journey
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex gap-4 border-b border-gray-200 dark:border-gray-700"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {['pipeline' as const, 'feed' as const, 'analytics' as const].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-semibold transition-colors duration-200 border-b-2 ${
                activeTab === tab
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {tab === 'pipeline' && '📊 Pipeline'}
              {tab === 'feed' && '📰 Job Feed'}
              {tab === 'analytics' && '📈 Analytics'}
            </button>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-4 gap-8">
          {/* Left: Pipeline / Feed / Analytics */}
          <div className="col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'pipeline' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Job Application Pipeline
                    </h2>
                    <KanbanBoard
                      columns={kanbanColumns}
                      onCardMove={handleCardMove}
                      onCardClick={setSelectedCard}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'feed' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Recommended Job Opportunities
                    </h2>
                    <JobFeed jobs={jobOpportunities} onApply={handleApplyJob} />
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <AnalyticsSection
                  data={{
                    totalApplications,
                    totalInterviews,
                    totalOffers,
                    applicationsTrend: 12,
                    interviewsTrend: 8,
                    offersTrend: 5,
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* Right: Notifications */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-20">
              <NotificationsPanel
                notifications={notifications.slice(0, 5)}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
            </div>
          </motion.div>
        </div>

        {/* Application Details Modal */}
        <Modal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          title={selectedCard?.jobTitle || ''}
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setSelectedCard(null)}>
                Close
              </Button>
              <Button onClick={() => alert('Updated!')}>Update Status</Button>
            </>
          }
        >
          {selectedCard && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Company</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedCard.companyName}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Applied Date</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(selectedCard.appliedDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Current Status</h3>
                <p className="text-gray-600 dark:text-gray-400 capitalize">
                  {selectedCard.status.charAt(0).toUpperCase() + selectedCard.status.slice(1)}
                </p>
              </div>
            </div>
          )}
        </Modal>
      </motion.div>
    </MainLayout>
  );
};

export default DashboardPage;