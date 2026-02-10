import { useState, useEffect, useRef, useReducer, useCallback, useMemo, createContext, useContext } from "react";

const T={bg0:"#06060e",bg1:"#0a0a14",bg2:"#0e0e1c",bg3:"#14142a",bg4:"#1a1a36",hover:"rgba(255,255,255,0.04)",active:"rgba(255,255,255,0.07)",brd:"rgba(255,255,255,0.06)",brdL:"rgba(255,255,255,0.1)",txt:"#d0d0e8",mut:"#666688",fnt:"#444466",acc:"#00ffd5",accD:"rgba(0,255,213,0.15)",red:"#ff4466",warn:"#ffaa00",grn:"#44ff88",pink:"#ff6bfa",ff:"'Outfit',sans-serif",mono:"'JetBrains Mono',monospace"};
const ST={online:{c:"#44ff88",l:"Online"},idle:{c:"#ffaa00",l:"Idle"},dnd:{c:"#ff4466",l:"Do Not Disturb"},offline:{c:"#555577",l:"Offline"}};
const uid=()=>Math.random().toString(36).slice(2,12)+Date.now().toString(36);
const fmt=d=>d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
const fmtDate=d=>{const n=new Date(),df=n-d;if(df<864e5&&d.getDate()===n.getDate())return"Today";if(df<1728e5)return"Yesterday";return d.toLocaleDateString([],{month:"short",day:"numeric"})};
const fmtSize=b=>b<1024?b+" B":b<1048576?(b/1024).toFixed(1)+" KB":(b/1048576).toFixed(1)+" MB";

const ME={id:"u1",name:"Velle",avatar:"V",status:"online",color:"#00ffd5",bio:"Building the future, one pixel at a time."};
const USERS=[ME,{id:"u2",name:"Nyx",avatar:"N",status:"online",color:"#ff6bfa",bio:"Code witch. Night owl."},{id:"u3",name:"Kai",avatar:"K",status:"idle",color:"#ffd000",bio:"Hardware hacker & coffee addict."},{id:"u4",name:"Zero",avatar:"Z",status:"dnd",color:"#ff4466",bio:"In the zone."},{id:"u5",name:"Echo",avatar:"E",status:"offline",color:"#8888bb",bio:"Exploring the void."},{id:"u6",name:"Pixel",avatar:"P",status:"online",color:"#44ffaa",bio:"Pixel artist & game dev."},{id:"u7",name:"Drift",avatar:"D",status:"idle",color:"#ff9944",bio:"IoT enthusiast."}];
const UM=Object.fromEntries(USERS.map(u=>[u.id,u]));
const SERVERS=[{id:"s1",name:"VELLEVERSE",icon:"⚡",color:"#00ffd5",mids:USERS.map(u=>u.id),cats:[{name:"GENERAL",chs:[{id:"c1",name:"welcome",type:"text",topic:"Say hello!",ur:0},{id:"c2",name:"general",type:"text",topic:"General discussion",ur:3},{id:"c3",name:"off-topic",type:"text",topic:"Anything goes",ur:0}]},{name:"DEV",chs:[{id:"c4",name:"projects",type:"text",topic:"Share builds",ur:7},{id:"c5",name:"code-review",type:"text",topic:"Get feedback",ur:0},{id:"c6",name:"dev-talk",type:"voice",ur:0}]},{name:"MEDIA",chs:[{id:"c7",name:"screenshots",type:"text",topic:"Show off",ur:2},{id:"c8",name:"music-lounge",type:"voice",ur:0}]}]},{id:"s2",name:"Cyber Lounge",icon:"🌃",color:"#ff6bfa",mids:["u1","u2","u4","u7"],cats:[{name:"LOBBY",chs:[{id:"c9",name:"chat",type:"text",topic:"Welcome",ur:12},{id:"c10",name:"memes",type:"text",topic:"Shitposts",ur:0}]},{name:"GAMING",chs:[{id:"c11",name:"lfg",type:"text",topic:"Looking for group",ur:1},{id:"c12",name:"game-night",type:"voice",ur:0}]}]},{id:"s3",name:"Maker Space",icon:"🔧",color:"#ffd000",mids:["u1","u3","u6","u7"],cats:[{name:"HARDWARE",chs:[{id:"c13",name:"raspberry-pi",type:"text",topic:"Pi projects",ur:5},{id:"c14",name:"sensors",type:"text",topic:"Sensor modules",ur:0}]},{name:"SOFTWARE",chs:[{id:"c15",name:"web-dev",type:"text",topic:"Web tech",ur:0},{id:"c16",name:"game-dev",type:"text",topic:"Game dev",ur:3}]}]}];
const DMS=[{id:"dm1",uid:"u2",last:"Check out this new shader I made",ur:2},{id:"dm2",uid:"u3",last:"The sensor arrived today!",ur:0},{id:"dm3",uid:"u6",last:"Collab on the pixel art tool?",ur:1}];
const mk=(u,c,a)=>({id:uid(),userId:u,content:c,ts:new Date(Date.now()-a)});
const SEED={c2:[mk("u3","Anyone watching the new cyberpunk anime?",72e5),mk("u6","The animation quality is insane",7e6),mk("u2","Reminds me of Blade Runner 2049",68e5),mk("u1","Hard agree. Neon aesthetics are chef's kiss",36e5),mk("u4","Check the portfolio site I'm building",18e5),mk("u3","Drop the link 👀",9e5)],c4:[mk("u1","Pushed the alarm clock dashboard with weather integration",144e5),mk("u2","Does it pull from an open API?",14e6),mk("u1","OpenWeather for forecasts, CoinGecko for crypto",138e5),mk("u6","Sick. Add air quality index too?",108e5),mk("u7","Working on a similar IoT dashboard, let's collab",72e5),mk("u1","Absolutely, let's sync in voice later",36e5),mk("u3","Count me in, got sensor modules to contribute",18e5)],c9:[mk("u4","This lounge has the best vibes",36e6),mk("u7","Games tonight?",144e5),mk("u2","I'm down. What are we playing?",108e5)],c13:[mk("u1","Got the Miuzei 4-inch touchscreen working on the Pi",5e7),mk("u3","What was the trick? Struggling with orientation",48e6),mk("u1","dtoverlay settings + recalibrate touch after rotation",46e6),mk("u6","Bookmarking. Just ordered the same screen",4e7),mk("u7","Pro tip: check vendor overlay name, they vary",2e7)],dm1:[mk("u2","CRT shader effect is amazing",72e5),mk("u1","Thanks! Tweaked scanline intensity forever",6e6),mk("u2","Check out this new shader I made",18e5)],dm2:[mk("u3","The sensor arrived today!",72e5),mk("u1","Which one did you get?",7e6),mk("u3","BME680 — temp, humidity, pressure, AND gas",68e5)],dm3:[mk("u6","Want to collab on the pixel art tool?",864e5)]};
const BOTS=["Solid approach, have you tried WebSockets?","Just deployed — zero errors 🎉","The docs are surprisingly good","Refactored the module, 3x faster now","Hot take: Rust is the future","Firmware update fixed everything","Debugging at 2am hits different","Pi cluster is finally stable","New mech keyboard. Productivity +200%","That PR looks clean, approved 👍","Memory leak in prod... fun times","Shipped! Only 3 cups of coffee","Can someone review my PR?","Latency is killing me today","New VS Code update is wild"];
const Ctx=createContext(null);

