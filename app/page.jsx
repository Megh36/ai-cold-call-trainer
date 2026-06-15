"use client";

import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id:"saas",       label:"SaaS / Software" },
  { id:"realestate", label:"Real Estate" },
  { id:"marketing",  label:"Marketing Services" },
  { id:"finance",    label:"Financial Services" },
  { id:"insurance",  label:"Insurance" },
  { id:"recruiting", label:"Recruitment / Staffing" },
  { id:"ecommerce",  label:"E-Commerce / Retail" },
  { id:"healthcare", label:"Healthcare / MedTech" },
];

const PROSPECTS = {
  saas: [
    { name:"James Thornton", spec:"CTO, Series B SaaS Startup",           diff:"Medium", gender:"male",   ctx:"Technical buyer. Burned by overpromising tools. Ask about API quality and integration complexity early. Warm up only if they show genuine technical depth." },
    { name:"Rachel Osei",    spec:"VP of Sales, Enterprise Software Co.",  diff:"Medium", gender:"female", ctx:"Sales leader with a 20-person team. Ask about rep adoption and ramp time. Warm up when they show how this reduces pipeline admin or improves forecast accuracy." },
    { name:"David Park",     spec:"CEO, Bootstrapped SaaS",                diff:"Hard",   gender:"male",   ctx:"Every dollar is deliberate. Burned by tools before. Demand specific ROI. Buzzword pitches end the call fast." },
    { name:"Karen Mitchell", spec:"IT Director, Mid-market Enterprise",     diff:"Hard",   gender:"female", ctx:"Gatekeeper for the tech stack. First question is always SOC2, data privacy, security posture. If they cannot answer precisely, the call is over." },
    { name:"Brian Nguyen",   spec:"Head of Product, Growth-stage Startup",  diff:"Easy",   gender:"male",   ctx:"Moves fast. Give a clear value prop and simple pricing and you have a shot. Ready to book a demo same-day." },
  ],
  realestate: [
    { name:"Sandra Brooks",  spec:"Independent Residential Agent",          diff:"Medium", gender:"female", ctx:"Time-poor solo agent. Already uses a CRM. Ask what makes this different. Warm up if they show it meaningfully reduces follow-up time." },
    { name:"Robert Finch",   spec:"Broker-Owner, 18-Agent Brokerage",      diff:"Medium", gender:"male",   ctx:"Focused on team productivity. Ask about multi-user setup and reporting. Warm up if they show it helps coach agents using performance data." },
    { name:"Maria Castillo", spec:"Commercial Real Estate Developer",       diff:"Hard",   gender:"female", ctx:"High-value deals, long timelines. Will not engage with tools built for residential. Only interested if they clearly understand commercial real estate." },
    { name:"Thomas Grey",    spec:"Property Manager, 300+ Units",          diff:"Medium", gender:"male",   ctx:"High inbound volume of tenant requests. Warm up if they show it handles routine inquiries without requiring your oversight." },
    { name:"Jessica Lam",    spec:"Luxury Residential Specialist",         diff:"Hard",   gender:"female", ctx:"White-glove service is your brand. Skeptical of AI in high-touch relationships. Only warm up if they show it elevates rather than automates your client experience." },
  ],
  marketing: [
    { name:"Daniel Foster",  spec:"Agency Owner, 12-Person Creative Shop",  diff:"Hard",   gender:"male",   ctx:"Tight margins. Ask for a direct business case: problem, cost, ROI. Generic pitches get cut off immediately." },
    { name:"Amanda Pierce",  spec:"CMO, DTC E-Commerce Brand",             diff:"Medium", gender:"female", ctx:"Everything connects to CAC, ROAS, or LTV. Ask how this moves those numbers — not just saves time in general." },
    { name:"Chris Okafor",   spec:"Head of Growth, Venture-backed Startup", diff:"Easy",  gender:"male",   ctx:"Moves fast. Always testing new channels. Give a clear value prop and reasonable pricing and you have a shot." },
    { name:"Priya Mehta",    spec:"Marketing Director, B2B SaaS",          diff:"Medium", gender:"female", ctx:"Seen too many martech tools overpromise. Ask about integration with existing stack. Warm up if they reduce work rather than add another dashboard." },
    { name:"Steven Ward",    spec:"Digital Marketing Consultant, Solo",     diff:"Hard",   gender:"male",   ctx:"Solo operator. No patience for long onboarding or annual contracts. Must show significant time saved or revenue added within 30 days." },
  ],
  finance: [
    { name:"Michael Sterling", spec:"Independent Financial Advisor",        diff:"Medium", gender:"male",   ctx:"Client relationships and compliance are everything. Warm up if they handle the compliance question well and address client trust." },
    { name:"Laura Beaumont",  spec:"Wealth Manager, Single-Family Office",  diff:"Hard",   gender:"female", ctx:"Ultra-high standards. Only engage if they demonstrate they understand your world: discretion, complexity, long-horizon thinking." },
    { name:"Kevin Walsh",     spec:"CFO, Manufacturing SMB",                diff:"Hard",   gender:"male",   ctx:"Numbers only. Cost, return, payback period. Push hard on any vague ROI claims and hidden costs." },
    { name:"Natalie Cruz",    spec:"Mortgage Broker, Independent",          diff:"Medium", gender:"female", ctx:"High volume of deals. Warm up if they show it automates client follow-up on document collection without micromanagement." },
    { name:"Edward Lawson",   spec:"Financial Planning Associate, Regional Firm", diff:"Easy", gender:"male", ctx:"Junior role, lots of admin work. Open to tools that reduce repetitive tasks. Will mention needing senior partner sign-off." },
  ],
  insurance: [
    { name:"Robert Mercer",  spec:"Independent Insurance Broker",          diff:"Medium", gender:"male",   ctx:"Multi-carrier solo shop. Skeptical of tools that do not understand insurance workflows. Warm up if they show real pipeline knowledge." },
    { name:"Diana Alvarez",  spec:"Agency Principal, Property and Casualty", diff:"Hard", gender:"female", ctx:"12 years running your agency. Push back hard on automation replacing personal relationships. Augmenting the team only." },
    { name:"Mark Jensen",    spec:"Commercial Lines Underwriter",           diff:"Hard",   gender:"male",   ctx:"Compliance is non-negotiable. Must address data privacy, state regulation compliance, and E and O implications immediately." },
    { name:"Sarah Tran",     spec:"Life and Health Insurance Agent",        diff:"Medium", gender:"female", ctx:"Growing book of business. Ask about compliance guardrails. Warm up if they are realistic about what AI can and cannot do." },
    { name:"Phil Hammond",   spec:"Medicare Insurance Specialist",          diff:"Medium", gender:"male",   ctx:"Clients are seniors needing human care. Only warm up if they show it handles sensitive interactions carefully." },
  ],
  recruiting: [
    { name:"Jennifer Morris", spec:"Founder, Boutique Tech Recruiter",     diff:"Medium", gender:"female", ctx:"Specialized firm, quality over volume. Ask how this helps with high-value search assignments, not bulk screening." },
    { name:"Marcus Davis",   spec:"Head of Talent Acquisition, Series C",  diff:"Medium", gender:"male",   ctx:"Hiring 40 people this quarter. Ask about speed and candidate quality. Warm up if it meaningfully cuts screening burden." },
    { name:"Karen O'Brien",  spec:"HR Director, 500-Person Company",       diff:"Hard",   gender:"female", ctx:"Everything goes through procurement, legal, and CHRO. Push back: 6-month evaluation cycle is normal here." },
    { name:"Andrew Cole",    spec:"Executive Search Consultant",           diff:"Hard",   gender:"male",   ctx:"C-suite placements with curated processes. Only warm up if they position this as handling low-value admin so you focus on relationships." },
    { name:"Tiffany Reyes",  spec:"HR Generalist, Growing SMB",            diff:"Easy",   gender:"female", ctx:"Wearing many hats, stretched thin. Open to anything that reduces repetitive admin. Warm up quickly if pricing is accessible." },
  ],
  ecommerce: [
    { name:"Nathan Bloom",   spec:"Founder, DTC Brand",                    diff:"Medium", gender:"male",   ctx:"Running a 2M revenue brand mostly solo. Ask about Shopify integration first. Interested in reducing support load and increasing repeat purchases." },
    { name:"Rachel Stone",   spec:"VP of Operations, Mid-size Retailer",   diff:"Hard",   gender:"female", ctx:"Focused on cost control. Ask hard questions about migration complexity and realistic ROI. Not easily moved." },
    { name:"James Choi",     spec:"E-Commerce Manager, Enterprise Retailer", diff:"Hard", gender:"male",   ctx:"Enterprise-grade requirements: security, compliance, SSO, scale. Decisions take months. Ask for proof of scale." },
    { name:"Emily Torres",   spec:"Shopify Store Owner, Solopreneur",      diff:"Easy",   gender:"female", ctx:"Growing online store. Ask about pricing tiers and free trials. Warm up quickly if it sounds simple to start." },
    { name:"Derek Thompson", spec:"Supply Chain Director, Retail Group",   diff:"Hard",   gender:"male",   ctx:"You are not the right contact. Push back immediately and ask how they got your number." },
  ],
  healthcare: [
    { name:"Dr. Alan Patel",  spec:"Private Practice Physician",            diff:"Hard",   gender:"male",   ctx:"30 patients a day. HIPAA compliance must be addressed immediately. If not addressed, the call ends." },
    { name:"Jennifer Cross",  spec:"Practice Administrator, Multi-Location Clinic", diff:"Medium", gender:"female", ctx:"Managing admin operations across 4 locations. Ask about EHR integration and HIPAA. Warm up if they show real healthcare admin workflow knowledge." },
    { name:"Richard Huang",   spec:"Procurement Officer, Regional Hospital System", diff:"Hard", gender:"male",   ctx:"Formal RFP process only. 6-month procurement cycle. Professional but thoroughly process-bound." },
    { name:"Sarah Kim",       spec:"CEO, Health-Tech Startup",              diff:"Medium", gender:"female", ctx:"Understands the space, moves quickly but thoughtfully. Ask about API access. Warm up if they can be a real product partner." },
    { name:"Philip Carter",   spec:"Senior VP, Regional Health System",     diff:"Hard",   gender:"male",   ctx:"C-suite. Very limited time. Ask immediately for a healthcare reference customer at scale. No reference = end of call." },
  ],
};

