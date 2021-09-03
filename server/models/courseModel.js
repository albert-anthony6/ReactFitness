const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A course must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A course name must have less or equal than 40 characters',
      ],
      minlength: [
        10,
        'A course name must have more or equal than 10 characters',
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A course must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A course must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A course must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [1, 'Rating must be above 1.0'],
      min: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A course must have a price'],
    },
    priceDiscount: {
      type: Number,
      // this only works for NEW document create, not something like update
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price {{VALUE}} would be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A course must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A course must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual properties are not persisted into the DB
courseSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
courseSchema.pre('save', function (next) {
  // this is the document and we're adding a new field to it called slug
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
