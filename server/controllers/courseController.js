const Course = require('../models/courseModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopCourses = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllCourses = async (req, res) => {
  try {
    // BUILD QUERY
    const features = new APIFeatures(Course.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // EXEXCUTE QUERY
    const courses = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        course: newCourse,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    // Third parameter is to say that we want to return the new updated version to the DB
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        course,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getCourseStats = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numCourses: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