function init(){const msgs={};SERVERS.forEach(s=>s.cats.forEach(c=>c.chs.forEach(ch=>msgs[ch.id]=SEED[ch.id]||[])));DMS.forEach(d=>msgs[d.id]=SEED[d.id]||[]);return{view:"server",srv:"s1",ch:"c2",dm:null,msgs,showMem:true,showSet:false,showSearch:false,profile:null,status:"online",pins:new Set(),sidebar:true,voice:null,muted:false,deaf:false,ctxMenu:null,editing:null,reply:null,mobileSb:false}}
function red(s,a){switch(a.type){
case"MSG":return{...s,msgs:{...s.msgs,[a.ch]:[...(s.msgs[a.ch]||[]),a.msg]},reply:null,editing:null};
case"EDIT_MSG":{const ms=(s.msgs[a.ch]||[]).map(m=>m.id===a.mid?{...m,content:a.content,edited:true}:m);return{...s,msgs:{...s.msgs,[a.ch]:ms},editing:null}}
case"DEL_MSG":return{...s,msgs:{...s.msgs,[a.ch]:(s.msgs[a.ch]||[]).filter(m=>m.id!==a.mid)}};
case"CH":return{...s,ch:a.ch,srv:a.srv,view:"server",reply:null,editing:null,mobileSb:false};
case"DM":return{...s,dm:a.dm,view:"dms",reply:null,editing:null,mobileSb:false};
case"VIEW":return{...s,view:a.v,mobileSb:false};
case"T_MEM":return{...s,showMem:!s.showMem};case"T_SET":return{...s,showSet:!s.showSet};
case"T_SEARCH":return{...s,showSearch:!s.showSearch};
case"PROFILE":return{...s,profile:a.uid};case"C_PROFILE":return{...s,profile:null};
case"STATUS":return{...s,status:a.st};
case"REACT":{const{ch,mid,emoji}=a;const ms=(s.msgs[ch]||[]).map(m=>{if(m.id!==mid)return m;const r={...(m.reactions||{})};const us=new Set(r[emoji]?.users||[]);if(us.has(ME.id))us.delete(ME.id);else us.add(ME.id);if(!us.size)delete r[emoji];else r[emoji]={count:us.size,users:[...us]};return{...m,reactions:r}});return{...s,msgs:{...s.msgs,[ch]:ms}}}
case"PIN":{const p=new Set(s.pins);p.has(a.mid)?p.delete(a.mid):p.add(a.mid);return{...s,pins:p}}
case"T_SB":return{...s,sidebar:!s.sidebar};
case"VOICE":return{...s,voice:a.ch,muted:false,deaf:false};case"LEAVE_V":return{...s,voice:null};
case"T_MUTE":return{...s,muted:!s.muted};case"T_DEAF":return{...s,deaf:!s.deaf,muted:!s.deaf||s.muted};
case"CTX":return{...s,ctxMenu:a.m};case"EDIT":return{...s,editing:a.mid};
case"REPLY":return{...s,reply:a.d};case"C_REPLY":return{...s,reply:null};case"C_EDIT":return{...s,editing:null};
case"T_MOB":return{...s,mobileSb:!s.mobileSb};
default:return s}}

