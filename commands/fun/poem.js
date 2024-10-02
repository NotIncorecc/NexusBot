import { SlashCommandBuilder } from "discord.js";
const { EmbedBuilder } = require('discord.js');

export const data = new SlashCommandBuilder()
    .setName("poem")
    .setDescription("Generates a poem as per your genre")
    .addSubcommand(sub => 
        sub
        .setName("help")
        .setDescription("Get information about this command"))
    .addSubcommand(sub =>
        sub
        .setName("random")
        .setDescription("Gives you a random poem")
        .addStringOption(option => 
            option
            .setName("Genre")
            .setDescription("You can enter a genre if you want")
            .setRequired(false))
        .addStringOption(option =>
            option
            .setName("Author")
            .setDescription("Name of Author")
            .setRequired(false)))

export async function execute(interaction) {
    if (interaction.options.getSubcommand() === "help"){
        const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Get any poem!')
        .setAuthor({ name: 'Poetrydb', url: 'https://poetrydb.org/index.html' })
        .setDescription("From Poetry Database")
        .addFields(
            {name:"poem random", value:"gives you a random poem"},
            {name:"poem random Genre:yourgenre", value:"from chosen genre"},
            {name:"poem random Author:yourauthor", value:"from chosen author"},
            {name:"poem random Genre:yourgenre Author:yourauthor", value:"from chosen author and genre"},
        )
        .setTimestamp()

        await interaction.reply({embeds: [embed]});
    }
}