const { unmute } = require("../mutemanger");
module.exports = {
  name: "unmute",
  cooldown: 0,
  blockInDms: true,
  blockInGuilds: false,
  aliases: [],
  description: "Unmutes a mentioned user",
  usage: "[@user]",
  args: true,
  deactivate: false,
  adminRoleOnly: true,

  /**
   * @param {[string]} args
   *
   * @param {import("discord.js").Message} message
   */
  execute: (args, message) => {
    const target = message.mentions.members.first();
    if (!target)
      return message.channel.send("You need to @ a target to unmute");
    unmute(target);
    message.channel.send("Unmuted");
  },
};
