import { CheckService } from "../domain/use-cases/checks/check-service";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";

const fsLogRepository = new LogRepositoryImpl(
	new FileSystemDatasource()
);
const mongoLogRepository = new LogRepositoryImpl(
	new MongoLogDatasource()
);
const postgressLogRepository = new LogRepositoryImpl(
	new PostgresLogDatasource()
);
const emailService = new EmailService();

export class Server {
	public static start() {
		console.log('Starting');
		//new SendEmailLogs(emailService, logRepository).execute(['doble_e87@hotmail.com'])
		//emailService.sendEmailWithFileSystemLogs(['doble_e87@hotmail.com'])
		/*emailService.sendEmail({
			to: 'doble_e87@hotmail.com',
			subject: 'Logs de sistema',
			htmlBody: `
				<h1>Logs de sistema - NOC</h1>
				<p>lorem ipsum dolor sit amet</p>
				<p>Ver logs adjunto</p>
			`
		})*/
		CronService.createJob('*/5 * * * * *', () => {
			new CheckServiceMultiple(
				[fsLogRepository, mongoLogRepository, postgressLogRepository],
				() => console.log('Success'),
				(error) => { console.log(error); }
			).execute('https://www.google.com')
			//new CheckService().execute('http://localhost:3000')
		});

	}
}