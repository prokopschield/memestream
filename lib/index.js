'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const doge_config_1 = require('doge-config');
const nodesite_eu_1 = require('nodesite.eu');
const oplist_1 = require('oplist');
const config = doge_config_1.getConfig('meme-config', {
	domain: `memestream-${process.env.USER}.nodesite.eu`,
});
const domain = config.__getString('domain');
const memes = doge_config_1.getConfig('memes').__getField('memes');
const banned = new oplist_1.OpList('config/banned.txt');
const on_init_banned = [...banned.entries];
let memecount = -1;
const oldmemes = [...memes.array];
const newmemes = [];
for (const meme of oldmemes) {
	if (
		typeof meme === 'string' &&
		meme.length === 64 &&
		!newmemes.includes(meme) &&
		!on_init_banned.includes(meme)
	) {
		memes.__set((++memecount).toString(), meme);
		newmemes.push(meme);
	}
}
nodesite_eu_1.create(
	domain,
	'/',
	() => ({ statusCode: 302, head: { Location: '/src/index.html' } }),
	'.'
);
nodesite_eu_1.create(domain, '/post', (request) => {
	var _a, _b;
	const meme =
		(_b =
			(_a = request.body) === null || _a === void 0 ? void 0 : _a.toString) ===
			null || _b === void 0
			? void 0
			: _b.call(_a);
	if (meme && meme.length === 64 && !memes.array.includes(meme)) {
		memes.__set((++memecount).toString(), meme);
	}
	return {
		body: `${memecount}`,
	};
});
nodesite_eu_1.create(domain, '/last', () => {
	return {
		body: `${memecount}`,
	};
});
nodesite_eu_1.create(domain, '/get', (request) => {
	let memeid = request.uri.replace(/[^0-9]+/g, '') || '0';
	return {
		body: memes.__has(memeid)
			? `"${memes.__getString(memeid)}"`
			: `"${memes.__getString(
					Math.floor(Math.random() * memecount).toString()
			  )}"`,
	};
});
