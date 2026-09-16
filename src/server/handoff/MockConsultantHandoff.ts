import type { AiHandoffRequest } from "../../types/ai";
export type HandoffConfirmation = {
  status: "queued";
  reference: string;
  message: string;
  payload: AiHandoffRequest;
};
export interface ConsultantHandoff {
  request(payload: AiHandoffRequest): Promise<HandoffConfirmation>;
}
export class MockConsultantHandoff implements ConsultantHandoff {
  async request(payload: AiHandoffRequest) {
    return {
      status: "queued" as const,
      reference: `consultant-${crypto.randomUUID()}`,
      message:
        "Запрос передан в очередь консультанта. Это демонстрационный режим: сообщение реальному сотруднику не отправлялось.",
      payload,
    };
  }
}
