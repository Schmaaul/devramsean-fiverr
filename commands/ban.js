module.exports = {
  name: "ban",
  cooldown: 0,
  blockInDms: true,
  blockInGuilds: false,
  aliases: [],
  description: "Bans a user from the server",
  usage: "[@ user to ban]",
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
      return message.channel.send("You need to @ the user you want to ban.");
    if (target.id === message.author.id)
      return message.channel.send("Sadly you can not ban yourself");
    if (target.id === message.client.user.id)
      return message.channel.send("Sadly you can not ban this bot");
    const rank = target.roles.highest.position;
    if (rank >= message.member.roles.highest.position)
      return message.channel.send(
        "Your role rank is not high enough to ban this user"
      );
    if (!target.bannable)
      return message.channel.send(
        "I don't have the permissions to ban this user"
      );

    target.ban().then(
      () => message.channel.send(`Banned "${target.user.username}"`),
      () => message.channel.send("Got an error trying to ban this user")
    );
  },
};
