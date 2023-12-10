import { APIGatewayProxyEvent } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({});
export const handler = async (event: APIGatewayProxyEvent) => {
    const fileName = event.queryStringParameters?.name;

    if(!fileName) {
        return {
            statusCode: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: "File name is missing"
        }
    }

    if(!fileName.includes(".csv")) {
        return {
            statusCode: 400,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: "Wrong file format"
        }
    }

    try {
        const command = new PutObjectCommand({
            Bucket: "s3-import-service-bucket",
            Key: `uploaded/${fileName}`,
        });
        const url = await getSignedUrl(client, command, {
            expiresIn: 3600
        })
        
        return {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: url
        }
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
            body: 'Server error occurred'
        };
    }
}