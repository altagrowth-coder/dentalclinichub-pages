import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const html=readFileSync(new URL('../iconic-blueprint/index.html',import.meta.url),'utf8');
test('valid JavaScript and bespoke identifiers',()=>{
 const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 new Script(code);
 assert.match(code,/practice:"Iconic Dent Norwich"/);
 assert.match(code,/altadent-iconic-tf-v1/);
 for(const old of ['Aura','Dhiren','Paresh','Sketch','__VIDEO__'])assert.ok(!html.includes(old),old);
});
test('walkthrough and full journey are included',()=>{
 assert.match(html,/clinic-proposal-blueprint-walkthrough-ecchbn2q\/embed/);
 for(const topic of ['Boxly migration','Evening and weekend calling','AI rules','Aftercare check-ins','Patient referrals','Membership and recall'])assert.ok(html.includes(topic),topic);
 assert.match(html,/business@iconicdent.co.uk/);
 assert.match(html,/source:"bespoke-blueprint"/);
});
