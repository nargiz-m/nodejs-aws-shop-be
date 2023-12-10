import { SQSEvent } from "aws-lambda";
import { productSchema } from "../validation/productValidator";
import { postNewProduct } from "../services/postNewProduct";

export const handler = async (event: SQSEvent) => {
    for (const message of event.Records) {
        try {
            const productObj = JSON.parse(message.body ?? '')
            const {error} = productSchema.validate(productObj);
            if(error) {
                throw error
            }
            const productId = await postNewProduct(productObj) 
            console.info("PRODUCT CREATED: ", productId);
        } catch (e) {
            console.error((e as Error).message)
        }
    }
}