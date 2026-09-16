export type AiUsageLimits = {
  requestsPerMinute: number;
  maxToolCalls: number;
  maxInputLength: number;
  maxOutputLength: number;
};
export class AiUsageGuard {
  private readonly requests = new Map<string, number[]>();
  readonly limits: AiUsageLimits;
  constructor(limits: AiUsageLimits) {
    this.limits = limits;
  }
  assertRequest(subject: string, input: string) {
    if (input.length > this.limits.maxInputLength)
      throw new Error("AI_INPUT_TOO_LONG");
    const now = Date.now();
    const recent = (this.requests.get(subject) ?? []).filter(
      (time) => now - time < 60000,
    );
    if (recent.length >= this.limits.requestsPerMinute)
      throw new Error("AI_RATE_LIMIT");
    recent.push(now);
    this.requests.set(subject, recent);
  }
  assertToolCalls(count: number) {
    if (count > this.limits.maxToolCalls) throw new Error("AI_TOOL_LIMIT");
  }
  truncateOutput(value: string) {
    return value.slice(0, this.limits.maxOutputLength);
  }
}
export const defaultAiUsageGuard = new AiUsageGuard({
  requestsPerMinute: 12,
  maxToolCalls: 5,
  maxInputLength: 1200,
  maxOutputLength: 4000,
});
