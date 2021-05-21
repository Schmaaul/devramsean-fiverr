const { time } = require("console");
const fs = require("fs");
const config = require("./config.json");

let timeouts = {};
let mutedIds = [];
let client;

/**
 *
 * @param {import("discord.js").GuildMember} target
 * @param {string} duration
 * @returns
 */
exports.mute = async (target, duration) => {
  const id = target.user.id;
  if (!duration) return "Invalid time";
  const times = duration.split(":");
  for (const time of times) {
    if (isNaN(time)) return "Invalid time";
  }
  let time = 0;
  if (times[0]) time += 86400000 * times[0]; // 1 day in ms
  if (times[1]) time += 3600000 * times[1]; // 1 h in ms
  if (times[2]) time += 60000 * times[2]; // 1 min in ms
  if (times[3]) time += 1000 * times[3]; // 1 sek in ms
  if (times[4]) time += 1 * times[4]; // 1 ms in ms

  if (!time) return "0 sek mute is dumb";

  const unmuteTimeStamp = Date.now() + time;

  const json = require("./mute.json");
  json[id] = unmuteTimeStamp;
  fs.writeFileSync("./mute.json", JSON.stringify(json, null, 2));

  clearTimeout(timeouts[id]);
  timeouts[id] = setTimeout(() => unmuteCallback(id), time);
  mutedIds = mutedIds.filter((mId) => mId != id);
  mutedIds.push(id);

  const role = await target.guild.roles.fetch(config.muteRoleId);

  target.roles.add(role);

  return "Added mute";
};

exports.unmute = (target) => {
  const id = target.user.id;
  unmuteCallback(id);
};

exports.loadMutes = () => {
  const json = require("./mute.json");
  for (const id in json) {
    const muteTimestamp = json[id];
    timeouts[id] = setTimeout(
      () => unmuteCallback(id),
      muteTimestamp - Date.now()
    );
    mutedIds = mutedIds.filter((mId) => mId != id);
    mutedIds.push(id);
  }
};

exports.isMuted = (id) => {
  return mutedIds.includes(id);
};

exports.setClient = (setClient) => {
  client = setClient;
};

const unmuteCallback = async (id) => {
  const json = require("./mute.json");
  json[id] = undefined;
  fs.writeFileSync("./mute.json", JSON.stringify(json, null, 2));
  clearTimeout(timeouts[id]);
  mutedIds = mutedIds.filter((mId) => mId != id);
  const guild = client.guilds.resolve(config.mainServerId);
  const role = await guild.roles.fetch(config.muteRoleId);
  const target = await guild.members.resolve(id);

  target.roles.remove(role);
};
