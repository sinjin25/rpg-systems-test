import { OwnerMaximal } from "../../actor2";
import { instantiateClassLevels } from "../class-level/registry";
import { ClassLevels } from "../class-level/type";

export const resolveOwnerClass = (owner: OwnerMaximal, className: string): ClassLevels | undefined =>
    owner.cs.levels[className] ?? instantiateClassLevels(className)