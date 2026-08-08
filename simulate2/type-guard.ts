import { Actor2, OwnerMaximal } from "../actor2";

export const participantIsActor = (d: OwnerMaximal | Actor2): d is Actor2 => 'owner' in d && 'health' in d && 'speed' in d