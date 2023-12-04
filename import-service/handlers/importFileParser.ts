import { S3Event } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { parseFile } from "../helper";

const client = new S3Client({});

export const handler = async (event: S3Event) => {
  const command = new GetObjectCommand({
    Bucket: "s3-import-service-bucket",
    Key: event.Records[0].s3.object.key,
  });
  try {
    const response = await client.send(command);
    const resBody = await response.Body as NodeJS.ReadableStream;
    const results = await parseFile(resBody)
    console.log('>>>>> S3 Trigger Success: ', JSON.stringify(results));
  } catch (err) {
    console.error('>>>>> S3 Trigger Error: ', err);
  }
};