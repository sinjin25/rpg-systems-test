import { leaf } from "../../log2";
import { makeWrapper } from "../instance";

const mod = 2

const bless = makeWrapper({
    displayName: 'Bless',
    broadContexts: {
        'attack-status-mod': () => leaf('Bless', mod),
    },
})

export default bless
