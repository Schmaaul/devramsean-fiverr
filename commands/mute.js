const { mute } = require("../mutemanger");
const { adminRoleId } = require("../config.json");
module.exports = {
  name: "mute",
  cooldown: 0,
  blockInDms: true,
  blockInGuilds: false,
  aliases: [],
  description: "Mutes a mentioned user",
  usage: "[@user] [time format days:hours:min:sek]",
  args: true,
  deactivate: false,
  adminRoleOnly: true,

  /**
   * @param {[string]} args
   *
   * @param {import("discord.js").Message} message
   */
  execute: async (args, message) => {
    const target = message.mentions.members.first();
    if (!target) return message.channel.send("You need to @ a target for mute");
    const rank = target.roles.highest.position;
    if (rank >= message.member.roles.highest.position)
      return message.channel.send(
        "Your role rank is not high enough to mute this user"
      );
    message.channel.send(await mute(target, args[1]));
  },
};
