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
const calendarResolvers = require('./resolvers/calendar.resolver');

const nonNullListOf = type => GraphQLNonNull(GraphQLList(GraphQLNonNull(type)));

const courseCode = GraphQLString;

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
      type: GraphQLList(GraphQLNonNull(meeting)),
      description: 'The meetings required for the section.',
    },
  },
});

const course = new GraphQLObjectType({
  name: 'Course',
  description: 'A course which includes all metadata and sections.',
  fields: {
    code: {
      type: GraphQLNonNull(courseCode),
      description: 'The course code, sometimes considered a course ID.',
    },
    name: { type: GraphQLString, description: 'The name of the course.' },
    description: {
      type: GraphQLString,
      description: 'An institution provided description for the course.',
      resolve: require('./resolvers/description.resolver'),
    },
    term: {
      type: GraphQLNonNull(term),
      description: 'The term which the course occurs during.',
    },
    credits: { type: GraphQLFloat, description: 'The course weight.' },
    institution: {
      type: GraphQLNonNull(institution),
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

const searchResult = new GraphQLObjectType({
  name: 'Result',
  description: 'An entity matched during a search.',
  fields: {
    code: {
      type: GraphQLNonNull(courseCode),
      description: 'The code of a matching entity.',
    },
    course: {
      type: course,
      description: 'Optional course data to be injected for the result.',
      resolve: require('./resolvers/result.resolver'),
    },
  },
});

const search = new GraphQLObjectType({
  name: 'Search',
  description: 'A search for course codes.',
  fields: {
    query: {
      type: GraphQLNonNull(GraphQLString),
      description: 'The search term used to determine the search results.',
    },
    term: {
      type: GraphQLNonNull(term),
      description: 'The term to search within.',
    },
    institution: {
      type: GraphQLNonNull(institution),
      description: 'The institution to search within.',
    },
    results: {
      type: nonNullListOf(searchResult),
      description: 'The list of resulting courses.',
    },
    skip: {
      type: GraphQLInt,
      description: 'Number of results skipped from beginning of results.',
    },
    limit: {
      type: GraphQLInt,
      description: 'Maximum number of results returned.',
    },
  },
});

const semester = new GraphQLEnumType({
  name: 'Semester',
  description:
    'A single semester of the year. Generally is used in tandem with a year to represent a term.',
  values: {
    F: { description: 'Fall Semester' },
    W: { description: 'Winter Semester' },
    S: { description: 'Summer Semester' },
    U: {},
    P1: {},
    P2: {},
    P3: {},
    P4: {},
  },
});

const infoSection = new GraphQLObjectType({
  name: 'Info_Section',
  description: 'A title and description representing one info section.',
  fields: {
    title: {
      type: GraphQLString,
      description: 'The title of this info section.',
    },
    description: {
      type: GraphQLString,
      description: 'The content of this info section.',
    },
  },
});

const infoList = GraphQLList(infoSection);

const courseDescription = new GraphQLObjectType({
  name: 'Course_Description',
  description: 'Course description and information for a single course.',
  fields: {
    code: {
      type: courseCode,
      description: 'The full course code.',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the course.',
    },
    rawTitle: {
      type: GraphQLString,
      description: 'The original, unparsed, title from the course calendar.',
    },
    semesters: {
      type: GraphQLList(semester),
      description: 'List of semesters which this course is offered in.',
    },
    lectureHours: {
      type: GraphQLString,
      description: 'The number of lecture hours expected every week.',
    },
    labHours: {
      type: GraphQLString,
      description: 'The number of lab hours expected every week.',
    },
    credits: {
      type: GraphQLString,
      description: 'The credit weight of the course.',
    },
    description: {
      type: GraphQLString,
      description: 'The description of the course itself.',
    },
    offering: {
      type: GraphQLString,
      description: 'Information on when and how the course is offered.',
    },
    prerequisite: {
      type: GraphQLString,
      description:
        'Information on the required prerequisite(s) for the course.',
    },
    equate: {
      type: GraphQLString,
      description: 'Information on courses which are equivalent to this one.',
    },
    restriction: {
      type: GraphQLString,
      description:
        'Information on the restriction(s) that apply for the course.',
    },
    department: {
      type: GraphQLString,
      description: 'The department(s) offering this course.',
    },
  },
});

const courseDescriptionSection = new GraphQLObjectType({
  name: 'Course_Description_Section',
  fields: {
    title: {
      type: GraphQLString,
      description: 'The title of the department.',
    },
    code: {
      type: GraphQLString,
      description: 'The prefix for course codes within this section.',
    },
    details: {
      type: new GraphQLObjectType({
        name: 'Course_Description_Section_Details',
        fields: {
          details: {
            type: GraphQLString,
            description: 'Extra information covering the whole section.',
          },
          courses: {
            type: GraphQLList(courseDescription),
            description: 'All current courses listed by this department.',
          },
        },
      }),
      resolve: calendarResolvers.courseDescriptionSection,
    },
  },
});

const calendar = new GraphQLObjectType({
  name: 'Academic_Calendar',
  description:
    "Information gathered from an institution's undergraduate calendar.",
  fields: {
    institution: {
      type: GraphQLNonNull(institution),
      description: 'The institution which this calendar belongs to.',
    },
    year: {
      type: GraphQLNonNull(GraphQLString),
      description: 'The year which this calendar represents.',
    },
    // the following is a 1:1 section mapping from the UoG calendar
    disclaimer: {
      type: infoSection,
      resolve: calendarResolvers.disclaimer,
      description: 'The "Disclaimer" section from the academic calendar.',
    },
    courses: {
      type: new GraphQLObjectType({
        name: 'Course_Descriptions',
        fields: {
          description: {
            type: infoList,
            description:
              'General information pertaining to all course descriptions.',
          },
          sections: {
            type: GraphQLList(courseDescriptionSection),
            description: 'Each individual department offering courses.',
          },
        },
      }),
      resolve: calendarResolvers.courseDescriptions,
      description:
        'The "Course Descriptions" section from the academic calendar.',
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
      resolve: require('./resolvers/course.resolver'),
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
    },
    search: {
      type: search,
      resolve: require('./resolvers/search.resolver'),
      args: {
        query: {
          type: GraphQLNonNull(GraphQLString),
          description: 'The search term used to determine the search results.',
        },
        term: {
          type: GraphQLNonNull(term),
          description: 'The term to search within.',
        },
        institution: {
          type: GraphQLNonNull(institution),
          description: 'The institution to search within.',
        },
        skip: {
          type: GraphQLInt,
          description:
            'Number of results to skip before returning, used for pagination in conjuction with limit.',
        },
        limit: {
          type: GraphQLInt,
          description:
            'Number of results to return before cutting off, used for pagination in conjuction with skip.',
        },
      },
    },
    calendar: {
      type: calendar,
      resolve: calendarResolvers.calendar,
      args: {
        institution: {
          type: GraphQLNonNull(institution),
          description: 'The institution to get the academic calendar for.',
        },
        year: {
          type: GraphQLInt,
          description:
            'The year to get the calendar for, defaults to current year.',
        },
      },
    },
  },
});

const schema = new GraphQLSchema({ query });

module.exports = schema;
