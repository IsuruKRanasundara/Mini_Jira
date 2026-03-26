const LearningResource = require('../models/LearningResource');

const createLearningResource = async (payload) => {
  const resource = await LearningResource.create(payload);
  return resource;
};

const getAllLearningResources = async () => {
  return LearningResource.find();
};

const getLearningResourceById = async (id) => {
  return LearningResource.findById(id);
};

const updateLearningResourceById = async (id, payload) => {
  return LearningResource.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteLearningResourceById = async (id) => {
  return LearningResource.findByIdAndDelete(id);
};

module.exports = {
  createLearningResource,
  getAllLearningResources,
  getLearningResourceById,
  updateLearningResourceById,
  deleteLearningResourceById,
};
