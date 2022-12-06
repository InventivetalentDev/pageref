import { DEMO } from "./demo";
import { SCRIPT } from "./script";
import { PAGES } from "./pages";

const DEFAULT_WEIGHT = 0.5;

const pagesJson = PAGES; //TODO: variable

let pageArray = pagesJson.map(value => ({value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)
    .map(page => {
        let pageUrl = new URL(page.href);
        return [page.weight || DEFAULT_WEIGHT, `${ pageUrl.href || '#' }`, ` ${ (page.name || page.title) || pageUrl.hostname } `, `${ page.target || '_blank' }`];
    });


export default {
    async fetch(request, env, ctx) {
        let url = new URL(request.url);
        if (url.pathname === "/script.js" || url.pathname === "/pages.js") {
            let max = parseInt(url.searchParams.get("max")) || 3;
            let container = url.searchParams.get('container') || '.pageref';
            let script = SCRIPT
                .replace('%%max%%', '' + max)
                .replace('%%container%%', container)
                .replace('%%pageArray%%', JSON.stringify(pageArray))
                .replace(/\n/g, '');
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
                'Content-Type': 'text/html'
            }
        });
    },
};
