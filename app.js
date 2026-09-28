const routine={0:[["Weekly reset","Review the week ahead"],["GO / Rest","Keep the day open"]],1:[["Strength · 30 min","Session 1 of 3"]],2:[["Walk","Walking day"],["Create · 15 min","Play"]],3:[["Strength · 30 min","Session 2 of 3"]],4:[["Walk","Walking day"],["Create · 30 min","Make something"]],5:[["Strength · 30 min","Session 3 of 3"]],6:[["GO","Free day — get out and do something"]]};
const names=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const packing={"Work gear":["Camera","Camera batteries","Battery charger","Memory cards","Tripod","Microphone","Microphone cables/accessories","Phone","Power bank","Charging cables","Laptop / tablet if needed","Work credentials","Event-specific work gear"],"Work clothing":["Work tops","Work bottoms","Undergarments","Socks","Cushioned work shoes","Indoor layer"],"Off-duty":["Relaxing clothes","Sleepwear","Travel-home outfit","Arch-support comfy shoes"],"Coffee + food":["Coffee press","Coffee beans","Water kettle","Mug","Healthy snacks","Oatmeal / breakfast","Reusable water bottle","Utensils"],"Personal":["Toiletries","Medications / supplements","Personal chargers"],"Recovery":["Foot / body recovery items"],"Last-minute":["Phone","Daily medications","Refrigerated food","Water bottle","Coffee items still in use"]};
const gear=["Camera","Charged battery","Spare battery","Memory card","Microphone","Tripod"];
const get=(k,d)=>JSON.parse(localStorage.getItem(k)??JSON.stringify(d)),set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function weekKey(){let d=new Date(),x=new Date(d),day=(d.getDay()+6)%7;x.setDate(d.getDate()-day);return x.toISOString().slice(0,10)} function logs(){return get("logs-"+weekKey(),[])}
function addLog(o){let l=logs();l.push({...o,date:new Date().toISOString()});set("logs-"+weekKey(),l);render()}
function logActivity(type,minutes){addLog({type,minutes:minutes||null})} function logCreate(kind,minutes){addLog({type:"art",kind,minutes})}
function counts(){let l=logs();return{strength:l.filter(x=>x.type==="strength").length,walk:l.filter(x=>x.type==="walk").length,play:l.some(x=>x.type==="art"&&x.kind==="play"),create:l.some(x=>x.type==="art"&&x.kind==="create")}}
function undoLast(){let l=logs();if(!l.length)return alert("Nothing to undo this week.");l.pop();set("logs-"+weekKey(),l);render()}
function editPriority(){let k="priority-"+new Date().toDateString(),v=prompt("What is the #1 thing that matters today?",get(k,""));if(v!==null){set(k,v.trim());render()}}

function todayKey(){return new Date().toDateString()}
function plannedToday(){
  let d=new Date(), trip=get("tripMode",false);
  return trip?[["Tournament / travel","Work + recovery"],["Packing / gear","Check what you need next"]]:routine[d.getDay()];
}
function choosePriority(v){
  set("priority-"+todayKey(),v);
  document.querySelectorAll("#priorityChoices button").forEach(b=>b.classList.toggle("chosen",b.dataset.value===v));
  priorityText.textContent=v;
}
function customPriority(){
  let v=prompt("What matters most today?",get("priority-"+todayKey(),""));
  if(v!==null && v.trim()){set("priority-"+todayKey(),v.trim());renderCheckin();priorityText.textContent=v.trim()}
}
function completeCheckin(){
  let p=get("priority-"+todayKey(),"");
  if(!p){alert("Choose your #1 thing for today first.");return}
  set("checkin-"+todayKey(),{done:true,time:new Date().toISOString()});
  renderCheckin();
}
function reopenCheckin(){set("checkin-"+todayKey(),{done:false});renderCheckin()}
function renderCheckin(){
  let done=get("checkin-"+todayKey(),{}).done||false;
  let tasks=plannedToday(), priority=get("priority-"+todayKey(),"");
  checkinPlan.textContent=(new Date().getDay()>0&&new Date().getDay()<6?"Work 8:30 AM–12:30 PM. ":"")+tasks.map(x=>x[0]).join(" · ")+".";
  let opts=tasks.map(x=>x[0]);
  if(new Date().getDay()>0&&new Date().getDay()<6) opts.unshift("Work");
  priorityChoices.innerHTML=[...new Set(opts)].map(v=>`<button data-value="${v.replace(/"/g,'&quot;')}" class="${priority===v?'chosen':''}" onclick="choosePriority(this.dataset.value)">${v}</button>`).join("");
  morningCheckin.classList.toggle("hidden",done);
  dayDashboard.classList.toggle("hidden",!done);
  let c=get("checkin-"+todayKey(),{});
  checkinStatus.textContent=done?`Checked in ${new Date(c.time).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}. #1: ${priority}`:"Ready when you are.";
}

