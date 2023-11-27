import products from './mocks';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';

const dbClient = new DynamoDBClient({
  credentials: fromIni({profile: 'default'}),
});
const docClient = DynamoDBDocumentClient.from(dbClient);

products.forEach(async (product) => {
    const input = new TransactWriteCommand({
        TransactItems: [{
            Put: {
                Item: {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    price: product.price,                
                },
                TableName: "Products",
            },
        }, {
            Put: {
                Item: {
                    product_id: product.id,
                    count: Math.floor(Math.random() * 25)
                },
                TableName: "Stocks",
            },
          },
        ]
    });
    const response = await docClient.send(input);
    console.log(JSON.stringify(response))
})