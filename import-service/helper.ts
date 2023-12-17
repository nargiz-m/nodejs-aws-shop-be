import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import stripBomStream from "strip-bom-stream";
import csvParser = require("csv-parser");

export const parseFile = (stream: NodeJS.ReadableStream) => {
    const results: string[] = [];
    return new Promise((resolve, reject) => {
        stream
        .pipe(stripBomStream())
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            resolve(results)
        })
        .on('error', reject)
    })
}