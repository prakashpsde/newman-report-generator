const fs = require('fs');
const newman = require('newman'); // require newman in your project
const csvParser = require("csv-parser");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const collectionJSON = require('./sample-collection.json');
const csvPath = './TestResults/TestResults.csv';

function updateCSVFile (data) {

    const csvWriter = createCsvWriter({
        path: csvPath,
        header: [
            {id: 'name', title: 'NAME'},
            {id: 'lang', title: 'LANGUAGE'}
        ]
    });
    
    const records = [
        {name: 'Bob',  lang: 'French, English'},
        {name: 'Mary', lang: 'English'}
    ];
    
    csvWriter.writeRecords(records)
        .then(() => {
            console.log('...Done');
        });

    const result = [];

    fs.createReadStream(csvPath)
    .pipe(csvParser())
    .on("data", (data) => {
        result.push(data);
        console.log(data)
    })
    .on("end", () => {
        console.log(result);
    });
};

// call newman.run to pass `options` object and wait for callback
newman.run({
    collection: collectionJSON,
    reporters: 'cli'
}, function (err) {
	if (err) { throw err; }
    console.log('collection run complete!');
}).on('beforeDone', (error, data) => {
    if (error) {
        throw error;
    }

    //Calling Function to Run After Capturing the Neccessary Data
    updateCSVFile(data);     
});