import fs from 'fs/promises';
import path from 'path';

import ElectronStore from 'electron-store';

const logStore = new ElectronStore({ name: 'log' });

export const logger = async (error: Error, isFatal: boolean = false) => {
	const data = {
		time: new Date().toUTCString(),
		error: { name: error?.name, message: error.message, stack: error?.stack },
	};
	console.log(error);

	const logData: LogData = logStore.store as any;

	if (logData && Object.keys(logData).length > 0) {
		logData.logs.push(data);
		logStore.store = logData as any;
	} else {
		logStore.store = { logs: [data] };
	}

	// await fs.readFile(path.join(__dirname, 'temp', 'log.json'), { encoding: 'utf-8' }).then(
	// 	async (str) => {
	// 		try {
	// 			const jsonData = JSON.parse(str);
	// 			if (jsonData) {
	// 				jsonData.logs.push(data);
	// 				await fs
	// 					.writeFile(path.join(__dirname, 'temp', 'log.json'), JSON.stringify(jsonData), {
	// 						encoding: 'utf-8',
	// 					})
	// 					.catch((err) => console.log(err));
	// 			} else console.log('Error in logger', jsonData);
	// 		} catch (err) {
	// 			throw err;
	// 		}
	// 	},
	// 	async (err) => {
	// 		if (err.code === 'ENOENT') {
	// 			const jsonData = JSON.stringify({ logs: [data] });
	// 			await fs
	// 				.writeFile(path.join(__dirname, 'temp', 'log.json'), jsonData, {
	// 					encoding: 'utf-8',
	// 				})
	// 				.catch((err) => console.log(err));
	// 		} else console.log(err);
	// 	}
	// );
	if (isFatal) throw error;
	return;
};
