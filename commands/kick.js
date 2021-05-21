module.exports = {
  name: "kick",
  cooldown: 0,
  blockInDms: true,
  blockInGuilds: false,
  aliases: [],
  description: "kicks a user from the server",
  usage: "[@ user to kick]",
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
      return message.channel.send("You need to @ the user you want to kick.");
    if (target.id === message.author.id)
      return message.channel.send("Sadly you can not kick yourself");
    if (target.id === message.client.user.id)
      return message.channel.send("Sadly you can not kick this bot");
    const rank = target.roles.highest.position;
    if (rank >= message.member.roles.highest.position)
      return message.channel.send(
        "Your role rank is not high enough to kick this user"
      );
    if (!target.kickable)
      return message.channel.send(
        "I don't have the permissions to kick this user"
      );

    target.kick().then(
      () => message.channel.send(`Kicked "${target.user.username}"`),
      () => message.channel.send("Got an error trying to kick this user")
    );
  },
};
