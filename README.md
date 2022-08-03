# DiscordBot
An easy to set-up discord bot performing basic functionalitites for a server

## Features
  * Embed User join message
  * Embed User left message
  * Provide a default role when a user joins the server

## Commands
  * Prefix - *
  * send - Sends a message in a defined channel with a user tagged in the beginning 
    * *send <@user> <message> 
    * Message can be configured in the config file
  * invite - Sends an invite link for the discord server 
    * Link can be configured in the config file
  * ann - Sends a message in the specified channel with the bot as the author 
    * *ann <#channel> <message>
  * taggedembed - Sends an embed with the user tagged at the beginning outside the embed 
    * *taggedembed <@user> 
    * Embed message can be configured in the config file
  * srules - Sends an embed with all the rules of the server 
    * Server rules can be configured in the config file
  * faq - Sends an embed with the most frequently asked question in the server 
    * FAQs can be configured in the config file
## Important 
  * Make sure to include the node_modules included in the repo
  * Make sure to change the path in the batch file 
