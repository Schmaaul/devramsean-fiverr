module.exports = {
  name: "clear",
  cooldown: 0,
  blockInDms: true,
  blockInGuilds: false,
  aliases: ["clr", "clean"],
  description: "Clears a specified amount of messages",
  usage: "[clear amount]",
  args: true,
  deactivate: false,
  adminRoleOnly: true,

  /**
   * @param {[string]} args
   *
   * @param {import("discord.js").Message} message
   */
  execute: (args, message) => {
    if (message.channel.type != "text")
      return message.channel.send(
        "Can only clear messages in text channels on servers"
      );
    if (isNaN(args[0]))
      return message.channel.send("The clear amount needs to be a number");
    const amount = parseInt(args[0]) + 1;
    if (amount > 100)
      return message.channel.send("Can only delete 99 messages at once");
    if (amount < 1)
      return message.channel.send("Can not delete negative amount");
    message.channel.bulkDelete(amount, true);
  },
};
