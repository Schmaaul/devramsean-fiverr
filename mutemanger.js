const { time } = require("console");
const fs = require("fs");

let timeouts = {};
let mutedIds = [];

exports.mute = (id, duration) => {
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

  return "Added mute";
};

exports.unmute = (id) => {
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

const unmuteCallback = (id) => {
  const json = require("./mute.json");
  json[id] = undefined;
  fs.writeFileSync("./mute.json", JSON.stringify(json, null, 2));
  clearTimeout(timeouts[id]);
  mutedIds = mutedIds.filter((mId) => mId != id);
  console.log(`Unmuted id ${id}`);
};
