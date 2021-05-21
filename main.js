// Setup
const fs = require("fs");

if (!fs.existsSync("./config.json")) {
  console.log(
    `Could not find the "config.json" file so created a new one please fill in the bot token and the admin role id`
  );
  fs.writeFileSync(
    "./config.json",
    JSON.stringify(
      {
        token: "Here goes your bot token",
        adminRoleId: "Here goes your admin role id",
        prefix: "!",
        logErr: false,
      },
      null,
      2
    )
  );
  process.exit();
}
if (!fs.existsSync("./reactions.json"))
  fs.writeFileSync("./reactions.json", "{}");

if (!fs.existsSync("./mute.json")) fs.writeFileSync("./mute.json", "{}");

const reactionJson = require("./reactions.json");

const muteManager = require("./mutemanger");

const Discord = require("discord.js");
const client = new Discord.Client();

const { token, adminRoleId, prefix, logErr } = require("./config.json");

// loading commands
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  if (command.deactivated) continue;
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.cooldowns = new Discord.Collection();

// starting the bot
client.on("message", (message) => {
  if (muteManager.isMuted(message.author.id) && message.deletable)
    message.delete();
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Get command name and args
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // search for the command
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;

  // checks if command needs admin role and if user has admin role
  if (command.adminRoleOnly && message.channel.type == "text") {
    if (!message.member.roles.cache.has(adminRoleId))
      return message.channel.send(
        "You need to have the admin role to use this command"
      );
  } else
    return message.channel.send(
      "This command needs admin role so it can only be used in text channels on servers"
    );

  // Checks if command needs arguments and if the user gave arguments
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // Block commands in dms or guilds
  if (command.blockInGuilds && message.channel.type === "text") return;
  if (command.blockInDms && message.channel.type === "dm")
    return msg.reply("I can't execute that command inside DMs!");

  // Check if the cooldown expired
  const { cooldowns } = client;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = command.cooldown || 0;
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(args, message);
  } catch (err) {
    message.reply("There was an error trying to execute your command");
    if (logErr) {
      console.log(`${message.author.tag}: ${message.content}`);
      console.log(err);
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;
  if (reaction.message.author.id != client.user.id) return;
  const embed = reaction.message.embeds[0];
  if (!embed) return;
  const reactions = await reaction.users.fetch();
  if (!reactions.get(client.user.id)) return reaction.remove();

  const member = reaction.message.guild.members.resolve(user.id);
  const roleId = embed.thumbnail.url.split("/").pop();

  const role = await member.guild.roles.fetch(roleId);
  if (!role) {
    embed.setFooter("the role dosnt exist anymore");
    return reaction.message.edit(embed);
  }
  member.roles.add(role);
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) return;
  if (reaction.message.author.id != client.user.id) return;

  const embed = reaction.message.embeds[0];
  if (!embed) return;

  const reactions = await reaction.users.fetch();
  if (!reactions.get(client.user.id)) return;

  const member = reaction.message.guild.members.resolve(user.id);
  const roleId = embed.thumbnail.url.split("/").pop();

  const role = await member.guild.roles.fetch(roleId);
  if (!role) {
    embed.setFooter("the role dosnt exist anymore");
    return reaction.message.edit(embed);
  }

  member.roles.remove(role);
});

client.on("ready", async () => {
  console.log("Bot Logged in as " + client.user.tag + "!");
  console.log("The bot is on " + client.guilds.cache.size + " servers!");

  // caching the reaction role messages
  for (const guildId in reactionJson) {
    const guild = await client.guilds.fetch(guildId);

    for (const channelId in reactionJson[guildId]) {
      const channel = guild.channels.resolve(channelId);
      const msgs = await channel.messages
        .fetch(reactionJson[guildId][channelId])
        .then((messages) =>
          messages.filter((msg) =>
            reactionJson[guildId][channelId].includes(msg.id)
          )
        );
    }
  }

  muteManager.loadMutes();
});

client.login(token);
