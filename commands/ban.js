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
    const user = message.mentions.members.first();
    if (!user)
      return message.channel.send("You need to @ the user you want to ban.");
    if (user.id === message.author.id)
      return message.channel.send("Sadly you can not ban yourself");
    if (user.id === message.client.user.id)
      return message.channel.send("Sadly you can not ban this bot");
    if (!user.bannable)
      return message.channel.send(
        "I don't have the permissions to ban this user"
      );

    user.ban().then(
      () => message.channel.send(`Banned "${user.user.username}"`),
      () => message.channel.send("Got an error trying to ban this user")
    );
  },
};
