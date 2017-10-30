const { resolve } = require('path');
const { readFileSync } = require('fs');
const _ = require('lodash');
const writeJson = require('./utils/write-json');
const mdToJson = require('./utils/md-to-json');

// get README.md as string
let file = resolve(__dirname, './README.md');
let md = readFileSync(file).toString();

// maps markdown string to object in which all headings are keys
let rawJson = mdToJson(md);

// create array of [key, value] pairs from parsed markdown object
let jsonEntries = Object.entries(rawJson);

// change [key, value] pairs into objects where { name: key, info: value }
// identify any object keys that are flagged as duplicate names
// remove the duplicate flag from those strings before assinging their value to name property
let data = jsonEntries.map((i) => {
    let hasDupeFlag = /.+!DUPE\+\d+/g;

    if (hasDupeFlag.test(i[0])) {
      let trimmedName = _.split(i[0], /!DUPE\+\d+/, 1)[0];
      i[0] = trimmedName;
    }

    return {
        name: i[0],
        info: i[1]
    };
});

// define values for objects parsed from markdown (unrelated to data) that we want to remove
let nameValuesToPull = [
    { name: 'Fempire' }, 
    { name: 'Example Format' }, 
    { name: 'Full Name (First, Last)'},
    { name: 'Table of Contents'},
    { name: 'undefined'}
]; 

// remove objects unrelated to data
let cleanData = _.pullAllBy(data, nameValuesToPull , 'name');

writeJson('data/all.json', cleanData); // write all data


// get indices of section headers
let indexOfSpeakers = _.findIndex(cleanData, { name: 'Women Tech Speakers' });
let indexOfOrganizers = _.findIndex(cleanData, { name: 'Women Tech Organizers' });
let indexOfInterested = _.findIndex(cleanData, { name: 'Women Interested In Getting Started / Getting Involved' });
let indexOfMentors = _.findIndex(cleanData, { name: 'People Interested In Mentoring Women' });


// create new array for each of the data types (speakers, organizers, interested, mentors)
// still in jsonML
let speakers = cleanData.slice(indexOfSpeakers, indexOfOrganizers);
let organizers = cleanData.slice(indexOfOrganizers, indexOfInterested);
let interested = cleanData.slice(indexOfInterested, indexOfMentors);
let mentors = cleanData.slice(indexOfMentors);


// write separated lists to individual files
writeJson('data/speakers-data.json', speakers); 
writeJson('data/organizers-data.json', organizers); 
writeJson('data/interested-data.json', interested); 
writeJson('data/mentors-data.json', mentors); 
