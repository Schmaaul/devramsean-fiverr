const { prefix } = require("../config.json");
const Discord = require("discord.js");
module.exports = {
  name: "help",
  description: "Lists all commands or gives info about a specific command.",
  args: false,
  guildOnly: false,
  cooldown: 5000,
  aliases: ["commands", "h"],
  usage: "[command name]",

  /**
   *
   * @param {import("discord.js").Message} message
   * @param {[string]} args
   * @returns
   */
  execute(args, message) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push("Here's a list of all my commands");
      data.push(commands.map((command) => command.name).join(", "));
      data.push(
        `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
      );
      return message.channel.send(data);
    }
    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) return message.reply("That's not a valid command!");
    const atachment = new Discord.MessageEmbed()
      .setColor("#fcfcfc")
      .setTitle("Help - " + prefix + command.name);
    if (command.aliases)
      atachment.addField("Aliases", command.aliases.join(", "));
    if (command.description) atachment.setDescription(command.description);
    if (command.usage)
      atachment.addField("Usage", prefix + command.name + " " + command.usage);
    atachment.addField("Cooldown", (command.cooldown || 3) + "s");
    message.channel.send(atachment);
  },
};
