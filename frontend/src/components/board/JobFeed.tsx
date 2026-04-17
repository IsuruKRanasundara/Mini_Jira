import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';

export type JobOpportunity = {
  id: string;
  company: string;
  role: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  experience: 'entry' | 'mid' | 'senior';
  remote: boolean;
  salary?: string;
  description?: string;
};

interface JobFeedProps {
  jobs: JobOpportunity[];
  onApply?: (jobId: string) => void;
}

const JobFeed: React.FC<JobFeedProps> = ({ jobs, onApply }) => {
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    experience: 'all',
    remote: false,
  });

  const filteredJobs = jobs.filter((job) => {
    if (filters.type !== 'all' && job.type !== filters.type) return false;
    if (filters.experience !== 'all' && job.experience !== filters.experience) return false;
    if (filters.remote && !job.remote) return false;
    return true;
  });

  return (
    <div>
      {/* Filters */}
      <motion.div
        className="grid grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Job Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>

        <select
          value={filters.experience}
          onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Levels</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
        </select>

        <label className="flex items-center gap-3 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
          <input
            type="checkbox"
            checked={filters.remote}
            onChange={(e) => setFilters({ ...filters, remote: e.target.checked })}
            className="w-4 h-4 rounded cursor-pointer"
          />
          <span className="text-gray-900 dark:text-white font-medium">Remote Only</span>
        </label>

        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </div>
      </motion.div>

      {/* Job Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {filteredJobs.map((job, idx) => (
          <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
            <Card hoverable clickable onClick={() => setSelectedJob(job)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {job.role}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                </div>
                {job.remote && <Badge variant="info" size="sm" icon="🌍">Remote</Badge>}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge
                  variant="neutral"
                  size="sm"
                  icon={{
                    'full-time': '✓',
                    'part-time': '⏱️',
                    'contract': '📋',
                  }[job.type]}
                >
                  {job.type === 'full-time' ? 'Full-time' : job.type === 'part-time' ? 'Part-time' : 'Contract'}
                </Badge>
                <Badge
                  variant="primary"
                  size="sm"
                  icon={{
                    entry: '📚',
                    mid: '⭐',
                    senior: '🏆',
                  }[job.experience]}
                >
                  {{
                    entry: 'Entry Level',
                    mid: 'Mid Level',
                    senior: 'Senior',
                  }[job.experience]}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">📍 {job.location}</p>

              {job.salary && (
                <p className="font-semibold text-green-600 dark:text-green-400 mb-4">{job.salary}</p>
              )}

              <div className="flex gap-2">
                <Button size="sm" onClick={(e) => {
                  e.stopPropagation();
                  onApply?.(job.id);
                }}>
                  Apply Now
                </Button>
                <Button size="sm" variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedJob(job);
                }}>
                  Details
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Job Details Modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.role || ''}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedJob(null)}>
              Close
            </Button>
            <Button onClick={() => {
              onApply?.(selectedJob?.id || '');
              setSelectedJob(null);
            }}>
              Apply Now
            </Button>
          </>
        }
      >
        {selectedJob && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Company</h3>
              <p className="text-gray-600 dark:text-gray-400">{selectedJob.company}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
              <p className="text-gray-600 dark:text-gray-400">{selectedJob.location}</p>
            </div>
            {selectedJob.salary && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Salary</h3>
                <p className="text-green-600 dark:text-green-400 font-semibold">{selectedJob.salary}</p>
              </div>
            )}
            {selectedJob.description && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedJob.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobFeed;