// Icons
const IC={
Hash:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
Vol:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>,
Mic:({s=16,c="currentColor",off})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>{off&&<line x1="1" y1="1" x2="23" y2="23" stroke={T.red}/>}</svg>,
Head:({s=16,c="currentColor",off})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>{off&&<line x1="1" y1="1" x2="23" y2="23" stroke={T.red}/>}</svg>,
Phone:({s=16,c=T.red})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72"/></svg>,
Search:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
Gear:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-2.82 1.18V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1.08-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1.08H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1.08 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1.08H21a2 2 0 010 4h-.09"/></svg>,
Users:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
Pin:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="12" y1="17" x2="12" y2="22"/><path d="M5 17h14v-1.76a2 2 0 00-1.11-1.79l-1.78-.89A2 2 0 0115 10.76V6h1a2 2 0 000-4H8a2 2 0 000 4h1v4.76a2 2 0 01-1.11 1.79l-1.78.89A2 2 0 005 15.24z"/></svg>,
Plus:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
Send:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
X:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
Reply:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 00-4-4H4"/></svg>,
Edit:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
Trash:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
File:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>,
Menu:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
Chev:({s=12,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
Msg:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
Smile:({s=16,c="currentColor"})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
};

// Helpers
function Av({user:u,size:sz=36,status:st=true,onClick:oc}){return<div onClick={oc} tabIndex={oc?0:undefined} style={{width:sz,height:sz,minWidth:sz,borderRadius:"50%",background:`linear-gradient(135deg,${u.color}30,${u.color}10)`,border:`2px solid ${u.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.mono,fontWeight:700,fontSize:sz*.38,color:u.color,position:"relative",flexShrink:0,cursor:oc?"pointer":"default",userSelect:"none"}} onKeyDown={oc?e=>e.key==="Enter"&&oc(e):undefined}>{u.avatar}{st&&<div style={{position:"absolute",bottom:-1,right:-1,width:Math.max(sz*.28,8),height:Math.max(sz*.28,8),borderRadius:"50%",background:ST[u.status]?.c||ST.offline.c,border:`2.5px solid ${T.bg1}`}}/>}</div>}
function Tip({text:t,children:ch}){const[s,set]=useState(false);return<div style={{position:"relative",display:"inline-flex"}} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)}>{ch}{s&&<div style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",background:T.bg0,border:`1px solid ${T.brdL}`,borderRadius:6,padding:"6px 10px",fontSize:12,color:T.txt,whiteSpace:"nowrap",zIndex:999,pointerEvents:"none",fontWeight:500,boxShadow:"0 4px 16px rgba(0,0,0,.4)"}}>{t}</div>}</div>}
function IBtn({icon:Ic,label:lb,onClick:oc,active:ac,danger:dg,size:sz=18,badge:bd}){const[h,set]=useState(false);return<Tip text={lb}><button aria-label={lb} onClick={oc} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)} style={{background:ac?T.active:h?T.hover:"transparent",border:"none",borderRadius:6,padding:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",color:dg?T.red:ac?T.txt:T.mut,transition:"all .15s"}}><Ic s={sz}/>{bd>0&&<span style={{position:"absolute",top:-2,right:-2,background:T.red,color:"#fff",fontSize:9,fontWeight:700,minWidth:14,height:14,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",border:`2px solid ${T.bg2}`}}>{bd}</span>}</button></Tip>}
function Badge({n}){if(!n)return null;return<span style={{background:T.red,color:"#fff",fontSize:10,fontWeight:700,minWidth:16,height:16,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{n>99?"99+":n}</span>}

// Server Bar
function ServerBar(){const{state:s,dispatch:d}=useContext(Ctx);const dmUr=DMS.reduce((a,dm)=>a+(dm.ur||0),0);
return<nav style={{width:68,minWidth:68,background:T.bg0,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 0",borderRight:`1px solid ${T.brd}`,overflowY:"auto",flexShrink:0,zIndex:30}} aria-label="Servers">
  <Tip text="Direct Messages"><div role="button" tabIndex={0} onClick={()=>d({type:"VIEW",v:"dms"})} style={{width:44,height:44,borderRadius:s.view==="dms"?14:22,background:s.view==="dms"?T.accD:T.bg3,color:s.view==="dms"?T.acc:T.mut,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginBottom:4,position:"relative",transition:"all .2s"}}><IC.Msg s={20}/>{dmUr>0&&<span style={{position:"absolute",bottom:-2,right:-2,background:T.red,color:"#fff",fontSize:9,fontWeight:700,minWidth:14,height:14,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${T.bg0}`}}>{dmUr}</span>}</div></Tip>
  <div style={{width:32,height:2,background:T.brd,margin:"6px auto",borderRadius:1}}/>
  {SERVERS.map(sv=>{const act=s.view==="server"&&sv.id===s.srv,ur=sv.cats.reduce((a,c)=>a+c.chs.reduce((b,ch)=>b+(ch.ur||0),0),0);
    return<Tip key={sv.id} text={sv.name}><div style={{position:"relative",marginBottom:4}}>
      {act&&<div style={{position:"absolute",left:-4,top:"50%",transform:"translateY(-50%)",width:4,height:28,background:"#fff",borderRadius:"0 4px 4px 0"}}/>}
      <div role="button" tabIndex={0} onClick={()=>{const f=sv.cats[0]?.chs.find(c=>c.type==="text");d({type:"CH",srv:sv.id,ch:f?.id})}}
        style={{width:44,height:44,borderRadius:act?14:22,background:act?`${sv.color}18`:T.bg3,border:`2px solid ${act?sv.color:"transparent"}`,color:sv.color,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:20,transition:"all .2s"}}>{sv.icon}</div>
      {ur>0&&!act&&<span style={{position:"absolute",bottom:-2,right:-2,background:T.red,color:"#fff",fontSize:9,fontWeight:700,minWidth:14,height:14,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${T.bg0}`}}>{ur}</span>}
    </div></Tip>})}
  <div style={{flex:1}}/>
  <Tip text="Add Server"><div style={{width:44,height:44,borderRadius:22,background:"transparent",color:T.grn,border:`2px dashed ${T.grn}44`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><IC.Plus s={20}/></div></Tip>
</nav>}

// Channel Sidebar
function ChSidebar(){const{state:s,dispatch:d}=useContext(Ctx);const sv=SERVERS.find(x=>x.id===s.srv)||SERVERS[0];const[col,setCol]=useState({});
if(s.view==="dms")return<DMSb/>;
return<aside style={{width:232,minWidth:232,background:T.bg2,display:"flex",flexDirection:"column",borderRight:`1px solid ${T.brd}`,flexShrink:0,zIndex:20}} aria-label="Channels">
  <div style={{padding:"14px 14px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.brd}`,cursor:"pointer"}}><span style={{color:sv.color,fontWeight:800,letterSpacing:.5,fontSize:14,fontFamily:T.mono}}>{sv.name}</span><IC.Chev s={14} c={T.fnt}/></div>
  <div style={{flex:1,overflowY:"auto",padding:"6px 0"}}>{sv.cats.map(cat=>{const ic=col[cat.name];return<div key={cat.name} style={{marginBottom:8}}>
    <button onClick={()=>setCol(p=>({...p,[cat.name]:!p[cat.name]}))} style={{display:"flex",alignItems:"center",padding:"0 14px",marginBottom:2,fontSize:10,fontWeight:700,letterSpacing:1.5,color:T.fnt,cursor:"pointer",background:"none",border:"none",fontFamily:T.ff,width:"100%"}}>
      <span style={{display:"inline-block",transition:"transform .15s",transform:ic?"rotate(-90deg)":"rotate(0)",marginRight:4}}><IC.Chev s={10}/></span>{cat.name}</button>
    {!ic&&cat.chs.map(ch=>{const isA=ch.id===s.ch,isV=ch.type==="voice",inV=s.voice===ch.id;
      return<div key={ch.id}><button onClick={()=>isV?d({type:inV?"LEAVE_V":"VOICE",ch:ch.id}):d({type:"CH",srv:sv.id,ch:ch.id})}
        style={{display:"flex",alignItems:"center",padding:"6px 12px",fontSize:13,cursor:"pointer",borderRadius:5,margin:"1px 6px",background:isA?T.active:"transparent",color:isA?"#fff":ch.ur>0?T.txt:T.mut,fontWeight:ch.ur>0?600:400,border:"none",fontFamily:T.ff,width:"calc(100% - 12px)",textAlign:"left",transition:"background .1s"}}>
        {isV?<IC.Vol s={16} c={inV?T.grn:undefined}/>:<IC.Hash s={16}/>}<span style={{marginLeft:6,flex:1}}>{ch.name}</span>{ch.ur>0&&<Badge n={ch.ur}/>}</button>
        {inV&&<div style={{padding:"2px 12px 6px 38px"}}><div style={{fontSize:11,color:T.grn,fontWeight:600,marginBottom:4}}>Voice Connected</div>
          {USERS.filter(u=>u.status==="online").slice(0,3).map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:6,padding:"2px 0",fontSize:12,color:T.mut}}><Av user={u} size={18} status={false}/>{u.name}</div>)}</div>}
      </div>})}</div>})}</div>
  {s.voice&&<VBar/>}<UPnl/>
</aside>}

function DMSb(){const{state:s,dispatch:d}=useContext(Ctx);
return<aside style={{width:232,minWidth:232,background:T.bg2,display:"flex",flexDirection:"column",borderRight:`1px solid ${T.brd}`,flexShrink:0}} aria-label="DMs">
  <div style={{padding:"14px 14px 12px",borderBottom:`1px solid ${T.brd}`}}><span style={{fontWeight:700,fontSize:14,color:T.txt}}>Direct Messages</span></div>
  <div style={{padding:8}}><button style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 10px",borderRadius:5,background:T.bg0,border:"none",color:T.fnt,fontSize:12,cursor:"pointer",fontFamily:T.ff}}><IC.Search s={14} c={T.fnt}/>Find or start a conversation</button></div>
  <div style={{flex:1,overflowY:"auto",padding:"0 6px"}}>{DMS.map(dm=>{const u=UM[dm.uid],isA=s.dm===dm.id;
    return<button key={dm.id} onClick={()=>d({type:"DM",dm:dm.id})} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:5,margin:"1px 0",background:isA?T.active:"transparent",border:"none",width:"100%",cursor:"pointer",fontFamily:T.ff,textAlign:"left"}}>
      <Av user={u} size={32}/><div style={{flex:1,minWidth:0}}><div style={{color:isA?"#fff":T.txt,fontWeight:500,fontSize:13}}>{u.name}</div><div style={{color:T.fnt,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dm.last}</div></div>{dm.ur>0&&<Badge n={dm.ur}/>}</button>})}</div>
  {s.voice&&<VBar/>}<UPnl/>
</aside>}

function VBar(){const{state:s,dispatch:d}=useContext(Ctx);const ch=SERVERS.flatMap(sv=>sv.cats.flatMap(c=>c.chs)).find(c=>c.id===s.voice);if(!ch)return null;
return<div style={{display:"flex",alignItems:"center",padding:"8px 10px",background:T.bg0,borderTop:`1px solid ${T.brd}`,borderBottom:`1px solid ${T.brd}`,gap:8}}>
  <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:700,color:T.grn}}>Voice Connected</div><div style={{fontSize:11,color:T.mut,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.name}</div></div>
  <div style={{display:"flex",gap:2}}><IBtn icon={p=><IC.Mic {...p} off={s.muted}/>} label="Mute" onClick={()=>d({type:"T_MUTE"})} active={s.muted}/><IBtn icon={p=><IC.Head {...p} off={s.deaf}/>} label="Deafen" onClick={()=>d({type:"T_DEAF"})} active={s.deaf}/><IBtn icon={IC.Phone} label="Disconnect" onClick={()=>d({type:"LEAVE_V"})} danger/></div></div>}

