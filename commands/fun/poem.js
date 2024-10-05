import { SlashCommandBuilder ,EmbedBuilder } from "discord.js";
import axios from "axios";

const apiURL = "https://poetrydb.org/";
const getRand = (items) => {return items[Math.floor(Math.random()*items.length)]};
const findSmallPoem = async () => { //first find the smallest poems, once found, get the lines appropriately
    let found =0, poems;
    while(found==0) {
        let r = Math.floor((Math.random() * 50) + 1);
        poems = (await axios.get(`${apiURL}linecount/${r}/title`)).data;
        found = poems.length;
    }
    let rPoemTitle = ( getRand(poems) ).title;
    let fetchedPoem = await axios.get(`${apiURL}title/${rPoemTitle}:abs`);
    return getRand(fetchedPoem.data);
}

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
            .setName("genre")//always use lowercase chars in name, it gives error for otherwise for some reason
            .setDescription("You can enter a genre if you want")
            .setRequired(false))
        .addStringOption(option =>
            option
            .setName("author")
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
    } else if (interaction.options.getSubcommand() === "random") {
        const poemAuthor = interaction.options.getString("author");
        const genre = interaction.options.getString("genre");
        try {
        if (poemAuthor && genre) {
            const req = (await axios.get(`${apiURL}author/${poemAuthor}/title,author,linecount,lines`)).data;
            const genreFilter = req.filter(poem => (poem.title).toLowerCase().includes(genre.toLowerCase()));
            var poem = getRand(genreFilter);
        } else if (poemAuthor) {
            const req = (await axios.get(`${apiURL}author/${poemAuthor}`) ).data;
            var poem = getRand(req);
        } else if (genre) {
            const req = (await axios.get(`${apiURL}title/${genre}`)).data;
            var poem = getRand(req);
        } else {
            var poem = await findSmallPoem();
        }
        const pEmbed = new EmbedBuilder()
            .setColor(0x00FF99)
            .setTitle(poem.title)
            .setAuthor({name: poem.author})
            .setDescription(poem.lines.join("\n"))
            .setTimestamp()
        
        await interaction.reply({embeds: [pEmbed]});
        } catch(error) {
            console.error(error);
        }
    }
}