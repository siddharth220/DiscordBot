const discord = require("discord.js");
const bot = new discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'] });
let config = require("config.json");
bot.setMaxListeners(1000)

const token = config.BOT_TOKEN;
const prefix = config.PREFIX;

bot.login(token)

bot.on("ready", function() {
    console.log("ready");
    bot.user.setActivity(config.SERVER_NAME, ({ type: "WATCHING" }))
});

bot.on('guildMemberAdd', member => {
    const welcome = new discord.MessageEmbed()
        .setColor(config.EMBED_COLOR)
        .setTitle('**Welcome to the server**')
        .setDescription(config.MESSAGES.JOIN_MESSAGE)
        .setThumbnail(member.user.avatarURL())
        .setImage(config.USER_JOIN_IMAGE)
        .setFooter({ text: config.MESSAGES.JOIN_FOOTER, iconURL: config.SERVER_LOGO })
    const welcomechannel = member.guild.channels.cache.get(config.CHANNELS.JOIN_CHANNEL);
    welcomechannel.send({ embeds: [welcome] })
    member.roles.add(config.JOIN_ROLE)
});

bot.on('guildMemberRemove', member => {

    const left = new discord.MessageEmbed()
        .setColor(config.EMBED_COLOR)
        .setTitle('**Thank you for being with us!**')
        .setDescription(`<@${member.user.id}> ${config.MESSAGES.LEFT_MESSAGE}`)
        .setThumbnail(member.user.avatarURL())
        .setImage(config.USER_LEFT_IMAGE)
        .setFooter({ text: config.MESSAGES.LEFT_FOOTER, iconURL: config.SERVER_LOGO })
    const leftchannel = member.guild.channels.cache.get(config.CHANNELS.LEFT_CHANNEL)
    leftchannel.send({ embeds: [left] })
});

bot.on("messageCreate", function(message) {
    if (message.content.startsWith(`${prefix}send`)) {
        if (message.member.permissions.has(discord.Permissions.FLAGS.ADMINISTRATOR)) {
            const channel01 = bot.channels.cache.find(channel => channel.id === config.CHANNELS.SEND_MESSAGE);

            const member = message.mentions.members.first(); // Get the first member that was mentioned
            if (!member) return message.channel.send({ content: "You need to mention someone!" }) // If a member wasn't mentioned return a message explaining that there wasn't a mention

            channel01.send({ content: config.MESSAGES.TAGGED_MESSAGE });

        } else {
            (message.reply({ content: 'You do not have the permissions for this' }))
        }
    }
});

bot.on("messageCreate", msg => {
    if (msg.content === `${prefix}invite`) {
        // msg.channel.send('Here is the permanent invite link for the server.\nhttps://discord.gg/zg5cJ9ZA8g')
        msg.channel.send({ content: `Here is the permanent invite link for the server.\n${config.SERVER_URL}` })
    }
})

bot.on("messageCreate", message => {
    if (message.author.bot) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if (message.channel.type === "dm") return;

    if (!message.content.startsWith('*')) return;

    if (command === `${prefix}ann`) {
        if (message.member.permissions.has('ADMINISTRATOR')) {
            let channel = message.mentions.channels.first();
            let announcement = args.slice(1).join(" ");

            channel.send({ content: announcement });
        } else {
            (message.reply('You do not have the permissions for this'))
        }
    }
})

bot.on("messageCreate", msg => {
    if (msg.content.startsWith(`${prefix}taggedembed`)) {
        const member = msg.mentions.users.first()
        if (!member) return msg.channel.send("You need to mention someone!")
        const issue = new discord.MessageEmbed()
            .setColor(config.EMBED_COLOR)
            .setTitle('**Embed with tag**')
            .setDescription(config.MESSAGES.EMBED_TAG)
            //msg.channel.send(`Hi ${member}`, { embed: issue });
        msg.channel.send({ content: `Hi ${member}`, embeds: [issue] })
    }
})

bot.on("messageCreate", msg => {
    if (msg.content === `${prefix}srules`) {
        const serrules = new discord.MessageEmbed()
            .setColor(config.EMBED_COLOR)
            .setTitle('**Server Rules**')
            .setDescription(config.MESSAGES.SERVER_RULES)
            .setThumbnail(config.SERVER_LOGO)
            .setFooter({ text: config.MESSAGES.JOIN_FOOTER, iconURL: config.SERVER_LOGO })
            // msg.channel.send(serrules)
        msg.channel.send({ embeds: [serrules] })
    }
})

bot.on("messageCreate", msg => {
    if (msg.content === `${prefix}faq`) {
        const faq = new discord.MessageEmbed()
            .setColor(config.EMBED_COLOR)
            .setTitle('**Frequently Asked Questions**')
            .setDescription(config.MESSAGES.FAQ)
            .setThumbnail(config.SERVER_LOGO)
            .setFooter({ text: config.MESSAGES.JOIN_FOOTER, iconURL: config.SERVER_LOGO })
            //msg.channel.send(faq)
        msg.channel.send({ embeds: [faq] })
    }
})