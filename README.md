# webadvisor-api

### Dependencies
- NodeJS 8+
- npm 4+

### Usage
A `nodemon` based development server can be ran using `npm run dev`.

A production ready server can be started with `npm run prod`.

Course structure
----------------
#### Schema
```javascript
courses = [{
    code: string,
    name: string,
    description: string,
    term: string,
    credits: number,
    location: string,
    level: string,
    prereqs: [courseCode: string],
    restrictions: [courseCode: string],
    sections: [{
        sectionId: string,
        faculty: string,
        available: number,
        capacity: number,
        status: string,
        meetings: [{
            type: string,
            day: string,
            start: string, // (ISO 8601 extended time)
            end: string, // (ISO 8601 extended time)
            location: string,
            building: string,
            room: string
        }]
    }]
}];
```

#### Sample Data
// TODO: get sample data...
```javascript
sampleCourses = [];
```
