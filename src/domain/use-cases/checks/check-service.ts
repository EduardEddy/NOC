import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repositry";

interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccessCallbacks = (() => void) | undefined;
type ErrorCallbacks = ((error: string) => void) | undefined;
export class CheckService implements CheckServiceUseCase {

  constructor(
    private readonly logRepository: LogRepository,
    private readonly successCallbacks: SuccessCallbacks,
    private readonly errorCallbacks: ErrorCallbacks
  ) { }

  async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);
      if (!req.ok) throw new Error(`Error on check service ${url}`);
      const log = new LogEntity({
        message: `Service ${url} working`,
        level: LogSeverityLevel.low,
        origin: 'checkt-service.ts'
      });
      this.logRepository.saveLog(log)
      this.successCallbacks && this.successCallbacks();
      return true;
    } catch (error) {
      const errorMessage = `${url} ${error}`;
      const log = new LogEntity({
        message: errorMessage, level: LogSeverityLevel.high,
        origin: 'checkt-service.ts'
      });
      this.logRepository.saveLog(log)
      this.errorCallbacks && this.errorCallbacks(errorMessage);
      return false;
    }
  }
}