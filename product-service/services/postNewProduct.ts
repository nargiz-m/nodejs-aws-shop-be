import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { Product } from '../models/Product';
import { Stock } from '../models/Stock';

export const postNewProduct = async (product: Partial<Product & Stock>) => {
    const { count, title, description, price } = product;
    const dbClient = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(dbClient);
    const id = uuidv4();
    const input = new TransactWriteCommand({
        TransactItems: [{
            Put: {
                Item: {
                    id,
                    title,
                    description,
                    price: Number(price)             
                },
                TableName: "Products",
            },
        }, {
            Put: {
                Item: {
                    product_id: id,
                    count: Number(count)
                },
                TableName: "Stocks",
            },
          },
        ]
    });
    const response = await docClient.send(input);
    console.log(response)
    return id;
}