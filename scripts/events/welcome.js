const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "welcome",
    version: "2.0",
    author: "Saimx69x",
    category: "events"
  },

  onStart: async function ({ api, event, message }) {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID, logMessageData } = event;
    const { addedParticipants } = logMessageData;
    const hours = new Date().getHours();
    const prefix = getPrefix(threadID);
    const nickNameBot = global.GoatBot.config.nickNameBot;

    // Bot nick set function
    if (addedParticipants.some(user => user.userFbId === api.getCurrentUserID())) {
      if (nickNameBot) {
        try {
          await api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
        } catch (error) {
          console.error("❌ Error changing bot nickname:", error);
        }
      }

      const timeStr = new Date().toLocaleString("fr-FR");

      await api.sendMessage(
`🇫🇷━━━━━━━━━━━━━━━━━━━━
👑 𝘽𝙊𝙏 𝘼𝘾𝙏𝙄𝙑𝙀́
━━━━━━━━━━━━━━━━━━━━

🤖 Système connecté avec succès
⚡ Intelligence active et prête à servir

💠 Préfixe : ${prefix}
💠 Nom : ${nickNameBot || "Bot"}

━━━━━━━━━━━━━━━━━━━━
🔗 GitHub :
https://github.com/celestincelestinolua-cmyk/Flemme

👤 Créateur :
https://www.facebook.com/mike.lumema

━━━━━━━━━━━━━━━━━━━━
💬 Tape ${prefix}help pour découvrir mes commandes
🕒 ${timeStr}

━━━━━━━━━━━━━━━━━━━━
👑 Système conçu par Célestin • Intelligence active
━━━━━━━━━━━━━━━━━━━━`,
        threadID
      );

      return;
    }

    // Original welcome code for new users
    const botID = api.getCurrentUserID();
    
    if (addedParticipants.some(u => u.userFbId === botID)) return;

    const threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo.threadName;
    const memberCount = threadInfo.participantIDs.length;

    for (const user of addedParticipants) {
      const userId = user.userFbId;
      const fullName = user.fullName;

      try {
        
        const timeStr = new Date().toLocaleString("fr-FR");

        const apiUrl = `https://xsaim8x-xxx-api.onrender.com/api/welcome?name=${encodeURIComponent(fullName)}&uid=${userId}&threadname=${encodeURIComponent(groupName)}&members=${memberCount}`;
        const tmp = path.join(__dirname, "..", "cache");
        await fs.ensureDir(tmp);
        const imagePath = path.join(tmp, `welcome_${userId}.png`);

        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imagePath, response.data);

        await api.sendMessage({
          body:
`🇫🇷━━━━━━━━━━━━━━━━━━━━
👑 𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙐𝙀 𝘿𝘼𝙉𝙎 𝙇𝙀 𝙂𝙍𝙊𝙐𝙋𝙀
━━━━━━━━━━━━━━━━━━━━

🎉 Salut ${fullName} !
Tu viens d’entrer dans :
🏷️ ${groupName}

👥 Membres actuels : ${memberCount}
⚡ Tu fais maintenant partie de l’élite 💎

━━━━━━━━━━━━━━━━━━━━
💬 Respect • Ambiance • Activité
🔥 Profite et fais-toi remarquer !

━━━━━━━━━━━━━━━━━━━━
👑 Système conçu par Célestin • Intelligence active
🕒 ${timeStr}
━━━━━━━━━━━━━━━━━━━━`,
          attachment: fs.createReadStream(imagePath),
          mentions: [{ tag: fullName, id: userId }]
        }, threadID);

        fs.unlinkSync(imagePath);

      } catch (err) {
        console.error("❌ Error sending welcome message:", err);
      }
    }
  }
};
