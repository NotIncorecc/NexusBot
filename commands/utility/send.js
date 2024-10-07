import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('send')
    .setDescription('Send a message to the mentioned user')
    .addUserOption(option => option.setName('user').setDescription('The user to send the message to').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('The message to send to the user').setRequired(true))
    .addBooleanOption(option => option.setName('sender').setDescription('Whether to keep the sender anonymous').setRequired(false));

export async function execute(interaction) {
    const user = interaction.options.getUser('user');
    const message = interaction.options.getString('message');
    const sender = interaction.options.getBoolean('sender') || false;
    if (user.id==='1254447825039659009' || user.bot) return await interaction.reply('I cannot send messages to myself or other bots');
    
    if (sender) {
        await user.send(`An anonymous user has sent you a message:\n${message}`);
        await interaction.reply(`Message sent to ${user.tag} anonymously`);
        return;
    } else {
        await user.send(`You have received a message from ${interaction.user.tag} of the guild ${interaction.guild.name}:\n${message}`);
        await interaction.reply(`Message sent to ${user.tag}`);
    }
}