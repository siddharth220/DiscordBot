# Discord Welcome & Moderation Bot

A feature-rich Discord bot built with Discord.js v14 that provides automated welcome/leave messages, moderation logging, and announcement capabilities.

## 🚀 Features

### 📝 Welcome & Leave System

- **Welcome Messages**: Sends beautiful embedded welcome messages when users join
- **Leave Detection**: Detects when users leave, get kicked, or banned
- **Smart Moderation Logging**: Distinguishes between voluntary leaves, kicks, and bans
- **Customizable Channels**: Set separate channels for welcome and leave messages

### 📢 Announcement System

- **Channel-specific Announcements**: Send messages to any channel using commands
- **Rich Embeds**: All announcements use attractive embed formatting
- **Flexible Targeting**: Use channel names, mentions, or IDs

### ⚙️ Configuration

- **Custom Prefix**: Set your own command prefix per server
- **Per-server Settings**: Each server maintains its own configuration
- **Persistent Storage**: All settings saved automatically in JSON format
- **Permission-based Access**: Only users with appropriate permissions can modify settings

## 📋 Commands

### Configuration Commands (Requires Permissions)

| Command | Permission Required | Description |
|---------|-------------------|-------------|
| `*setwelcome #channel` | Manage Channels | Set the welcome message channel |
| `*setleave #channel` | Manage Channels | Set the leave/kick/ban message channel |
| `*setprefix <prefix>` | Manage Server | Change the bot's command prefix |

### Utility Commands

| Command | Permission Required | Description |
|---------|-------------------|-------------|
| `*ann <channel> <message>` | Manage Messages | Send announcement to specified channel |
| `*help` | None | Display all commands and current settings |

## 🛠️ Setup Guide

### Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Enter your bot name and click **"Create"**
4. Navigate to the **"Bot"** section
5. Click **"Add Bot"**
6. Copy your **Bot Token** (keep this secret!)

### Step 2: Configure Bot Settings

#### Required Intents

In the **Bot** section, enable these **Privileged Gateway Intents**:

- ✅ **Server Members Intent** (for join/leave detection)
- ✅ **Message Content Intent** (for reading command messages)

#### Bot Permissions

The bot needs these permissions to function properly:

- ✅ **View Channels**
- ✅ **Send Messages**
- ✅ **Embed Links**
- ✅ **Read Message History**
- ✅ **Use External Emojis**
- ✅ **View Audit Log** (for kick/ban detection)

### Step 3: Generate Invite Link

#### OAuth2 Scopes

In **OAuth2** → **URL Generator**, select:

- ✅ **`bot`** scope

#### Bot Permissions (Recommended)

Select these permissions with the `bot` scope:

- ✅ Send Messages
- ✅ Embed Links
- ✅ View Channels
- ✅ Read Message History
- ✅ Use External Emojis
- ✅ View Audit Log
- ✅ Manage Messages
- ✅ Use Slash Commands

**Generated Permission Integer**: `379968`

#### Manual Invite URL

If the URL Generator requires a redirect URI, use this format:
<https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=379968>
Replace `YOUR_CLIENT_ID` with your bot's Client ID from the **General Information** page.

### Step 4: Install and Run

#### Prerequisites

- Node.js 16.9.0 or higher
- npm (comes with Node.js)

#### Installation

1. Clone or download the bot files
2. Install dependencies:
npm install discord.js
3. Replace `'YOUR_BOT_TOKEN'` in the code with your actual bot token
4. Run the bot:
node index.js

## 📁 File Structure

discord-bot/
├── index.js # Main bot file
├── config.json # Auto-generated server configurations
├── package.json # Node.js dependencies
└── README.md # This file

## 🔧 Configuration

### Initial Setup

After inviting the bot to your server:

1. **Set Welcome Channel**:

    *setwelcome #general

2. **Set Leave Channel**:

    *setleave #moderation-log

3. **Change Prefix** (optional):

    *setprefix !

### Per-Server Settings

Each server maintains its own configuration stored in `config.json`:

{
"SERVER_ID": {
"prefix": "*",
"welcomeChannel": "CHANNEL_ID",
"leaveChannel": "CHANNEL_ID"
}
}

## 📊 Message Types

### Welcome Messages

- **Color**: Green (`#00FF00`)
- **Includes**: Username, tag, profile picture, member count
- **Trigger**: User joins server

### Leave Messages

- **Regular Leave**: Red (`#FF0000`) - User left voluntarily
- **Kicked**: Orange (`#FF8C00`) - User was kicked by moderator
- **Banned**: Dark Red (`#8B0000`) - User was banned by moderator

### Announcements

- **Color**: Gold (`#FFD700`)
- **Includes**: Message content, sender information, timestamp

## 🚨 Troubleshooting

### Common Issues

#### Bot doesn't respond to commands

- ✅ Check **Message Content Intent** is enabled
- ✅ Verify bot has **Send Messages** permission
- ✅ Ensure you're using the correct prefix

#### Welcome/leave messages not working

- ✅ Enable **Server Members Intent** in Developer Portal
- ✅ Check bot has access to configured channels
- ✅ Verify **View Audit Log** permission for kick/ban detection

#### Commands work but config doesn't save

- ✅ Check file permissions in bot directory
- ✅ Ensure Node.js has write access to create `config.json`

### Debug Mode

Add console logs to track bot behavior:
console.log('Bot is online as', client.user.tag);
console.log('Received message:', message.content);

## 🔒 Security Notes

- **Keep your bot token secret** - never share it publicly
- **Use minimal permissions** - only grant necessary permissions
- **Regular updates** - keep Discord.js updated for security patches
- **Backup config** - save your `config.json` file regularly

## 📚 Dependencies

- **discord.js**: ^14.14.1 (Discord API wrapper)
- **Node.js**: 16.9.0+ (JavaScript runtime)

## 🤝 Support

### Common Commands for Testing

Test welcome message (have someone join)
*setwelcome #general

Test leave message (have someone leave)
*setleave #general

Test announcement
*ann general Hello everyone!

View current settings
*help

### Bot Status Indicators

- ✅ **Online**: Bot responds to commands
- ⚠️ **Partial**: Some features may not work (check intents/permissions)
- ❌ **Offline**: Bot not responding (check token/connection)

## 📄 License

This project is open source. Feel free to modify and distribute according to your needs.

---

**Built with Discord.js v14** | **Supports Discord's latest features**
