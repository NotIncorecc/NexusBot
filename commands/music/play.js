//two main componenets of in discord/voice are AudioPlayer and VoiceCoinnection
//important to listen to state changes
//listen to transitions in indivivdual states
//voice connection
import fs from 'node:fs';
import path from 'node:path';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import { SlashCommandBuilder } from "discord.js";

const getMp3 = () => {
    const allTracks = fs.readdirSync(path.join(path.resolve(), 'audio')).filter(file => file.endsWith('.mp3'));
    let trackData = [];
    for (const track of allTracks) {
        trackData.push({
            name: track.substring(0, track.length - 4).replace(/\s/g,'').toLowerCase(),
            value: track
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
    const songPath = `../../audio/${query}`;
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return await interaction.reply("You need to be in a voice channel to play music!");
    
    console.log(`Attempting to play: ${songPath}`);
    const audioplayer = createAudioPlayer({
        behaviors:{
            noSubscriber:"pause",
        },
    });

    const vconnection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId:voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
    })

    
    const songResource = createAudioResource(songPath);
    vconnection.subscribe(audioplayer);
    audioplayer.play(songResource);
    console.log(`Now playing: ${query}`,songResource.metadata);
    await interaction.reply(`Now playing: ${query}`);

    //vconnection.subscribe(audioplayer);
    audioplayer.on(AudioPlayerStatus.Idle, async () =>{
        await interaction.reply(`Song ended leaving the channel`);
        audioplayer.stop();
        vconnection.destroy();
    });

    audioplayer.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
    });
}