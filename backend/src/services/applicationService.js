const Application = require('../models/Application');

const createApplication = async (payload) => {
  const application = await Application.create(payload);
  return application;
};

const getAllApplications = async () => {
  return Application.find();
};

const getApplicationById = async (id) => {
  return Application.findById(id);
};

const updateApplicationById = async (id, payload) => {
  return Application.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteApplicationById = async (id) => {
  return Application.findByIdAndDelete(id);
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationById,
  deleteApplicationById,
};
