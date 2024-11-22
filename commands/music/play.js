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
    const songPath = `audio/${query}`;//problem here, getting path is not case sensitive 
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return await interaction.reply("You need to be in a voice channel to play music!");

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

    try{
        const songResource = createAudioResource(songPath);
        audioplayer.play(songResource);

        vconnection.subscribe(audioplayer);
        audioplayer.on(AudioPlayerStatus.Idle, async () =>{
            await interaction.reply(`Song ended leaving the channel`);
            audioplayer.stop();
            vconnection.destroy();
        });
    } catch(error) {
        console.log(error);
    }
    

}