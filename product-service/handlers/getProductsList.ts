import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";

export const handler = async () => {
  const dbClient = new DynamoDBClient({
    credentials: fromIni({profile: 'default'}),
  });
  const docClient = DynamoDBDocumentClient.from(dbClient);
  const command = new ScanCommand({TableName: "Products"});
  const response = await docClient.send(command);

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(response.Items)
  };
};