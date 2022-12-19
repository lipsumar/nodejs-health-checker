import { Dialects, IntegrationConfig } from "../../src/interfaces/types";
import { redisCheck } from "../../src/integrations/redis";
import { memcacheCheck } from "../../src/integrations/memcache";
import { webCheck } from "../../src/integrations/web";
import { dynamoCheck } from "../../src/integrations/dynamo";
import { databaseCheck } from "../../src/integrations/database";
import { customCheck } from "../../src/integrations/custom";
import { REDIS_HOST, MEMCACHED_HOST, WEB_HOST, DYNAMO_HOST, DATABASE_HOST } from "../../src/envs";

export interface HealthCheckDetailedTestScenario {
  [key: string]: HealthCheckDetailedTestConfig;
}

export interface HealthCheckDetailedTestConfig {
  expected: boolean;
  config: IntegrationConfig;
}
// all this tests must be exec in docker context
export const scenarios: HealthCheckDetailedTestScenario = {
  redisTruthy: {
    expected: true,
    config: redisCheck({
      name: "jest-test-redis",
      host: REDIS_HOST,
    }),
  },
  redisFalsy: {
    expected: false,
    config: redisCheck({
      name: "jest-test-redis",
      host: REDIS_HOST,
      port: 100,
      auth: {
        password: "sdf",
      },
    }),
  },
  memcachedTruthy: {
    expected: true,
    config: memcacheCheck({
      name: "jest-test-memcached",
      host: MEMCACHED_HOST,
      port: 11211,
    }),
  },
  memcachedDefaultTimeout: {
    expected: true,
    config: memcacheCheck({
      name: "jest-test-memcached",
      host: MEMCACHED_HOST,
      port: 11211,
      timeout: 1001,
    }),
  },
  memcachedFalsy: {
    expected: false,
    config: memcacheCheck({
      name: "jest-test-memcached",
      host: MEMCACHED_HOST,
      port: 11299,
    }),
  },
  webIntegrationTruthy: {
    expected: true,
    config: webCheck({
      name: "jest-test-web",
      url: WEB_HOST,
    }),
  },
  webIntegrationFalsy: {
    // status 404
    expected: false,
    config: webCheck({
      name: "jest-test-web",
      url: `${WEB_HOST}sssssssss`,
      timeout: 4000,
      headers: [{ key: "Accept", value: "application/json" }],
    }),
  },
  webIntegrationTimeout: {
    expected: false,
    config: webCheck({
      name: "jest-test-web",
      url: `${WEB_HOST}sssssssss`,
      timeout: 4,
      headers: [{ key: "Accept", value: "application/json" }],
    }),
  },
  dynamoIntegrationTruthy: {
    expected: true,
    config: dynamoCheck({
      name: "jest-test-dynamodb",
      host: DYNAMO_HOST,
      port: 8000,
      Aws: {
        region: "us-east-1",
        access_key_id: "",
        secret_access_key: "",
      },
    }),
  },
  dynamoIntegrationFalsy: {
    expected: false,
    config: dynamoCheck({
      name: "jest-test-dynamodb",
      host: DYNAMO_HOST,
      port: 8001,
    }),
  },
  databaseIntegrationTruthy: {
    expected: true,
    config: databaseCheck({
      name: "jest-test-postgres",
      host: DATABASE_HOST,
      port: 5432,
      dbName: "postgres",
      dbUser: "postgres",
      dbPwd: "root",
      dbDialect: Dialects.postgres,
    }),
  },
  databaseIntegrationFalsy: {
    expected: false,
    config: databaseCheck({
      name: "jest-test-postgres",
      host: DATABASE_HOST,
      port: 8001,
      dbDialect: "postgres",
      dbUser: "foo",
      dbPwd: "foo",
      dbName: "foo",
    }),
  },
  customIntegrationTruthy: {
    expected: true,
    config: customCheck({
      name: "custom-integration",
      customCheckerFunction: async () => {
        return {
          status: true,
        };
      },
    }),
  },
  customIntegrationFalsy: {
    expected: false,
    config: customCheck({
      name: "custom-integration",
      customCheckerFunction: async () => {
        return {
          status: false,
          error: { message: "Something has failed" },
        };
      },
    }),
  },
  customIntegrationFunctionThrows: {
    expected: false,
    config: customCheck({
      name: "custom-integration-missing-function",
      host: "my-custom-integration-host",
      customCheckerFunction: () => {
        throw new Error("Help!");
      },
    }),
  },
};