function render(){let d=new Date(),trip=get("tripMode",false),k="priority-"+d.toDateString();dateLabel.textContent=d.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});modePill.textContent=trip?"TOURNAMENT":"NORMAL";tripToggle.checked=trip;todayTitle.textContent=trip?"Tournament mode":"Your day";workLine.textContent=(d.getDay()>0&&d.getDay()<6)?"Work · 8:30 AM–12:30 PM":"No regular work block";priorityText.textContent=get(k,"")||"Choose what matters most today.";let tasks=trip?[["Tournament / travel","Work + recovery; normal routine is paused"],["Packing / gear","Check what you need next"]]:routine[d.getDay()];todayTasks.innerHTML=tasks.map((t,i)=>`<div class="card task"><input type="checkbox" ${get("task-"+d.toDateString()+"-"+i,false)?"checked":""} onchange="set('task-${d.toDateString()}-${i}',this.checked)"><div><strong>${t[0]}</strong><p class="muted">${t[1]}</p></div></div>`).join("");let c=counts();strengthCount.textContent=`${Math.min(c.strength,3)}/3`;walkCount.textContent=`${Math.min(c.walk,2)}/2`;createCount.textContent=`${(c.play?1:0)+(c.create?1:0)}/2`;artDetail.textContent=`Play 15 ${c.play?"✓":"○"}   ·   Create 30 ${c.create?"✓":"○"}`;renderPacking();renderGo();loadTrip();renderCheckin()}
function renderPacking(){let s=get("packing",{});packingList.innerHTML=Object.entries(packing).map(([g,items])=>`<div class="card packgroup"><h3>${g}</h3>${items.map(item=>{let k=g+"|"+item;return `<label class="packitem"><input type="checkbox" ${s[k]?"checked":""} onchange="packCheck('${encodeURIComponent(k)}',this.checked)"><span>${item}</span></label>`}).join("")}</div>`).join("");gearCheck.innerHTML=gear.map(x=>{let k="gear|"+x;return `<label class="packitem"><input type="checkbox" ${s[k]?"checked":""} onchange="packCheck('${encodeURIComponent(k)}',this.checked)"><span>${x}</span></label>`}).join("")}
function packCheck(e,v){let k=decodeURIComponent(e),s=get("packing",{});s[k]=v;set("packing",s)} function resetPacking(){if(confirm("Clear all packed items and gear checks?")){set("packing",{});renderPacking()}}
function toggleTrip(){set("tripMode",tripToggle.checked);render()} function saveTrip(){set("tripDetails",{depart:departDate.value,nights:nights.value,workdays:workdays.value})} function loadTrip(){let t=get("tripDetails",{depart:"",nights:2,workdays:2});departDate.value=t.depart;nights.value=t.nights;workdays.value=t.workdays}
function saveGo(){let n=goNote.value.trim();if(!n)return;let g=get("goLog",[]);g.unshift({note:n,date:new Date().toISOString()});set("goLog",g);goNote.value="";renderGo()}
function renderGo(){let g=get("goLog",[]).slice(0,8);goHistory.innerHTML=g.length?g.map(x=>`<div class="history"><strong>${x.note}</strong><div class="muted">${new Date(x.date).toLocaleDateString()}</div></div>`).join(""):'<p class="muted">Nothing logged yet.</p>'}
function showWeek(){weekPreview.innerHTML=names.map((n,i)=>`<div class="weekline"><strong>${n}</strong><span>${routine[i].map(x=>x[0]).join(" · ")}</span></div>`).join("")}
function showView(id){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));document.querySelectorAll("nav button").forEach(x=>x.classList.toggle("selected",x.dataset.view===id));document.getElementById(id).classList.add("active")}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>showView(b.dataset.view));if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").then(r=>r.update());render();