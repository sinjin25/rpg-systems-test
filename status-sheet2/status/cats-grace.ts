import { leaf } from "../../log2";
import { makeWrapper } from "../instance";

const mod = 4

const catsGrace = makeWrapper({
    displayName: 'cats-grace',
    broadContexts: {
        'dex-from-status': (owner) => leaf('cats-grace', mod),
    },
})

export default catsGrace
