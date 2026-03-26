const asyncHandler = require('../utils/asyncHandler');
const learningResourceService = require('../services/learningResourceService');

const createLearningResource = asyncHandler(async (req, res) => {
  const resource = await learningResourceService.createLearningResource(req.body);

  return res.status(201).json({
    message: 'Learning resource created successfully',
    data: resource,
  });
});

const getLearningResources = asyncHandler(async (req, res) => {
  const resources = await learningResourceService.getAllLearningResources();
  return res.status(200).json({ data: resources });
});

const getLearningResource = asyncHandler(async (req, res) => {
  const resource = await learningResourceService.getLearningResourceById(req.params.id);

  if (!resource) {
    return res.status(404).json({ message: 'Learning resource not found' });
  }

  return res.status(200).json({ data: resource });
});

const updateLearningResource = asyncHandler(async (req, res) => {
  const resource = await learningResourceService.updateLearningResourceById(req.params.id, req.body);

  if (!resource) {
    return res.status(404).json({ message: 'Learning resource not found' });
  }

  return res.status(200).json({
    message: 'Learning resource updated successfully',
    data: resource,
  });
});

const deleteLearningResource = asyncHandler(async (req, res) => {
  const resource = await learningResourceService.deleteLearningResourceById(req.params.id);

  if (!resource) {
    return res.status(404).json({ message: 'Learning resource not found' });
  }

  return res.status(200).json({ message: 'Learning resource deleted successfully' });
});

module.exports = {
  createLearningResource,
  getLearningResources,
  getLearningResource,
  updateLearningResource,
  deleteLearningResource,
};
