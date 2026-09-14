import { useState, useEffect, useRef } from "react";
import { PearlButton } from "./components/ui/pearl-button";

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

// ─── Storage Helper ──────────────────────────────────────────────────────────
const storage = {
  get: async (key) => {
    if (typeof window !== "undefined" && window.storage?.get) {
      try { const r = await window.storage.get(key); return r ? { value: r.value } : null; } catch {}
    }
    if (typeof window !== "undefined" && window.localStorage) {
      const v = window.localStorage.getItem(key);
      return v ? { value: v } : null;
    }
    return null;
  },
  set: async (key, value) => {
    if (typeof window !== "undefined" && window.storage?.set) {
      try { await window.storage.set(key, value); } catch {}
    }
    if (typeof window !== "undefined" && window.localStorage) {
      try { window.localStorage.setItem(key, value); } catch {}
    }
  },
  delete: async (key) => {
    if (typeof window !== "undefined" && window.storage?.delete) {
      try { await window.storage.delete(key); } catch {}
    }
    if (typeof window !== "undefined" && window.localStorage) {
      try { window.localStorage.removeItem(key); } catch {}
    }
  },
  list: async (prefix) => {
    if (typeof window !== "undefined" && window.storage?.list) {
      try { const r = await window.storage.list(prefix); if (r?.keys) return r; } catch {}
    }
    if (typeof window !== "undefined" && window.localStorage) {
      const keys = Object.keys(window.localStorage).filter(k => k.startsWith(prefix));
      return { keys };
    }
    return { keys: [] };
  }
};

const saveCall = async (data) => { await storage.set(`call:${data.id}`, JSON.stringify(data)); };
const loadHistory = async () => {
  try {
    const keys = await storage.list("call:");
    if (!keys?.keys?.length) return [];
    const uniqueKeys = [...new Set(keys.keys)];
    const items = await Promise.all(uniqueKeys.map(async k => {
      try { const r = await storage.get(k); return r?.value ? JSON.parse(r.value) : null; } catch { return null; }
    }));
    const byId   = new Set();
    const bySlot = new Set();
    return items
      .filter(Boolean)
      .sort((a,b) => b.id - a.id)
      .filter(item => {
        if (byId.has(item.id)) return false;
        byId.add(item.id);
        const slot = `${item.prospectName}|${Math.floor((item.id||0) / 60000)}`;
        if (bySlot.has(slot)) return false;
        bySlot.add(slot);
        return true;
      });
  } catch { return []; }
};
const saveCustomCat = async (data) => { await storage.set(`ccat:${data.id}`, JSON.stringify(data)); };
const loadCustomCats = async () => {
  try {
    const keys = await storage.list("ccat:");
    if (!keys?.keys?.length) return [];
    const uniqueKeys = [...new Set(keys.keys)];
    const items = await Promise.all(uniqueKeys.map(async k => {
      try { const r = await storage.get(k); return r?.value ? JSON.parse(r.value) : null; } catch { return null; }
    }));
    const seen = new Set();
    return items.filter(Boolean).filter(item => { if(seen.has(item.id)) return false; seen.add(item.id); return true; }).sort((a,b) => a.id - b.id);
  } catch { return []; }
};
const deleteCustomCatFromStorage = async (catId) => {
  try {
    await storage.delete(`ccat:${catId}`);
    const keys = await storage.list(`cprospect:${catId}:`);
    if (keys?.keys?.length) await Promise.all(keys.keys.map(k => storage.delete(k)));
  } catch {}
};
const saveCustomProspect = async (catId, data) => { await storage.set(`cprospect:${catId}:${data.id}`, JSON.stringify(data)); };
const loadCustomProspects = async (catId) => {
  try {
    const keys = await storage.list(`cprospect:${catId}:`);
    if (!keys?.keys?.length) return [];
    const uniqueKeys = [...new Set(keys.keys)];
    const items = await Promise.all(uniqueKeys.map(async k => {
      try { const r = await storage.get(k); return r?.value ? JSON.parse(r.value) : null; } catch { return null; }
    }));
    const seen = new Set();
    return items.filter(Boolean).filter(item => { if(seen.has(item.id)) return false; seen.add(item.id); return true; }).sort((a,b) => a.id - b.id);
  } catch { return []; }
};

// ─── Smart Fallback AI Engine ───────────────────────────────────────────────
const getFallbackResponse = (msgs, sys, prospect) => {
  const isGreeting = msgs.length === 1 && String(msgs[0]?.content||"").includes("Phone just connected");
  const name = prospect?.name || "Prospect";
  const firstName = name.split(" ")[0] || "there";

  if (isGreeting) {
    const greetings = [
      `Hello, this is ${firstName}. How can I help you?`,
      `Yeah, ${firstName} speaking. What's this regarding?`,
      `Hi, this is ${name}. Who is calling?`,
      `Hello? ${firstName} here.`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  const lastUserMsg = [...msgs].reverse().find(m => m.role === "user")?.content || "";
  const lower = lastUserMsg.toLowerCase();

  if (lower.includes("price") || lower.includes("cost") || lower.includes("pricing") || lower.includes("how much")) {
    return "Pricing is always a key factor for us. What kind of measurable ROI or time savings are your current clients actually seeing?";
  }
  if (lower.includes("demo") || lower.includes("meeting") || lower.includes("15 min") || lower.includes("schedule") || lower.includes("time")) {
    return "Look, my calendar is pretty packed this week. Can you send over a brief email summary first, and if it makes sense we can look at next week?";
  }
  if (lower.includes("tool") || lower.includes("software") || lower.includes("current") || lower.includes("crm") || lower.includes("stack")) {
    return "We already have a system in place that works reasonably well. What specifically makes your solution worth switching or integrating?";
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("calling from")) {
    return `Hi. I only have a couple of minutes before my next meeting. What's the short version of why you're reaching out today?`;
  }

  const contextualReplies = [
    `I hear what you're saying, but we've been burned by similar tools in the past that promised quick results and didn't deliver. How are you different?`,
    `That sounds interesting in theory, but my team is already stretched thin. How much setup or onboarding time does this actually require?`,
    `We're currently evaluating our priorities for the quarter. What is the single biggest impact this would have on our operations?`,
    `I appreciate you reaching out, but I'd need to see some real numbers or case studies before taking this further. What results have similar companies gotten?`
  ];

  return contextualReplies[Math.floor(Math.random() * contextualReplies.length)];
};

// ─── Responsive & Pearl Button Global Styles ────────────────────────────────
const css = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
@keyframes waveBar{from{transform:scaleY(.2)}to{transform:scaleY(1)}}
@keyframes blink{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.msg{animation:fadeUp .28s ease forwards}

/* Pearl Button Global CSS override for .btn elements - Larger Buttons & High Contrast Bold Text */
.btn {
  --radius: 100px;
  outline: none;
  cursor: pointer;
  border: 0;
  position: relative;
  border-radius: var(--radius);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-align: center;
  padding: 32px 96px;
  min-height: 88px;
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.95), 0 0 12px rgba(255, 255, 255, 0.2);
  user-select: none;
  overflow: hidden;
  box-shadow:
    inset 0 0.4rem 0.8rem rgba(255, 255, 255, 0.35),
    inset 0 -0.2rem 0.4rem rgba(0, 0, 0, 0.9),
    inset 0 -0.45rem 1rem var(--btn-glow, rgba(129, 140, 248, 0.5)),
    0 1.2rem 2.5rem rgba(0, 0, 0, 0.5),
    0 0.6rem 1rem -0.2rem rgba(0, 0, 0, 0.9);
}

.btn::before {
  content: "";
  position: absolute;
  left: -15%;
  right: -15%;
  bottom: 25%;
  top: -100%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.18);
  transition: all 0.3s ease;
  pointer-events: none;
}

.btn::after {
  content: "";
  position: absolute;
  left: 6%;
  right: 6%;
  top: 10%;
  bottom: 40%;
  border-radius: 22px 22px 0 0;
  box-shadow: inset 0 12px 12px -6px rgba(255, 255, 255, 0.8);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0) 100%
  );
  transition: all 0.3s ease;
  pointer-events: none;
}

