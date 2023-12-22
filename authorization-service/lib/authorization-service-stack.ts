import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuthorizationService } from './authorization-service';

export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new AuthorizationService(this, 'Authorization');
  }
}
