import { SQSEvent } from "aws-lambda";
import { productSchema } from "../validation/productValidator";
import { postNewProduct } from "../services/postNewProduct";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

export const handler = async (event: SQSEvent) => {
    console.log('Catalog batch process started')
    const snsClient = new SNSClient({});
    for (const message of event.Records) {
        try {
            const productObj = JSON.parse(message.body ?? '')
            const {error} = productSchema.validate(productObj);
            if(error) {
                throw error
            }
            const productId = await postNewProduct(productObj) 
            console.log("PRODUCT CREATED: ", productId);
            const response =  await snsClient.send(new PublishCommand({
                TopicArn: process.env.TOPIC_ARN,
                Subject: "New Product",
                Message: `${productId} has been created`,
                MessageAttributes: {
                    count: {
                      DataType: "Number",
                      StringValue: String(productObj.count),
                    },
                },
            }))
            console.log('email sent: ', response)
        } catch (e) {
            console.error((e as Error).message)
        }
    }
}