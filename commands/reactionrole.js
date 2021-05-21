const { MessageEmbed, Emoji } = require("discord.js");
const fs = require("fs");
module.exports = {
  name: "reactionrole",
  cooldown: 0,
  blockInDms: true,
  blockInGuilds: false,
  aliases: ["rr"],
  description: "Creates a new reaction role handler",
  usage: "<roleId> <emoji> <roledescription>",
  args: true,
  deactivate: false,
  adminRoleOnly: true,

  /**
   * @param {[string]} args
   *
   * @param {import("discord.js").Message} message
   */
  execute: async (args, message) => {
    const role = await message.guild.roles.fetch(args[0]);
    if (!role)
      return message.channel.send(
        `Could not get a Role from the specified id (${args[0]})`
      );

    const emoji = args[1];
    const roledescription = message.content.split(" ").slice(3).join(" ");

    //console.log(`https://dummy/${role.id}.png`);

    const embed = new MessageEmbed()
      .setTitle(`Get the role ${role.name}`)
      .setColor("#0000ff")
      .setDescription(roledescription)
      .setFooter(`React to get the role`)
      .setThumbnail(
        `https://notawebsidejustforstoringtheroleidsoihopethisdosntexists.com/${role.id}`
      );

    const msg = await message.channel.send(embed);
    msg.react(emoji);
    const ids = JSON.parse(fs.readFileSync("./reactions.json"));
    if (!ids[message.guild.id]) ids[message.guild.id] = {};

    if (!ids[message.guild.id][message.channel.id])
      ids[message.guild.id][message.channel.id] = [];
    ids[message.guild.id][message.channel.id].push(msg.id);
    fs.writeFileSync("./reactions.json", JSON.stringify(ids, null, 2));
  },
};
