import { DEMO } from "./demo";
import { SCRIPT } from "./script";

const DEFAULT_WEIGHT = 0.5;

async function getConfig(env) {
    let conf = await env.CACHE.get('config');
    if (conf) {
        return JSON.parse(conf);
    }
    conf = await fetch(env.CONFIG).then(res => res.json())
    await env.CACHE.put('config', JSON.stringify(conf), {expirationTtl: 10 * 60});
    return conf;
}

async function makeScript(url, env) {
    let config = await getConfig(env);

    let pageArray = config['pages'].map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value)
        .map(page => {
            let pageUrl = new URL(page.href);
            return [page.weight || DEFAULT_WEIGHT, `${ pageUrl.href || '#' }`, ` ${ (page.name || page.title) || pageUrl.hostname } `, `${ page.target || '_blank' }`];
        });

    let max = parseInt(url.searchParams.get("max")) || 3;
    let container = url.searchParams.get('container') || '.pageref';
    return SCRIPT
        .replace('%%max%%', '' + max)
        .replace('%%container%%', container)
        .replace('%%pageArray%%', JSON.stringify(pageArray))
        .replace(/\n/g, '');
}

export default {
    async fetch(request, env, ctx) {
        let url = new URL(request.url);
        if (url.pathname === "/script.js" || url.pathname === "/pages.js") {
            let script = await makeScript(url, env);
            return new Response(script, {
                    headers: {
                        'Content-Type': 'application/js',
                        'Cache-Control': 'public, max-age=86400'
                    }
                }
            )
        }
        return new Response(DEMO, {
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'public, max-age=86400'
            }
        });
    },
};
