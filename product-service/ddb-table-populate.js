import products from './mocks.js';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";

const dbClient = new DynamoDBClient({
  credentials: fromIni({profile: 'default'}),
});
const docClient = DynamoDBDocumentClient.from(dbClient);

products.forEach(async (product) => {
    const command = new PutCommand({
        TableName: "Products",
        Item: {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
        }
    });
    const stockCommand = new PutCommand({
        TableName: "Stocks",
        Item: {
            product_id: product.id,
            count: 10
        }
    });
      
    const response = await docClient.send(command);
    const stockResponse = await docClient.send(stockCommand);
    console.log(JSON.stringify(response))
    console.log(JSON.stringify(stockResponse))
})