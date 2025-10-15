const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Format uptime properly
function formatUptime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0) time += `${hours}h `;
    if (minutes > 0) time += `${minutes}m `;
    if (seconds > 0 || time === '') time += `${seconds}s`;

    return time.trim();
}

// Format RAM usage
function formatRam(total, free) {
    const used = (total - free) / (1024 * 1024 * 1024);
    const totalGb = total / (1024 * 1024 * 1024);
    const percent = ((used / totalGb) * 100).toFixed(1);
    return `${used.toFixed(1)}GB / ${totalGb.toFixed(1)}GB (${percent}%)`;
}

// Count total commands
function countCommands() {
    return 158; // Replace with actual command count
}

// Get mood emoji based on time
function getMoodEmoji() {
    const hour = getLagosTime().getHours();
    if (hour < 12) return '🌅';
    if (hour < 18) return '☀️';
    return '🌙';
}

// Get countdown to next day
function getCountdown() {
    const now = getLagosTime();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `(${hours}h ${minutes}m)`;
}

// Get current time in Africa/Lagos timezone
function getLagosTime() {
    try {
        // Try using Intl API for proper timezone handling
        const options = {
            timeZone: 'Africa/Harare',
            hour12: false,
            hour: 'numeric',
            minute: 'numeric'
        };
        
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(new Date());
        
        const hour = parts.find(part => part.type === 'hour').value;
        const minute = parts.find(part => part.type === 'minute').value;
        
        // Create a new Date object with the correct time
        const now = new Date();
        const lagosDate = new Date(now.toLocaleString('en-US', {timeZone: 'Africa/Lagos'}));
        
        return lagosDate;
    } catch (error) {
        // Fallback for environments without Intl API support
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        // Africa/Lagos is UTC+1
        return new Date(utc + (3600000 * 1));
    }
}