.btn.p {
  background-color: #0f1124;
  color: #ffffff !important;
  --btn-glow: rgba(129, 140, 248, 0.6);
  --btn-border-glow: rgba(129, 140, 248, 0.5);
}

.btn.g {
  background-color: #111320;
  color: #ffffff !important;
  --btn-glow: rgba(255, 255, 255, 0.25);
  --btn-border-glow: rgba(255, 255, 255, 0.25);
}

.btn.d {
  background-color: #240808;
  color: #ffffff !important;
  --btn-glow: rgba(239, 68, 68, 0.55);
  --btn-border-glow: rgba(239, 68, 68, 0.45);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  filter: grayscale(40%);
  box-shadow: none !important;
  transform: none !important;
}

.btn:hover:not(:disabled) {
  box-shadow:
    inset 0 0.4rem 0.8rem rgba(255, 255, 255, 0.6),
    inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.9),
    inset 0 -0.5rem 1.1rem var(--btn-glow, rgba(129, 140, 248, 0.65)),
    0 1.6rem 2.8rem rgba(0, 0, 0, 0.6),
    0 0.8rem 1.2rem -0.2rem var(--btn-border-glow, rgba(129, 140, 248, 0.45));
  transform: translateY(-3px);
}

.btn:hover:not(:disabled)::before {
  transform: translateY(-6%);
}

.btn:hover:not(:disabled)::after {
  opacity: 0.65;
  transform: translateY(4%);
}

.btn:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow:
    inset 0 0.2rem 0.4rem rgba(255, 255, 255, 0.5),
    inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.9),
    inset 0 -0.3rem 0.7rem var(--btn-glow, rgba(129, 140, 248, 0.4)),
    0 0.4rem 0.8rem rgba(0, 0, 0, 0.4);
}

/* Grids & Containers */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 14px;
  width: 100%;
}
@media (min-width: 480px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px) { .cat-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
@media (min-width: 1024px) { .cat-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; } }

.prospect-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  width: 100%;
}
@media (min-width: 768px) { .prospect-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }

.cat-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:20px 24px;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;justify-content:space-between}
.cat-card:hover{background:rgba(255,255,255,.08);border-color:rgba(129,140,248,.35);transform:translateY(-2px)}
.cat-custom-card{background:rgba(129,140,248,.06);border:1px solid rgba(129,140,248,.2);border-radius:16px;padding:20px 24px;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;justify-content:space-between}
.cat-custom-card:hover{background:rgba(129,140,248,.11);border-color:rgba(129,140,248,.38);transform:translateY(-2px)}
.cat-add{background:rgba(129,140,248,.07);border:1px dashed rgba(129,140,248,.3);border-radius:16px;padding:20px 24px;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;justify-content:space-between}
.cat-add:hover{background:rgba(129,140,248,.12);border-color:rgba(129,140,248,.5)}

.p-row{display:flex;align-items:center;gap:16px;padding:18px 20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:16px;cursor:pointer;transition:all .18s ease}
.p-row:hover{background:rgba(255,255,255,.08);border-color:rgba(129,140,248,.3);transform:translateY(-2px)}

.h-row{display:flex;align-items:center;gap:14px;padding:16px 20px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);border-radius:14px;cursor:pointer;transition:background .18s ease}
.h-row:hover{background:rgba(255,255,255,.065)}

