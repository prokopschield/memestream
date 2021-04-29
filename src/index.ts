import { getConfig, ValidConfigValue } from 'doge-config';
import NodeSiteClient, { NodeSiteRequest } from 'nodesite.eu';

const memes = getConfig('memes');

let memecount = -1;
const oldmemes = [ ...memes.array ];
const newmemes: string[] = [];

for (const meme of oldmemes) {
	if ((typeof meme === 'string') && (meme.length === 64) && (!newmemes.includes(meme))) {
		memes.__set((++memecount).toString(), meme);
		newmemes.push(meme);
	}
}

NodeSiteClient.create('memestream', '/', () => ({ statusCode: 302, head: { Location: '/src/index.html' }}), '.');

NodeSiteClient.create('memestream', '/post', (request: NodeSiteRequest) => {
	const meme = request.body?.toString?.();
	if (meme && (meme.length === 64) && !memes.array.includes(meme)) {
		memes.__set((++memecount).toString(), meme);
	}
	return ({
		body: `${memecount}`,
	});
});

NodeSiteClient.create('memestream', '/last', () => {
	return ({
		body: `${memecount}`,
	});
});

NodeSiteClient.create('memestream', '/get', (request: NodeSiteRequest) => {
	let memeid = request.uri.replace(/[^0-9]+/g, '') || '0';
	return ({
		body: (
			memes.__has(memeid)
			? `"${memes.__getString(memeid)}"`
			: `"${memes.__getString(Math.floor(Math.random() * memecount).toString())}"`
		)
	});
});
