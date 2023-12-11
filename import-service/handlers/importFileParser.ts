import { S3Event } from "aws-lambda";
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { parseFile } from "../helper";
import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";

const client = new S3Client({});
const sqsClient = new SQSClient({});

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
    const result = await parseFile(resBody)
    const sendResponse = await sqsClient.send(new SendMessageBatchCommand({
      QueueUrl: process.env.QUEUE_URL,
      Entries: (result as string[]).map((res, i) => ({
        Id: i.toString(),
        MessageBody: JSON.stringify(res)
      })),
    }));
    console.log('>>>>> S3 Trigger Success: ', JSON.stringify(sendResponse))
    const copyResponse = await client.send(copyCommand);
    console.log(JSON.stringify(copyResponse));
    const deleteResponse = await client.send(deleteCommand);
    console.log(JSON.stringify(deleteResponse));
  } catch (err) {
    console.error('>>>>> S3 Trigger Error: ', err);
  }
};
