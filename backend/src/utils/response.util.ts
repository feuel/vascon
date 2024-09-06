export class ResponseWrapper {
  metadata: Record<string, unknown>;
  data: unknown;
  constructor(data: unknown, metadata: Record<string, unknown> = {}) {
    this.data = data;
    this.metadata = metadata;
  }
}
