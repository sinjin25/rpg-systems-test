# Overview
Rough outline
- Roll a speed dice
    - See speed/index.ts
- When the number hits negative, track the remainder
    - The relevant character acts
        - See act/index.ts
    - Tie goes to player
- Relevant character acts
    - The target has an AC
    - The actor rolls attack and damage
    - If the actors rolls high enough, damage applies
    - If the target dies, they need to be removed from the actor queue