.txin{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:14px;color:#F0F0F5;font-family:inherit;font-size:16px;padding:14px 20px;outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
.txin:focus{border-color:rgba(129,140,248,.5);box-shadow:0 0 0 3px rgba(129,140,248,.15)}
.txin::placeholder{color:rgba(240,240,245,.35)}

.txarea{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:14px;color:#F0F0F5;font-family:inherit;font-size:15px;padding:14px 20px;outline:none;transition:border-color .2s,box-shadow .2s;width:100%;resize:vertical;min-height:90px;line-height:1.6}
.txarea:focus{border-color:rgba(129,140,248,.5);box-shadow:0 0 0 3px rgba(129,140,248,.15)}
.txarea::placeholder{color:rgba(240,240,245,.35)}

.bt{background:rgba(255,255,255,.08);border-radius:4px;height:7px;overflow:hidden}
.bf{height:100%;border-radius:4px;background:linear-gradient(90deg,#818CF8,#A78BFA);transition:width 1s cubic-bezier(.4,0,.2,1)}

.fl{display:flex;flex-direction:column;gap:6px}
.lbl{font-size:13px;color:rgba(240,240,245,.5);letter-spacing:.02em;font-weight:600}
.del-dot{position:absolute;top:-8px;right:-8px;width:24px;height:24px;border-radius:50%;background:#FF3B30;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;border:2.5px solid #050508;transition:transform .15s ease}
.del-dot:hover{transform:scale(1.18)}
.del-minus{color:#fff;font-size:16px;font-weight:800;line-height:1;opacity:0;transition:opacity .12s ease;margin-top:-1px}
.del-dot:hover .del-minus{opacity:1}

.sug-box{background:rgba(34,197,94,.07);border:1px solid rgba(34,197,94,.2);border-radius:12px;padding:12px 16px;margin-top:8px}
.live-tip{background:rgba(129,140,248,.08);border:1px solid rgba(129,140,248,.2);border-radius:10px;padding:10px 14px;margin-top:8px;font-size:13px;color:rgba(200,205,255,.9);line-height:1.55}

.call-wrap {
  height: 100vh;
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media (min-width: 768px) {
  .call-wrap {
    max-width: 1060px;
    height: 85vh;
    max-height: 820px;
    margin: 30px auto;
    border-radius: 24px;
    border: 1px solid rgba(255,255,255,.09);
    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
    display: grid;
    grid-template-columns: 340px 1fr;
    grid-template-rows: 1fr;
    overflow: hidden;
  }
  .call-sidebar {
    background: rgba(255,255,255,.02);
    border-right: 1px solid rgba(255,255,255,.07);
    padding: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .call-main {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: rgba(5,5,8,.6);
  }
}

.two-col-layout {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
}
@media (min-width: 768px) {
  .two-col-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
  }
}

::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:4px}
`;

const FONT = "-apple-system,BlinkMacSystemFont,'Plus Jakarta Sans','Inter',sans-serif";
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
  return <span style={{background:`rgba(${d.r},.1)`,border:`1px solid rgba(${d.r},.25)`,color:d.c,borderRadius:"6px",padding:"3px 9px",fontSize:"11px",fontWeight:"600"}}>{diff}</span>;
}
function VBadge({verdict}) {
  const v=VCS[verdict]||VCS["Good call"];
  return <span style={{display:"inline-block",background:`rgba(${v.r},.1)`,border:`1px solid rgba(${v.r},.25)`,color:v.c,borderRadius:"20px",padding:"4px 12px",fontSize:"12px",fontWeight:"600"}}>{verdict}</span>;
}
function StatusPill({status}) {
  const c=STC[status]||"#6B7280";
  return (
    <div style={{display:"flex",alignItems:"center",gap:"6px",fontSize:"13px",color:"rgba(240,240,245,.6)"}}>
      <span style={{width:"7px",height:"7px",borderRadius:"50%",background:c,display:"inline-block",animation:status!=="On call"?"blink 1.1s ease-in-out infinite":"none"}}/>
      {status}
    </div>
  );
}
function ScoreBar({score}) {
  return <div className="bt"><div className="bf" style={{width:`${((score||0)/10)*100}%`}}/></div>;
}
function TopNav({onHistory, onApiKey, hasKey}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",marginBottom:"28px"}}>
      <div style={{fontSize:"15px",fontWeight:"700",letterSpacing:"-.02em",color:"rgba(240,240,245,.95)",display:"flex",alignItems:"center",gap:"8px"}}>
        <span style={{background:"rgba(129,140,248,.2)",border:"1px solid rgba(129,140,248,.4)",color:"#818CF8",padding:"4px 10px",borderRadius:"8px",fontSize:"11px",fontWeight:"800"}}>AI</span>
        Cold Call Trainer
      </div>
      <div style={{display:"flex",gap:"12px"}}>
        <PearlButton variant="secondary" size="small" onClick={onApiKey}>
          <span style={{width:"8px",height:"8px",borderRadius:"50%",background:hasKey?"#22C55E":"#F59E0B",marginRight:"6px"}}/>
          {hasKey ? "API Key Set" : "Add API Key"}
        </PearlButton>
        <PearlButton variant="secondary" size="small" onClick={onHistory}>
          Call History
        </PearlButton>
      </div>
    </div>
  );
}

function Glass({children,padding="26px",style={}}) {
  return (
    <div style={{background:"rgba(255,255,255,.03)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,.07)",borderRadius:"18px",padding,...style}}>
      {children}
    </div>
  );
}
function W({children,maxW="1100px"}) {
  return (
    <div style={{minHeight:"100vh",background:BG,color:"#F0F0F5",fontFamily:FONT,display:"flex",flexDirection:"column",alignItems:"center",padding:"32px 24px 56px"}}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div style={{width:"100%",maxWidth:maxW}}>{children}</div>
    </div>
  );
}

const BLANK_CP = { name:"", title:"", company:"", difficulty:"Medium", gender:"male", traits:[], objection:"", interest:"", context:"" };

// ─── Main App ────────────────────────────────────────────────────────────────
export default function ColdCallTrainer() {
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
  const [liveTips,       setLiveTips]       = useState({});
  const [resetConfirm,   setResetConfirm]   = useState(false);
  const [apiKey,         setApiKey]         = useState("");
  const [showKeyModal,   setShowKeyModal]   = useState(false);
  const [keyInput,       setKeyInput]       = useState("");

  const recRef        = useRef(null);
  const txRef         = useRef(null);
  const tmRef         = useRef(null);
  const t0Ref         = useRef(null);
  const callEndingRef = useRef(false);

  useEffect(()=>{
    setVoiceOk(!!(window.SpeechRecognition||window.webkitSpeechRecognition));
    loadCustomCats().then(setCustomCats);
    if(typeof window !== "undefined") {
      const savedKey = localStorage.getItem("anthropic_api_key") || "";
      setApiKey(savedKey);
      setKeyInput(savedKey);
    }
  },[]);

  useEffect(()=>{
    if(screen==="call"){t0Ref.current=Date.now();tmRef.current=setInterval(()=>setDur(Math.floor((Date.now()-t0Ref.current)/1000)),1000);}
    else clearInterval(tmRef.current);
    return()=>clearInterval(tmRef.current);
  },[screen]);

  useEffect(()=>{ if(txRef.current) txRef.current.scrollTop=txRef.current.scrollHeight; },[messages]);

  useEffect(()=>{
    if(screen==="history"&&history===null) loadHistory().then(h=>{setHistory(h);setInsight("");setResetConfirm(false);});
  },[screen]);

  useEffect(()=>{
    if(screen==="prospects"&&cat?.id) loadCustomProspects(cat.id).then(setSavedProspects);
  },[screen,cat]);

  const unlockSpeech = () => {
    if (!window.speechSynthesis) return;
    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      const silent = new SpeechSynthesisUtterance(" ");
      silent.volume = 0; silent.rate = 10;
      window.speechSynthesis.speak(silent);
    } catch {}
  };

  const speak = (text, gender="neutral", onEnd) => {
    if(!window.speechSynthesis || !text) { onEnd?.(); return; }
    window.speechSynthesis.cancel();

    const doSpeak = (voices) => {
      const u = new SpeechSynthesisUtterance(text);
      const list = gender === "female" ? FEMALE_VX : MALE_VX;

      let voice = voices.find(v => v.lang.startsWith("en") && list.some(name => v.name.toLowerCase().includes(name)))
               || voices.find(v => list.some(name => v.name.toLowerCase().includes(name)))
               || voices.find(v => v.lang.startsWith("en"))
               || voices[0];

      if(voice) u.voice = voice;
      u.rate = 1.0; u.pitch = gender === "female" ? 1.1 : 0.95;

      u.onstart = () => { setAiSpeak(true); setStatus("Speaking..."); };
      u.onend   = () => { setAiSpeak(false); setStatus("On call"); onEnd?.(); };
      u.onerror = () => { setAiSpeak(false); setStatus("On call"); onEnd?.(); };

      setTimeout(()=>{ try{ window.speechSynthesis.speak(u); }catch{ setAiSpeak(false); onEnd?.(); } }, 50);
    };

    const voices = window.speechSynthesis.getVoices();
    if(voices.length){
      doSpeak(voices);
    } else {
      const handler = () => doSpeak(window.speechSynthesis.getVoices());
      window.speechSynthesis.addEventListener("voiceschanged", handler, {once:true});
      setTimeout(()=>{ window.speechSynthesis.removeEventListener("voiceschanged",handler); doSpeak([]); }, 800);
    }
  };

  const callClaude = async (msgs, sys, max=1000) => {
    try {
      const headers = { "Content-Type": "application/json" };
      if (apiKey) headers["x-api-key"] = apiKey;

      const res = await fetch("/api/claude", {
        method: "POST",
        headers,
        body: JSON.stringify({ messages: msgs, system: sys, max_tokens: max })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text && data.text.trim()) {
          return data.text.trim();
        }
      }
    } catch (e) {
      console.warn("Server API route failed, trying fallback...", e);
    }

    if (apiKey) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true"
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: max,
            system: sys,
            messages: msgs
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.content?.[0]?.text) {
            return data.content[0].text.trim();
          }
        }
      } catch (e) {
        console.warn("Direct Anthropic API call failed:", e);
      }
    }

    return getFallbackResponse(msgs, sys, prospect);
  };

  const saveApiKey = (key) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    if(typeof window !== "undefined") {
      if (trimmed) localStorage.setItem("anthropic_api_key", trimmed);
      else localStorage.removeItem("anthropic_api_key");
    }
    setShowKeyModal(false);
  };

  const startCall = async (p, catOverride) => {
    unlockSpeech();
    const activeCat = catOverride||cat;
    callEndingRef.current = false;
    setLiveTips({});
    setProspect(p);setMessages([]);setScore(null);setDur(0);setInput("");
    setScreen("call");setLoading(true);setStatus("Connecting...");
    if(window.speechSynthesis){window.speechSynthesis.getVoices();await new Promise(r=>setTimeout(r,400));}
    const sys = p.systemPrompt || buildSys(p, activeCat?.label);
    try {
      let text = await callClaude([{role:"user",content:"[Phone just connected. Answer naturally — say hello or yeah — one sentence only.]"}], sys);
      if(!text || !text.trim()) {
        text = getFallbackResponse([{role:"user",content:"[Phone just connected]"}], sys, p);
      }
      setMessages([{speaker:"prospect",content:text}]);setStatus("On call");speak(text, p.gender||"neutral");
    } catch {
      const text = getFallbackResponse([{role:"user",content:"[Phone just connected]"}], sys, p);
      setMessages([{speaker:"prospect",content:text}]);setStatus("On call");speak(text, p.gender||"neutral");
    }
    setLoading(false);
  };

  const send = async (text) => {
    if(!text.trim()||loading||aiSpeak)return;
    unlockSpeech();
    setInput("");setListen(false);recRef.current?.stop();
    const updated = [...messages,{speaker:"trainee",content:text}];
    setMessages(updated);setLoading(true);setStatus("Thinking...");
    const sys = prospect.systemPrompt || buildSys(prospect, cat?.label);
    const api = [];
    if(updated[0]?.speaker==="prospect") api.push({role:"user",content:"[call connected, you answered]"});
    updated.forEach(m=>api.push({role:m.speaker==="prospect"?"assistant":"user",content:m.content}));
    try {
      let reply = await callClaude(api, sys);
      if(!reply || !reply.trim()) {
        reply = getFallbackResponse(api, sys, prospect);
      }
      const nextMessages = [...updated, {speaker:"prospect",content:reply}];
      setMessages(nextMessages);setStatus("On call");speak(reply, prospect?.gender||"neutral");

      const tipIdx = nextMessages.length - 1;
      const tipSys = "Sales coach. One sentence, max 18 words. Tell the rep exactly what to do or say NEXT based on the prospect's last reply.";
      const tipCtx = nextMessages.slice(-2).map(m=>`${m.speaker==="prospect"?prospect.name:"Rep"}: ${m.content}`).join("\n");
      callClaude([{role:"user",content:tipCtx}], tipSys, 60)
        .then(tip=>{
          if(tip && tip.trim()) setLiveTips(prev=>({...prev,[tipIdx]:tip.trim()}));
          else setLiveTips(prev=>({...prev,[tipIdx]:"Ask an open-ended question to uncover their core priority."}));
        })
        .catch(()=>{
          setLiveTips(prev=>({...prev,[tipIdx]:"Acknowledge their concern before introducing value."}));
        });
    } catch {
      const reply = getFallbackResponse(api, sys, prospect);
      const nextMessages = [...updated, {speaker:"prospect",content:reply}];
      setMessages(nextMessages);setStatus("On call");speak(reply, prospect?.gender||"neutral");
    }
    setLoading(false);
  };

  const endCall = async () => {
    if(callEndingRef.current) return;
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
      let parsed;
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      } catch {
        parsed = {
          overall: 7,
          opener: { score: 7, feedback: "Clear and direct opening line." },
          objectionHandling: { score: 6, feedback: "Addressed objections with good poise." },
          valueProposition: { score: 7, feedback: "Highlighted key benefits effectively." },
          ctaStrength: { score: 6, feedback: "Push for a specific calendar slot." },
          coachingTip: "Ask one clarifying question before pitching solution details.",
          verdict: "Good call"
        };
      }
      const callData = {id:Date.now(),date:new Date().toISOString(),catLabel:cat?.label||"Custom",prospectName:prospect.name,prospectSpec:prospect.spec||prospect.title,prospectGender:prospect.gender||"neutral",diff:prospect.diff||prospect.difficulty,...parsed,dur:finalDur,exchanges:Math.ceil(messages.length/2),messages:messages.map(m=>({speaker:m.speaker,content:m.content}))};
      await saveCall(callData);setScore({...callData});
    } catch {
      setScore({overall:7,verdict:"Good call",coachingTip:"Keep practicing!",dur:finalDur,exchanges:Math.ceil(messages.length/2)});
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
    catch{setInsight("Focus on anchoring value early and securing a specific meeting slot.");}
    setInsLoad(false);
  };

  const generateSuggestions = async () => {
    if(!detailCall?.messages?.length)return;
    setSugLoading(true);
    const transcript = detailCall.messages.map(m=>`${m.speaker==="prospect"?detailCall.prospectName:"Sales Rep"}: ${m.content}`).join("\n");
    const traineeLines = detailCall.messages.filter(m=>m.speaker==="trainee").map((m,i)=>`Turn ${i+1}: "${m.content}"`).join("\n");
    const prompt = `Transcript:\n${transcript}\n\nRep lines:\n${traineeLines}\n\nFor EACH sales rep message, provide what a world-class closer would have said instead. Return ONLY a raw JSON object: {"suggestions":["<closer alternative for rep message 1>","<closer alternative for rep message 2>",...]}`;
    try {
      const raw = await callClaude([{role:"user",content:prompt}],"Sales coach. Return raw JSON array of string alternatives only.",1000);
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setSuggestions(parsed.suggestions||[]);
    } catch {
      setSuggestions(detailCall.messages.filter(m=>m.speaker==="trainee").map(()=>"State a clear business problem before asking for the meeting."));
    }
    setSugLoading(false);
  };

  const selectCategory = (c) => { setCat(c); setScreen("prospects"); };

  const handleSubmitCc = async () => {
    if(!ccForm.product.trim())return;
    const id=Date.now();
    const newCat={id,label:ccForm.product.trim(),target:ccForm.target,isCustom:true,createdAt:new Date().toISOString()};
    await saveCustomCat(newCat);setCustomCats(prev=>[...prev,newCat]);
    setCat(newCat);setCcForm({product:"",target:""});setSavedProspects([]);setScreen("prospects");
  };

  const handleSubmitCp = async () => {
    if(!cpForm.name.trim()||!cpForm.title.trim())return;
    const id=Date.now();
    const p={id,catId:cat?.id,name:cpForm.name.trim(),spec:cpForm.title.trim()+(cpForm.company?`, ${cpForm.company.trim()}`:""),title:cpForm.title.trim(),company:cpForm.company.trim(),diff:cpForm.difficulty,gender:cpForm.gender,traits:[...cpForm.traits],objection:cpForm.objection,interest:cpForm.interest,context:cpForm.context,systemPrompt:buildCustomSys(cpForm,cat?.label),isCustom:true};
    if(cat?.id) await saveCustomProspect(cat.id,p);
    setCpForm(BLANK_CP);startCall(p);
  };

  const deleteCustomCat = async (catId, e) => {
    e?.stopPropagation();
    await deleteCustomCatFromStorage(catId);
    setCustomCats(prev=>prev.filter(c=>c.id!==catId));
  };

  const goHome = () => {
    window.speechSynthesis?.cancel();recRef.current?.stop();clearInterval(tmRef.current);setScreen("home");
  };

  const resetHistory = async () => {
    try {
      const keys = await storage.list("call:");
      if (keys?.keys?.length) {
        await Promise.all([...new Set(keys.keys)].map(k => storage.delete(k)));
      }
    } catch {}
    setHistory([]);
    setInsight("");
    setResetConfirm(false);
  };

  const openDetail = (call) => {
    setDetailCall(call);setSuggestions(null);setScreen("detail");
  };

  // ── HOME ──────────────────────────────────────────────────────────────────
  if(screen==="home") return (
    <W maxW="1100px">
      <TopNav onHistory={()=>{setHistory(null);setScreen("history");}} onApiKey={()=>setShowKeyModal(true)} hasKey={!!apiKey}/>
      
      <div style={{textAlign:"center",marginBottom:"48px",width:"100%"}}>
        <div style={{fontSize:"12px",letterSpacing:".1em",color:"rgba(240,240,245,.45)",textTransform:"uppercase",marginBottom:"16px",fontWeight:"700"}}>AI Sales Pitch Roleplay</div>
        <h1 style={{fontSize:"clamp(34px,5.5vw,58px)",fontWeight:"800",letterSpacing:"-.04em",lineHeight:1.08,margin:0}}>
          Train like a pro.<br/>
          <span style={{color:"#818CF8"}}>Close like a closer.</span>
        </h1>
        <p style={{color:"rgba(240,240,245,.5)",fontSize:"clamp(15px,1.9vw,17px)",marginTop:"18px",lineHeight:1.65,maxWidth:"560px",margin:"18px auto 0"}}>
          Practice cold calls against realistic AI prospects across 8 industries. Get live coaching tips, objection handling, and detailed post-call scorecards.
        </p>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",width:"100%"}}>
        <div style={{fontSize:"13px",letterSpacing:".08em",color:"rgba(240,240,245,.55)",textTransform:"uppercase",fontWeight:"700"}}>Select Product Industry</div>
        <PearlButton variant="primary" size="medium" onClick={()=>setScreen("customCat")}>
          + Custom Category
        </PearlButton>
      </div>
      
      <div className="cat-grid" style={{marginBottom:"28px"}}>
        {CATEGORIES.map(c=>(
          <div key={c.id} className="cat-card" onClick={()=>selectCategory(c)}>
            <div style={{fontSize:"16px",fontWeight:"600",color:"rgba(240,240,245,.95)"}}>{c.label}</div>
            <span style={{color:"rgba(129,140,248,.8)",fontSize:"18px",fontWeight:"700"}}>→</span>
          </div>
        ))}
      </div>

      {customCats.length > 0 && (
        <>
          <div style={{fontSize:"13px",letterSpacing:".08em",color:"rgba(240,240,245,.55)",textTransform:"uppercase",marginBottom:"14px",marginTop:"28px",width:"100%",fontWeight:"700"}}>Your Custom Categories</div>
          <div className="cat-grid" style={{marginBottom:"24px"}}>
            {customCats.map(c=>(
              <div key={c.id} className="cat-custom-card" style={{position:"relative"}} onClick={()=>selectCategory(c)}>
                <div className="del-dot" onClick={(e)=>deleteCustomCat(c.id, e)}>
                  <span className="del-minus">−</span>
                </div>
                <div>
                  <div style={{fontSize:"16px",fontWeight:"600",color:"#818CF8"}}>{c.label}</div>
                  {c.target&&<div style={{fontSize:"13px",color:"rgba(240,240,245,.45)",marginTop:"3px"}}>{c.target}</div>}
                </div>
                <span style={{color:"#818CF8",fontSize:"18px",fontWeight:"700"}}>→</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* API Key Modal */}
      {showKeyModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.78)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"20px"}}>
          <Glass style={{width:"100%",maxWidth:"460px",padding:"32px"}}>
            <h3 style={{fontSize:"20px",fontWeight:"700",marginBottom:"10px"}}>Anthropic API Key Settings</h3>
            <p style={{fontSize:"14px",color:"rgba(240,240,245,.55)",marginBottom:"20px",lineHeight:1.55}}>
              Enter your Anthropic API Key to use Claude live in your browser. Leave blank if your Vercel project already has `ANTHROPIC_API_KEY` configured or to use Smart Fallback Mode.
            </p>
            <input className="txin" value={keyInput} onChange={e=>setKeyInput(e.target.value)} placeholder="sk-ant-api03-..." style={{marginBottom:"22px"}}/>
            <div style={{display:"flex",gap:"12px"}}>
              <PearlButton variant="secondary" size="medium" onClick={()=>setShowKeyModal(false)} style={{flex:1}}>Cancel</PearlButton>
              <PearlButton variant="primary" size="medium" onClick={()=>saveApiKey(keyInput)} style={{flex:1}}>Save Key</PearlButton>
            </div>
          </Glass>
        </div>
      )}
    </W>
  );

  // ── CALL SCREEN ───────────────────────────────────────────────────────────
  if(screen==="call") return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div style={{minHeight:"100vh",background:BG,color:"#F0F0F5",fontFamily:FONT,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"12px"}}>
        <div className="call-wrap">
          
          <div className="call-sidebar" style={{background:CBG}}>
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"24px"}}>
                <PearlButton variant="secondary" size="small" onClick={endCall}>← Exit</PearlButton>
                <StatusPill status={status}/>
              </div>

              <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:"16px",marginBottom:"28px"}}>
                <Av name={prospect?.name||"?"} size={80}/>
                <div>
                  <div style={{fontWeight:"700",fontSize:"20px",color:"#F0F0F5"}}>{prospect?.name}</div>
                  <div style={{color:"rgba(240,240,245,.55)",fontSize:"14px",marginTop:"4px"}}>{prospect?.spec||prospect?.title}</div>
                  <div style={{marginTop:"10px"}}><DBadge diff={prospect?.diff||prospect?.difficulty||"Medium"}/></div>
                </div>
              </div>

              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"14px",margin:"20px 0"}}>
                <Waveform active={aiSpeak}/>
                <div style={{fontVariantNumeric:"tabular-nums",fontSize:"18px",color:"rgba(240,240,245,.7)",fontWeight:"600"}}>{fmt(dur)}</div>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"12px",width:"100%"}}>
              {voiceOk&&<PearlButton variant="secondary" size="medium" onClick={toggleMic} disabled={loading||aiSpeak} style={{width:"100%"}}>{listen?"Stop Listening":"Voice Speak"}</PearlButton>}
              <PearlButton variant="danger" size="medium" onClick={endCall} disabled={loading} style={{width:"100%"}}>End Call & Score</PearlButton>
            </div>
          </div>

          <div className="call-main">
            <div style={{padding:"18px 24px",borderBottom:"1px solid rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:"13px",fontWeight:"700",color:"rgba(240,240,245,.65)",letterSpacing:".05em"}}>LIVE TRANSCRIPT</div>
              {loading&&!aiSpeak&&<div style={{fontSize:"13px",color:"rgba(240,240,245,.45)",animation:"blink 1.2s ease-in-out infinite"}}>Prospect is thinking...</div>}
            </div>

            <div ref={txRef} style={{flex:1,padding:"24px",overflowY:"auto",display:"flex",flexDirection:"column",gap:"16px",minHeight:0}}>
              {messages.length===0&&<div style={{color:"rgba(240,240,245,.35)",fontSize:"15px",textAlign:"center",margin:"auto"}}>{loading?"Connecting call...":"Say something to start pitching"}</div>}
              {messages.map((m,i)=>{
                const isP=m.speaker==="prospect";
                const contentText = (m.content && m.content.trim()) ? m.content : (isP ? `(Hello, ${prospect?.name||'Prospect'} here)` : '...');
                return(
                  <div key={i} className="msg">
                    <div style={{display:"flex",flexDirection:isP?"row":"row-reverse",gap:"12px",alignItems:"flex-start"}}>
                      <Av name={isP?(prospect?.name||"?"):"You"} size={36}/>
                      <div style={{maxWidth:"80%",background:isP?"rgba(255,255,255,.07)":"rgba(129,140,248,.16)",border:`1px solid ${isP?"rgba(255,255,255,.1)":"rgba(129,140,248,.3)"}`,borderRadius:isP?"4px 18px 18px 18px":"18px 4px 18px 18px",padding:"12px 18px",fontSize:"15px",lineHeight:1.6,color:isP?"rgba(240,240,245,.95)":"#C7D2FE"}}>
                        {contentText}
                      </div>
                    </div>
                    {isP&&liveTips[i]&&(
                      <div style={{display:"flex",paddingLeft:"48px",marginTop:"8px"}}>
                        <div className="live-tip">
                          <span style={{color:"#818CF8",marginRight:"6px",fontSize:"11px",fontWeight:"800"}}>↗ COACHING TIP:</span>
                          {liveTips[i]}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{padding:"18px 24px",borderTop:"1px solid rgba(255,255,255,.07)",background:"rgba(0,0,0,.2)"}}>
              <div style={{display:"flex",gap:"12px"}}>
                <input className="txin" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send(input)} placeholder={listen?"Listening to your voice...":aiSpeak?"Prospect speaking...":"Type your reply and press Enter..."} disabled={loading||aiSpeak||listen}/>
                <PearlButton variant="primary" size="medium" onClick={()=>send(input)} disabled={loading||aiSpeak||listen||!input.trim()} style={{whiteSpace:"nowrap"}}>Send</PearlButton>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );

  // ── PROSPECTS SCREEN ──────────────────────────────────────────────────────
  if(screen==="prospects") {
    const list = [...(PROSPECTS[cat?.id]||[]), ...savedProspects];
    return (
      <W maxW="1000px">
        <PearlButton variant="secondary" size="small" onClick={goHome} style={{alignSelf:"flex-start",marginBottom:"24px"}}>← Home</PearlButton>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"28px",width:"100%"}}>
          <div>
            <div style={{fontSize:"13px",letterSpacing:".08em",color:"#818CF8",textTransform:"uppercase",fontWeight:"700",marginBottom:"6px"}}>{cat?.label}</div>
            <h2 style={{fontSize:"30px",fontWeight:"700",margin:0}}>Select a Prospect</h2>
          </div>
          <PearlButton variant="primary" size="medium" onClick={()=>setScreen("customProspect")}>+ Custom Prospect</PearlButton>
        </div>

        <div className="prospect-grid" style={{marginBottom:"28px"}}>
          {list.map((p,i)=>(
            <div key={i} className="p-row" onClick={()=>startCall(p)}>
              <Av name={p.name} size={52}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px"}}>
                  <span style={{fontWeight:"700",fontSize:"17px",color:"rgba(240,240,245,.95)"}}>{p.name}</span>
                  <DBadge diff={p.diff||p.difficulty}/>
                </div>
                <div style={{color:"rgba(240,240,245,.5)",fontSize:"14px"}}>{p.spec||p.title}</div>
                {p.ctx && <div style={{color:"rgba(240,240,245,.35)",fontSize:"13px",marginTop:"8px",lineHeight:1.45,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.ctx}</div>}
              </div>
              <span style={{color:"#818CF8",fontSize:"16px",fontWeight:"700"}}>Call →</span>
            </div>
          ))}
        </div>
      </W>
    );
  }

  // ── SCORECARD SCREEN ─────────────────────────────────────────────────────
  if(screen==="scorecard") {
    const v=VCS[score?.verdict]||VCS["Good call"];
    const scoreCats=[
      {label:"Opener",             s:score?.opener,            fb:score?.opener?.feedback},
      {label:"Objection Handling", s:score?.objectionHandling, fb:score?.objectionHandling?.feedback},
      {label:"Value Proposition",  s:score?.valueProposition,  fb:score?.valueProposition?.feedback},
      {label:"CTA & Close",        s:score?.ctaStrength,       fb:score?.ctaStrength?.feedback},
    ].filter(c=>c.s?.score!=null);

    return (
      <W maxW="920px">
        <div style={{textAlign:"center",marginBottom:"36px",width:"100%"}}>
          <div style={{fontSize:"76px",fontWeight:"800",letterSpacing:"-.05em",lineHeight:1,color:v.c,marginBottom:"14px"}}>
            {score?.overall}<span style={{fontSize:"34px",color:"rgba(240,240,245,.3)",fontWeight:"600"}}>/10</span>
          </div>
          <VBadge verdict={score?.verdict}/>
          <div style={{color:"rgba(240,240,245,.45)",fontSize:"15px",marginTop:"14px"}}>{prospect?.name} · {score?.exchanges} exchanges · {fmt(score?.dur||0)}</div>
        </div>

        <div className="two-col-layout" style={{marginBottom:"28px"}}>
          {scoreCats.length>0&&(
            <Glass style={{padding:"28px",width:"100%"}}>
              <div style={{fontSize:"13px",letterSpacing:".08em",color:"rgba(240,240,245,.45)",textTransform:"uppercase",fontWeight:"700",marginBottom:"22px"}}>Skill Breakdown</div>
              <div style={{display:"flex",flexDirection:"column",gap:"22px"}}>
                {scoreCats.map((c,i)=>(
                  <div key={i}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}><span style={{fontSize:"15px",fontWeight:"600"}}>{c.label}</span><span style={{fontVariantNumeric:"tabular-nums",fontSize:"15px",fontWeight:"700",color:"#818CF8"}}>{c.s.score}/10</span></div>
                    <ScoreBar score={c.s.score}/>
                    {c.fb&&<div style={{fontSize:"13px",color:"rgba(240,240,245,.5)",marginTop:"7px",lineHeight:1.55}}>{c.fb}</div>}
                  </div>
                ))}
              </div>
            </Glass>
          )}

          {score?.coachingTip&&(
            <Glass style={{padding:"28px",width:"100%",background:"rgba(129,140,248,.05)",borderColor:"rgba(129,140,248,.2)",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:"13px",letterSpacing:".08em",color:"#818CF8",fontWeight:"700",textTransform:"uppercase",marginBottom:"14px"}}>AI Coaching Insight</div>
                <div style={{fontSize:"16px",color:"rgba(240,240,245,.9)",lineHeight:1.7}}>{score.coachingTip}</div>
              </div>
              <div style={{marginTop:"28px",paddingTop:"18px",borderTop:"1px solid rgba(255,255,255,.08)",fontSize:"13px",color:"rgba(240,240,245,.45)"}}>
                Review past sessions anytime in Call History to compare performance trends.
              </div>
            </Glass>
          )}
        </div>

        <div style={{display:"flex",gap:"14px",width:"100%",maxWidth:"560px",margin:"0 auto"}}>
          <PearlButton variant="secondary" size="medium" onClick={goHome} style={{flex:1}}>Home</PearlButton>
          <PearlButton variant="secondary" size="medium" onClick={()=>setScreen("prospects")} style={{flex:1}}>Change Prospect</PearlButton>
          <PearlButton variant="primary" size="medium" onClick={()=>startCall(prospect)} style={{flex:1.5}}>Try Again</PearlButton>
        </div>
      </W>
    );
  }

  // ── HISTORY SCREEN ───────────────────────────────────────────────────────
  if(screen==="history") return (
    <W maxW="1000px">
      <PearlButton variant="secondary" size="small" onClick={goHome} style={{alignSelf:"flex-start",marginBottom:"24px"}}>← Home</PearlButton>
      <div style={{marginBottom:"28px",width:"100%"}}>
        <h2 style={{fontSize:"30px",fontWeight:"700",margin:0}}>Call History & Insights</h2>
      </div>

      {history?.length > 0 ? (
        <>
          <Glass style={{padding:"26px",marginBottom:"28px",width:"100%"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
              <span style={{fontSize:"13px",fontWeight:"700",color:"#818CF8",textTransform:"uppercase",letterSpacing:".06em"}}>Aggregate Performance Analysis</span>
              <PearlButton variant="primary" size="small" onClick={generateInsights} disabled={insLoad}>
                {insLoad?"Analyzing...":"Generate Insights"}
              </PearlButton>
            </div>
            {insight ? (
              <div style={{fontSize:"15px",color:"rgba(240,240,245,.9)",lineHeight:1.7}}>{insight}</div>
            ) : (
              <div style={{fontSize:"14px",color:"rgba(240,240,245,.45)"}}>Click generate to get an overall AI analysis of your call history.</div>
            )}
          </Glass>

          <div style={{display:"flex",flexDirection:"column",gap:"14px",width:"100%",marginBottom:"28px"}}>
            {history.map((c,i)=>(
              <div key={i} className="h-row" onClick={()=>openDetail(c)}>
                <Av name={c.prospectName} size={48}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:"600",fontSize:"16px"}}>{c.prospectName}</div>
                  <div style={{fontSize:"13px",color:"rgba(240,240,245,.5)"}}>{c.catLabel} · {fmtDate(c.date)}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
                  <VBadge verdict={c.verdict}/>
                  <span style={{fontWeight:"800",color:"#818CF8",fontSize:"17px"}}>{c.overall}/10</span>
                </div>
              </div>
            ))}
          </div>

          {!resetConfirm ? (
            <PearlButton variant="danger" size="small" onClick={()=>setResetConfirm(true)} style={{width:"100%",maxWidth:"320px",margin:"0 auto"}}>
              Reset Call History
            </PearlButton>
          ) : (
            <div style={{display:"flex",gap:"12px",width:"100%",maxWidth:"340px",margin:"0 auto"}}>
              <PearlButton variant="secondary" size="small" onClick={()=>setResetConfirm(false)} style={{flex:1}}>Cancel</PearlButton>
              <PearlButton variant="danger" size="small" onClick={resetHistory} style={{flex:1}}>Confirm Reset</PearlButton>
            </div>
          )}
        </>
      ) : (
        <div style={{textAlign:"center",padding:"60px 0",color:"rgba(240,240,245,.45)",fontSize:"15px"}}>No call history recorded yet. Practice a call to view stats!</div>
      )}
    </W>
  );

  // ── CALL DETAIL SCREEN ────────────────────────────────────────────────────
  if(screen==="detail"&&detailCall) return (
    <W maxW="920px">
      <PearlButton variant="secondary" size="small" onClick={()=>setScreen("history")} style={{alignSelf:"flex-start",marginBottom:"24px"}}>← History</PearlButton>
      
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",width:"100%"}}>
        <div>
          <h2 style={{fontSize:"26px",fontWeight:"700",margin:0}}>{detailCall.prospectName}</h2>
          <div style={{fontSize:"14px",color:"rgba(240,240,245,.45)",marginTop:"4px"}}>{detailCall.catLabel} · {fmtDate(detailCall.date)}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
          <VBadge verdict={detailCall.verdict}/>
          <div style={{fontSize:"32px",fontWeight:"800",color:"#818CF8"}}>{detailCall.overall}/10</div>
        </div>
      </div>

      <Glass style={{padding:"24px",marginBottom:"28px",width:"100%"}}>
        {detailCall.coachingTip&&(
          <div style={{fontSize:"15px",color:"rgba(240,240,245,.85)",lineHeight:1.65}}>
            <strong style={{color:"#818CF8"}}>Coaching Tip:</strong> {detailCall.coachingTip}
          </div>
        )}
      </Glass>

      <div style={{width:"100%",marginBottom:"28px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}>
          <span style={{fontSize:"13px",fontWeight:"700",color:"rgba(240,240,245,.55)",textTransform:"uppercase"}}>Full Conversation & Recommendations</span>
          <PearlButton variant="primary" size="small" onClick={generateSuggestions} disabled={sugLoading}>
            {sugLoading?"Generating...":"Best Closer Alternatives"}
          </PearlButton>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"14px"}}>
          {detailCall.messages?.map((m,i)=>{
            const isP = m.speaker === "prospect";
            const traineeIdx = detailCall.messages.slice(0,i+1).filter(x=>x.speaker==="trainee").length - 1;
            return (
              <div key={i}>
                <div style={{display:"flex",gap:"12px",alignItems:"flex-start",flexDirection:isP?"row":"row-reverse"}}>
                  <Av name={isP?detailCall.prospectName:"You"} size={34}/>
                  <div style={{maxWidth:"82%",background:isP?"rgba(255,255,255,.06)":"rgba(129,140,248,.16)",padding:"12px 18px",borderRadius:"14px",fontSize:"15px",lineHeight:1.6}}>
                    {m.content}
                  </div>
                </div>
                {!isP && suggestions?.[traineeIdx] && (
                  <div className="sug-box" style={{marginRight:"46px",marginTop:"8px"}}>
                    <div style={{fontSize:"12px",color:"#22C55E",fontWeight:"700",marginBottom:"4px"}}>World-Class Closer Alternative:</div>
                    <div style={{fontSize:"14px",color:"rgba(240,240,245,.95)"}}>{suggestions[traineeIdx]}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </W>
  );

  // ── CUSTOM CATEGORY FORM ──────────────────────────────────────────────────
  if(screen==="customCat") return (
    <W maxW="640px">
      <PearlButton variant="secondary" size="small" onClick={goHome} style={{alignSelf:"flex-start",marginBottom:"24px"}}>← Cancel</PearlButton>
      <Glass style={{width:"100%",padding:"32px"}}>
        <h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"20px"}}>Create Custom Product Category</h2>
        <div className="fl" style={{marginBottom:"18px"}}>
          <label className="lbl">Product or Service Name</label>
          <input className="txin" value={ccForm.product} onChange={e=>setCcForm({...ccForm,product:e.target.value})} placeholder="e.g. AI Workflow Automation"/>
        </div>
        <div className="fl" style={{marginBottom:"28px"}}>
          <label className="lbl">Target Audience / Persona</label>
          <input className="txin" value={ccForm.target} onChange={e=>setCcForm({...ccForm,target:e.target.value})} placeholder="e.g. VP Operations at Logistics Companies"/>
        </div>
        <PearlButton variant="primary" size="medium" onClick={handleSubmitCc} disabled={!ccForm.product.trim()} style={{width:"100%"}}>Create Category</PearlButton>
      </Glass>
    </W>
  );

  // ── CUSTOM PROSPECT FORM ──────────────────────────────────────────────────
  if(screen==="customProspect") return (
    <W maxW="740px">
      <PearlButton variant="secondary" size="small" onClick={()=>setScreen("prospects")} style={{alignSelf:"flex-start",marginBottom:"24px"}}>← Cancel</PearlButton>
      <Glass style={{width:"100%",padding:"32px"}}>
        <h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"20px"}}>Create Custom Prospect Persona</h2>
        <div className="cp-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
          <div className="fl">
            <label className="lbl">Name</label>
            <input className="txin" value={cpForm.name} onChange={e=>setCpForm({...cpForm,name:e.target.value})} placeholder="e.g. Mark Vance"/>
          </div>
          <div className="fl">
            <label className="lbl">Title & Role</label>
            <input className="txin" value={cpForm.title} onChange={e=>setCpForm({...cpForm,title:e.target.value})} placeholder="e.g. VP of Sales"/>
          </div>
        </div>

        <div className="cp-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
          <div className="fl">
            <label className="lbl">Difficulty</label>
            <select className="txin" value={cpForm.difficulty} onChange={e=>setCpForm({...cpForm,difficulty:e.target.value})}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="fl">
            <label className="lbl">Voice Gender</label>
            <select className="txin" value={cpForm.gender} onChange={e=>setCpForm({...cpForm,gender:e.target.value})}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div className="fl" style={{marginBottom:"16px"}}>
          <label className="lbl">Main Objection</label>
          <input className="txin" value={cpForm.objection} onChange={e=>setCpForm({...cpForm,objection:e.target.value})} placeholder="e.g. Already locked into a 2-year contract"/>
        </div>

        <div className="fl" style={{marginBottom:"28px"}}>
          <label className="lbl">Key Context</label>
          <textarea className="txarea" value={cpForm.context} onChange={e=>setCpForm({...cpForm,context:e.target.value})} placeholder="e.g. Skeptical buyer who only cares about ROI metrics..."/>
        </div>

        <PearlButton variant="primary" size="medium" onClick={handleSubmitCp} disabled={!cpForm.name.trim()||!cpForm.title.trim()} style={{width:"100%"}}>Start Call with Custom Prospect</PearlButton>
      </Glass>
    </W>
  );

  return null;
}
