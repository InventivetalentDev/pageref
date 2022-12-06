const pagesJson = [
    {
        "href": "https://mineskin.org",
        "target": "_blank"
    },
    {
        "href": "https://spiget.org",
        "target": "_blank"
    },
    {
        "href": "https://mcasset.cloud",
        "target": "_blank"
    }
];

const totalWeight = pagesJson.map(p => p.weight || 1).reduce((s, p) => s + p, 0);

let SCRIPT = `(() => {`;
SCRIPT += `const c = document.querySelector('.pageref');`;
SCRIPT += `let ls = [];`

SCRIPT += `function ml(h,n,t,w) {`;
SCRIPT += `let l = document.createElement('a');`;
SCRIPT += `l.className = 'pageref-link';`;
SCRIPT += `l.href = h;`;
SCRIPT += `l.innerText = n;`
SCRIPT += `l.target = t;`
SCRIPT += `l.w=w;`
SCRIPT+=`l.s=Math.random();`
SCRIPT += `return l;`
SCRIPT += `}`

SCRIPT += `let l;`
SCRIPT += `let r = Math.random()*${ totalWeight };`;
pagesJson.map(value => ({value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)
    .forEach(page => {
        let pageUrl = new URL(page.href);

        SCRIPT += `ls.push(ml("${ pageUrl.href || '#' }"," ${ (page.name || page.title) || pageUrl.hostname } ","${ page.target || '_blank' }", ${ page.weight || 1 }));`
    });

SCRIPT += `ls.sort((a, b) => a.s - b.s).forEach(l => {`;
SCRIPT += `if(r<=0.0) return;`
SCRIPT += `c.append(l);`
SCRIPT += `r-=l.w;`
SCRIPT += `});`

SCRIPT += `})();`

const DEMO = `
<html>
<body>

<div>Hello World</div>

<div class="pageref"></div>

<script src="./script.js"></script>
</body>
</html>
`

export default {
    async fetch(request, env, ctx) {
        let url = new URL(request.url);
        if (url.pathname === "/script.js") {
            return new Response(SCRIPT, {
                headers: {
                    'Content-Type': 'application/js',
                    'Cache-Control':'public, max-age=86400'
                }
            })
        }
        return new Response(DEMO, {
            headers: {
                'Content-Type': 'text/html'
            }
        });
    },
};
