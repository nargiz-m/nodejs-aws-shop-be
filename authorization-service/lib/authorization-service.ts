import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import 'dotenv/config';

export class AuthorizationService extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const funcProps = {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            environment: process.env as Record<string, string>,
        }
      
        const basicAuthorizer = new NodejsFunction(this, "basicAuthorizerLambda", {
            ...funcProps,
            entry: "handlers/basicAuthorizer.ts",
        });
    }
}