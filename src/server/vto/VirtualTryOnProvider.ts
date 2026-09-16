import type { VirtualTryOnJob } from "../../types/vto";
export interface VirtualTryOnProvider {
  create(input: {
    userImageReference: string;
    garmentImageReference: string;
    garmentCategory: string;
  }): Promise<Pick<VirtualTryOnJob, "providerRequestId" | "status">>;
  status(
    providerRequestId: string,
  ): Promise<{ status: VirtualTryOnJob["status"]; resultBytes?: Uint8Array }>;
}
export class MockVirtualTryOnProvider implements VirtualTryOnProvider {
  private fail: boolean;
  constructor(fail = false) {
    this.fail = fail;
  }
  async create() {
    if (this.fail) throw new Error("VTO_PROVIDER_FAILED");
    return {
      providerRequestId: crypto.randomUUID(),
      status: "PROCESSING" as const,
    };
  }
  async status() {
    return {
      status: "COMPLETED" as const,
      resultBytes: new Uint8Array([0xff, 0xd8, 0xff, 0xd9]),
    };
  }
}
