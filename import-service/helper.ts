import csvParser = require("csv-parser");

export const parseFile = (stream: NodeJS.ReadableStream) => {
    const results: string[] = [];
    return new Promise((resolve, reject) => {
        stream
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            resolve(results)
        })
        .on('error', reject)
    })
}