const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: String,
  name: String,
  description: String,
  term: String,
  credits: Number,
  location: String,
  level: String,
  prerequisites: String,
  restrictions: String,
  equates: String,
  sections: [
    {
      sectionId: String,
      faculty: String,
      available: Number,
      capacity: Number,
      status: String,
      meetings: [
        {
          type: String,
          day: String,
          start: String,
          end: String,
          location: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model('course', courseSchema);
