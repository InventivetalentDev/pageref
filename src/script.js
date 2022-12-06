export const SCRIPT = `((d) => {
const c = d.querySelector('%%container%%');
if (!c) return;
let ls = %%pageArray%%;
let mx = %%max%%;
let r = Math.random()*%%totalWeight%%;
let i = 0;

function ml(h,n,t,w) {
    let l = document.createElement('a');
    l.className = 'pageref-link';
    l.href = h;
    l.innerText = n;
    l.target = t;
    l.w = w;
    l.s = Math.random();
    return l;
}

ls
.map(p=>ml.apply(this, p))
.sort((a, b) => a.s - b.s)
.forEach(l => {
    if(r<=0.0) return;
    if(i++>=mx) return;
    c.append(l);
    r-=l.w;
});

})(document);`
