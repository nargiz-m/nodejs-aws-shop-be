import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class ProductService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const funcProps = {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler'
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

    const api = new apigateway.RestApi(this, "products-api", {
      restApiName: "Propduct Service"
    });

    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsList));
    products.addMethod('POST', new apigateway.LambdaIntegration(createProduct));

    const product = products.addResource('{product_id}');
    product.addMethod('GET', new apigateway.LambdaIntegration(getProductsById));
  }
}