import { storage, logging } from "near-runtime-ts";

export function incrementParticipation(): void {
  let newCounter = storage.getPrimitive<i32>("counter", 0) + 1;
  storage.set<i32>("counter", newCounter);
  logging.log("We added another NEAR participant. That's now " + newCounter.toString());
}

export function getTotal(): i32 {
  return storage.getPrimitive<i32>("counter", 0);
}

export function resetTotal(): void {
  storage.set<i32>("counter", 0);
  logging.log("We've not reset participation total.")
}