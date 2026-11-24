import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,createContext,runInContext} from 'node:vm';
const html=readFileSync(new URL('../rise-blueprint/index.html',import.meta.url),'utf8');
const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function context(){
 const ctx=createContext({localStorage:{getItem:()=>null},location:{href:'https://go.dentalclinichub.com/rise-blueprint?qa=1'},URLSearchParams});
 runInContext(code.replace(/render\(\);\s*$/,''),ctx);
 return ctx;
}
test('Rise identifiers, existing branding, video and valid JavaScript',()=>{
 new Script(code);
 assert.match(html,/AltaDent Growth/);
 assert.match(code,/altadent-rise-tf-v1/);
 assert.match(code,/proposal-builder-walkthrough-bnaf6ynm\/embed/);
 for(const stale of ['Iconic','Lana','Aura','Boxly','__VIDEO__','business@iconic'])assert.ok(!html.includes(stale),stale);
 assert.doesNotMatch(html,/[£€]|\$\d/);
 assert.match(html,/A starting point from your website/);
});
test('33 focused questions; only name and work email required; unknowns accepted',()=>{
 const ctx=context();
 assert.equal(runInContext('Q.length',ctx),35);
 assert.equal(runInContext('Q.filter(x=>x.id).length',ctx),33);
 assert.equal(runInContext('new Set(Q.filter(x=>x.id).map(x=>x.id)).size',ctx),33);
 assert.equal(runInContext('JSON.stringify(Q.filter(x=>x.req).map(x=>x.id))',ctx),'["Filled in by","Email"]');
 assert.equal(runInContext('Q[0].t',ctx),'welcome');
 assert.equal(runInContext('Q.at(-1).t',ctx),'end');
 assert.equal(runInContext('Q.at(-2).id',ctx),'Anything else');
 for(const topic of ['Waitlist','Migration','Systems','Integration owners','Booking rules','Clinical safety and escalation','Evening and weekend calling','Payment policies','Plan acceptance and aftercare','Reviews and recall','Reporting and tracking','Assets and access contacts'])assert.equal(runInContext(`Q.some(x=>x.id===${JSON.stringify(topic)})`,ctx),true,topic);
 assert.match(html,/No passwords|not patient information or passwords/);
 assert.match(html,/children and safeguarding/);
 assert.match(html,/medical urgency/);
 assert.match(html,/SMS is not in the proposed scope unless separately approved/);
});
test('bespoke-blueprint payload keeps practice, contact and notification schema',()=>{
 const ctx=context();
 runInContext(`state={'Filled in by':'QA Example','Email':'qa@example.invalid','Mobile':'','Go-live':'To confirm','Must-have features':['AI enquiry assistant'],'Services':['To confirm / add details'],'Service details':'Medical scope to confirm','Starting point__edits':{'0':'Launch date to confirm'},'Anything we missed':'Phased launch'};`,ctx);
 const p=JSON.parse(runInContext('JSON.stringify(payload())',ctx));
 assert.equal(p.practice,'Rise Dental & Medical');assert.equal(p.source,'bespoke-blueprint');assert.equal(p.final,true);
 assert.equal(p.name,'QA Example');assert.equal(p.email,'qa@example.invalid');assert.deepEqual(p.must_haves,['AI enquiry assistant']);
 assert.equal(p.page,'https://go.dentalclinichub.com/rise-blueprint');assert.ok(!isNaN(Date.parse(p.sent_at)));
 assert.equal(Object.keys(p.answers).length,33);assert.equal(Object.keys(p.sections.Answers).length,33);
 assert.match(p.answers['Starting point'],/Launch date to confirm/);assert.match(p.answers['Starting point'],/Missed: Phased launch/);
 assert.match(p.answers.Services,/Medical scope to confirm/);assert.equal(p.answers.Mobile,'(skipped)');
 assert.equal(p.answers['Go-live'],'To confirm');
});
test('same endpoint and local autosave, recap edit and resume remain in shell',()=>{
 const base=readFileSync(new URL('../iconic-blueprint/index.html',import.meta.url),'utf8');
 assert.equal(code.match(/const HOOK = (.*);/)[1],base.match(/const HOOK = (.*);/)[1]);
 for(const bit of ['localStorage.setItem(KEY','Continue where you left off','data-c="ed"','state._at','mode:"no-cors"','source:"bespoke-blueprint"'])assert.ok(code.includes(bit),bit);
});
