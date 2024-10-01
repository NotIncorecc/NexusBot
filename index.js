// Require the necessary discord.js classes
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import fs from "node:fs";
import path from "node:path"
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
//to store commands
client.commands = new Collection();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const folder_path = path.join(__dirname,'commands');
const command_types = fs.readdirSync(folder_path);

for (const f of command_types) {
    const ct_path = path.join(folder_path, f);
    const command_files = fs.readdirSync(ct_path).filter(n => n.endsWith('.js'));
    for (const c of command_files) {
        const c_path = path.join(ct_path, c);
        //const command = require(c_path);
		const command = await import(c_path);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${c_path} is missing a required "data" or "execute" property.`);
		}

    }

};

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = import(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(process.env.dtoken);