const TRAITS = ["Skeptical","Analytical","Time-poor","Budget-conscious","Relationship-focused","Compliance-focused","Technical buyer","Already has a solution","Open to new tools","Process-driven","Gatekeeper"];
const MALE_VX   = ["male","david","mark","james","daniel","alex","tom","fred","oliver","jorge","guy"];
const FEMALE_VX = ["female","samantha","karen","victoria","zira","allison","susan","lisa","moira","tessa","serena","fiona","hazel","kate"];

// ─── Utilities ────────────────────────────────────────────────────────────────
const AVC = [
  {bg:"rgba(129,140,248,.2)",t:"#818CF8"},{bg:"rgba(52,211,153,.2)",t:"#34D399"},
  {bg:"rgba(251,191,36,.2)",t:"#FBBF24"},{bg:"rgba(249,115,22,.2)",t:"#F97316"},
  {bg:"rgba(236,72,153,.2)",t:"#EC4899"},{bg:"rgba(20,184,166,.2)",t:"#14B8A6"},
];
const getInitials = n => (n||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
const getAVC     = n => AVC[(n||"A").charCodeAt(0) % AVC.length];
const fmt        = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const fmtDate    = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})+" · "+d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
};

const buildSys = (p, catLabel) =>
`You are ${p.name}, ${p.spec}. You just received a cold call from a sales rep.
Context: ${p.ctx}
Rules:
- Keep every response to 1-3 sentences max. You are on the phone, not writing an email.
- Sound like a real professional on a call — brief, natural, sometimes blunt.
- After 6-8 exchanges: strong pitch → show buying interest ("send me something" / "let us find 20 minutes"); weak or generic → professionally end the call.
- Never break character.`;

const buildCustomSys = (form, productLabel) => {
  const traitStr = form.traits?.length ? form.traits.join(", ") : "direct and professional";
  return `You are ${form.name}, ${form.title}${form.company ? ` at ${form.company}` : ""}. You just received a cold call about ${productLabel||"a product or service"}.
Your personality traits: ${traitStr}
Your main concern or objection: ${form.objection||"unclear ROI and switching costs"}
What could get you interested: ${form.interest||"a specific, credible value proposition tailored to your role"}
${form.context ? `Additional context: ${form.context}` : ""}
Rules:
- Keep every response to 1-3 sentences max. You are on the phone.
- Sound like a real professional — brief, natural, sometimes blunt or skeptical.
- After 6-8 exchanges: strong specific pitch → show interest; weak or generic → end professionally.
- Never break character.`;
};

// ─── Storage (localStorage) ───────────────────────────────────────────────────
const lsSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };
const lsGet = (key) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } };
const lsDel = (key) => { try { localStorage.removeItem(key); } catch {} };
const lsList = (prefix) => { try { return Object.keys(localStorage).filter(k => k.startsWith(prefix)); } catch { return []; } };

