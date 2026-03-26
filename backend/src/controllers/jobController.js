const asyncHandler = require('../utils/asyncHandler');
const jobService = require('../services/jobService');

const createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.body);

  return res.status(201).json({
    message: 'Job created successfully',
    data: job,
  });
});

const getJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getAllJobs();
  return res.status(200).json({ data: jobs });
});

const getJob = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  return res.status(200).json({ data: job });
});

const updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJobById(req.params.id, req.body);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  return res.status(200).json({
    message: 'Job updated successfully',
    data: job,
  });
});

const deleteJob = asyncHandler(async (req, res) => {
  const job = await jobService.deleteJobById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  return res.status(200).json({ message: 'Job deleted successfully' });
});

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
};
