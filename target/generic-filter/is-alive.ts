import { GenericFilter } from "./types";

const isAlive: GenericFilter = (p) => {
    return p.health.curr > 0
}

export default isAlive