const saveCall = (data) => lsSet(`call:${data.id}`, data);
const loadHistory = () => {
  const keys = [...new Set(lsList("call:"))];
  const items = keys.map(k => lsGet(k)).filter(Boolean);
  const byId = new Set(), bySlot = new Set();
  return items.sort((a,b) => b.id - a.id).filter(item => {
    if(byId.has(item.id)) return false;
    byId.add(item.id);
    const slot = `${item.prospectName}|${Math.floor((item.id||0)/60000)}`;
    if(bySlot.has(slot)) return false;
    bySlot.add(slot);
    return true;
  });
};
const saveCustomCat = (data) => lsSet(`ccat:${data.id}`, data);
const loadCustomCats = () => {
  const keys = [...new Set(lsList("ccat:"))];
  const items = keys.map(k => lsGet(k)).filter(Boolean);
  const seen = new Set();
  return items.sort((a,b) => a.id - b.id).filter(item => { if(seen.has(item.id)) return false; seen.add(item.id); return true; });
};
const deleteCustomCatFromStorage = (catId) => {
  lsDel(`ccat:${catId}`);
  lsList(`cprospect:${catId}:`).forEach(k => lsDel(k));
};
const saveCustomProspect = (catId, data) => lsSet(`cprospect:${catId}:${data.id}`, data);
const loadCustomProspects = (catId) => {
  const keys = [...new Set(lsList(`cprospect:${catId}:`))];
  const items = keys.map(k => lsGet(k)).filter(Boolean);
  const seen = new Set();
  return items.sort((a,b) => a.id - b.id).filter(item => { if(seen.has(item.id)) return false; seen.add(item.id); return true; });
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const css = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@keyframes waveBar{from{transform:scaleY(.2)}to{transform:scaleY(1)}}
@keyframes blink{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.msg{animation:fadeUp .28s ease forwards}
.btn{display:flex;align-items:center;justify-content:center;gap:6px;border:none;font-family:inherit;cursor:pointer;transition:all .18s ease}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
.btn:not(:disabled):active{transform:scale(.97)}
.g{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:rgba(240,240,245,.8);border-radius:12px}
.g:not(:disabled):hover{background:rgba(255,255,255,.12)}
.p{background:rgba(129,140,248,.16);border:1px solid rgba(129,140,248,.35);color:#818CF8;border-radius:12px;font-weight:600}
.p:not(:disabled):hover{background:rgba(129,140,248,.26);border-color:rgba(129,140,248,.55)}
.d{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.22);color:#FCA5A5;border-radius:12px}
.d:not(:disabled):hover{background:rgba(239,68,68,.2)}
.mon{background:rgba(129,140,248,.2)!important;border-color:rgba(129,140,248,.5)!important;color:#818CF8!important}
.glass{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.1);border-radius:16px}
.cat-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:18px 20px;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;justify-content:space-between}
.cat-card:hover{background:rgba(255,255,255,.08);border-color:rgba(129,140,248,.3);transform:translateY(-2px)}
.cat-custom-card{background:rgba(129,140,248,.06);border:1px solid rgba(129,140,248,.2);border-radius:14px;padding:18px 20px;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;justify-content:space-between}
.cat-custom-card:hover{background:rgba(129,140,248,.11);border-color:rgba(129,140,248,.38);transform:translateY(-2px)}
.cat-add{background:rgba(129,140,248,.07);border:1px dashed rgba(129,140,248,.3);border-radius:14px;padding:18px 20px;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;justify-content:space-between}
.cat-add:hover{background:rgba(129,140,248,.12);border-color:rgba(129,140,248,.5)}
.p-row{display:flex;align-items:center;gap:14px;padding:14px 16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:12px;cursor:pointer;transition:all .18s ease}
.p-row:hover{background:rgba(255,255,255,.08);border-color:rgba(129,140,248,.3)}
.p-custom-btn{display:flex;align-items:center;gap:14px;padding:16px 18px;background:rgba(129,140,248,.07);border:1px dashed rgba(129,140,248,.3);border-radius:12px;cursor:pointer;transition:all .18s ease}
.p-custom-btn:hover{background:rgba(129,140,248,.12);border-color:rgba(129,140,248,.5)}
.h-row{display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);border-radius:12px;cursor:pointer;transition:background .18s ease}
.h-row:hover{background:rgba(255,255,255,.065)}
.txin{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:12px;color:#F0F0F5;font-family:inherit;font-size:15px;padding:12px 16px;outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
.txin:focus{border-color:rgba(129,140,248,.5);box-shadow:0 0 0 3px rgba(129,140,248,.1)}
.txin::placeholder{color:rgba(240,240,245,.28)}
.txin:disabled{opacity:.5}
.txarea{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:12px;color:#F0F0F5;font-family:inherit;font-size:14px;padding:12px 16px;outline:none;transition:border-color .2s,box-shadow .2s;width:100%;resize:vertical;min-height:80px;line-height:1.6}
.txarea:focus{border-color:rgba(129,140,248,.5);box-shadow:0 0 0 3px rgba(129,140,248,.1)}
.txarea::placeholder{color:rgba(240,240,245,.28)}
.trait-pill{padding:6px 12px;border-radius:20px;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s ease;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:rgba(240,240,245,.6)}
.trait-pill:hover{background:rgba(255,255,255,.1)}
.trait-on{background:rgba(129,140,248,.18)!important;border-color:rgba(129,140,248,.45)!important;color:#818CF8!important}
.bt{background:rgba(255,255,255,.08);border-radius:3px;height:5px;overflow:hidden}
.bf{height:100%;border-radius:3px;background:linear-gradient(90deg,#818CF8,#A78BFA);transition:width 1s cubic-bezier(.4,0,.2,1)}
.sc{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:14px}
.fl{display:flex;flex-direction:column;gap:6px}
.lbl{font-size:12px;color:rgba(240,240,245,.45);letter-spacing:.02em}
.del-dot{position:absolute;top:-8px;right:-8px;width:22px;height:22px;border-radius:50%;background:#FF3B30;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;border:2.5px solid #050508;transition:transform .15s ease,box-shadow .15s ease}
.del-dot:hover{transform:scale(1.18);box-shadow:0 0 0 4px rgba(255,59,48,.2)}
.del-minus{color:#fff;font-size:15px;font-weight:800;line-height:1;opacity:0;transition:opacity .12s ease;margin-top:-1px;user-select:none}
.del-dot:hover .del-minus{opacity:1}
.sug-box{background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.2);border-radius:10px;padding:10px 14px;margin-top:6px}
.live-tip{background:rgba(129,140,248,.08);border:1px solid rgba(129,140,248,.2);border-radius:8px;padding:7px 11px;margin-top:5px;font-size:12px;color:rgba(200,205,255,.75);line-height:1.5}
.call-wrap{height:100vh;height:-webkit-fill-available;display:flex;flex-direction:column}
@media(max-width:500px){
  .sc-btns{flex-wrap:wrap!important}
  .sc-btns>.btn{flex:1 1 calc(50% - 5px)!important;min-width:0!important;font-size:13px!important}
  .detail-score{grid-template-columns:1fr 1fr!important}
  .cp-2col{grid-template-columns:1fr!important}
  .cat-card,.cat-custom-card,.cat-add{padding:14px 16px!important}
  .h-row{flex-wrap:wrap;gap:8px!important}
  .h-row>div:last-child{width:100%;flex-direction:row!important;justify-content:space-between!important;align-items:center!important}
}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:3px}
`;

const FONT = "-apple-system,BlinkMacSystemFont,'SF Pro Display','Inter',sans-serif";
const BG   = "radial-gradient(ellipse 80% 60% at 20% 10%,rgba(129,140,248,.09) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 80% 90%,rgba(167,139,250,.07) 0%,transparent 60%),#050508";
const CBG  = "radial-gradient(ellipse 70% 40% at 50% 0%,rgba(129,140,248,.12) 0%,transparent 60%),#050508";
const STC  = {"On call":"#22C55E","Connecting...":"#F59E0B","Listening...":"#818CF8","Thinking...":"#F59E0B","Speaking...":"#C084FC","Scoring...":"#F59E0B"};
const DC   = {Easy:{c:"#22C55E",r:"34,197,94"},Medium:{c:"#F59E0B",r:"245,158,11"},Hard:{c:"#EF4444",r:"239,68,68"}};
const VCS  = {"Strong call":{c:"#22C55E",r:"34,197,94"},"Good call":{c:"#818CF8",r:"129,140,248"},"Needs work":{c:"#F59E0B",r:"245,158,11"},"Rough call":{c:"#EF4444",r:"239,68,68"}};

// ─── Sub-components ──────────────────────────────────────────────────────────
const WAVE = [.3,.55,.75,.95,.65,1,.8,.5,.9,.4,.85,1,.7,.9,.5,.8,1,.6,.4,.8,.7,.5,.3,.2];
function Waveform({active}) {
  return (
    <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:"4px",height:"52px"}}>
      {WAVE.map((h,i)=>(
        <div key={i} style={{width:"3px",height:active?`${Math.max(4,h*44)}px`:"3px",borderRadius:"2px",background:active?`rgba(129,140,248,${.45+h*.55})`:"rgba(255,255,255,.14)",transformOrigin:"bottom center",animation:active?`waveBar ${.4+(i%6)*.07}s ease-in-out ${(i*.04)%.45}s infinite alternate`:"none",transition:"height .45s cubic-bezier(.4,0,.2,1),background .45s ease"}}/>
      ))}
    </div>
  );
}
function Av({name,size=44}) {
  const {bg,t}=getAVC(name||"A");
  return (
    <div style={{width:size,height:size,borderRadius:"50%",background:bg,border:`1px solid ${t}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.3,fontWeight:"700",color:t,letterSpacing:"-.5px",flexShrink:0}}>
      {getInitials(name||"?")}
    </div>
  );
}
function DBadge({diff}) {
  const d=DC[diff]||DC.Medium;
  return <span style={{background:`rgba(${d.r},.1)`,border:`1px solid rgba(${d.r},.25)`,color:d.c,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:"600"}}>{diff}</span>;
}
function VBadge({verdict}) {
  const v=VCS[verdict]||VCS["Good call"];
  return <span style={{display:"inline-block",background:`rgba(${v.r},.1)`,border:`1px solid rgba(${v.r},.25)`,color:v.c,borderRadius:"20px",padding:"3px 10px",fontSize:"12px",fontWeight:"600"}}>{verdict}</span>;
}
function StatusPill({status}) {
  const c=STC[status]||"#6B7280";
  return (
    <div style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"13px",color:"rgba(240,240,245,.55)"}}>
      <span style={{width:"6px",height:"6px",borderRadius:"50%",background:c,display:"inline-block",animation:status!=="On call"?"blink 1.1s ease-in-out infinite":"none"}}/>
      {status}
    </div>
  );
}
function ScoreBar({score}) {
  return <div className="bt"><div className="bf" style={{width:`${((score||0)/10)*100}%`}}/></div>;
}

const BLANK_CP = {name:"",title:"",company:"",difficulty:"Medium",gender:"neutral",traits:[],objection:"",interest:"",context:""};
const BASE = {minHeight:"100vh",background:BG,color:"#F0F0F5",fontFamily:FONT,padding:"clamp(16px,4vw,36px) clamp(12px,4vw,28px)",display:"flex",flexDirection:"column",alignItems:"center"};

