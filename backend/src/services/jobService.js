const Job = require('../models/Job');

const createJob = async (payload) => {
  const job = await Job.create(payload);
  return job;
};

const getAllJobs = async () => {
  return Job.find();
};

const getJobById = async (id) => {
  return Job.findById(id);
};

const updateJobById = async (id, payload) => {
  return Job.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteJobById = async (id) => {
  return Job.findByIdAndDelete(id);
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJobById,
  deleteJobById,
};
