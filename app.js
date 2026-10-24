const K = "az900tracker.v1"; let S = { a: [], exam: "" };
try { const r = localStorage.getItem(K); if (r) S = JSON.parse(r) } catch (e) { }
const save = () => { try { localStorage.setItem(K, JSON.stringify(S)) } catch (e) { } };
const $ = id => document.getElementById(id);
const sh = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a };
const dom = t => { const r = S.a.filter(a => a.t === t).slice(-3); const n = r.reduce((s, a) => s + a.n, 0); return n ? { p: r.reduce((s, a) => s + a.c, 0) / n * 100, n, k: S.a.filter(a => a.t === t).length } : null };
const trend = t => { const r = S.a.filter(a => a.t === t); if (r.length < 2) return ""; const d = r[r.length - 1].c / r[r.length - 1].n - r[r.length - 2].c / r[r.length - 2].n; return d > .05 ? " ▲" : d < -.05 ? " ▼" : " ▬" };
const lvl = p => p == null ? ["none", "Not started"] : p >= 80 ? ["ready", "Exam-ready"] : p >= 65 ? ["almost", "Almost there"] : ["need", "Needs work"];
const col = p => p >= 80 ? "var(--acc)" : p >= 65 ? "var(--warn)" : "var(--bad)";
let tab = 1, qz = null;
function dash() {
    const ds = Object.keys(TOP).map(t => ({ t, d: dom(t) })); const have = ds.filter(x => x.d);
    const wsum = have.reduce((s, x) => s + TOP[x.t].w, 0);
    const ov = have.length ? have.reduce((s, x) => s + x.d.p * TOP[x.t].w, 0) / wsum : null;
    const [lc, ll] = lvl(ov); const C = 326.7;
    let days = ""; if (S.exam) { const n = Math.ceil((new Date(S.exam + "T00:00:00") - new Date()) / 864e5); days = n > 0 ? `${n} day${n == 1 ? "" : "s"} to your exam` : n == 0 ? "Exam day, good luck!" : "Exam date has passed" }
    const weak = have.slice().sort((a, b) => a.d.p - b.d.p)[0], miss = ds.filter(x => !x.d);
    const rec = !have.length ? "Take your first practice set to get a readiness score." : miss.length ? `Next: start “${TOP[miss[0].t].n}”, you haven’t practised it yet.` : weak.d.p >= 80 ? "All topics are above target. Keep revising with mixed practice and stay consistent." : `Focus next on “${TOP[weak.t].n}” (${Math.round(weak.d.p)}%).`;
    const hist = S.a.slice(-12);
    $("v").innerHTML = `<div class="card hero"><div class="ring"><svg width="130" height="130"><circle cx="65" cy="65" r="52" fill="none" stroke="var(--line)" stroke-width="12"/><circle cx="65" cy="65" r="52" fill="none" stroke="${ov == null ? "var(--line)" : col(ov)}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - (ov || 0) / 100)}"/></svg><b>${ov == null ? "–" : Math.round(ov) + "%"}</b></div>
  <div style="flex:1;min-width:200px"><span class="pill ${lc}">${ll}</span><p style="margin:8px 0 4px"><strong>${rec}</strong></p>
  <p class="sm" style="margin:0">${have.length ? `Based on ${have.length} of 3 topics, weighted by exam share. Uses your last 3 attempts per topic.` : "Target: 80% in every topic."}</p>
  <div class="row" style="margin-top:10px"><label class="sm">Exam date <input type="date" id="ex" value="${S.exam || ""}"></label><span class="sm">${days}</span></div></div></div>
  <h2>By topic</h2>${ds.map(({ t, d }) => {
        const [c, l] = lvl(d && d.p); return `<div class="card dom"><div class="top"><strong>${TOP[t].n}</strong><span class="sm">~${Math.round(TOP[t].w / 1.175 * 100)}% of exam · ${d ? d.k + " attempt" + (d.k > 1 ? "s" : "") : "no attempts"}</span></div>
  <div class="track"><i style="width:${d ? d.p : 0}%;background:${d ? col(d.p) : "var(--line)"}"></i><u title="80% target"></u></div>
  <div class="top"><span class="pill ${c}">${l}</span><span class="sm">${d ? Math.round(d.p) + "%" + trend(t) + " (last " + d.n + " questions)" : "–"}</span></div></div>`
    }).join("")}
  <h2>Recent attempts</h2><div class="card">${hist.length ? `<div class="chart">${hist.map(a => { const p = a.c / a.n * 100; return `<div title="${TOP[a.t].n}: ${a.c}/${a.n}" style="height:${Math.max(p, 3)}%;background:${col(p)}"></div>` }).join("")}</div><p class="sm" style="margin:6px 0 0">Newest on the right. Hover or tap a bar for details. Bars at 80% or above count as on target.</p>` : `<p class="sm" style="margin:0">No attempts yet. Go to Practice.</p>`}</div>
  <h2>Log a score from another practice test</h2><div class="card row"><select id="lt">${Object.entries(TOP).map(([k, v]) => `<option value="${k}">${v.n}</option>`).join("")}</select>
  <input id="lc" type="number" min="0" placeholder="Correct" style="width:90px"><input id="ln" type="number" min="1" placeholder="Out of" style="width:90px"><button class="pri" id="lb">Add</button></div>
  <p class="row" style="margin-top:16px"><button id="rs">Reset all data</button></p>`;
    $("ex").onchange = e => { S.exam = e.target.value; save(); dash() };
    $("lb").onclick = () => { const c = +$("lc").value, n = +$("ln").value; if (n > 0 && c >= 0 && c <= n) { S.a.push({ t: $("lt").value, c, n, d: Date.now() }); save(); dash() } else alert("Enter a valid score, e.g. 7 out of 10.") };
    $("rs").onclick = () => { if (confirm("Delete all your scores?")) { S = { a: [], exam: "" }; save(); dash() } };
}
function prac() {
    if (!qz) {
        $("v").innerHTML = `<div class="card"><strong>Choose a topic</strong><p class="sm">5 questions, instant feedback with an explanation after every answer.</p>${Object.entries(TOP).map(([k, v]) => `<button class="opt" data-k="${k}">${v.n}</button>`).join("")}</div>`;
        $("v").querySelectorAll("[data-k]").forEach(b => b.onclick = () => { const k = b.dataset.k; qz = { t: k, q: sh(Q.filter(x => x[0] === k)).slice(0, 5), i: 0, c: 0, done: false }; prac() }); return
    }
    if (qz.i >= qz.q.length) {
        const p = qz.c / qz.q.length * 100; S.a.push({ t: qz.t, c: qz.c, n: qz.q.length, d: Date.now() }); save();
        $("v").innerHTML = `<div class="card"><h2 style="margin-top:0">${qz.c}/${qz.q.length} in ${TOP[qz.t].n}</h2><p>${p >= 80 ? "Strong result. Keep it up!" : p >= 60 ? "Getting there. Review the explanations and retry." : "Good start. Read the explanations and try again."}</p><div class="row"><button class="pri" id="g1">See dashboard</button><button id="g2">Practise again</button></div></div>`;
        $("g1").onclick = () => { qz = null; go(1) }; $("g2").onclick = () => { qz = null; prac() }; return
    }
    const x = qz.q[qz.i]; if (!qz.o) qz.o = sh(x.slice(2, 6));
    $("v").innerHTML = `<div class="card"><p class="sm">${TOP[qz.t].n} · Question ${qz.i + 1} of ${qz.q.length}</p><strong>${x[1]}</strong>${qz.o.map((o, j) => `<button class="opt ${qz.done ? (o === x[2] ? "right" : qz.pick === j ? "wrong" : "") : ""}" data-j="${j}" ${qz.done ? "disabled" : ""}>${o}</button>`).join("")}
  ${qz.done ? `<div class="fb"><strong>${qz.o[qz.pick] === x[2] ? "Correct." : "Not quite."}</strong> ${x[6]}</div><p><button class="pri" id="nx">${qz.i + 1 < qz.q.length ? "Next" : "Finish"}</button></p>` : ""}</div>`;
    $("v").querySelectorAll("[data-j]").forEach(b => b.onclick = () => { qz.pick = +b.dataset.j; qz.done = true; if (qz.o[qz.pick] === x[2]) qz.c++; prac() });
    if (qz.done) $("nx").onclick = () => { qz.i++; qz.done = false; qz.o = null; prac() };
}
function go(n) { tab = n; $("t1").className = n == 1 ? "on" : ""; $("t2").className = n == 2 ? "on" : ""; n == 1 ? dash() : prac() }
$("t1").onclick = () => go(1); $("t2").onclick = () => go(2); go(1);