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




// //calling getBalance() function
// const before = await getBalance(acc);
// console.log(`Your balance is: ${before}`);


// const commonInteract = {
//   reportPosition: (did,  proof_and_position) => console.log(`New position inserted \n DID: "${did}" \n proof_and_position: "${proof_and_position}"`),

// };

// //implement the functions to log inside the backend
// commonInteract.log = async (...args) => {
//   console.log(...args)
// };
// if (role === 'creator') { // ***** CREEATOR ******
//   const creatorInteract = {
//     ...commonInteract,
//   };
//   var did = await ask.ask(
//     `What is your DID?`,
//     (did => did)
//   );

//   const addrCreator = stdlib.formatAddress(acc.getAddress());

//   var proof_and_location_creator = getProof_Loc_Addr({
//     proof: String(proof_creator),
//     location: String(location_creator),
//     walletAddress: addrCreator
//   });

//   console.log(proof_and_location_creator)
//   creatorInteract.decentralized_identifier = did;
//   creatorInteract.position = proof_and_location_creator;
  



//   // await showBalance(acc);
//   //const ctc = acc.contract(backend); //OLD VERSION
//   ctc = acc.contract(backend); //creating the contract
//   ctc.getInfo().then((info) => {
//     console.log(`The contract is deployed as = ${JSON.stringify(info)}`); //display the id of the contract. It was "parse" not "stringify"
//   });



//   const part = backend.Creator;
//   await part(ctc, creatorInteract);
  
//   const afterCreator = await getBalance(acc);
//   console.log(`Your balance is: ${afterCreator}`);

// } else if (role == 'attacher'){ // ***** ATTACHER ******
//   const attacherInteract = {
//     ...commonInteract,
//   };


//   const acc = await stdlib.newTestAccount(iBalance);

//   //calling getBalance() function
//   const before = await getBalance(acc);
//   console.log(`Your balance is: ${before}`);

//   const info = await ask.ask(
//     `Please paste the contract information:`,
//     JSON.parse
//   );

//   ctc = acc.contract(backend, info);


//   const addrAttacher = stdlib.formatAddress(acc.getAddress());

// //   const attacher_api = ctc.a.attacherAPI;
  
// //   await call(() => attacher_api.insert_position(
// //         String(proof_and_location_attacher),
// //         String(did)
// //       )
// //     );


// }

