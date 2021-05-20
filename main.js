const fs = require("fs");

if (!fs.existsSync("./config.json")) {
  console.log(
    `Could not find the "config.json" file so created a new one please fill in the bot token and the admin role id`
  );
  fs.writeFileSync(
    "./config.json",
    JSON.stringify(
      {
        token: "Here goes your bot token",
        adminRoleId: "Here goes your admin role id",
      },
      null,
      2
    )
  );
  process.exit();
}
