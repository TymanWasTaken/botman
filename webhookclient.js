/* eslint-disable no-constant-condition */
'use strict';
const Discord = require('discord.js');
// Create a new webhook
const hook = new Discord.WebhookClient('700040030038523966', 'LaICUDLrUbyanCOpXMKoW3I2sdLJAVH12qLVQGgvQtp6qZ_tqbVhtYKW6GIQu_njUZ3i');

const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin , output: process.stdout });

const getLine = (function () {
	const getLineGen = (async function* () {
		for await (const line of rl) {
			yield line;
		}
	})();
	return async () => ((await getLineGen.next()).value);
})();

const main = async () => {
	while (1) {
		await console.log('What to say?');
		hook.send(await getLine());
	}
};

main();
	
