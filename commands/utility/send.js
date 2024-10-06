import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send a message to the mentioned user')
    .addUserOption(option => option.setName('user').setDescription('The user to send the message to').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('The message to send to the user').setRequired(true));

export async function execute(interaction) {
    const user = interaction.options.getUser('user');
    const message = interaction.options.getString('message');

    await user.send(message);
    await interaction.reply(`Message sent to ${user.tag}`);
}