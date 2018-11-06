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
            location: string
        }]
    }]
}];
```

#### Sample Data
```javascript
sampleCourses = [{
     "code": "CIS*1500",
     "name": "Introduction to Programming",
     "credits": "0.50",
     "location": "Guelph",
     "level": "Undergraduate",
     "term": "W19",
     "sections": [{
         "sectionId": "0101",
         "faculty": "R. Chaturvedi",
         "available": 0,
         "capacity": 2,
         "status": "Closed",
         "meetings": [{
             "type": "LEC",
             "day": "tuesday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
             "type": "LEC",
             "day": "thursday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
            "type": "LAB",
            "day": "tuesday",
            "start": "09:30",
            "end": "11:20",
            "location": "THRN, Room 3401"
        }]
     }, {
         "sectionId": "0102",
         "faculty": "R. Chaturvedi",
         "available": 0,
         "capacity": 2,
         "status": "Closed",
         "meetings": [{
             "type": "LEC",
             "day": "tuesday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
             "type": "LEC",
             "day": "thursday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
            "type": "LAB",
            "day": "wednesday",
            "start": "12:30",
            "end": "14:20",
            "location": "THRN, Room 3401"
        }]
     }, {
         "sectionId": "0103",
         "faculty": "R. Chaturvedi",
         "available": 1,
         "capacity": 2,
         "status": "Open",
         "meetings": [{
             "type": "LEC",
             "day": "tuesday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
             "type": "LEC",
             "day": "thursday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
            "type": "LAB",
            "day": "thursday",
            "start": "09:30",
            "end": "11:20",
            "location": "THRN, Room 3401"
        }]
     }, {
         "sectionId": "0104",
         "faculty": "R. Chaturvedi",
         "available": 0,
         "capacity": 2,
         "status": "Closed",
         "meetings": [{
             "type": "LEC",
             "day": "tuesday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
             "type": "LEC",
             "day": "thursday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
            "type": "LAB",
            "day": "thursday",
            "start": "11:30",
            "end": "13:20",
            "location": "THRN, Room 3401"
        }]
     }, {
         "sectionId": "0105",
         "faculty": "R. Chaturvedi",
         "available": 0,
         "capacity": 2,
         "status": "Closed",
         "meetings": [{
             "type": "LEC",
             "day": "tuesday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
             "type": "LEC",
             "day": "thursday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
            "type": "LAB",
            "day": "monday",
            "start": "14:30",
            "end": "16:20",
            "location": "THRN, Room 3401"
        }]
     }, {
         "sectionId": "0106",
         "faculty": "R. Chaturvedi",
         "available": 2,
         "capacity": 2,
         "status": "Open",
         "meetings": [{
             "type": "LEC",
             "day": "tuesday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
             "type": "LEC",
             "day": "thursday",
             "start": "16:00",
             "end": "17:20",
             "location": "MACN, Room 113"
         }, {
            "type": "LAB",
            "day": "tuesday",
            "start": "11:30",
            "end": "13:20",
            "location": "THRN, Room 3401"
        }]
     }]
 }];
```
