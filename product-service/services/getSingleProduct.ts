import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

export const getSingleProduct = async (productId: string) => {
    const dbClient = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(dbClient);
    const getProduct = new QueryCommand({
        TableName: "Products",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": productId }
    });
    const getStock = new QueryCommand({
        TableName: "Stocks",
        KeyConditionExpression: "product_id = :id",
        ExpressionAttributeValues: { ":id": productId }
    });
    const product = await docClient.send(getProduct);
    const stock = await docClient.send(getStock);

    return product.Items?.length ? {
        ...product.Items[0],
        count: stock.Items?.length ? stock.Items[0].count : 0
    } : undefined;
}