function UPnl(){const{state:s,dispatch:d}=useContext(Ctx);const u={...ME,status:s.status};
return<div style={{display:"flex",alignItems:"center",padding:"8px 10px",background:T.bg0,borderTop:`1px solid ${T.brd}`,flexShrink:0}}>
  <Av user={u} size={32} onClick={()=>d({type:"PROFILE",uid:u.id})}/><div style={{flex:1,minWidth:0,marginLeft:8}}><div style={{color:u.color,fontSize:12,fontWeight:700,fontFamily:T.mono}}>{u.name}</div><div style={{color:T.fnt,fontSize:10}}>{ST[u.status]?.l}</div></div>
  <div style={{display:"flex",gap:2}}><IBtn icon={p=><IC.Mic {...p} off={s.muted}/>} label="Mute" onClick={()=>d({type:"T_MUTE"})} size={16}/><IBtn icon={IC.Gear} label="Settings" onClick={()=>d({type:"T_SET"})} size={16}/></div></div>}

// Chat Area
function ChatMain(){const{state:s,dispatch:d}=useContext(Ctx);const mob=typeof window!=="undefined"&&window.innerWidth<768;
const isDM=s.view==="dms";let chId,chName,chTopic;
if(isDM){const dm=DMS.find(x=>x.id===s.dm);if(!dm)return<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:T.bg1}}><div style={{textAlign:"center",color:T.mut}}><div style={{fontSize:48,marginBottom:16,opacity:.3}}>💬</div><div style={{fontSize:16}}>Select a conversation</div></div></div>;const u=UM[dm.uid];chId=dm.id;chName=u.name;chTopic=u.bio}
else{const sv=SERVERS.find(x=>x.id===s.srv)||SERVERS[0];const all=sv.cats.flatMap(c=>c.chs);const ch=all.find(c=>c.id===s.ch&&c.type==="text")||all.find(c=>c.type==="text");if(!ch)return<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:T.bg1,color:T.mut}}>Select a text channel</div>;chId=ch.id;chName=ch.name;chTopic=ch.topic}
const msgs=s.msgs[chId]||[];
return<main style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,background:T.bg1}}>
  <header style={{display:"flex",alignItems:"center",padding:"10px 12px",borderBottom:`1px solid ${T.brd}`,background:T.bg1,flexShrink:0,gap:4,minHeight:48}}>
    <IBtn icon={s.sidebar?(()=><span style={{fontSize:14,fontWeight:700,color:T.mut}}>◀</span>):IC.Menu} label="Toggle sidebar" onClick={()=>d({type:mob?"T_MOB":"T_SB"})} size={16}/>
    <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:4}}>{isDM?<IC.Msg s={18} c={T.mut}/>:<IC.Hash s={18} c={T.mut}/>}<span style={{fontWeight:700,color:"#fff",fontSize:15}}>{chName}</span></div>
    {chTopic&&<><div style={{width:1,height:20,background:T.brd,margin:"0 12px"}}/><span style={{color:T.fnt,fontSize:13,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{chTopic}</span></>}
    <div style={{display:"flex",gap:2,marginLeft:"auto"}}><IBtn icon={IC.Pin} label="Pins" onClick={()=>{}} badge={s.pins.size}/><IBtn icon={IC.Search} label="Search" onClick={()=>d({type:"T_SEARCH"})} active={s.showSearch}/>{!isDM&&<IBtn icon={IC.Users} label="Members" onClick={()=>d({type:"T_MEM"})} active={s.showMem}/>}</div>
  </header>
  <MsgList msgs={msgs} chId={chId}/>
  <MsgInput chId={chId} chName={chName} isDM={isDM}/>
</main>}

function MsgList({msgs,chId}){const{state:s}=useContext(Ctx);const btm=useRef(null),list=useRef(null);const[autoS,setAS]=useState(true);
useEffect(()=>{if(autoS)btm.current?.scrollIntoView({behavior:"smooth"})},[msgs.length,autoS]);
const groups=useMemo(()=>{const g=[];let ld="";for(const m of msgs){const dt=fmtDate(m.ts);if(dt!==ld){g.push({t:"d",date:dt});ld=dt}g.push({t:"m",msg:m})}return g},[msgs]);
return<div ref={list} style={{flex:1,overflowY:"auto"}} onScroll={()=>{const el=list.current;if(el)setAS(el.scrollHeight-el.scrollTop-el.clientHeight<100)}} role="log">
  <div style={{padding:"32px 16px 8px"}}><div style={{width:56,height:56,borderRadius:28,background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:12}}><IC.Hash s={28} c={T.mut}/></div><h2 style={{fontSize:22,fontWeight:800,color:"#fff",margin:"0 0 4px"}}>Welcome!</h2><p style={{color:T.mut,fontSize:13}}>This is the beginning of this conversation.</p></div>
  {groups.map((item,i)=>{if(item.t==="d")return<div key={`d${i}`} style={{display:"flex",alignItems:"center",padding:"16px 16px 4px",gap:8}}><div style={{flex:1,height:1,background:T.brd}}/><span style={{fontSize:11,fontWeight:600,color:T.mut,fontFamily:T.mono}}>{item.date}</span><div style={{flex:1,height:1,background:T.brd}}/></div>;
    const m=item.msg,u=UM[m.userId]||ME,own=m.userId===ME.id,pin=s.pins.has(m.id);
    const pi=msgs.indexOf(m)-1,prev=pi>=0?msgs[pi]:null,compact=prev&&prev.userId===m.userId&&(m.ts-prev.ts)<3e5;
    if(s.editing===m.id)return<EditMsg key={m.id} msg={m} chId={chId}/>;
    return<MsgItem key={m.id} m={m} u={u} chId={chId} own={own} pin={pin} compact={compact}/>})}
  {!autoS&&<button style={{position:"sticky",bottom:8,background:T.acc,color:T.bg0,border:"none",borderRadius:20,padding:"6px 16px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:T.ff,display:"block",margin:"0 auto",boxShadow:"0 4px 12px rgba(0,255,213,.3)"}} onClick={()=>{btm.current?.scrollIntoView({behavior:"smooth"});setAS(true)}}>↓ New messages</button>}
  <div ref={btm}/></div>}

function MsgItem({m,u,chId,own,pin,compact}){const{state:s,dispatch:d}=useContext(Ctx);const[hov,setH]=useState(false),[emo,setEmo]=useState(false);
const emojis=["👍","🔥","💜","😂","🚀","👀","❤️","🎉"];
const reply=m.replyTo?(s.msgs[chId]||[]).find(x=>x.id===m.replyTo):null;const rU=reply?UM[reply.userId]||ME:null;
return<div style={{display:"flex",flexDirection:"column",padding:compact?"1px 48px 1px 16px":"8px 48px 8px 16px",position:"relative",transition:"background .1s",background:hov?T.hover:pin?"rgba(255,213,0,.03)":"transparent",borderLeft:pin?`2px solid ${T.warn}44`:"2px solid transparent"}}
  onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setEmo(false)}}
  onContextMenu={e=>{e.preventDefault();d({type:"CTX",m:{x:e.clientX,y:e.clientY,d:{msg:m,chId,own}}})}} role="article">
  {reply&&<div style={{display:"flex",alignItems:"center",gap:6,marginLeft:50,marginBottom:4}}><IC.Reply s={12} c={T.fnt}/><Av user={rU} size={14} status={false}/><span style={{color:rU.color,fontSize:11,fontWeight:600}}>{rU.name}</span><span style={{color:T.fnt,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{reply.content.slice(0,80)}</span></div>}
  <div style={{display:"flex",gap:12}}>
    {!compact?<Av user={u} size={38} status={false} onClick={()=>d({type:"PROFILE",uid:u.id})}/>:<div style={{width:38,minWidth:38,display:"flex",alignItems:"center",justifyContent:"center"}}>{hov&&<span style={{fontSize:10,color:T.fnt,fontFamily:T.mono}}>{fmt(m.ts)}</span>}</div>}
    <div style={{flex:1,minWidth:0}}>
      {!compact&&<div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap",marginBottom:2}}><span style={{color:u.color,fontWeight:700,fontSize:14,fontFamily:T.mono,cursor:"pointer"}} onClick={()=>d({type:"PROFILE",uid:u.id})}>{u.name}</span><time style={{color:T.fnt,fontSize:11,fontFamily:T.mono}}>{fmt(m.ts)}</time>{pin&&<span style={{fontSize:10,color:T.warn}}>📌</span>}{m.edited&&<span style={{fontSize:10,color:T.fnt}}>(edited)</span>}</div>}
      <div style={{color:T.txt,fontSize:14,lineHeight:1.55,wordBreak:"break-word"}}>{m.content}</div>
      {m.file&&<div style={{display:"flex",alignItems:"center",gap:10,background:T.bg3,border:`1px solid ${T.brd}`,borderRadius:8,padding:"10px 14px",maxWidth:400,marginTop:4}}><IC.File s={24} c={T.acc}/><div><div style={{color:T.acc,fontSize:13,fontWeight:600}}>{m.file.name}</div><div style={{color:T.fnt,fontSize:11}}>{fmtSize(m.file.size)}</div></div></div>}
      {m.reactions&&Object.keys(m.reactions).length>0&&<div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>{Object.entries(m.reactions).map(([em,data])=>{const mine=data.users?.includes(ME.id);return<button key={em} style={{background:mine?T.accD:"rgba(255,255,255,.05)",border:`1px solid ${mine?T.acc+"44":T.brd}`,borderRadius:10,padding:"2px 8px",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",fontFamily:T.ff}} onClick={()=>d({type:"REACT",ch:chId,mid:m.id,emoji:em})}>{em}<span style={{marginLeft:3,fontFamily:T.mono,fontSize:11}}>{data.count}</span></button>})}</div>}
    </div></div>
  {hov&&<div style={{position:"absolute",top:-4,right:12,display:"flex",gap:1,background:T.bg3,borderRadius:6,border:`1px solid ${T.brdL}`,padding:2,zIndex:5,boxShadow:"0 4px 12px rgba(0,0,0,.3)"}}>
    <IBtn icon={IC.Smile} label="React" onClick={()=>setEmo(p=>!p)} size={16}/><IBtn icon={IC.Reply} label="Reply" onClick={()=>d({type:"REPLY",d:{chId,messageId:m.id}})} size={16}/>{own&&<IBtn icon={IC.Edit} label="Edit" onClick={()=>d({type:"EDIT",mid:m.id})} size={16}/>}<IBtn icon={IC.Pin} label={pin?"Unpin":"Pin"} onClick={()=>d({type:"PIN",mid:m.id})} size={16}/>{own&&<IBtn icon={IC.Trash} label="Delete" onClick={()=>d({type:"DEL_MSG",ch:chId,mid:m.id})} danger size={16}/>}</div>}
  {emo&&<div style={{position:"absolute",top:36,right:12,display:"flex",gap:2,background:T.bg3,borderRadius:8,border:`1px solid ${T.brdL}`,padding:6,zIndex:10,boxShadow:"0 8px 24px rgba(0,0,0,.4)",flexWrap:"wrap",width:200}}>{emojis.map(e=><button key={e} style={{padding:"4px 6px",cursor:"pointer",borderRadius:4,fontSize:20,background:"none",border:"none"}} onClick={()=>{d({type:"REACT",ch:chId,mid:m.id,emoji:e});setEmo(false)}}>{e}</button>)}</div>}
</div>}

function EditMsg({msg:m,chId}){const{dispatch:d}=useContext(Ctx);const[v,setV]=useState(m.content);const ref=useRef(null);useEffect(()=>ref.current?.focus(),[]);
const save=()=>{if(v.trim()&&v.trim()!==m.content)d({type:"EDIT_MSG",ch:chId,mid:m.id,content:v.trim()});else d({type:"C_EDIT"})};
return<div style={{padding:"8px 48px 8px 66px"}}><input ref={ref} value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")save();if(e.key==="Escape")d({type:"C_EDIT"})}} style={{width:"100%",background:T.bg3,border:`1px solid ${T.brdL}`,borderRadius:6,padding:"8px 12px",color:T.txt,fontSize:14,fontFamily:T.ff}}/>
<div style={{fontSize:11,color:T.fnt,marginTop:4}}>escape to <button style={{background:"none",border:"none",color:T.acc,cursor:"pointer",fontSize:11,padding:0,textDecoration:"underline"}} onClick={()=>d({type:"C_EDIT"})}>cancel</button> • enter to <button style={{background:"none",border:"none",color:T.acc,cursor:"pointer",fontSize:11,padding:0,textDecoration:"underline"}} onClick={save}>save</button></div></div>}

function MsgInput({chId,chName,isDM}){const{state:s,dispatch:d}=useContext(Ctx);const[inp,setInp]=useState(""),[typing,setTyp]=useState(null),[files,setFiles]=useState([]);
const iRef=useRef(null),fRef=useRef(null);useEffect(()=>iRef.current?.focus(),[chId]);
const reply=s.reply?.chId===chId?(s.msgs[chId]||[]).find(m=>m.id===s.reply.messageId):null;const rU=reply?UM[reply.userId]||ME:null;
const send=useCallback(()=>{const txt=inp.trim();if(!txt&&!files.length)return;
  d({type:"MSG",ch:chId,msg:{id:uid(),userId:ME.id,content:txt,ts:new Date(),...(reply&&{replyTo:reply.id}),...(files.length&&{file:{name:files[0].name,size:files[0].size,type:files[0].type}})}});
  setInp("");setFiles([]);
  const who=USERS.filter(u=>u.id!==ME.id&&u.status!=="offline")[Math.floor(Math.random()*4)];
  if(who){setTyp(who.name);setTimeout(()=>{setTyp(null);d({type:"MSG",ch:chId,msg:{id:uid(),userId:who.id,content:BOTS[Math.floor(Math.random()*BOTS.length)],ts:new Date()}})},1200+Math.random()*2e3)}
},[inp,files,chId,reply,d]);
return<div style={{padding:"0 16px 12px",flexShrink:0}}>
  {reply&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:T.bg3,borderRadius:"8px 8px 0 0",border:`1px solid ${T.brd}`,borderBottom:"none"}}><IC.Reply s={14} c={T.fnt}/><span style={{color:T.mut,fontSize:12}}>Replying to</span><span style={{color:rU.color,fontSize:12,fontWeight:600}}>{rU.name}</span><div style={{flex:1}}/><button style={{background:"none",border:"none",cursor:"pointer",color:T.mut,padding:4}} onClick={()=>d({type:"C_REPLY"})}><IC.X s={14}/></button></div>}
  {files.length>0&&<div style={{display:"flex",gap:8,padding:"8px 12px",background:T.bg3,borderRadius:reply?"0":"8px 8px 0 0",border:`1px solid ${T.brd}`,borderBottom:"none",flexWrap:"wrap"}}>{files.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,background:T.bg4,borderRadius:6,padding:"4px 8px"}}><IC.File s={14} c={T.acc}/><span style={{fontSize:12,color:T.txt}}>{f.name}</span><button style={{background:"none",border:"none",cursor:"pointer",color:T.mut,padding:2}} onClick={()=>setFiles(files.filter((_,j)=>j!==i))}><IC.X s={12}/></button></div>)}</div>}
  <div style={{display:"flex",alignItems:"center",background:T.bg3,borderRadius:reply||files.length?"0 0 8px 8px":8,border:`1px solid ${T.brd}`,padding:"0 4px"}}>
    <input type="file" ref={fRef} style={{display:"none"}} multiple onChange={e=>setFiles([...e.target.files].slice(0,5))}/>
    <IBtn icon={IC.Plus} label="Attach" onClick={()=>fRef.current?.click()} size={18}/>
    <input ref={iRef} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder={isDM?`Message @${chName}`:`Message #${chName}`} style={{flex:1,background:"transparent",border:"none",color:T.txt,fontSize:14,padding:"12px 8px",fontFamily:T.ff,minWidth:0}} aria-label="Message input"/>
    <IBtn icon={IC.Smile} label="Emoji" onClick={()=>{}} size={18}/>
    <div style={{width:1,height:20,background:T.brd,margin:"0 2px"}}/>
    <IBtn icon={IC.Send} label="Send" onClick={send} size={18} active={!!inp.trim()||files.length>0}/>
  </div>
  {typing&&<div style={{padding:"4px 12px 2px",fontSize:11,color:T.mut}}><span className="td" style={{fontSize:8,display:"inline-block",animation:"typingBounce 1s infinite"}}>●</span><span className="td" style={{fontSize:8,display:"inline-block",animation:"typingBounce 1s infinite",animationDelay:".15s"}}>●</span><span className="td" style={{fontSize:8,display:"inline-block",animation:"typingBounce 1s infinite",animationDelay:".3s"}}>●</span> <strong>{typing}</strong> is typing…</div>}
</div>}

// Members Panel
function MemPanel(){const{state:s,dispatch:d}=useContext(Ctx);if(!s.showMem||s.view==="dms")return null;
const sv=SERVERS.find(x=>x.id===s.srv)||SERVERS[0];const mems=sv.mids.map(id=>UM[id]).filter(Boolean);
const grp={online:[],idle:[],dnd:[],offline:[]};mems.forEach(u=>(grp[u.status]||grp.offline).push(u));
return<aside style={{width:224,minWidth:224,background:T.bg2,borderLeft:`1px solid ${T.brd}`,overflowY:"auto",flexShrink:0}} aria-label="Members">
  <div style={{padding:"14px 14px 6px",fontWeight:700,fontSize:11,letterSpacing:1.5,color:T.mut}}>MEMBERS — {mems.length}</div>
  {Object.entries(grp).filter(([,u])=>u.length).map(([st,users])=><div key={st}>
    <div style={{padding:"12px 14px 4px",fontSize:10,fontWeight:700,letterSpacing:1.5,color:ST[st].c,textTransform:"uppercase"}}>{ST[st].l} — {users.length}</div>
    {users.map(u=><button key={u.id} onClick={()=>d({type:"PROFILE",uid:u.id})} style={{display:"flex",alignItems:"center",padding:"6px 12px",cursor:"pointer",borderRadius:5,margin:"1px 6px",background:"none",border:"none",width:"calc(100% - 12px)",fontFamily:T.ff}}>
      <Av user={u} size={30}/><span style={{marginLeft:8,color:u.status==="offline"?T.fnt:T.txt,fontWeight:500,fontSize:13}}>{u.name}</span></button>)}</div>)}
</aside>}

// Search Panel
function SearchPanel(){const{state:s,dispatch:d}=useContext(Ctx);const[q,setQ]=useState("");const ref=useRef(null);
useEffect(()=>ref.current?.focus(),[]);if(!s.showSearch)return null;
const results=[];if(q.length>=2){const ql=q.toLowerCase();Object.entries(s.msgs).forEach(([chId,ms])=>ms.forEach(m=>{if(m.content.toLowerCase().includes(ql))results.push({...m,chId})}))}
return<div style={{position:"absolute",top:48,right:0,width:420,maxWidth:"100vw",height:"calc(100% - 48px)",background:T.bg2,borderLeft:`1px solid ${T.brd}`,display:"flex",flexDirection:"column",zIndex:40,boxShadow:"-4px 0 20px rgba(0,0,0,.3)"}}>
  <div style={{padding:12}}><div style={{display:"flex",alignItems:"center",gap:8,background:T.bg0,borderRadius:6,padding:"8px 12px",border:`1px solid ${T.brd}`}}>
    <IC.Search s={16} c={T.fnt}/><input ref={ref} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search messages…" style={{flex:1,background:"transparent",border:"none",color:T.txt,fontSize:14,fontFamily:T.ff}}/>{q&&<button style={{background:"none",border:"none",cursor:"pointer",color:T.mut,padding:4}} onClick={()=>setQ("")}><IC.X s={14}/></button>}</div></div>
  <div style={{flex:1,overflowY:"auto",padding:"0 12px 12px"}}>
    {!results.length&&q.length>=2&&<div style={{padding:20,textAlign:"center",color:T.mut,fontSize:13}}>No results</div>}
    {results.slice(0,25).map(r=>{const u=UM[r.userId]||ME;return<div key={r.id} style={{padding:"10px 12px",borderRadius:6,border:`1px solid ${T.brd}`,marginBottom:6,cursor:"pointer"}}>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><Av user={u} size={18} status={false}/><span style={{color:u.color,fontSize:12,fontWeight:600}}>{u.name}</span><span style={{color:T.fnt,fontSize:10}}>{fmt(r.ts)}</span></div>
      <div style={{fontSize:13,color:T.txt,lineHeight:1.4}}>{r.content}</div></div>})}
  </div></div>}

// Profile Card
function ProfileCard(){const{state:s,dispatch:d}=useContext(Ctx);if(!s.profile)return null;const u=UM[s.profile];if(!u)return null;
return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)"}} onClick={()=>d({type:"C_PROFILE"})}>
  <div style={{background:T.bg2,borderRadius:12,border:`1px solid ${T.brdL}`,width:340,maxWidth:"90vw",overflow:"hidden",animation:"modalIn .2s ease",boxShadow:"0 16px 48px rgba(0,0,0,.5)"}} onClick={e=>e.stopPropagation()}>
    <div style={{height:60,background:`linear-gradient(135deg,${u.color}40,${u.color}10)`,borderRadius:"12px 12px 0 0"}}/>
    <div style={{padding:"0 20px 20px",marginTop:-28}}>
      <Av user={u} size={56}/><h2 style={{color:u.color,fontSize:20,fontWeight:800,fontFamily:T.mono,margin:"10px 0 2px"}}>{u.name}</h2>
      <div style={{color:T.mut,fontSize:12,marginBottom:12}}><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:ST[u.status]?.c,marginRight:6}}/>{ST[u.status]?.l}</div>
      <div style={{height:1,background:T.brd,margin:"12px 0"}}/>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:T.mut,marginBottom:6}}>ABOUT ME</div>
      <div style={{fontSize:13,color:T.txt,lineHeight:1.5}}>{u.bio}</div>
      {u.id!==ME.id&&<button onClick={()=>{const dm=DMS.find(x=>x.uid===u.id);if(dm)d({type:"DM",dm:dm.id});d({type:"C_PROFILE"})}} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"10px 16px",borderRadius:6,background:T.acc,color:T.bg0,fontWeight:700,fontSize:13,cursor:"pointer",border:"none",fontFamily:T.ff,marginTop:16}}><IC.Msg s={14}/>Send Message</button>}
    </div></div></div>}

