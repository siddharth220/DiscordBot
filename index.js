const { Client, GatewayIntentBits, EmbedBuilder, AuditLogEvent } = require('discord.js');
const fs = require('fs');

// Configuration system (same as before)
let config = new Map();

function initializeConfig() {
    const configPath = 'config.json';
    
    try {
        if (fs.existsSync(configPath)) {
            const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            Object.entries(data).forEach(([key, value]) => {
                config.set(key, value);
            });
            console.log('Configuration loaded successfully');
        } else {
            fs.writeFileSync(configPath, '{}', 'utf8');
            console.log('Created new config.json file');
        }
    } catch (error) {
        console.error('Error loading config:', error);
        fs.writeFileSync(configPath, '{}', 'utf8');
    }
}

function saveConfig() {
    try {
        const configObj = Object.fromEntries(config);
        fs.writeFileSync('config.json', JSON.stringify(configObj, null, 2));
    } catch (error) {
        console.error('Error saving config:', error);
    }
}

function getServerConfig(guildId) {
    return config.get(guildId) || {
        prefix: '*',
        welcomeChannel: null,
        leaveChannel: null
    };
}

function setServerConfig(guildId, newConfig) {
    const currentConfig = getServerConfig(guildId);
    config.set(guildId, { ...currentConfig, ...newConfig });
    saveConfig();
}

// Initialize client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration  // Required for audit logs
    ]
});

initializeConfig();

client.once('ready', () => {
    console.log(`${client.user.tag} is online!`);
});

// Welcome message (same as before)
client.on('guildMemberAdd', async member => {
    const serverConfig = getServerConfig(member.guild.id);
    
    if (!serverConfig.welcomeChannel) return;
    
    const welcomeChannel = member.guild.channels.cache.get(serverConfig.welcomeChannel);
    if (!welcomeChannel) return;

    if (!welcomeChannel.permissionsFor(client.user).has(['SendMessages', 'EmbedLinks'])) return;

    const welcomeEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🎉 Welcome to the Server!')
        .setDescription(`Welcome **${member.user.tag}**!\nWe're glad you're here!`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: '👤 Username', value: member.user.username, inline: true },
            { name: '🏷️ Tag', value: member.user.tag, inline: true },
            { name: '📊 Member Count', value: `${member.guild.memberCount}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL() });

    try {
        await welcomeChannel.send({ embeds: [welcomeEmbed] });
    } catch (error) {
        console.error('Error sending welcome message:', error);
    }
});

// Enhanced leave/kick/ban detection
client.on('guildMemberRemove', async member => {
    const serverConfig = getServerConfig(member.guild.id);
    
    if (!serverConfig.leaveChannel) return;
    
    const leaveChannel = member.guild.channels.cache.get(serverConfig.leaveChannel);
    if (!leaveChannel) return;

    if (!leaveChannel.permissionsFor(client.user).has(['SendMessages', 'EmbedLinks'])) return;

    // Check audit logs to determine if user was kicked or banned
    let actionType = 'left';
    let executor = null;
    let reason = null;

    try {
        // Check for kicks first
        const kickLogs = await member.guild.fetchAuditLogs({
            type: AuditLogEvent.MemberKick,
            limit: 1
        });

        const kickLog = kickLogs.entries.first();
        if (kickLog && kickLog.target.id === member.user.id && 
            (Date.now() - kickLog.createdTimestamp) < 5000) { // Within 5 seconds
            actionType = 'kicked';
            executor = kickLog.executor;
            reason = kickLog.reason;
        } else {
            // Check for bans
            const banLogs = await member.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanAdd,
                limit: 1
            });

            const banLog = banLogs.entries.first();
            if (banLog && banLog.target.id === member.user.id && 
                (Date.now() - banLog.createdTimestamp) < 5000) { // Within 5 seconds
                actionType = 'banned';
                executor = banLog.executor;
                reason = banLog.reason;
            }
        }
    } catch (error) {
        console.error('Error fetching audit logs:', error);
    }

    // Create appropriate embed based on action type
    let embed;
    
    if (actionType === 'kicked') {
        embed = new EmbedBuilder()
            .setColor('#FF8C00')
            .setTitle('👢 Member Kicked')
            .setDescription(`**${member.user.tag}** was kicked from the server.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🏷️ User', value: member.user.tag, inline: true },
                { name: '👮 Kicked by', value: executor ? executor.tag : 'Unknown', inline: true },
                { name: '📊 Members Now', value: `${member.guild.memberCount}`, inline: true }
            );

        if (reason) {
            embed.addFields({ name: '📝 Reason', value: reason, inline: false });
        }
    } else if (actionType === 'banned') {
        embed = new EmbedBuilder()
            .setColor('#8B0000')
            .setTitle('🔨 Member Banned')
            .setDescription(`**${member.user.tag}** was banned from the server.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🏷️ User', value: member.user.tag, inline: true },
                { name: '👮 Banned by', value: executor ? executor.tag : 'Unknown', inline: true },
                { name: '📊 Members Now', value: `${member.guild.memberCount}`, inline: true }
            );

        if (reason) {
            embed.addFields({ name: '📝 Reason', value: reason, inline: false });
        }
    } else {
        // Regular leave
        embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('👋 Member Left')
            .setDescription(`**${member.user.tag}** has left the server.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🏷️ Tag', value: member.user.tag, inline: true },
                { name: '📊 Members Now', value: `${member.guild.memberCount}`, inline: true }
            );
    }

    embed.setTimestamp().setFooter({ text: member.guild.name, iconURL: member.guild.iconURL() });

    try {
        await leaveChannel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Error sending leave message:', error);
    }
});

// Rest of your command handling code stays the same...
client.on('messageCreate', async message => {
    // Your existing command handling code here
});

client.login('YOUR_BOT_TOKEN');
