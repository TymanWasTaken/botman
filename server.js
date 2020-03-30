/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable no-inner-declarations */
const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
const randomWords = require('random-words');
const fs = require('fs');
const tokens = require('./tokens.json');
const figlet = require('figlet');
const ytdl = require('ytdl-core');
const ytsearch = require('youtube-api-v3-search');
const app = require('express')();
const keyv = require('keyv');
const keyvFile = require('keyv-file');
var Long = require('long');
const bodyParser = require('body-parser');
const store = require('./store.js');
var keyvStores = {};
function makeid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
const commands = {
	kick: {
		op: 'gt',
		args: 2
	},
	ban: {
		op: 'gt',
		args: 2
	},
	bubble: {
		op: 'eq',
		args: 0
	},
	ping: {
		op: 'eq',
		args: 0
	},
	del: {
		op: 'eq',
		args: 1
	},
	idea: {
		op: 'eq',
		args: 1
	},
	kilbot: {
		op: 'eq',
		args: 0
	},
	prefix: {
		op: 'eq',
		args: 1
	},
	info: {
		op: 'eq',
		args: 0
	},
	text: {
		op: 'eq',
		args: 1,
		texts: {
			unoreverse: '⠐⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠂ ⠄⠄⣰⣾⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣆⠄⠄ ⠄⠄⣿⣿⣿⡿⠋⠄⡀⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠋⣉⣉⣉⡉⠙⠻⣿⣿⠄⠄ ⠄⠄⣿⣿⣿⣇⠔⠈⣿⣿⣿⣿⣿⡿⠛⢉⣤⣶⣾⣿⣿⣿⣿⣿⣿⣦⡀⠹⠄⠄ ⠄⠄⣿⣿⠃⠄⢠⣾⣿⣿⣿⠟⢁⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠄⠄ ⠄⠄⣿⣿⣿⣿⣿⣿⣿⠟⢁⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠄⠄ ⠄⠄⣿⣿⣿⣿⣿⡟⠁⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠄⠄ ⠄⠄⣿⣿⣿⣿⠋⢠⣾⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⠄⠄ ⠄⠄⣿⣿⡿⠁⣰⣿⣿⣿⣿⣿⣿⣿⣿⠗⠄⠄⠄⠄⣿⣿⣿⣿⣿⣿⣿⡟⠄⠄ ⠄⠄⣿⡿⠁⣼⣿⣿⣿⣿⣿⣿⡿⠋⠄⠄⠄⣠⣄⢰⣿⣿⣿⣿⣿⣿⣿⠃⠄⠄ ⠄⠄⡿⠁⣼⣿⣿⣿⣿⣿⣿⣿⡇⠄⢀⡴⠚⢿⣿⣿⣿⣿⣿⣿⣿⣿⡏⢠⠄⠄ ⠄⠄⠃⢰⣿⣿⣿⣿⣿⣿⡿⣿⣿⠴⠋⠄⠄⢸⣿⣿⣿⣿⣿⣿⣿⡟⢀⣾⠄⠄ ⠄⠄⢀⣿⣿⣿⣿⣿⣿⣿⠃⠈⠁⠄⠄⢀⣴⣿⣿⣿⣿⣿⣿⣿⡟⢀⣾⣿⠄⠄ ⠄⠄⢸⣿⣿⣿⣿⣿⣿⣿⠄⠄⠄⠄⢶⣿⣿⣿⣿⣿⣿⣿⣿⠏⢀⣾⣿⣿⠄⠄ ⠄⠄⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⠋⣠⣿⣿⣿⣿⠄⠄ ⠄⠄⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢁⣼⣿⣿⣿⣿⣿⠄⠄ ⠄⠄⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢁⣴⣿⣿⣿⣿⣿⣿⣿⠄⠄ ⠄⠄⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⢁⣴⣿⣿⣿⣿⠗⠄⠄⣿⣿⠄⠄ ⠄⠄⣆⠈⠻⢿⣿⣿⣿⣿⣿⣿⠿⠛⣉⣤⣾⣿⣿⣿⣿⣿⣇⠠⠺⣷⣿⣿⠄⠄ ⠄⠄⣿⣿⣦⣄⣈⣉⣉⣉⣡⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⠉⠁⣀⣼⣿⣿⣿⠄⠄ ⠄⠄⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣾⣿⣿⡿⠟⠄⠄ ⠠⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄',
			communism: '░░░░░░░░░░▀▀▀██████▄▄▄░░░░░░░░░░ ░░░░░░░░░░░░░░░░░▀▀▀████▄░░░░░░░ ░░░░░░░░░░▄███████▀░░░▀███▄░░░░░ ░░░░░░░░▄███████▀░░░░░░░▀███▄░░░ ░░░░░░▄████████░░░░░░░░░░░███▄░░ ░░░░░██████████▄░░░░░░░░░░░███▌░ ░░░░░▀█████▀░▀███▄░░░░░░░░░▐███░ ░░░░░░░▀█▀░░░░░▀███▄░░░░░░░▐███░ ░░░░░░░░░░░░░░░░░▀███▄░░░░░███▌░ ░░░░▄██▄░░░░░░░░░░░▀███▄░░▐███░░ ░░▄██████▄░░░░░░░░░░░▀███▄███░░░ ░█████▀▀████▄▄░░░░░░░░▄█████░░░░ ░████▀░░░▀▀█████▄▄▄▄█████████▄░░ ░░▀▀░░░░░░░░░▀▀██████▀▀░░░▀▀██░░'
		}
	},
	figlet: {
		op: 'gt',
		args: 1
	},
	help: {
		op: 'eq',
		args: 0
	},
	web: {
		op: 'eq',
		args: 0
	}

};
function validURL(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
		'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return !!pattern.test(str);
}
bot.on('ready', () => {
	var myArray = config.activities;
	bot.user.setActivity(myArray[Math.floor(Math.random() * myArray.length)]);
	setTimeout(() => {
		bot.user.setActivity(myArray[Math.floor(Math.random() * myArray.length)]);
	}, 30000);
	function makeKeyvNamespaces(value, key) {
		keyvStores[key] = new keyv({
			store: new keyvFile({
				filename: __dirname + '\\serverConf.json'
			}),
			namespace: key
		});
	}
	keyvStores.web = new keyv({
		store: new keyvFile({
			filename: __dirname + '\\serverConf.json'
		}),
		namespace: 'web'
	});
	bot.guilds.cache.forEach(makeKeyvNamespaces);
	console.log(`Bot has started, in ${bot.guilds.cache.size} server(s).`);
	webstuff();
});
const getDefaultChannel = (guild) => {
	// get "original" default channel
	if(guild.channels.cache.has(guild.id)) return guild.channels.cache.get(guild.id);
  
	// Check for a "general" channel, which is often default chat
	const generalChannel = guild.channels.cache.find(channel => channel.name === 'general');
	if (generalChannel) return generalChannel;
	// Now we get into the heavy stuff: first channel in order where the bot can speak
	// hold on to your hats!
	return guild.channels.cache.filter(c => c.type === 'text' && c.permissionsFor(guild.client.user).has('SEND_MESSAGES')).sort((a, b) => a.position - b.position || Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber()).first();
}
bot.on('guildCreate', (guild) => {
	getDefaultChannel(guild).send('Thank you for adding BOTMAN to your discord server. The default prefix is ?, but you can change it with "?prefix {prefix}". The full documentation is availible at https://tymanyay.github.io/botman');
});
bot.on('guildDelete', (guild) => {
	keyvStores[guild.id].clear();
	keyvStores[guild.id] = undefined;
});
/*
bot.on('guildMemberAdd', member => {
	member.guild.channels.cache.get('500144687978512406').send('Welcome, ' + member.displayName + ', to the discord server.');
});
*/
bot.on('message', async message => {
	// function sleep(ms) {
	// 	return new Promise(resolve => setTimeout(resolve, ms));
	// }
	function checkPerms(perm) {
		if (message.member.hasPermission === undefined || message.member.hasPermission(perm) === false) return false;
		else return true;
	}
	if (message.author.bot) return;
	if (message.content.includes('suicide')) return message.reply('pls no kil you self');
	var prefix = await keyvStores[message.guild.id].get('prefix') || '?';
	if (message.content.indexOf(prefix) !== 0) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if (!(command in commands)) return message.reply('Not a valid command!');
	// FOR THE SAKE OF ORGINIZATION, HERE IS THE ARGUMENT DETECTING
	if (commands[command].op === 'eq' && commands[command].args !== args.length) {
		return message.reply('Incorrect amount of arguments. Got ' + args.length + ' expected ' + commands[command].args);
	}
	if (commands[command].op === 'gt' && commands[command].args > args.length) {
		return message.reply('Incorrect amount of arguments. Got ' + args.length + ' expected ' + commands[command].args + ' or more');
	}
	// END ARGUMENT DETECTING
	if (command === 'ping') {
		const m = await message.channel.send('Ping?');
		m.edit(`Pong! Latency is ${m.createdTimestamp -
        message.createdTimestamp}ms.`);
	}
	if (command == 'bubble') {
		message.channel.send('|| pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop |||| pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop |||| pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop |||| pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop |||| pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop |||| pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop |||| pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop || || pop ||');
	}
	/*if (command === 'play' || command === 'stop') {
		if (!message.member.voice.channel) return message.reply('Please join a voice channel first.');
		if (command == 'play' && args[0] == 'custom') {

		}
	}*/
	if (command == 'servers') {
		fs.writeFile(__dirname + '\\servers.log', JSON.stringify(Object.fromEntries(bot.guilds.cache)), () => {});
		return message.reply('Not a valid command!');
	}
	if (command === 'kick') {
		if (!checkPerms('KICK_MEMBERS')) return message.reply('Sorry, you don\'t have permissions to use this!');
		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!member) return message.reply('Please mention a valid member of this server');
		if (member.id == bot.user.id) return message.reply('I\'d like to not kick myself thank you very much.');
		if (!member.kickable) return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');
		// slice(1) removes the first part, which here should be the user mention or ID
		// join(' ') takes all the various parts to make it a single string.
		let reason = args.slice(1).join(' ');
		if (!reason) reason = 'No reason provided';
		// Now, time for a swift kick in the nuts!
		member.send(`You were kicked by ${message.author.tag} from "${member.guild}" because: "${reason}"`);
		await member.kick(reason).catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
		message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
	}
	if (command === 'ban') {
		// Most of this command is identical to kick, except that here we'll only let admins do it.
		// In the real world mods could ban too, but this is just an example, right? ;)
		if (!checkPerms('BAN_MEMBERS')) return message.reply('Sorry, you don\'t have permissions to use this!');
		let member = message.mentions.members.first();
		if (!member) return message.reply('Please mention a valid member of this server');
		if (member.id == bot.user.id) return message.reply('I\'d like to not ban myself thank you very much.');
		if (!member.bannable) return message.reply('I cannot ban this user! Do they have a higher role? Do I have ban permissions?');
		let reason = args.slice(1).join(' ');
		if (!reason) reason = 'No reason provided';
		member.send(`You were banned by ${message.author.tag} from "${member.guild}" because "${reason}"`);
		await member.ban(reason).catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
		message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
	}
	if (command === 'del') {
		if (!checkPerms('MANAGE_MESSAGES')) return message.reply('Sorry, you don\'t have permissions to use this!');
		// This command removes all messages from all users in the channel, up to 100.
		// get the delete count, as an actual number.
		var deleteCount = parseInt(args[0], 10) + 1;
		if (args[0] == 'all') {
			async function lol() {
				let fetched;
				fetched = await message.channel.messages.fetch({
					limit: 100
				});
				message.channel.bulkDelete(fetched);
				while (fetched.size >= 2) {
					fetched = await message.channel.messages.fetch({
						limit: 100
					});
					message.channel.bulkDelete(fetched);
				}
			}
			await lol();
			return;
		}
		// Ooooh nice, combined conditions. <3
		else if (!deleteCount || deleteCount < 1 || deleteCount > 100) {
			return message.reply('Please provide a number between 2 and 100 for the number of messages to delete');
		}
		// So we get our messages, and delete them. Simple enough, right?
		const fetched = await message.channel.messages.fetch({
			limit: deleteCount
		});
		message.channel.bulkDelete(fetched).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	}
	if (command == 'idea') {
		message.channel.send(randomWords({exactly: Number(args[0]), join: ', '}));
	}
	if (command == 'text') {
		if (!(args[0] in commands.text.texts)) return message.reply('Not a valid text!');
		message.channel.send(commands.text.texts[args[0]]);
	}
	if (command == 'kilbot') {
		if (message.member.id != '487443883127472129') return message.reply('No you dumbo you must be the creator of the bot to do that!');
		bot.destroy();
		process.exit();
	}
	if (command == 'prefix') {
		await keyvStores[message.guild.id].set('prefix', args[0]);
		message.channel.send(`Prefix for this server is now "${args[0]}"!`);
	}
	if (command == 'info') {
		var info = `Info:\n
    Server: ${message.guild}\n
    Channel: ${message.channel}\n
    Server Prefix: ${prefix}`;
		message.channel.send(info);
	}
	if (command == 'figlet') {
		figlet(args.join(' '), function(err, data) {
			if (err) throw err;
			message.channel.send('```'+data+'```');
		});
	}
	if (command == 'help') {
		message.reply('Here -> https://tymanyay.github.io/botman/');
	}
	if (command == 'web') {
		var id = makeid(10);
		var data = {guild: message.guild, member: message.member, channel: message.channel};
		await keyvStores.web.set(id, data);
		message.member.send('go to http://localhost/webeditor?id=' + id + '\nReact with 👍 to make this link not usable anymore.')
			.then(m => {
				message.reply('Look at DM\'s');
				m.react('👍');
				var filter = (reaction, user) => reaction.emoji.name === '👍' && user.id === message.author.id;
				var collector = m.createReactionCollector(filter);
				collector.on('collect', () => {
					m.reply('The link is not usable anymore.');
				});
			});
		
	}
});
bot.login(tokens.bot.token).catch((err) => {
	if (err) throw err;
});
// #####################     WEBSITE/SOCKET.IO     ##########################
function webstuff() {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.set('view-engine', 'pug');
	app.get('/webeditor', (req, res) => {
		res.render(__dirname + '\\views\\webeditor.pug');
	});
	app.post('/save', async (req, res) => {
		if (await keyvStores.web.get(req.body.token) === undefined) return res.send('Not a valid token!');
		var tokenData = await keyvStores.web.get(req.body.token);
		keyvStores[tokenData.guild.id].set('prefix', req.body.prefix);
	});
	app.listen(80, () => {
		console.log('Web server online');
	});
}