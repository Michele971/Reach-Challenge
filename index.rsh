'reach 0.1';
'use strict';


export const main = Reach.App(() => {
  const A = Participant('Alice', {
    ready: Fun([], Null),
    ...hasConsoleLogger,
  });

  const Bob = API('Bob',{
    attach: Fun([], Bool),
  });

  init();
  
  A.only(() => {
    interact.ready();
  })
  A.publish();
  commit();


  A.publish();


  const [count, keepgoing] = 
  parallelReduce([0, true]) 
    .invariant(balance() == balance()) // invariant: the condition inside must be true for the all time that the while goes on
    .while(keepgoing)
    .api(Bob.attach, // the name of the api that is called 
      (y) => { // the code to execute and the returning variable of the api (y)
        if(count == 5){ //this is the 6 element, we start counting from 0
          A.interact.log("You cannot attach. There maximun number has been reached.")
          y(false)
          return [count, true]; // NOTE: You can set keepgoing to True if you want to terminate the smart contract. It was not required for this level
        }else{
          const counter = count + 1;
          A.interact.log("The counter has been increased");
          y(true);
          return [counter, true];  // the returning of the API for the parallel reduce necessary to update the initial variable 
        }

      }
    )

    
    // avoid the error "balance zero at application exit"
    transfer(balance()).to(A)
    commit();
    exit();
    
   


});
