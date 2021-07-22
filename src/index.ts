import { getConfig } from 'doge-config';
import { create, NodeSiteRequest } from 'nodesite.eu';
import { OpList } from 'oplist';

const config = getConfig('meme-config', {
	domain: `memestream-${process.env.USER}.nodesite.eu`,
});
const domain = config.__getString('domain');
const memes = getConfig('memes').__getField('memes');

const banned = new OpList('config/banned.txt');

const on_init_banned = [...banned.entries];

let memecount = -1;
const oldmemes = [...memes.array];
const newmemes: string[] = [];

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

create(
	domain,
	'/',
	() => ({ statusCode: 302, head: { Location: '/src/index.html' } }),
	'.'
);

create(domain, '/post', (request: NodeSiteRequest) => {
	const meme = request.body?.toString?.();
	if (meme && meme.length === 64 && !memes.array.includes(meme)) {
		memes.__set((++memecount).toString(), meme);
	}
	return {
		body: `${memecount}`,
	};
});

create(domain, '/last', () => {
	return {
		body: `${memecount}`,
	};
});

create(domain, '/get', (request: NodeSiteRequest) => {
	let memeid = request.uri.replace(/[^0-9]+/g, '') || '0';
	return {
		body: memes.__has(memeid)
			? `"${memes.__getString(memeid)}"`
			: `"${memes.__getString(
					Math.floor(Math.random() * memecount).toString()
			  )}"`,
	};
});
