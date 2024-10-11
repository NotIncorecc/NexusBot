//two main componenets of in discord/voice are AudioPlayer and VoiceCoinnection
//important to listen to state changes
//listen to transitions in indivivdual states
//voice connection
import fs from 'node:fs';
import path from 'node:path';
import { joinVoiceChannel, createAudioPlayer } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

const getMp3 = () => {
    const allTracks = fs.readdirSync(path.join(path.resolve(), 'audio')).filter(file => file.endsWith('.mp3'));
    let trackData = [];
    for (const track of allTracks) {
        trackData.push({
            name: track.substring(0, track.length - 4).replace(/\s/g,'').toLowerCase(),
            value: track.replace(/\s/g,'').toLowerCase()
        });
    }
    return trackData;
}

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays music in a voice channel")
    .addStringOption(option => option
        .setName("query")
        .setDescription("The song to play")
        .setRequired(true)
        .addChoices(...(getMp3()))
    );
    

export async function execute(interaction) {
    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return await interaction.reply("You need to be in a voice channel to play music!");
    return await interaction.reply(`Playing ${query} in ${voiceChannel.name}`);//for now
/*
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: "pause",
        },
    });
    try{
        
    } catch (error) {
        console.error(error);
    }
*/

}