// Format time specifically for Africa/Lagos
function formatLagosTime() {
    const lagosTime = getLagosTime();
    const hours = lagosTime.getHours().toString().padStart(2, '0');
    const minutes = lagosTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
┌ ❏ * ⌜Cybermaster XMD  ⌟* ❏ 
│
├◆ ᴏᴡɴᴇʀ: ${settings.botOwner || 'Cybermaster'}
├◆ ᴘʀᴇғɪx: .
├◆ ᴜsᴇʀ: ${message.pushName}
├◆ ᴘʟᴀɴ: Premium ${'✓'}
├◆ ᴠᴇʀsɪᴏɴ: ${settings.version || '3.0.0'}
├◆ ᴛɪᴍᴇ: ${formatLagosTime()} (Africa/Harare)
├◆ ᴜᴘᴛɪᴍᴇ: ${formatUptime(process.uptime())}
├◆ ᴄᴏᴍᴍᴀɴᴅs: ${countCommands()}
├◆ ᴛᴏᴅᴀʏ: ${new Date().toLocaleDateString('en-US', {weekday: 'long'})}
├◆ ᴅᴀᴛᴇ: ${new Date().toLocaleDateString('en-GB')}
├◆ ᴘʟᴀᴛғᴏʀᴍ: Chrome Ubuntu
├◆ ʀᴜɴᴛɪᴍᴇ: Node.js v${process.version.replace('v', '')}
├◆ ᴄᴘᴜ: ${os.cpus()[0].model.split(' ')[0]} ${os.cpus()[0].speed}MHz
├◆ ʀᴀᴍ: ${formatRam(os.totalmem(), os.freemem())}
├◆ ᴍᴏᴅᴇ: ${settings.commandMode || 'Public'}
├◆ ᴍᴏᴏᴅ: ${getMoodEmoji()} ${getCountdown()}
├◆
┗━━━━━━━━━━━━━━

💠 *𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* 💠

╔══🌐 *𝗚𝗘𝗡𝗘𝗥𝗔𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* ══╗
☆ .help
☆ .menu
☆ .ping
☆ .alive
☆ .tts <text>
☆ .owner
☆ .joke
☆ .quote
☆ .fact
☆ .weather <city>
☆ .news
☆ .attp <text>
☆ .lyrics <song_title>
☆ .8ball <question>
☆ .groupinfo
☆ .staff
☆ .vv
☆ .trt <text> <lang>
☆ .ss <link>
☆ .jid
☆ .url
╚═══════════════════════════════════════╝

╔══👮‍♂️ *𝗔𝗗𝗠𝗜𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* ══╗
☆ .ban
☆ .promote
☆ .demote
☆ .mute <minutes>
☆ .unmute
☆ .delete
☆ .del
☆ .kick
☆ .warn
☆ .warnings
☆ .antilink
☆ .antibadword
☆ .clear
☆ .tag
☆ .tagall
☆ .tagnotadmin
☆ .hidetag
☆ .chatbot
☆ .resetlink
☆ .antitag
☆ .welcome
☆ .goodbye
☆ .setgdesc
☆ .setgname
☆ .setgpp
╚═══════════════════════════════════════╝

╔══🔒 *𝗢𝗪𝗡𝗘𝗥 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* ══╗
☆ .mode <public/private>
☆ .clearsession
☆ .antidelete
☆ .cleartmp
☆ .update
☆ .settings
☆ .restart
☆ .setpp
☆ .autoreact
☆ .autostatus
☆ .autotyping
☆ .autoread
☆ .anticall
☆ .pmblocker
☆ .setmention
☆ .mention
╚═══════════════════════════════════════╝

╔══🎨 *𝗜𝗠𝗔𝗚𝗘 / 𝗦𝗧𝗜𝗖𝗞𝗘𝗥* ══╗
☆ .blur
☆ .simage
☆ .sticker
☆ .removebg
☆ .remini
☆ .crop
☆ .tgsticker
☆ .meme
☆ .take
☆ .emojimix
☆ .igs
☆ .igsc
╚═══════════════════════════════════════╝

╔══🖼️ *𝗣𝗜𝗘𝗦 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* ══╗
☆ .pies <country>
☆ .china
☆ .indonesia
☆ .japan
☆ .korea
☆ .hijab
╚═══════════════════════════════════════╝

╔══🎮 *𝗚𝗔𝗠𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* ══╗
☆ .tictactoe
☆ .hangman
☆ .guess
☆ .trivia
☆ .answer
☆ .truth
☆ .dare
╚═══════════════════════════════════════╝

╔══🤖 *𝗔𝗜 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* ══╗
☆ .gpt
☆ .gemini
☆ .imagine
☆ .flux
☆ .sora
╚═══════════════════════════════════════╝

╔══🎯 *𝗙𝗨𝗡 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦* ══╗
☆ .compliment
☆ .insult
☆ .flirt
☆ .shayari
☆ .goodnight
☆ .roseday
☆ .character
☆ .wasted
☆ .ship
☆ .simp
☆ .stupid
╚═══════════════════════════════════════╝

╔══🔤 *𝗧𝗘𝗫𝗧𝗠𝗔𝗞𝗘𝗥* ══╗
☆ .metallic
☆ .ice
☆ .snow
☆ .impressive
☆ .matrix
☆ .light
☆ .neon
☆ .devil
☆ .purple
☆ .thunder
☆ .leaves
☆ .1917
☆ .arena
☆ .hacker
☆ .sand
☆ .blackpink
☆ .glitch
☆ .fire
╚═══════════════════════════════════════╝

╔══📥 *𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥* ══╗
☆ .play
☆ .song
☆ .spotify
☆ .instagram
☆ .facebook
☆ .tiktok
☆ .video
☆ .ytmp4
╚═══════════════════════════════════════╝

╔══🧩 *𝗠𝗜𝗦𝗖* ══╗
☆ .heart
☆ .horny
☆ .circle
☆ .lgbt
☆ .lolice
☆ .its-so-stupid
☆ .namecard
☆ .oogway
☆ .tweet
☆ .ytcomment
☆ .comrade
☆ .gay
☆ .glass
☆ .jail
☆ .passed
☆ .triggered
╚═══════════════════════════════════════╝

╔══🖼️ *𝗔𝗡𝗜𝗠𝗘* ══╗
☆ .neko
☆ .waifu
☆ .loli
☆ .nom
☆ .poke
☆ .cry
☆ .kiss
☆ .pat
☆ .hug
☆ .wink
☆ .facepalm
╚═══════════════════════════════════════╝

╔══💻 *𝗚𝗜𝗧𝗛𝗨𝗕* ══╗
☆ .git
☆ .github
☆ .sc
☆ .script
☆ .repo
╚═══════════════════════════════════════╝

⚡ *𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗖𝘆𝗯𝗲𝗿𝗺𝗮𝘀𝘁𝗲𝗿 𝗫𝗠𝗗* ⚡`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);

            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363421524293619@newsletter',
                        newsletterName: '𝗖𝗬𝗕𝗘𝗥𝗠𝗔𝗦𝗧𝗘𝗥 𝗫𝗠𝗗',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363421524293619@newsletter',
                        newsletterName: '𝗖𝗬𝗕𝗘𝗥𝗠𝗔𝗦𝗧𝗘𝗥 𝗫𝗠𝗗',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;