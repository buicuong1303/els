import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-grpc';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { Resource } from '@opentelemetry/resources';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
// configure the SDK to export telemetry data to the console
// enable all auto-instrumentations from the meta package

const exporterOptions = {
  url: process.env.COLLECTOR_URL,
};

const initializeTracer = function (serviceName: string, instrumentationNames: string[]) {
  const instrumentations = instrumentationNames.map(ins => {
    switch(ins){
      case 'http':
        return new HttpInstrumentation();
      case 'graphql':
        return new GraphQLInstrumentation({ allowValues: true });
      case 'grpc':
        return new GrpcInstrumentation() as any;
      case 'amqp':
        return new AmqplibInstrumentation() as any;
      case 'fastify':
        return new FastifyInstrumentation();
    }
  });
  // Define traces
  registerInstrumentations({
    instrumentations
  });

  const provider = new NodeTracerProvider({
    resource: Resource.default().merge(
      new Resource({
        // Replace with any string to identify this service in your system
        'service.name': serviceName,
      })
    ),
  });

  const otlpExporter = new OTLPTraceExporter(exporterOptions);
  provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));
  provider.addSpanProcessor(new SimpleSpanProcessor( new ConsoleSpanExporter()));
  // Register the provider to begin tracing
  provider.register();
};
export { initializeTracer };
