import { createDefaultOwner } from '../../defaults.ts'
import csFromEquipment from './csFromEquipment.ts'
import { describe, test, assert, expect } from 'vitest'

describe('cs-from-equipment', () => {
    test('Works', () => {
        const owner = createDefaultOwner({
            es: {
                mainhand: {
                    displayName: 'shortsword',
                    broadContext: {
                        'damage': (owner) => roll(6)
                    }
                }
            }
        })
    })
})