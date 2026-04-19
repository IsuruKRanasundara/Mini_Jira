import React, { useEffect, useState } from 'react';
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
import { type Notification } from '../../components/board/NotificationsPanel';
import api from '../../services/api';

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

type BackendJob = {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salaryRange?: {
    min?: number;
    max?: number;
  };
  jobType: 'Full-time' | 'Part-time' | 'Freelance';
};

type BackendApplication = {
  _id: string;
  jobId: string;
  appliedDate: string;
  applicationStatus: 'Pending' | 'Interview' | 'Rejected' | 'Offer';
};

const initialKanbanColumns: KanbanColumn[] = [
  {
    id: 'applied' as const,
    title: 'Applied',
    icon: '📄',
    color: 'info',
    cards: [],
  },
  {
    id: 'interviewing' as const,
    title: 'Interviewing',
    icon: '🎤',
    color: 'warning',
    cards: [],
  },
  {
    id: 'offered' as const,
    title: 'Offered',
    icon: '🎉',
    color: 'success',
    cards: [],
  },
];

const statusToKanbanStatus = (status: BackendApplication['applicationStatus']): ApplicationStatus | null => {
  if (status === 'Pending') {
    return 'applied';
  }

  if (status === 'Interview') {
    return 'interviewing';
  }

  if (status === 'Offer') {
    return 'offered';
  }

  return null;
};

const formatSalary = (salaryRange?: BackendJob['salaryRange']) => {
  if (!salaryRange?.min && !salaryRange?.max) {
    return undefined;
  }

  const min = salaryRange.min ? `$${Math.round(salaryRange.min / 1000)}k` : 'N/A';
  const max = salaryRange.max ? `$${Math.round(salaryRange.max / 1000)}k` : 'N/A';
  return `${min} - ${max}`;
};

const inferExperience = (salaryRange?: BackendJob['salaryRange']): JobOpportunity['experience'] => {
  const maxSalary = salaryRange?.max ?? 0;
  if (maxSalary >= 130000) {
    return 'senior';
  }

  if (maxSalary >= 80000) {
    return 'mid';
  }

  return 'entry';
};

const readStoredUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawUser = window.localStorage.getItem('user');
    if (!rawUser) {
      return null;
    }

    const parsedUser = JSON.parse(rawUser) as { firstName?: string; lastName?: string } | null;
    const firstName = parsedUser?.firstName?.trim() ?? '';
    const lastName = parsedUser?.lastName?.trim() ?? '';

    if (!firstName && !lastName) {
      return null;
    }

    return {
      firstName,
      lastName,
      displayName: [firstName, lastName].filter(Boolean).join(' ').trim(),
    };
  } catch {
    return null;
  }
};

const DashboardPage: React.FC = () => {
  const [kanbanColumns, setKanbanColumns] = useState(initialKanbanColumns);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>([]);
  const [selectedCard, setSelectedCard] = useState<JobApplicationCardData | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'feed' | 'analytics'>('pipeline');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [storedUser, setStoredUser] = useState<ReturnType<typeof readStoredUser>>(null);

  useEffect(() => {
    setStoredUser(readStoredUser());
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setLoadingError(null);

        const [jobsResponse, applicationsResponse] = await Promise.all([
          api.get<{ data: BackendJob[] }>('/jobs'),
          api.get<{ data: BackendApplication[] }>('/applications'),
        ]);

        const jobs = jobsResponse.data.data ?? [];
        const applications = applicationsResponse.data.data ?? [];
        const jobsById = new Map(jobs.map((job) => [job._id, job]));

        const mappedJobs: JobOpportunity[] = jobs.map((job) => ({
          id: job._id,
          company: job.company,
          role: job.title,
          location: job.location,
          type: job.jobType === 'Full-time' ? 'full-time' : job.jobType === 'Part-time' ? 'part-time' : 'contract',
          experience: inferExperience(job.salaryRange),
          remote: /remote/i.test(job.location),
          salary: formatSalary(job.salaryRange),
          description: job.description,
        }));

        const mappedCards: JobApplicationCardData[] = applications
          .map((application) => {
            const status = statusToKanbanStatus(application.applicationStatus);
            const relatedJob = jobsById.get(application.jobId);

            if (!status || !relatedJob) {
              return null;
            }

            return {
              id: application._id,
              companyName: relatedJob.company,
              jobTitle: relatedJob.title,
              appliedDate: application.appliedDate,
              status,
            };
          })
          .filter((card): card is JobApplicationCardData => card !== null);

        setKanbanColumns([
          {
            id: 'applied',
            title: 'Applied',
            icon: '📄',
            color: 'info',
            cards: mappedCards.filter((card) => card.status === 'applied'),
          },
          {
            id: 'interviewing',
            title: 'Interviewing',
            icon: '🎤',
            color: 'warning',
            cards: mappedCards.filter((card) => card.status === 'interviewing'),
          },
          {
            id: 'offered',
            title: 'Offered',
            icon: '🎉',
            color: 'success',
            cards: mappedCards.filter((card) => card.status === 'offered'),
          },
        ]);

        setJobOpportunities(mappedJobs);

        const latestNotifications: Notification[] = applications
          .slice()
          .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
          .slice(0, 8)
          .map((application) => {
            const relatedJob = jobsById.get(application.jobId);
            const companyName = relatedJob?.company ?? 'Unknown company';
            const jobTitle = relatedJob?.title ?? 'Unknown role';

            if (application.applicationStatus === 'Interview') {
              return {
                id: application._id,
                type: 'interview' as const,
                title: 'Interview Stage',
                description: `Your application for ${jobTitle} at ${companyName} is now in interview stage.`,
                timestamp: new Date(application.appliedDate),
                read: false,
              };
            }

            if (application.applicationStatus === 'Offer') {
              return {
                id: application._id,
                type: 'offer' as const,
                title: 'Offer Stage',
                description: `Your application for ${jobTitle} at ${companyName} reached offer stage.`,
                timestamp: new Date(application.appliedDate),
                read: false,
              };
            }

            return {
              id: application._id,
              type: 'application' as const,
              title: 'Application Update',
              description: `Application recorded for ${jobTitle} at ${companyName}.`,
              timestamp: new Date(application.appliedDate),
              read: false,
            };
          });

        setNotifications(latestNotifications);
      } catch {
        setLoadingError('Unable to load live dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

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
  const dashboardSubtitle =
    isLoading && !loadingError
      ? 'Loading live dashboard data...'
      : `Showing ${jobOpportunities.length} live jobs, ${totalApplications} applications, and ${notifications.length} updates from the API.`;

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        {/* Header */}
        {storedUser && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {storedUser.displayName} 👋
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{dashboardSubtitle}</p>
          </motion.div>
        )}

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
                    {storedUser && (
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Job Application Pipeline
                      </h2>
                    )}
                    {isLoading && (
                      <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
                    )}
                    {loadingError && (
                      <p className="text-red-600 dark:text-red-400">{loadingError}</p>
                    )}
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
                    {storedUser && (
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Recommended Job Opportunities
                      </h2>
                    )}
                    {isLoading && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">Loading job advertisements...</p>
                    )}
                    {loadingError && (
                      <p className="text-red-600 dark:text-red-400 mb-4">{loadingError}</p>
                    )}
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