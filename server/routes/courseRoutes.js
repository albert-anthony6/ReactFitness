const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(courseController.aliasTopCourses, courseController.getAllCourses);

router.route('/course-stats').get(courseController.getCourseStats);
router.route('/monthly-plan/:year').get(courseController.getMonthlyPlan);

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;
