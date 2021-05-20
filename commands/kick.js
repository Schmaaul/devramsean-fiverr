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
    const user = message.mentions.members.first();
    if (!user)
      return message.channel.send("You need to @ the user you want to kick.");
    if (user.id === message.author.id)
      return message.channel.send("Sadly you can not kick yourself");
    if (user.id === message.client.user.id)
      return message.channel.send("Sadly you can not kick this bot");
    if (!user.kickable)
      return message.channel.send(
        "I don't have the permissions to kick this user"
      );

    user.kick().then(
      () => message.channel.send(`Kicked "${user.user.username}"`),
      () => message.channel.send("Got an error trying to kick this user")
    );
  },
};
