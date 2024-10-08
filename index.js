// Import the necessary discord.js classes
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// To store commands
client.commands = new Collection();

const cmdsFolderPath = path.join(path.resolve(), 'commands');
const commandTypes = fs.readdirSync(cmdsFolderPath);

for (const folder of commandTypes) {
    const folderPath = path.join(path.resolve(), 'commands', folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = await import(`file://${filePath}`);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(path.resolve(), 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(`file://${filePath}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log in to Discord with your client's token
client.login(process.env.dtoken);
