// available class: near, context, storage, logging, base58, base64, 
// PersistentMap, PersistentVector, PersistentDeque, PersistentTopN, ContractPromise, math
// import { TextMessage } from "./model";
import { storage, logging } from "near-runtime-ts";


// export function getColor(): i32 {
//   return storage.getPrimitive<i32>("color", 19);
// }
//
// export function changeColor(color: i32): void {
//   storage.set<i32>("color", color)
//   logging.log("Set color to " + color.toString())
// }

export function incrementParticipation(): void {
  let newCounter = storage.getPrimitive<i32>("counter", 0) + 1;
  storage.set<i32>("counter", newCounter);
  logging.log("We added another NEAR participant. That's now " + newCounter.toString());
  // if (newCounter % totalSlides == 0) {
  //   logging.log('First (or one of first) to reach ' + newCounter.toString());
  // } else {
  // }
}

export function getTotal(): i32 {
  return storage.getPrimitive<i32>("counter", 0);
}

export function resetTotal(): void {
  storage.set<i32>("counter", 0);
  logging.log("We've not reset participation total.")
}