import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Product } from '../models/Product';

export const postNewProduct = async (product: Partial<Product>) => {
    const { id, ...productInfo } = product;
    const dbClient = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(dbClient);
    const newProduct = {
        id: uuidv4(),
        ...productInfo
    };
    const command = new PutCommand({
        TableName: "Products",
        Item: newProduct
    });
    
    const response = await docClient.send(command);
    console.log(response);
    
    return newProduct;
}