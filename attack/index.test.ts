import { describe, assert, test } from 'vitest'
import { Attack, default as defaultAttack } from './index'

describe('standard functionality', () => {
    test('produces a number', () => {
        assert.equal(defaultAttack.calculate(), 5)
    })
})

describe('Can be extended', () => {
    test('uses interface', () => {
        const customAttack: Attack = {
            calculate() {
                return 5 * 10
            }
        }

        assert.equal(customAttack.calculate(), 50)
    })
})