# webadvisor-api

### Dependencies
- NodeJS 8+
- npm 4+

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
    sections: [{
        sectionId: number,
        faculty: string,
        available: number,
        capacity: number,
        status: string,
        meetings: [{
            type: string,
            start: string, // (ISO 8601 extended time with timezone)
            end: string, // (ISO 8601 extended time with timezone)
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
