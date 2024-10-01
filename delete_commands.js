import { REST, Routes } from "discord.js";
import dotenv from 'dotenv';
dotenv.config();

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.dtoken);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

/* for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);
*/