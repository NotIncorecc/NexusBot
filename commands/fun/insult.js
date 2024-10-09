import { SlashCommandBuilder } from "discord.js";
import axios from "axios";

export const data = new SlashCommandBuilder()
    .setName('insult')
    .setDescription('Insult the mentioned user')
    .addUserOption(option => option.setName('user').setDescription('The user to insult').setRequired(true));

export async function execute(interaction) {
    const user = interaction.options.getUser('user');
    if (user.id==='1254447825039659009' || user.bot) return await interaction.reply('I cannot insult myself or other bots');

    const req = (await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json')).data;
    await interaction.reply(`${user} ${req.insult}`);
}