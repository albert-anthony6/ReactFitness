const fs = require('fs');

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  if (req.params.id * 1 > courses.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }
  next();
};

exports.getAllCourses = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses,
    },
  });
};
