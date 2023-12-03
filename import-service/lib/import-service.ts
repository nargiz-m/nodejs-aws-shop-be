import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";

export class ImportService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const funcProps = {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler'
        }

        const s3Bucket = Bucket.fromBucketName(this, 'bucketId', 's3-import-service-bucket');
        const importFileParser = new NodejsFunction(this, 'importFileParser', {
            ...funcProps,
            entry: "handlers/importFileParser.ts",
        })
        s3Bucket.addEventNotification(EventType.OBJECT_CREATED, new LambdaDestination(importFileParser), { prefix: 'uploaded/' })

        const importProductsFile = new NodejsFunction(this, 'importProductsFile', {
            ...funcProps,
            entry: "handlers/importProductsFile.ts",
        })

        const api = new apigateway.RestApi(this, "import-api", {
            restApiName: "Import Service",
            defaultCorsPreflightOptions: {
              allowOrigins: apigateway.Cors.ALL_ORIGINS,
              allowMethods: apigateway.Cors.ALL_METHODS
            }
        })

        const importRoot = api.root.addResource('import');
        importRoot.addMethod('GET', new apigateway.LambdaIntegration(importProductsFile));
    }
}