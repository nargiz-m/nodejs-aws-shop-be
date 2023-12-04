import { S3Event } from "aws-lambda";
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { parseFile } from "../helper";

const client = new S3Client({});

export const handler = async (event: S3Event) => {
  const s3Key = event.Records[0].s3.object.key;
  const fileName = s3Key.slice(s3Key.lastIndexOf('/') + 1);
  const command = new GetObjectCommand({
    Bucket: "s3-import-service-bucket",
    Key: s3Key,
  });
  const copyCommand = new CopyObjectCommand({
    Bucket: "s3-import-service-bucket",
    CopySource: `s3-import-service-bucket/${s3Key}`,
    Key: `parsed/${fileName}`,
  })
  const deleteCommand = new DeleteObjectCommand({
    Bucket: "s3-import-service-bucket",
    Key: s3Key,
  })
  try {
    const response = await client.send(command);
    const resBody = await response.Body as NodeJS.ReadableStream;
    const results = await parseFile(resBody)
    console.log('>>>>> S3 Trigger Success: ', JSON.stringify(results));
    const copyResponse = await client.send(copyCommand);
    console.log(JSON.stringify(copyResponse));
    const deleteResponse = await client.send(deleteCommand);
    console.log(JSON.stringify(deleteResponse));
  } catch (err) {
    console.error('>>>>> S3 Trigger Error: ', err);
  }
};
