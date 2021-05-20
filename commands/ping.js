module.exports = {
  name: "ping",
  cooldown: 5000,
  blockInDms: false,
  blockInGuilds: false,
  aliases: ["test"],
  description: "Tests if bot is online",
  usage: undefined,
  args: false,
  deactivate: false,
  adminRoleOnly: false,

  /**
   * @param {[string]} args
   *
   * @param {import("discord.js").Message} message
   */
  execute: (args, message) => {
    message.channel.send("Pong!");
  },
};
