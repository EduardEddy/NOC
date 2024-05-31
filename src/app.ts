import { PrismaClient } from "@prisma/client";
import { envs } from "./config/plugins/envs.plugin";
import { LogModel, MongoDatabase } from "./data/mongo";
import { Server } from "./presentation/server";

(() => {
	main()
})();

async function main() {
	await MongoDatabase.connect({
		mongoUrl: envs.MONGO_URL,
		dbName: envs.MONGO_DB_NAME
	});

	/*const prisma = new PrismaClient();
	const newLog = await prisma.logModel.create({
		data: {
			message: "Test message",
			origin: "App.ts",
			level: 'LOW'
		}
	})

	const logs = await prisma.logModel.findMany();
	console.log({ logs })*/
	// const newLog = await LogModel.create({
	// 	message: "Test message desde Mongo",
	// 	origin: "App.ts",
	// 	level: 'low'
	// })

	// await newLog.save();

	//const logs = await LogModel.find();
	//console.log(logs);

	Server.start();
	console.log(envs.PORT)
}