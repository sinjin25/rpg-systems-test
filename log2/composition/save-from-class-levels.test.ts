import { describe, test, expect } from 'vitest'
import baseSave from './save-from-class-levels'
import { createDefaultOwner } from '../../actor2'
import modNodeToText from '../format'

describe('save-from-class-levels', () => {
    test('fortitude: one child per class, summed over acquired levels', () => {
        const owner = createDefaultOwner({
            cs: {
                levels: [{
                    freeFeats: [],
                    key: 'rogue'
                }, {
                    freeFeats: [],
                    key: 'fighter',
                }],
            },
        })
        const node = baseSave(owner, 'fortitude')
        expect(node.total()).toBe(1) // Fighter +1
        expect(node.children.map(c => `${c.displayName} ${c.total()}`)).toEqual(['rogue 0', 'fighter 1'])
        expect(node.displayName).toBe('class-fortitude')

        console.log(modNodeToText(node))
    })
})
