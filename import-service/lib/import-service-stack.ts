import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ImportService } from './import-service';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ImportService(this, 'Import');
  }
}
