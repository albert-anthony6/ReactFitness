const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router.route('/:id').get(courseController.getCourse);

module.exports = router;
