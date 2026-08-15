import { Actor2 } from "../../actor2";

// TRUE means that you CAN target something
// if it doesn't match up, flip the question

export type GenericFilter = (participant: Actor2) => boolean