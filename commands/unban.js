module.exports = {
  name: "unban",
  cooldown: 0,
  blockInDms: true,
  blockInGuilds: false,
  aliases: [],
  description: "Unbans a user from the server",
  usage: "[Username to unban]",
  args: true,
  deactivate: false,
  adminRoleOnly: true,

  /**
   * @param {[string]} args
   *
   * @param {import("discord.js").Message} message
   */
  execute: async (args, message) => {
    const baned = await message.guild.fetchBans();
    if (baned.size == 0)
      return message.channel.send("There are no users banned");
    const unBanUser = baned.find(
      (user) =>
        user.user.username.toLowerCase() ==
        message.content.split(" ").slice(1).join(" ").toLowerCase()
    );
    if (!unBanUser)
      return message.channel.send(
        `Could not find the user "${message.content
          .split(" ")
          .slice(1)
          .join(" ")
          .toLowerCase()}"`
      );
    message.guild.members.unban(unBanUser.user).then(
      () =>
        message.channel.send(`Unbanned the user "${unBanUser.user.username}"`),
      (err) => {
        console.log(err);
        message.channel.send(
          `Got an error while trying to unban user "${unBanUser.user.username}"`
        );
      }
    );
  },
};
