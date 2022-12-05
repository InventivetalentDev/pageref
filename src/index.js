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
SCRIPT += `let l;`
SCRIPT += `let r = Math.random()*${ totalWeight };`;
pagesJson.map(value => ({value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)
    .forEach(page => {
        let pageUrl = new URL(page.href);

        SCRIPT += `l = document.createElement('a');`;
        SCRIPT += `l.className = 'pageref-link';`;
        SCRIPT += `l.href = "${ pageUrl.href || '#' }";`;
        SCRIPT += `l.innerText = " ${ (page.name || page.title) || pageUrl.hostname } ";`
        SCRIPT += `l.target = "${ page.target || '_blank' }";`
        SCRIPT += `c.append(l);`;

        SCRIPT += `r -= ${ page.weight || 1 };`;
        SCRIPT += `if (r <= 0.0) return;`
    });
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
                    'Content-Type': 'application/js'
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
