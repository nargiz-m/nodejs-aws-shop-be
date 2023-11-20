import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

export class ProductService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const getProductsList = new Function(this, "getProductsList", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset('handlers'),
      handler: 'getProductsList.handler',
    })

    const getProductsById = new Function(this, "getProductsById", {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset('handlers'),
      handler: 'getProductsById.handler',
    })

    const api = new apigateway.RestApi(this, "products-api", {
      restApiName: "Propduct Service"
    });

    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsList));

    const product = products.addResource('{product_id}');
    product.addMethod('GET', new apigateway.LambdaIntegration(getProductsById));
  }
}