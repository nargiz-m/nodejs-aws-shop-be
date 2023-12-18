import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";
import 'dotenv/config';

export class ImportService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const funcProps = {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            environment: {
                QUEUE_URL: process.env.QUEUE_URL as string,
            }
        }

        const s3Bucket = Bucket.fromBucketName(this, 'bucketId', 's3-import-service-bucket');
        const importFileParser = new NodejsFunction(this, 'importFileParser', {
            ...funcProps,
            entry: "handlers/importFileParser.ts",
        })
        s3Bucket.addEventNotification(EventType.OBJECT_CREATED, new LambdaDestination(importFileParser), { prefix: 'uploaded/' })

        const basicAuthorizer = NodejsFunction.fromFunctionArn(this, "basicAuthorizer",
            process.env.AUTHORIZER_ARN as string
        );
        const tokenAuthorizer = new apigateway.TokenAuthorizer(this, "myAuthorizer", {
            handler: basicAuthorizer,
            identitySource:'method.request.header.Authorization'
        })
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
        importRoot.addMethod('GET', new apigateway.LambdaIntegration(importProductsFile), {
            authorizer: tokenAuthorizer
        });
    }
}