function W({children,maxW="680px"}) {
  return (
    <div style={{...BASE}}>
      <style>{css}</style>
      <div style={{width:"100%",maxWidth:maxW}}>{children}</div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,         setScreen]         = useState("home");
  const [cat,            setCat]            = useState(null);
  const [prospect,       setProspect]       = useState(null);
  const [messages,       setMessages]       = useState([]);
  const [aiSpeak,        setAiSpeak]        = useState(false);
  const [listen,         setListen]         = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [input,          setInput]          = useState("");
  const [status,         setStatus]         = useState("Ready");
  const [score,          setScore]          = useState(null);
  const [dur,            setDur]            = useState(0);
  const [voiceOk,        setVoiceOk]        = useState(false);
  const [history,        setHistory]        = useState(null);
  const [insight,        setInsight]        = useState("");
  const [insLoad,        setInsLoad]        = useState(false);
  const [ccForm,         setCcForm]         = useState({product:"",target:""});
  const [cpForm,         setCpForm]         = useState(BLANK_CP);
  const [customCats,     setCustomCats]     = useState([]);
  const [savedProspects, setSavedProspects] = useState([]);
  const [detailCall,     setDetailCall]     = useState(null);
  const [suggestions,    setSuggestions]    = useState(null);
  const [sugLoading,     setSugLoading]     = useState(false);
  const [liveTips,       setLiveTips]       = useState({}); // keyed by message index
  const [resetConfirm,   setResetConfirm]   = useState(false);

  const recRef        = useRef(null);
  const txRef         = useRef(null);
  const tmRef         = useRef(null);
  const t0Ref         = useRef(null);
  const callEndingRef = useRef(false);
  const keepAliveRef  = useRef(null); // iOS speech keep-alive interval

  useEffect(()=>{
    setVoiceOk(!!(window.SpeechRecognition||window.webkitSpeechRecognition));
    setCustomCats(loadCustomCats());
    const onVoicesChanged = () => { setVoiceOk(v=>v); };
    window.speechSynthesis?.addEventListener?.("voiceschanged", onVoicesChanged);
    return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", onVoicesChanged);
  },[]);
  useEffect(()=>{
    if(screen==="call"){t0Ref.current=Date.now();tmRef.current=setInterval(()=>setDur(Math.floor((Date.now()-t0Ref.current)/1000)),1000);}
    else clearInterval(tmRef.current);
    return()=>clearInterval(tmRef.current);
  },[screen]);
  useEffect(()=>{ if(txRef.current) txRef.current.scrollTop=txRef.current.scrollHeight; },[messages]);
  useEffect(()=>{
    if(screen==="history"&&history===null){setHistory(loadHistory());setInsight("");setResetConfirm(false);}
  },[screen]);
  useEffect(()=>{
    if(screen==="prospects"&&cat?.id) setSavedProspects(loadCustomProspects(cat.id));
  },[screen,cat]);

  // Must be called synchronously inside a user-gesture handler to unlock mobile audio
  const unlockSpeech = () => {
    if (!window.speechSynthesis) return;
    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      const silent = new SpeechSynthesisUtterance(" ");
      silent.volume = 0; silent.rate = 10;
      window.speechSynthesis.speak(silent);
    } catch {}
  };


  const speak = (text, gender, onEnd) => {
    if(!window.speechSynthesis){onEnd?.();return;}
    clearInterval(keepAliveRef.current);
    window.speechSynthesis.cancel();

    const doSpeak = (voices) => {
      const u = new SpeechSynthesisUtterance(text);
      u.rate  = .93;
      u.pitch = gender==="male" ? .72 : gender==="female" ? 1.1 : .96;

      // Pick voice; fall back gracefully if list is empty
      if(voices.length){
        const en = voices.filter(v=>v.lang.startsWith("en"));
        let picked = null;
        if(gender==="male")   picked = en.find(v=>MALE_VX.some(k=>v.name.toLowerCase().includes(k)));
        if(gender==="female") picked = en.find(v=>FEMALE_VX.some(k=>v.name.toLowerCase().includes(k)));
        if(!picked) picked = en.find(v=>v.name.toLowerCase().includes("google"))||en.find(v=>v.lang==="en-US")||en[0];
        if(picked) u.voice = picked;
      }

      u.onstart = () => {
        setAiSpeak(true); setStatus("Speaking...");
        // iOS pauses synthesis silently — poke resume() every 250ms
        keepAliveRef.current = setInterval(()=>{
          if(window.speechSynthesis.paused) window.speechSynthesis.resume();
        }, 250);
      };
      u.onend = () => {
        clearInterval(keepAliveRef.current);
        setAiSpeak(false); setStatus("On call"); onEnd?.();
      };
      u.onerror = () => {
        clearInterval(keepAliveRef.current);
        setAiSpeak(false); setStatus("On call"); onEnd?.();
      };

      // Always resume() before speak() — required on iOS after cancel() or page focus loss
      window.speechSynthesis.resume();
      // Small delay avoids Android Chrome race condition after cancel()
      setTimeout(()=>{ try{ window.speechSynthesis.speak(u); }catch{ setAiSpeak(false); onEnd?.(); } }, 50);
    };

    const voices = window.speechSynthesis.getVoices();
    if(voices.length){
      doSpeak(voices);
    } else {
      // Voices not yet loaded (common on mobile first load) — wait for event
      const handler = () => doSpeak(window.speechSynthesis.getVoices());
      window.speechSynthesis.addEventListener("voiceschanged", handler, {once:true});
      // Safety: if voiceschanged never fires, speak with system default after 800ms
      setTimeout(()=>{ window.speechSynthesis.removeEventListener("voiceschanged",handler); doSpeak([]); }, 800);
    }
  };

  const callClaude = async (msgs, sys, max=1000) => {
    const r = await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:max,system:sys,messages:msgs})});
    const d = await r.json();
    return d.content?.[0]?.text||"";
  };

  const startCall = async (p, catOverride) => {
    unlockSpeech(); // synchronous — must be before any await to unlock mobile audio
    const activeCat = catOverride||cat;
    callEndingRef.current = false; // reset guard for new call
    setLiveTips({});
    setProspect(p);setMessages([]);setScore(null);setDur(0);setInput("");
    setScreen("call");setLoading(true);setStatus("Connecting...");
    if(window.speechSynthesis){window.speechSynthesis.getVoices();await new Promise(r=>setTimeout(r,400));}
    const sys = p.systemPrompt || buildSys(p, activeCat?.label);
    try {
      const text = await callClaude([{role:"user",content:"[Phone just connected. Answer naturally — say hello or yeah — one sentence only.]"}], sys);
      setMessages([{speaker:"prospect",content:text}]);setStatus("On call");speak(text, p.gender||"neutral");
    } catch {setStatus("Connection error");}
    setLoading(false);
  };

  const send = async (text) => {
    if(!text.trim()||loading||aiSpeak)return;
    unlockSpeech(); // synchronous — must be before any await to unlock mobile audio
    setInput("");setListen(false);recRef.current?.stop();
    const updated = [...messages,{speaker:"trainee",content:text}];
    setMessages(updated);setLoading(true);setStatus("Thinking...");
    const sys = prospect.systemPrompt || buildSys(prospect, cat?.label);
    const api = [];
    if(updated[0]?.speaker==="prospect") api.push({role:"user",content:"[call connected, you answered]"});
    updated.forEach(m=>api.push({role:m.speaker==="prospect"?"assistant":"user",content:m.content}));
    try {
      const reply = await callClaude(api, sys);
      const nextMessages = [...updated, {speaker:"prospect",content:reply}];
      setMessages(nextMessages);setStatus("On call");speak(reply, prospect?.gender||"neutral");
      // Fetch live coaching tip — fire-and-forget, non-blocking
      const tipIdx = nextMessages.length - 1;
      const tipSys = "Sales coach. One sentence, max 18 words. Tell the rep exactly what to do or say NEXT based on the prospect's last reply. Be prescriptive, not descriptive. Name a technique if it fits (e.g. 'Mirror their concern', 'Use a tie-down', 'Drop the price anchor'). No openers like 'Great' or 'Try to'.";
      // Only last 2 turns needed — prospect reply + rep's preceding line
      const tipCtx = nextMessages.slice(-2).map(m=>`${m.speaker==="prospect"?prospect.name:"Rep"}: ${m.content}`).join("\n");
      callClaude([{role:"user",content:tipCtx}], tipSys, 60)
        .then(tip=>{ if(tip) setLiveTips(prev=>({...prev,[tipIdx]:tip.trim()})); })
        .catch(()=>{});
    } catch {setStatus("Error — try again");}
    setLoading(false);
  };

  const endCall = async () => {
    if(callEndingRef.current) return; // hard guard — cannot run twice
    callEndingRef.current = true;
    window.speechSynthesis?.cancel();recRef.current?.stop();
    clearInterval(tmRef.current);setListen(false);setLoading(true);setStatus("Scoring...");
    const finalDur = Math.floor((Date.now()-t0Ref.current)/1000);
    const transcript = messages.map(m=>`${m.speaker==="prospect"?prospect.name:"Sales Rep"}: ${m.content}`).join("\n");
    const sys = `You are an expert sales coach evaluating a cold call roleplay. The sales rep was pitching to ${prospect.name} (${prospect.spec||prospect.title}).
Return ONLY valid JSON, no markdown:
{"overall":<1-10>,"opener":{"score":<1-10>,"feedback":"<one sentence>"},"objectionHandling":{"score":<1-10>,"feedback":"<one sentence>"},"valueProposition":{"score":<1-10>,"feedback":"<one sentence>"},"ctaStrength":{"score":<1-10>,"feedback":"<one sentence>"},"coachingTip":"<one specific actionable improvement>","verdict":"<Strong call|Good call|Needs work|Rough call>"}`;
    try {
      const raw = await callClaude([{role:"user",content:`Transcript:\n\n${transcript}`}], sys);
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      const callData = {id:Date.now(),date:new Date().toISOString(),catLabel:cat?.label||"Custom",prospectName:prospect.name,prospectSpec:prospect.spec||prospect.title,prospectGender:prospect.gender||"neutral",diff:prospect.diff||prospect.difficulty,...parsed,dur:finalDur,exchanges:Math.ceil(messages.length/2),messages:messages.map(m=>({speaker:m.speaker,content:m.content}))};
      saveCall(callData);setScore({...callData});
    } catch {
      setScore({overall:5,verdict:"Call complete",coachingTip:"Keep practicing!",dur:finalDur,exchanges:Math.ceil(messages.length/2)});
    }
    setScreen("scorecard");setLoading(false);
  };

  const toggleMic = () => {
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR)return;
    if(listen){recRef.current?.stop();setListen(false);setStatus("On call");return;}
    const rec = new SR();recRef.current=rec;
    rec.continuous=false;rec.interimResults=true;rec.lang="en-US";
    rec.onresult=e=>{const t=Array.from(e.results).map(r=>r[0].transcript).join("");setInput(t);if(e.results[e.results.length-1].isFinal){rec.stop();setListen(false);send(t);}};
    rec.onend=()=>setListen(false);
    rec.onerror=()=>{setListen(false);setStatus("On call");};
    try{rec.start();setListen(true);setStatus("Listening...");}catch{}
  };

  const generateInsights = async () => {
    if(!history?.length)return;
    setInsLoad(true);
    const avg=arr=>arr.length?(arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1):"n/a";
    const s=history.map(c=>c.overall).filter(Boolean),o=history.map(c=>c.opener?.score).filter(Boolean),ob=history.map(c=>c.objectionHandling?.score).filter(Boolean),vp=history.map(c=>c.valueProposition?.score).filter(Boolean),ct=history.map(c=>c.ctaStrength?.score).filter(Boolean);
    const catMap={};history.forEach(c=>{catMap[c.catLabel]=(catMap[c.catLabel]||0)+1;});
    const topCat=Object.entries(catMap).sort((a,b)=>b[1]-a[1])[0]?.[0]||"various";
    const prompt=`Sales trainee (${history.length} total calls): avg ${avg(s)}/10. Skills: Opener ${avg(o)}/10, Objections ${avg(ob)}/10, Value Prop ${avg(vp)}/10, CTA ${avg(ct)}/10. Most practiced: ${topCat}. Write 2-3 sentences of direct, specific coaching advice. No filler.`;
    try{const raw=await callClaude([{role:"user",content:prompt}],"You are a direct, experienced sales coach.",400);setInsight(raw);}
    catch{setInsight("Unable to generate insights right now.");}
    setInsLoad(false);
  };

  const generateSuggestions = async () => {
    if(!detailCall?.messages?.length)return;
    setSugLoading(true);
    const transcript = detailCall.messages.map(m=>`${m.speaker==="prospect"?detailCall.prospectName:"Sales Rep"}: ${m.content}`).join("\n");
    const traineeLines = detailCall.messages.filter(m=>m.speaker==="trainee").map((m,i)=>`Turn ${i+1}: "${m.content}"`).join("\n");
    const sys = `You are an elite B2B sales coach reviewing a cold call. The sales rep was pitching to ${detailCall.prospectName} (${detailCall.prospectSpec}).
For EACH sales rep message, provide what a world-class closer would have said instead.
Return ONLY valid JSON, no markdown:
{"suggestions":[{"original":"<exact rep text>","improved":"<what best closer would say — 1-2 sentences max>","technique":"<2-3 word technique label e.g. Pattern Interrupt, Outcome Hook, Permission Open, Objection Flip>"}]}
One object per sales rep turn, in order.`;
    const prompt = `Full transcript:\n${transcript}\n\nSales rep turns only:\n${traineeLines}`;
    try{
      const raw = await callClaude([{role:"user",content:prompt}], sys, 1000);
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setSuggestions(parsed.suggestions||[]);
    }catch{setSuggestions([]);}
    setSugLoading(false);
  };

  const handleSubmitCc = () => {
    if(!ccForm.product.trim())return;
    const id=Date.now();
    const newCat={id,label:ccForm.product.trim(),target:ccForm.target,isCustom:true,createdAt:new Date().toISOString()};
    saveCustomCat(newCat);setCustomCats(prev=>[...prev,newCat]);
    setCat(newCat);setCcForm({product:"",target:""});setSavedProspects([]);setScreen("prospects");
  };

  const handleSubmitCp = () => {
    if(!cpForm.name.trim()||!cpForm.title.trim())return;
    const id=Date.now();
    const p={id,catId:cat?.id,name:cpForm.name.trim(),spec:cpForm.title.trim()+(cpForm.company?`, ${cpForm.company.trim()}`:""),title:cpForm.title.trim(),company:cpForm.company.trim(),diff:cpForm.difficulty,gender:cpForm.gender,traits:[...cpForm.traits],objection:cpForm.objection,interest:cpForm.interest,context:cpForm.context,systemPrompt:buildCustomSys(cpForm,cat?.label),isCustom:true};
    if(cat?.id) saveCustomProspect(cat.id,p);
    setCpForm(BLANK_CP);startCall(p);
  };

  const deleteCustomCat = (catId, e) => {
    e?.stopPropagation();
    deleteCustomCatFromStorage(catId);
    setCustomCats(prev=>prev.filter(c=>c.id!==catId));
  };

  const goHome = () => {
    window.speechSynthesis?.cancel();recRef.current?.stop();clearInterval(tmRef.current);setScreen("home");
  };

  const resetHistory = () => {
    lsList("call:").forEach(k => lsDel(k));
    setHistory([]);
    setInsight("");
    setResetConfirm(false);
  };

  const openDetail = (call) => {
    setDetailCall(call);setSuggestions(null);setScreen("detail");
  };

  // ── HOME ──────────────────────────────────────────────────────────────────
  if(screen==="home") return (
    <W>
      {/* Nav row */}
      <div style={{display:"flex",justifyContent:"flex-end",width:"100%",marginBottom:"24px"}}>
        <button className="btn g" onClick={()=>{setHistory(null);setScreen("history");}} style={{padding:"9px 16px",fontSize:"13px"}}>Call History</button>
      </div>
      {/* Centered hero */}
      <div style={{textAlign:"center",marginBottom:"44px",width:"100%"}}>
        <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.35)",textTransform:"uppercase",marginBottom:"14px"}}>Sales Training</div>
        <h1 style={{fontSize:"clamp(28px,6vw,52px)",fontWeight:"800",letterSpacing:"-.04em",lineHeight:1.05,margin:0}}>
          Train like a pro.<br/>
          <span style={{color:"#818CF8"}}>Close like a closer.</span>
        </h1>
        <p style={{color:"rgba(240,240,245,.38)",fontSize:"clamp(13px,2vw,15px)",marginTop:"14px",lineHeight:1.65,maxWidth:"420px",margin:"14px auto 0"}}>
          Practice any cold call against AI prospects. Live coaching, objection tracking, and full analysis after every session.
        </p>
      </div>
      <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.3)",textTransform:"uppercase",marginBottom:"14px",width:"100%"}}>What are you selling?</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"10px",marginBottom:"20px"}}>
        {CATEGORIES.map(c=>(
          <div key={c.id} className="cat-card" onClick={()=>{setCat(c);setSavedProspects([]);setScreen("prospects");}}>
            <span style={{fontSize:"14px",fontWeight:"500"}}>{c.label}</span>
            <span style={{color:"rgba(240,240,245,.3)",fontSize:"16px"}}>›</span>
          </div>
        ))}
      </div>
      {customCats.length>0&&(
        <>
          <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.3)",textTransform:"uppercase",marginBottom:"14px"}}>Your Custom Categories</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"10px",marginBottom:"20px"}}>
            {customCats.map(c=>(
              <div key={c.id} style={{position:"relative"}}>
                <div className="cat-custom-card" onClick={()=>{setCat(c);setSavedProspects([]);setScreen("prospects");}}>
                  <div>
                    <div style={{fontSize:"14px",fontWeight:"500"}}>{c.label}</div>
                    {c.target&&<div style={{fontSize:"11px",color:"rgba(240,240,245,.35)",marginTop:"3px"}}>{c.target}</div>}
                  </div>
                  <span style={{color:"rgba(129,140,248,.5)",fontSize:"16px"}}>›</span>
                </div>
                <div className="del-dot" onClick={e=>deleteCustomCat(c.id,e)}><span className="del-minus">−</span></div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="cat-add" onClick={()=>setScreen("custom-category")}>
        <div>
          <div style={{fontSize:"14px",fontWeight:"600",color:"#818CF8"}}>Define your own category</div>
          <div style={{fontSize:"12px",color:"rgba(129,140,248,.6)",marginTop:"2px"}}>Selling something not listed above? Build a custom scenario.</div>
        </div>
        <span style={{color:"#818CF8",fontSize:"16px"}}>›</span>
      </div>
    </W>
  );

  // ── CUSTOM CATEGORY ───────────────────────────────────────────────────────
  if(screen==="custom-category") return (
    <W maxW="520px">
      <button className="btn g" onClick={()=>setScreen("home")} style={{padding:"8px 14px",fontSize:"13px",marginBottom:"28px"}}>← Back</button>
      <div style={{marginBottom:"28px"}}>
        <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.35)",textTransform:"uppercase",marginBottom:"8px"}}>Custom Category</div>
        <h2 style={{fontSize:"22px",fontWeight:"700",letterSpacing:"-.02em"}}>Define your scenario</h2>
        <p style={{color:"rgba(240,240,245,.4)",fontSize:"14px",marginTop:"6px"}}>Tell us what you are selling so we can tailor the roleplay.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
        <div className="fl">
          <label className="lbl">What are you selling? *</label>
          <input className="txin" value={ccForm.product} onChange={e=>setCcForm(f=>({...f,product:e.target.value}))} placeholder="e.g. AI-powered HR software, B2B SaaS tool, consulting services..." onKeyDown={e=>e.key==="Enter"&&handleSubmitCc()}/>
        </div>
        <div className="fl">
          <label className="lbl">Who is your ideal customer? (optional)</label>
          <input className="txin" value={ccForm.target} onChange={e=>setCcForm(f=>({...f,target:e.target.value}))} placeholder="e.g. HR Directors at mid-size companies, solo agency owners..."/>
        </div>
        <button className="btn p" onClick={handleSubmitCc} disabled={!ccForm.product.trim()} style={{padding:"14px",fontSize:"15px",width:"100%",marginTop:"4px"}}>Continue to Prospects</button>
      </div>
    </W>
  );

  // ── PROSPECTS ─────────────────────────────────────────────────────────────
  if(screen==="prospects") {
    const stdList = PROSPECTS[cat?.id]||[];
    return (
      <W maxW="560px">
        <button className="btn g" onClick={()=>setScreen(cat?.isCustom?"custom-category":"home")} style={{padding:"8px 14px",fontSize:"13px",marginBottom:"28px"}}>← Back</button>
        <div style={{marginBottom:"24px"}}>
          <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.35)",textTransform:"uppercase",marginBottom:"6px"}}>{cat?.label}</div>
          <h2 style={{fontSize:"22px",fontWeight:"700",letterSpacing:"-.02em"}}>Choose a prospect</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {stdList.map((p,i)=>(
            <div key={i} className="p-row" onClick={()=>startCall(p)}>
              <Av name={p.name} size={44}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:"14px",fontWeight:"600",marginBottom:"2px"}}>{p.name}</div>
                <div style={{fontSize:"12px",color:"rgba(240,240,245,.4)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.spec}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}><DBadge diff={p.diff}/><span style={{color:"rgba(240,240,245,.3)",fontSize:"16px"}}>›</span></div>
            </div>
          ))}
          {savedProspects.length>0&&(
            <>
              {stdList.length>0&&<div style={{fontSize:"11px",letterSpacing:".06em",color:"rgba(240,240,245,.25)",textTransform:"uppercase",margin:"6px 0 4px",textAlign:"center"}}>Your saved prospects</div>}
              {savedProspects.map((p,i)=>(
                <div key={i} className="p-row" onClick={()=>startCall(p)} style={{borderColor:"rgba(129,140,248,.2)"}}>
                  <Av name={p.name} size={44}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"14px",fontWeight:"600",marginBottom:"2px"}}>{p.name}</div>
                    <div style={{fontSize:"12px",color:"rgba(240,240,245,.4)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.spec}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}><DBadge diff={p.diff}/><span style={{color:"rgba(240,240,245,.3)",fontSize:"16px"}}>›</span></div>
                </div>
              ))}
            </>
          )}
          <div style={{marginTop:(stdList.length||savedProspects.length)?"8px":"0"}}>
            {(stdList.length||savedProspects.length)>0&&<div style={{fontSize:"11px",letterSpacing:".06em",color:"rgba(240,240,245,.25)",textTransform:"uppercase",marginBottom:"10px",textAlign:"center"}}>or</div>}
            <div className="p-custom-btn" onClick={()=>setScreen("custom-prospect")}>
              <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(129,140,248,.12)",border:"1px dashed rgba(129,140,248,.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",color:"#818CF8",fontWeight:"700",flexShrink:0}}>+</div>
              <div>
                <div style={{fontSize:"14px",fontWeight:"600",color:"#818CF8"}}>Build a custom prospect</div>
                <div style={{fontSize:"12px",color:"rgba(129,140,248,.6)",marginTop:"2px"}}>Define name, role, gender, personality, objections, and more</div>
              </div>
            </div>
          </div>
        </div>
      </W>
    );
  }

  // ── CUSTOM PROSPECT FORM ──────────────────────────────────────────────────
  if(screen==="custom-prospect") {
    const valid = cpForm.name.trim()&&cpForm.title.trim();
    const toggleTrait = t => setCpForm(f=>({...f,traits:f.traits.includes(t)?f.traits.filter(x=>x!==t):[...f.traits,t]}));
    return (
      <W maxW="540px">
        <button className="btn g" onClick={()=>setScreen("prospects")} style={{padding:"8px 14px",fontSize:"13px",marginBottom:"28px"}}>← Back</button>
        <div style={{marginBottom:"24px"}}>
          <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.35)",textTransform:"uppercase",marginBottom:"8px"}}>{cat?.label} · Custom Prospect</div>
          <h2 style={{fontSize:"22px",fontWeight:"700",letterSpacing:"-.02em"}}>Build your prospect</h2>
          <p style={{color:"rgba(240,240,245,.4)",fontSize:"14px",marginTop:"6px"}}>Customize every detail to match your real-world scenario.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <div>
            <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.3)",textTransform:"uppercase",marginBottom:"14px"}}>Basics</div>
            <div className="cp-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
              <div className="fl">
                <label className="lbl">Full Name *</label>
                <input className="txin" value={cpForm.name} onChange={e=>setCpForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Sarah Mitchell"/>
              </div>
              <div className="fl">
                <label className="lbl">Job Title / Role *</label>
                <input className="txin" value={cpForm.title} onChange={e=>setCpForm(f=>({...f,title:e.target.value}))} placeholder="e.g. VP of Sales"/>
              </div>
            </div>
            <div className="fl">
              <label className="lbl">Company / Context (optional)</label>
              <input className="txin" value={cpForm.company} onChange={e=>setCpForm(f=>({...f,company:e.target.value}))} placeholder="e.g. Series B SaaS startup, ~80 employees"/>
            </div>
          </div>
          <div>
            <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.3)",textTransform:"uppercase",marginBottom:"12px"}}>Difficulty</div>
            <div style={{display:"flex",gap:"8px"}}>
              {["Easy","Medium","Hard"].map(d=>(
                <button key={d} className={`btn ${cpForm.difficulty===d?"p":"g"}`} onClick={()=>setCpForm(f=>({...f,difficulty:d}))} style={{flex:1,padding:"11px",fontSize:"14px"}}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.3)",textTransform:"uppercase",marginBottom:"12px"}}>Prospect Gender <span style={{color:"rgba(240,240,245,.3)",fontWeight:"400",textTransform:"none",letterSpacing:0,fontSize:"10px"}}>(sets voice)</span></div>
            <div style={{display:"flex",gap:"8px"}}>
              {[["male","Male"],["female","Female"],["neutral","Neutral"]].map(([val,lbl])=>(
                <button key={val} className={`btn ${cpForm.gender===val?"p":"g"}`} onClick={()=>setCpForm(f=>({...f,gender:val}))} style={{flex:1,padding:"11px",fontSize:"14px"}}>{lbl}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.3)",textTransform:"uppercase",marginBottom:"12px"}}>Personality Traits</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
              {TRAITS.map(t=>(
                <span key={t} className={`trait-pill${cpForm.traits.includes(t)?" trait-on":""}`} onClick={()=>toggleTrait(t)}>{t}</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.3)",textTransform:"uppercase",marginBottom:"14px"}}>Behavior</div>
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              <div className="fl">
                <label className="lbl">Primary objection they raise</label>
                <input className="txin" value={cpForm.objection} onChange={e=>setCpForm(f=>({...f,objection:e.target.value}))} placeholder="e.g. We already have a vendor for this"/>
              </div>
              <div className="fl">
                <label className="lbl">What gets them interested</label>
                <input className="txin" value={cpForm.interest} onChange={e=>setCpForm(f=>({...f,interest:e.target.value}))} placeholder="e.g. Concrete ROI numbers, peer references, time savings"/>
              </div>
              <div className="fl">
                <label className="lbl">Additional context (optional)</label>
                <textarea className="txarea" value={cpForm.context} onChange={e=>setCpForm(f=>({...f,context:e.target.value}))} placeholder="Any other personality details, industry context, or specific behaviors..."/>
              </div>
            </div>
          </div>
          <button className="btn p" onClick={handleSubmitCp} disabled={!valid} style={{padding:"14px",fontSize:"15px",width:"100%"}}>Start Call</button>
        </div>
      </W>
    );
  }

  // ── CALL ──────────────────────────────────────────────────────────────────
  if(screen==="call") return (
    <>
      <style>{css}</style>
      <div className="call-wrap" style={{background:CBG,color:"#F0F0F5",fontFamily:FONT,maxWidth:"600px",margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 20px 16px",borderBottom:"1px solid rgba(255,255,255,.07)",flexShrink:0}}>
          <div>
            <div style={{fontWeight:"600",fontSize:"16px"}}>{prospect?.name}</div>
            <div style={{color:"rgba(240,240,245,.38)",fontSize:"12px",marginTop:"1px"}}>{prospect?.spec||prospect?.title}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <StatusPill status={status}/>
            <div style={{fontVariantNumeric:"tabular-nums",fontSize:"14px",color:"rgba(240,240,245,.4)",fontWeight:"500"}}>{fmt(dur)}</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 20px 16px",gap:"14px",flexShrink:0}}>
          <Av name={prospect?.name||"?"} size={64}/>
          <Waveform active={aiSpeak}/>
          {loading&&!aiSpeak&&<div style={{fontSize:"13px",color:"rgba(240,240,245,.3)",animation:"blink 1.2s ease-in-out infinite"}}>{status==="Connecting..."?"Dialing...":"..."}</div>}
        </div>
        <div ref={txRef} className="glass" style={{flex:1,margin:"0 14px",padding:"14px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"10px",minHeight:0}}>
          {messages.length===0&&<div style={{color:"rgba(240,240,245,.2)",fontSize:"13px",textAlign:"center",margin:"auto"}}>{loading?"Connecting...":"Say something to start"}</div>}
          {messages.map((m,i)=>{const isP=m.speaker==="prospect";return(
            <div key={i} className="msg">
              <div style={{display:"flex",flexDirection:isP?"row":"row-reverse",gap:"8px",alignItems:"flex-start"}}>
                <Av name={isP?(prospect?.name||"?"):"You"} size={28}/>
                <div style={{maxWidth:"78%",background:isP?"rgba(255,255,255,.07)":"rgba(129,140,248,.14)",border:`1px solid ${isP?"rgba(255,255,255,.1)":"rgba(129,140,248,.25)"}`,borderRadius:isP?"4px 14px 14px 14px":"14px 4px 14px 14px",padding:"9px 13px",fontSize:"14px",lineHeight:1.55,color:isP?"rgba(240,240,245,.9)":"#C7D2FE"}}>
                  {m.content}
                </div>
              </div>
              {isP&&liveTips[i]&&(
                <div style={{display:"flex",paddingLeft:"36px",marginTop:"5px"}}>
                  <div className="live-tip">
                    <span style={{color:"#818CF8",marginRight:"5px",fontSize:"10px",verticalAlign:"middle"}}>↗</span>
                    {liveTips[i]}
                  </div>
                </div>
              )}
            </div>
          );})}
        </div>
        <div style={{padding:"14px",borderTop:"1px solid rgba(255,255,255,.07)",flexShrink:0}}>
          <div style={{display:"flex",gap:"8px",marginBottom:"10px"}}>
            <input className="txin" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send(input)} placeholder={listen?"Listening...":aiSpeak?"Prospect is speaking...":"Type your reply..."} disabled={loading||aiSpeak||listen}/>
            <button className="btn p" onClick={()=>send(input)} disabled={loading||aiSpeak||listen||!input.trim()} style={{padding:"0 18px",fontSize:"14px",whiteSpace:"nowrap"}}>Send</button>
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            {voiceOk&&<button onClick={toggleMic} className={`btn g${listen?" mon":""}`} disabled={loading||aiSpeak} style={{flex:1,padding:"11px",fontSize:"13px"}}>{listen?"Stop Listening":"Speak"}</button>}
            <button onClick={endCall} className="btn d" disabled={loading} style={{flex:voiceOk?1:2,padding:"11px",fontSize:"13px"}}>End Call</button>
          </div>
          {!voiceOk&&<p style={{fontSize:"11px",color:"rgba(240,240,245,.25)",textAlign:"center",marginTop:"8px"}}>Voice input not available — type your replies</p>}
        </div>
      </div>
    </>
  );

  // ── SCORECARD ─────────────────────────────────────────────────────────────
  if(screen==="scorecard") {
    const v=VCS[score?.verdict]||VCS["Good call"];
    const scoreCats=[
      {label:"Opener",             s:score?.opener,            fb:score?.opener?.feedback},
      {label:"Objection Handling", s:score?.objectionHandling, fb:score?.objectionHandling?.feedback},
      {label:"Value Proposition",  s:score?.valueProposition,  fb:score?.valueProposition?.feedback},
      {label:"CTA & Close",        s:score?.ctaStrength,       fb:score?.ctaStrength?.feedback},
    ].filter(c=>c.s?.score!=null);
    return (
      <>
        <style>{css}</style>
        <div style={{minHeight:"100vh",background:`radial-gradient(ellipse 60% 40% at 50% 0%,rgba(${v.r},.1) 0%,transparent 55%),#050508`,color:"#F0F0F5",fontFamily:FONT,display:"flex",flexDirection:"column",alignItems:"center",padding:"36px 20px 48px"}}>
          <div style={{width:"100%",maxWidth:"500px"}}>
            <div style={{textAlign:"center",marginBottom:"28px"}}>
              <div style={{fontSize:"64px",fontWeight:"800",letterSpacing:"-.05em",lineHeight:1,color:v.c,marginBottom:"10px"}}>
                {score?.overall}<span style={{fontSize:"28px",color:"rgba(240,240,245,.25)",fontWeight:"600"}}>/10</span>
              </div>
              <VBadge verdict={score?.verdict}/>
              <div style={{color:"rgba(240,240,245,.35)",fontSize:"13px",marginTop:"10px"}}>{prospect?.name} · {score?.exchanges} exchanges · {fmt(score?.dur||0)}</div>
            </div>
            {scoreCats.length>0&&(
              <div className="glass" style={{padding:"20px",marginBottom:"14px"}}>
                <div style={{fontSize:"11px",letterSpacing:".07em",color:"rgba(240,240,245,.3)",textTransform:"uppercase",marginBottom:"18px"}}>Breakdown</div>
                <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
                  {scoreCats.map((c,i)=>(
                    <div key={i}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"7px"}}><span style={{fontSize:"14px"}}>{c.label}</span><span style={{fontVariantNumeric:"tabular-nums",fontSize:"14px",fontWeight:"700",color:"#818CF8"}}>{c.s.score}/10</span></div>
                      <ScoreBar score={c.s.score}/>
                      {c.fb&&<div style={{fontSize:"12px",color:"rgba(240,240,245,.38)",marginTop:"5px",lineHeight:1.5}}>{c.fb}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {score?.coachingTip&&(
              <div className="glass" style={{padding:"16px 20px",marginBottom:"20px",background:"rgba(129,140,248,.06)",borderColor:"rgba(129,140,248,.18)"}}>
                <div style={{fontSize:"11px",letterSpacing:".07em",color:"#818CF8",fontWeight:"600",textTransform:"uppercase",marginBottom:"8px"}}>Coaching Tip</div>
                <div style={{fontSize:"14px",color:"rgba(240,240,245,.75)",lineHeight:1.65}}>{score.coachingTip}</div>
              </div>
            )}
            <div className="sc-btns" style={{display:"flex",gap:"10px",marginBottom:"10px",flexWrap:"wrap"}}>
              <button className="btn g" onClick={goHome} style={{flex:"1 1 80px",padding:"12px",fontSize:"14px"}}>Home</button>
              <button className="btn g" onClick={()=>setScreen("home")} style={{flex:"1 1 80px",padding:"12px",fontSize:"14px"}}>Change Category</button>
              <button className="btn g" onClick={()=>setScreen("prospects")} style={{flex:"1 1 80px",padding:"12px",fontSize:"14px"}}>Change Prospect</button>
            </div>
            <button className="btn p" onClick={()=>startCall(prospect)} style={{width:"100%",padding:"14px",fontSize:"15px"}}>Try Again</button>
          </div>
        </div>
      </>
    );
  }

  // ── HISTORY ───────────────────────────────────────────────────────────────
  if(screen==="history") {
    const calls=history||[];
    const avg=arr=>arr.length?(arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1):"—";
    const s=calls.map(c=>c.overall).filter(Boolean),o=calls.map(c=>c.opener?.score).filter(Boolean),ob=calls.map(c=>c.objectionHandling?.score).filter(Boolean),vp=calls.map(c=>c.valueProposition?.score).filter(Boolean),ct=calls.map(c=>c.ctaStrength?.score).filter(Boolean);
    const thisWeek=calls.filter(c=>Date.now()-c.id<7*24*60*60*1000).length,best=s.length?Math.max(...s):"—";
    return (
      <W maxW="660px">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"32px",gap:"12px"}}>
          <div>
            <button className="btn g" onClick={()=>{setScreen("home");setResetConfirm(false);}} style={{padding:"8px 14px",fontSize:"13px",marginBottom:"12px"}}>← Back</button>
            <h2 style={{fontSize:"22px",fontWeight:"700",letterSpacing:"-.02em"}}>Call History</h2>
          </div>
          {calls.length>0&&(
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"8px",paddingTop:"4px"}}>
              {!resetConfirm ? (
                <button className="btn d" onClick={()=>setResetConfirm(true)} style={{padding:"8px 14px",fontSize:"13px",whiteSpace:"nowrap"}}>
                  Reset All
                </button>
              ) : (
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"6px"}}>
                  <div style={{fontSize:"11px",color:"rgba(240,240,245,.45)",textAlign:"right"}}>Delete all history?</div>
                  <div style={{display:"flex",gap:"8px"}}>
                    <button className="btn g" onClick={()=>setResetConfirm(false)} style={{padding:"7px 12px",fontSize:"12px"}}>Cancel</button>
                    <button className="btn d" onClick={resetHistory} style={{padding:"7px 14px",fontSize:"12px",fontWeight:"700"}}>Yes, reset</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {history===null?(<div style={{textAlign:"center",padding:"60px",color:"rgba(240,240,245,.3)"}}>Loading...</div>)
        :calls.length===0?(<div style={{textAlign:"center",padding:"60px"}}><div style={{fontSize:"16px",color:"rgba(240,240,245,.4)",marginBottom:"16px"}}>No calls yet.</div><button className="btn p" onClick={()=>setScreen("home")} style={{padding:"10px 24px",fontSize:"14px"}}>Start Training</button></div>)
        :(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"10px",marginBottom:"20px"}}>
              {[{label:"Total Calls",value:calls.length},{label:"Average Score",value:`${avg(s)}/10`},{label:"Best Score",value:`${best}/10`},{label:"This Week",value:thisWeek}].map((st,i)=>(
                <div key={i} className="sc"><div style={{fontSize:"11px",color:"rgba(240,240,245,.35)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:"8px"}}>{st.label}</div><div style={{fontSize:"22px",fontWeight:"700",letterSpacing:"-.02em"}}>{st.value}</div></div>
              ))}
            </div>
            <div className="glass" style={{padding:"18px 20px",marginBottom:"16px"}}>
              <div style={{fontSize:"11px",letterSpacing:".07em",color:"rgba(240,240,245,.3)",textTransform:"uppercase",marginBottom:"16px"}}>Skill Averages</div>
              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                {[{label:"Opener",val:avg(o)},{label:"Objection Handling",val:avg(ob)},{label:"Value Proposition",val:avg(vp)},{label:"CTA & Close",val:avg(ct)}].map((sk,i)=>(
                  <div key={i}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}><span style={{fontSize:"13px"}}>{sk.label}</span><span style={{fontSize:"13px",fontWeight:"600",color:"#818CF8"}}>{sk.val}</span></div>
                    <div className="bt"><div className="bf" style={{width:sk.val!=="—"?`${(parseFloat(sk.val)/10)*100}%`:"0%"}}/></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass" style={{padding:"16px 20px",marginBottom:"20px",background:"rgba(129,140,248,.05)",borderColor:"rgba(129,140,248,.16)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:insight?"12px":"0"}}>
                <div style={{fontSize:"11px",letterSpacing:".07em",color:"#818CF8",fontWeight:"600",textTransform:"uppercase"}}>AI Performance Insight</div>
                {!insight&&<button className="btn p" onClick={generateInsights} disabled={insLoad} style={{padding:"6px 14px",fontSize:"12px"}}>{insLoad?"Analyzing...":"Analyze My Performance"}</button>}
              </div>
              {insight&&<div style={{fontSize:"14px",color:"rgba(240,240,245,.75)",lineHeight:1.65}}>{insight}</div>}
            </div>
            <div style={{fontSize:"11px",letterSpacing:".07em",color:"rgba(240,240,245,.3)",textTransform:"uppercase",marginBottom:"12px"}}>Recent Calls — tap to review</div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {calls.map((c,i)=>{const v=VCS[c.verdict]||VCS["Good call"];return(
                <div key={i} className="h-row" onClick={()=>openDetail(c)}>
                  <Av name={c.prospectName||"?"} size={38}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"14px",fontWeight:"600",marginBottom:"2px"}}>{c.prospectName}</div>
                    <div style={{fontSize:"11px",color:"rgba(240,240,245,.38)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.prospectSpec} · {c.catLabel}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px",flexShrink:0}}>
                    <VBadge verdict={c.verdict}/>
                    <div style={{display:"flex",gap:"8px",fontSize:"11px",color:"rgba(240,240,245,.35)"}}>
                      <span style={{fontVariantNumeric:"tabular-nums",color:"#818CF8",fontWeight:"600"}}>{c.overall}/10</span>
                      <span>{fmt(c.dur||0)}</span>
                      <span>{fmtDate(c.date)}</span>
                    </div>
                  </div>
                </div>
              );})}
            </div>
          </>
        )}
      </W>
    );
  }

  // ── CALL DETAIL ───────────────────────────────────────────────────────────
  if(screen==="detail") {
    const call = detailCall;
    if(!call){setScreen("history");return null;}
    const v = VCS[call.verdict]||VCS["Good call"];
    const dCats = [
      {label:"Opener",             s:call.opener?.score,            fb:call.opener?.feedback},
      {label:"Objection Handling", s:call.objectionHandling?.score, fb:call.objectionHandling?.feedback},
      {label:"Value Proposition",  s:call.valueProposition?.score,  fb:call.valueProposition?.feedback},
      {label:"CTA & Close",        s:call.ctaStrength?.score,       fb:call.ctaStrength?.feedback},
    ].filter(c=>c.s!=null);
    const hasMsgs = call.messages?.length>0;
    let ti = 0;
    const msgsWithSug = hasMsgs ? call.messages.map(m => {
      if(m.speaker==="trainee"){const sug=suggestions?.[ti]||null;ti++;return{...m,sug};}
      return m;
    }) : [];
    return (
      <W maxW="700px">
        <div style={{display:"flex",alignItems:"flex-start",gap:"14px",marginBottom:"24px"}}>
          <button className="btn g" onClick={()=>{setSuggestions(null);setScreen("history");}} style={{padding:"8px 14px",fontSize:"13px",flexShrink:0,marginTop:"2px"}}>← Back</button>
          <div style={{flex:1,minWidth:0}}>
            <h2 style={{fontSize:"18px",fontWeight:"700",letterSpacing:"-.02em"}}>{call.prospectName}</h2>
            <div style={{fontSize:"12px",color:"rgba(240,240,245,.38)",marginTop:"3px"}}>{call.prospectSpec} · {call.catLabel} · {fmtDate(call.date)} · {fmt(call.dur||0)}</div>
          </div>
          <VBadge verdict={call.verdict}/>
        </div>
        <div className="detail-score" style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr 1fr",gap:"10px",marginBottom:"16px",alignItems:"stretch"}}>
          <div className="sc" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minWidth:"80px"}}>
            <div style={{fontSize:"11px",color:"rgba(240,240,245,.35)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:"6px"}}>Overall</div>
            <div style={{fontSize:"30px",fontWeight:"800",color:v.c,letterSpacing:"-.04em",lineHeight:1}}>{call.overall}<span style={{fontSize:"14px",color:"rgba(240,240,245,.3)",fontWeight:"500"}}>/10</span></div>
          </div>
          {dCats.map((c,i)=>(
            <div key={i} className="sc">
              <div style={{fontSize:"10px",color:"rgba(240,240,245,.35)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:"8px"}}>{c.label}</div>
              <div style={{fontSize:"20px",fontWeight:"700",color:"#818CF8",marginBottom:"6px"}}>{c.s}<span style={{fontSize:"11px",color:"rgba(240,240,245,.3)"}}>/10</span></div>
              <ScoreBar score={c.s}/>
              {c.fb&&<div style={{fontSize:"10px",color:"rgba(240,240,245,.32)",marginTop:"6px",lineHeight:1.4}}>{c.fb}</div>}
            </div>
          ))}
        </div>
        {call.coachingTip&&(
          <div className="glass" style={{padding:"13px 18px",marginBottom:"20px",background:"rgba(129,140,248,.06)",borderColor:"rgba(129,140,248,.18)"}}>
            <div style={{fontSize:"10px",letterSpacing:".07em",color:"#818CF8",fontWeight:"600",textTransform:"uppercase",marginBottom:"5px"}}>Coaching Tip</div>
            <div style={{fontSize:"14px",color:"rgba(240,240,245,.75)",lineHeight:1.6}}>{call.coachingTip}</div>
          </div>
        )}
        {hasMsgs ? (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
              <div style={{fontSize:"11px",letterSpacing:".08em",color:"rgba(240,240,245,.3)",textTransform:"uppercase"}}>Conversation · {call.messages.length} messages</div>
              {!suggestions&&(
                <button className="btn p" onClick={generateSuggestions} disabled={sugLoading} style={{padding:"7px 16px",fontSize:"12px"}}>
                  {sugLoading?"Generating...":"Show Best Closer Alternatives"}
                </button>
              )}
            </div>
            <div className="glass" style={{padding:"16px"}}>
              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                {msgsWithSug.map((m,i)=>{
                  const isP=m.speaker==="prospect";
                  return (
                    <div key={i}>
                      <div style={{display:"flex",flexDirection:isP?"row":"row-reverse",gap:"8px",alignItems:"flex-start"}}>
                        <Av name={isP?(call.prospectName||"?"):"You"} size={28}/>
                        <div style={{maxWidth:"76%",background:isP?"rgba(255,255,255,.07)":"rgba(129,140,248,.14)",border:`1px solid ${isP?"rgba(255,255,255,.1)":"rgba(129,140,248,.25)"}`,borderRadius:isP?"4px 14px 14px 14px":"14px 4px 14px 14px",padding:"9px 13px",fontSize:"14px",lineHeight:1.55,color:isP?"rgba(240,240,245,.9)":"#C7D2FE"}}>
                          {m.content}
                        </div>
                      </div>
                      {!isP&&m.sug&&(
                        <div style={{display:"flex",justifyContent:"flex-end",paddingRight:"36px",marginTop:"6px"}}>
                          <div className="sug-box" style={{maxWidth:"76%"}}>
                            <div style={{fontSize:"10px",letterSpacing:".07em",color:"#22C55E",fontWeight:"700",textTransform:"uppercase",marginBottom:"5px"}}>Best closer · {m.sug.technique||"Improved"}</div>
                            <div style={{fontSize:"13px",lineHeight:1.6,color:"rgba(240,240,245,.82)",fontStyle:"italic"}}>"{m.sug.improved}"</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {suggestions&&suggestions.length===0&&(
              <div style={{textAlign:"center",fontSize:"13px",color:"rgba(240,240,245,.3)",marginTop:"12px"}}>Could not generate suggestions for this call.</div>
            )}
          </>
        ):(
          <div className="glass" style={{padding:"28px",textAlign:"center"}}>
            <div style={{fontSize:"14px",color:"rgba(240,240,245,.35)",lineHeight:1.6}}>Transcript not recorded for this call.<br/>Calls made from this version onwards include full transcripts.</div>
          </div>
        )}
      </W>
    );
  }

  return null;
}
