import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as product_service from './product-service';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new product_service.ProductService(this, 'Products');
  }
}
