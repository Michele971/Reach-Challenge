import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const stdlib = loadStdlib();

//setting the call for reach api
const call = async (f) => {
  let res = undefined;
  try {
    res = await f();
    console.log(`res`, res);
    return res;
  } catch (e) {
    res = [`err`, e]
    console.log(`res`, res);
    return false;
  }
};

const iBalance = stdlib.parseCurrency(2000);
const accAlice = await stdlib.newTestAccount(iBalance);
console.log("Hello Alice and Bob");
console.log("Launching ...");
const ctcAlice = accAlice.contract(backend);
console.log("starting backend ...");

const users = [];



const startsBob = async () => {
    let ctc = null;
    const newBob = async(who) => {
        const acc = await stdlib.newTestAccount(iBalance);
        ctc = acc.contract(backend, ctcAlice.getInfo());
    }

    const attachBob = async() =>{
         //setting the API 
         const bob_API = ctc.a.Bob;
         //calling the API
         await call(() => bob_API.attach());
    }

    for(var i = 1; i<7; i++){
        console.log("creating a new bob user ...")
        var nameBob = "bob"+i

        await newBob(nameBob);
        console.log(`Attaching ${nameBob}`);
        const result = await attachBob();
        await stdlib.wait(1);

        //inserting in the array only if bob is attached
        if (result){
            users.push(acc.getAddress());
        }
    }
    
    console.log(users);

}

//initialize interact using Reach stdlib
const interact = { ...stdlib.hasRandom }; 
//logging feature 
interact.log = async (...args) => {
    console.log(...args)
}; 

// await ctcAlice.p.Alice({ // old version
//     //Alice interact object
interact.ready = async () => {
    console.log("Alice is ready");
    startsBob();
}
// });

const part = backend.Alice;
await part(ctcAlice, interact);

console.log("Goodbye, Alice and Bob");



