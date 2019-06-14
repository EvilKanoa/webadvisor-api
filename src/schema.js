const {
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');

const institution = new GraphQLEnumType({
  name: 'School',
  description: 'One of the institutions available to query.',
  values: {
    UOG: { description: 'University of Guelph' },
    UW: { description: 'University of Waterloo' },
    WLU: { description: 'Wilfrid Laurier University' },
  },
});

const meetingType = new GraphQLEnumType({
  name: 'Meeting_Type',
  description: 'The type of a meeting.',
  values: {
    LEC: { description: 'Lecture' },
    LAB: { description: 'Lab' },
    SEM: { description: 'Seminar' },
  },
});

const weekday = new GraphQLEnumType({
  name: 'Day',
  description: 'One of the seven days in a week.',
  values: {
    monday: { description: 'Monday' },
    tuesday: { description: 'Tuesday' },
    wednesday: { description: 'Wednesday' },
    thursday: { description: 'Thursday' },
    friday: { description: 'Friday' },
    saturday: { description: 'Saturday' },
    sunday: { description: 'Sunday' },
  },
});

const term = new GraphQLEnumType({
  name: 'Term',
  description:
    'A school term, includes the term season which is summer, fall, or winter, as well as the year.',
  values: {
    W19: {},
    S19: {},
    F19: {},
    W20: {},
    S20: {},
    F20: {},
    W21: {},
    S21: {},
    F21: {},
    W22: {},
    S22: {},
    F22: {},
  },
});

const prerequisites = new GraphQLObjectType({
  name: 'Prerequisites',
  description:
    'A set of required courses which has the ability to represent a union of courses, an intersection of courses, or a single course.',
  fields: () => ({
    only: {
      type: GraphQLString,
      description: 'A single course prerequisite.',
    },
    any: {
      type: GraphQLList(prerequisites),
      description: 'One of the items in this list is required as a prereq.',
    },
    all: {
      type: GraphQLList(prerequisites),
      description: 'Every item in this list is required as a prereq.',
    },
  }),
});

const meeting = new GraphQLObjectType({
  name: 'Meeting',
  description:
    'A recurring meeting for a given course section including where and when it takes place.',
  fields: {
    type: {
      type: meetingType,
      description: 'The type of the meeting, or none if type is not known.',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the meeting if one is given.',
    },
    day: { type: weekday, description: 'The day which the meeting occurs.' },
    start: {
      type: GraphQLString,
      description:
        'The start time of the meeting, stored as an ISO 8601 extended time.',
    },
    end: {
      type: GraphQLString,
      description:
        'The end time of the meeting, stored as an ISO 8601 extended time.',
    },
    available: {
      type: GraphQLInt,
      description: 'The number of available/free slots for the meeting.',
    },
    capacity: {
      type: GraphQLInt,
      description: 'The total number of slots for the meeting.',
    },
    location: {
      type: GraphQLString,
      description: 'The location of the meeting.',
    },
  },
});

const section = new GraphQLObjectType({
  name: 'Section',
  description: 'A course section which defines registration and meetings.',
  fields: {
    id: {
      type: GraphQLString,
      description: 'The identifying string for the section, may not exist.',
    },
    faculty: {
      type: GraphQLString,
      description: 'The faculty in charge of the section.',
    },
    available: {
      type: GraphQLInt,
      description: 'The number of available/free slots for the section.',
    },
    capacity: {
      type: GraphQLInt,
      description: 'The total number of slots for the section.',
    },
    meetings: {
      type: GraphQLList(meeting),
      description: 'The meetings required for the section.',
    },
  },
});

const course = new GraphQLObjectType({
  name: 'Course',
  description: 'A course which includes all metadata and sections.',
  fields: {
    code: {
      type: GraphQLString,
      description: 'The course code, sometimes considered a course ID.',
    },
    name: { type: GraphQLString, description: 'The name of the course.' },
    description: {
      type: GraphQLString,
      description: 'An institution provided description for the course.',
      resolve: require('./resolvers/description.resolver'),
    },
    term: {
      type: term,
      description: 'The term which the course occurs during.',
    },
    credits: { type: GraphQLFloat, description: 'The course weight.' },
    institution: {
      type: institution,
      description: 'The institution which is offering the course.',
    },
    location: {
      type: GraphQLString,
      description: 'The institution defined location of the course.',
    },
    level: {
      type: GraphQLString,
      description: 'The institution defined academic level of the course.',
    },
    prerequisites: {
      type: prerequisites,
      description:
        'An object representing the prerequisites required for the course.',
    },
    sections: {
      type: GraphQLList(section),
      description: 'All sections offered for this course.',
    },
  },
});

const query = new GraphQLObjectType({
  name: 'Query',
  description:
    'The base level query object used to access any and all API information. Have fun!',
  fields: {
    course: {
      type: course,
      args: {
        code: {
          type: GraphQLNonNull(GraphQLString),
          description: 'The institution defined course code.',
        },
        institution: {
          type: GraphQLNonNull(institution),
          description: 'The instiution that offers the course.',
        },
        term: {
          type: GraphQLNonNull(term),
          description: 'The term that the course occurs during.',
        },
      },
      resolve: require('./resolvers/course.resolver'),
    },
  },
});

const schema = new GraphQLSchema({ query });

module.exports = schema;
