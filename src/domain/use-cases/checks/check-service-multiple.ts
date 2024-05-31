import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repositry";

interface CheckServiceMultipleUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallbacks = (() => void) | undefined;
type ErrorCallbacks = ((error: string) => void) | undefined;

export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
  constructor(
    private readonly logRepository: LogRepository[],
    private readonly successCallbacks: SuccessCallbacks,
    private readonly errorCallbacks: ErrorCallbacks
  ) { }

  private callLogs(log: LogEntity) {
    this.logRepository.forEach(logRepository => {
      logRepository.saveLog(log);
    })
  }

  async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);
      if (!req.ok) throw new Error(`Error on check service ${url}`);
      const log = new LogEntity({
        message: `Service ${url} working`,
        level: LogSeverityLevel.low,
        origin: 'checkt-service.ts'
      });
      this.callLogs(log)
      this.successCallbacks && this.successCallbacks();
      return true;
    } catch (error) {
      const errorMessage = `${url} ${error}`;
      const log = new LogEntity({
        message: errorMessage, level: LogSeverityLevel.high,
        origin: 'checkt-service.ts'
      });
      this.callLogs(log)
      this.errorCallbacks && this.errorCallbacks(errorMessage);
      return false;
    }
  }
}