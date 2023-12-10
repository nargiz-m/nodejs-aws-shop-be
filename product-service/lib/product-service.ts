import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import 'dotenv/config';
import { Queue } from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export class ProductService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const funcProps = {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      environment: {
        PRODUCTS_TABLE_NAME: process.env.PRODUCTS_TABLE_NAME as string,
        STOCKS_TABLE_NAME: process.env.STOCKS_TABLE_NAME as string,
      }
    }

    const getProductsList = new NodejsFunction(this, "getProductsList", {
      ...funcProps,
      entry: "handlers/getProductsList.ts",
    })

    const createProduct = new NodejsFunction(this, "createProduct", {
      ...funcProps,
      entry: "handlers/createProduct.ts",
    })

    const getProductsById = new NodejsFunction(this, "getProductsById", {
      ...funcProps,
      entry: "handlers/getProductsById.ts",
    })

    const catalogBatchProcess = new NodejsFunction(this, "catalogBatchProcess", {
      ...funcProps,
      entry: "handlers/catalogBatchProcess.ts",
    })

    const catalogItemsQueue = new Queue(this, 'catalogItemsQueue');
    const eventSource = new SqsEventSource(catalogItemsQueue, {
      batchSize: 5
    });
    catalogBatchProcess.addEventSource(eventSource);

    const api = new apigateway.RestApi(this, "products-api", {
      restApiName: "Propduct Service",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    });

    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsList));
    products.addMethod('POST', new apigateway.LambdaIntegration(createProduct));

    const product = products.addResource('{product_id}');
    product.addMethod('GET', new apigateway.LambdaIntegration(getProductsById));
  }
}