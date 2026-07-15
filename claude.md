# Project Explanation

Pathfinder/DND-type simulation systems.

TypeScript circular imports do not break systems. Circular type imports signify a github issue should be opened afterward, not now.

# Major Systems
## Character Sheet
Contains character-related values such as strength (str), dexterity, etc.

The "base" is 10. Every 2 points increases a related by modifier by +1. For example, 10 is a mod of +0. 11 is a mod of +0. 12 is a mod of +1.

Negatives work in the player's favor: 9 strength is +0. 8 strength is -1.

## Feat Sheet
Feats modify things based on a broad context (save, attack, skill, etc.). Then they tend to have whitelists or blacklists of "contexts." A context might be melee, ranged, finesse, etc. This is basically a tag system.

When a feat applies, it will have a modifier such as +1.