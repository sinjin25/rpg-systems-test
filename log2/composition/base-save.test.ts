import { describe, test, expect } from 'vitest'
import baseSave from './base-save'
import { createDefaultOwner } from '../../actor2'

describe('base-save', () => {
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
        expect(node.displayName).toBe('base-fortitude')
    })
})
