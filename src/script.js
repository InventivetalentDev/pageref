export const SCRIPT = `((d) => {
const c = d.querySelector('%%container%%');
if (!c) return;

let ls = %%pageArray%%;
let mx = %%max%%;

function ml(w,h,n,t) {
    let l = document.createElement('a');
    l.className = 'pageref-link';
    l.href = h;
    l.rel = 'external';
    l.innerText = n;
    l.target = t;
    l.w = w;
    l.s = Math.random();
    return l;
}

function r() {
    c.innerText = '';
    let i = 0;
    ls
    .map(p=>ml.apply(this, p))
    .sort((a, b) => a.s - b.s)
    .forEach(l => {
        if(Math.random()>l.w) return;
        if(i++>=mx) return;
        c.append(l);
    });
}

r();

c.addEventListener('click',()=>r());

})(document);`
