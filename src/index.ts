import { getConfig, ValidConfigValue } from 'doge-config';
import NodeSiteClient, { NodeSiteRequest } from 'nodesite.eu';

const memes = getConfig('memes');

NodeSiteClient.create('memestream', '/', () => ({ statusCode: 302, head: { Location: '/src/index.html' }}), '.');

NodeSiteClient.create('memestream', '/post', (request: NodeSiteRequest) => {
	const meme = request.body?.toString?.();
	if (meme && (meme.length === 64)) {
		if (!memes.array.includes(meme)) {
			memes.array.push(meme);
			return ({
				statusCode: 302,
				head: {
					Location: '/last',
				}
			});
		}
	} return ({
		body: '{"error": "Old meme!"}',
	});
});

NodeSiteClient.create('memestream', '/last', () => {
	return ({
		body: `${memes.array.length}`,
	});
});

NodeSiteClient.create('memestream', '/get', (request: NodeSiteRequest) => {
	return ({
		body: `"${memes.__getString(request.uri.replace(/[^0-9]+/g, ''))}"`,
	});
});
