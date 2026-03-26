const asyncHandler = require('../utils/asyncHandler');
const skillService = require('../services/skillService');

const createSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.createSkill(req.body);

  return res.status(201).json({
    message: 'Skill created successfully',
    data: skill,
  });
});

const getSkills = asyncHandler(async (req, res) => {
  const skills = await skillService.getAllSkills();
  return res.status(200).json({ data: skills });
});

const getSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.getSkillById(req.params.id);

  if (!skill) {
    return res.status(404).json({ message: 'Skill not found' });
  }

  return res.status(200).json({ data: skill });
});

const updateSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.updateSkillById(req.params.id, req.body);

  if (!skill) {
    return res.status(404).json({ message: 'Skill not found' });
  }

  return res.status(200).json({
    message: 'Skill updated successfully',
    data: skill,
  });
});

const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await skillService.deleteSkillById(req.params.id);

  if (!skill) {
    return res.status(404).json({ message: 'Skill not found' });
  }

  return res.status(200).json({ message: 'Skill deleted successfully' });
});

module.exports = {
  createSkill,
  getSkills,
  getSkill,
  updateSkill,
  deleteSkill,
};