// Settings Modal
function SettingsModal(){const{state:s,dispatch:d}=useContext(Ctx);const[tab,setTab]=useState("account");if(!s.showSet)return null;
const Toggle=({def=true})=>{const[on,set]=useState(def);return<button onClick={()=>set(p=>!p)} style={{width:40,height:22,borderRadius:11,background:on?`${T.acc}55`:T.bg3,cursor:"pointer",position:"relative",transition:"background .2s",border:"none",padding:0}}><div style={{width:16,height:16,borderRadius:"50%",background:on?T.acc:T.mut,position:"absolute",top:3,left:on?21:3,transition:"left .2s, background .2s"}}/></button>};
const Row=({l,v})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.brd}`,fontSize:13}}><span style={{color:T.mut}}>{l}</span>{v}</div>;
return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)"}} onClick={()=>d({type:"T_SET"})}>
  <div style={{background:T.bg2,borderRadius:12,border:`1px solid ${T.brdL}`,width:680,maxWidth:"95vw",maxHeight:"85vh",display:"flex",overflow:"hidden",animation:"modalIn .2s ease",boxShadow:"0 16px 48px rgba(0,0,0,.5)"}} onClick={e=>e.stopPropagation()}>
    <div style={{width:180,minWidth:180,background:T.bg0,padding:12,display:"flex",flexDirection:"column",gap:2,borderRight:`1px solid ${T.brd}`}}>
      {["account","appearance","notifications","keybinds"].map(t=><button key={t} onClick={()=>setTab(t)} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 12px",borderRadius:5,fontSize:13,fontWeight:500,cursor:"pointer",border:"none",fontFamily:T.ff,background:tab===t?T.active:"transparent",color:tab===t?"#fff":T.mut,transition:"background .1s",textTransform:"capitalize"}}>{t}</button>)}
      <div style={{flex:1}}/><div style={{height:1,background:T.brd,margin:"8px 0"}}/><button onClick={()=>d({type:"T_SET"})} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 12px",borderRadius:5,fontSize:13,cursor:"pointer",border:"none",fontFamily:T.ff,background:"transparent",color:T.red}}>Close</button>
    </div>
    <div style={{flex:1,padding:28,overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><h2 style={{color:"#fff",margin:0,fontSize:20,fontWeight:800,textTransform:"capitalize"}}>{tab}</h2><button style={{background:"none",border:"none",cursor:"pointer",color:T.mut,padding:4}} onClick={()=>d({type:"T_SET"})}><IC.X s={18}/></button></div>
      {tab==="account"&&<><div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:T.mut,marginBottom:12}}>STATUS</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:24}}>{Object.entries(ST).map(([k,v])=><button key={k} onClick={()=>d({type:"STATUS",st:k})} style={{background:s.status===k?`${v.c}20`:"transparent",border:`2px solid ${v.c}`,borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:T.mono,display:"flex",alignItems:"center",color:v.c}}><span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:v.c,marginRight:6}}/>{v.l}</button>)}</div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:T.mut,marginBottom:12}}>PROFILE</div><Row l="Username" v={<span style={{color:T.acc,fontFamily:T.mono}}>{ME.name}</span>}/><Row l="User ID" v={<span style={{fontFamily:T.mono,fontSize:11}}>{ME.id}</span>}/></>}
      {tab==="appearance"&&<><div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:T.mut,marginBottom:12}}>THEME</div><Row l="Theme" v="Midnight Neon"/><Row l="Density" v="Cozy"/><Row l="Font Scale" v="100%"/></>}
      {tab==="notifications"&&<><div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:T.mut,marginBottom:12}}>NOTIFICATIONS</div><Row l="Desktop Notifications" v={<Toggle/>}/><Row l="Message Sounds" v={<Toggle def={false}/>}/><Row l="Unread Badge" v={<Toggle/>}/></>}
      {tab==="keybinds"&&<><div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:T.mut,marginBottom:12}}>KEYBOARD SHORTCUTS</div>{[["Toggle Members","Ctrl+M"],["Toggle Sidebar","Ctrl+B"],["Search","Ctrl+K"],["Settings","Ctrl+,"],["Navigate","Alt+↑/↓"]].map(([l,k])=><Row key={l} l={l} v={<span style={{display:"flex",gap:4}}>{k.split("+").map(x=><kbd key={x} style={{background:T.bg0,border:`1px solid ${T.brdL}`,borderRadius:4,padding:"2px 7px",fontSize:11,fontFamily:T.mono,color:T.mut}}>{x}</kbd>)}</span>}/>)}</>}
    </div></div></div>}

// Context Menu
function CtxMenu(){const{state:s,dispatch:d}=useContext(Ctx);const ref=useRef(null);
useEffect(()=>{if(!s.ctxMenu)return;const h=e=>{if(ref.current&&!ref.current.contains(e.target))d({type:"CTX",m:null})};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h)},[s.ctxMenu,d]);
if(!s.ctxMenu)return null;const{x,y,d:data}=s.ctxMenu;
const acts=[{l:"Reply",ic:IC.Reply,fn:()=>d({type:"REPLY",d:{chId:data.chId,messageId:data.msg.id}})},{l:"React",ic:IC.Smile,fn:()=>{}},{l:s.pins.has(data.msg.id)?"Unpin":"Pin",ic:IC.Pin,fn:()=>d({type:"PIN",mid:data.msg.id})}];
if(data.own)acts.push({l:"Edit",ic:IC.Edit,fn:()=>d({type:"EDIT",mid:data.msg.id})},{sep:true},{l:"Delete",ic:IC.Trash,dg:true,fn:()=>d({type:"DEL_MSG",ch:data.chId,mid:data.msg.id})});
const cx=Math.min(x,window.innerWidth-210),cy=Math.min(y,window.innerHeight-acts.length*36-20);
return<div ref={ref} style={{position:"fixed",left:cx,top:cy,background:T.bg0,border:`1px solid ${T.brdL}`,borderRadius:8,padding:6,zIndex:200,minWidth:180,boxShadow:"0 8px 24px rgba(0,0,0,.5)"}} role="menu">
  {acts.map((a,i)=>a.sep?<div key={i} style={{height:1,background:T.brd,margin:"4px 0"}}/>:<button key={i} onClick={()=>{a.fn();d({type:"CTX",m:null})}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"8px 10px",borderRadius:4,fontSize:13,cursor:"pointer",border:"none",background:"none",fontFamily:T.ff,color:a.dg?T.red:T.txt,textAlign:"left"}} role="menuitem"><a.ic s={14} c={a.dg?T.red:T.mut}/>{a.l}</button>)}</div>}

// Main App
export default function NexusChat(){
  const[state,dispatch]=useReducer(red,null,init);
  const ctx=useMemo(()=>({state,dispatch}),[state]);
  useEffect(()=>{const h=e=>{if(e.ctrlKey||e.metaKey){switch(e.key){case"m":e.preventDefault();dispatch({type:"T_MEM"});break;case"b":e.preventDefault();dispatch({type:"T_SB"});break;case"k":e.preventDefault();dispatch({type:"T_SEARCH"});break;case",":e.preventDefault();dispatch({type:"T_SET"});break}}
    if(e.key==="Escape"){if(state.showSet)dispatch({type:"T_SET"});else if(state.showSearch)dispatch({type:"T_SEARCH"});else if(state.profile)dispatch({type:"C_PROFILE"});else if(state.ctxMenu)dispatch({type:"CTX",m:null});else if(state.editing)dispatch({type:"C_EDIT"});else if(state.reply)dispatch({type:"C_REPLY"})}};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h)},[state.showSet,state.showSearch,state.profile,state.ctxMenu,state.editing,state.reply]);
  const mob=typeof window!=="undefined"&&window.innerWidth<768;
  const showSb=mob?state.mobileSb:state.sidebar;
  return<Ctx.Provider value={ctx}><div style={{display:"flex",height:"100vh",width:"100vw",background:T.bg1,fontFamily:T.ff,color:T.txt,overflow:"hidden",position:"relative"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}html,body,#root{height:100%;overflow:hidden}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:3px}::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.15)}::selection{background:${T.acc}33;color:#fff}input::placeholder{color:${T.fnt}}input:focus,button:focus-visible{outline:2px solid ${T.acc}44;outline-offset:2px}button:focus:not(:focus-visible){outline:none}@keyframes typingBounce{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-4px);opacity:1}}@keyframes modalIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}`}</style>
    <ServerBar/>{showSb&&<ChSidebar/>}{mob&&state.mobileSb&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:15}} onClick={()=>dispatch({type:"T_MOB"})}/>}<ChatMain/>{!mob&&<MemPanel/>}<SearchPanel/><SettingsModal/><ProfileCard/><CtxMenu/>
  </div></Ctx.Provider>}
