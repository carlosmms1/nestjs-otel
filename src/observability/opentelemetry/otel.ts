import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

import { otelConfig } from './otel.config';

export class OpenTelemetry {
  private _sdk: NodeSDK;

  constructor() {
    this._sdk = new NodeSDK({
      resource: new Resource({
        [ATTR_SERVICE_NAME]: otelConfig.OTEL_SERVICE_NAME,
        [ATTR_SERVICE_VERSION]: otelConfig.OTEL_SERVICE_VERSION,
      }),
    });
  }

  public start() {
    this._sdk.start();
  }
}
