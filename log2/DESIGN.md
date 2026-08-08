Contains trees of subproblems which require trees of subproblems. A tree has child nodes. It has a display name. It has a total method. The total method figures out how to use children to form a value - for instance, sum/max/min, constant.

/bases represent leaves (constant returning total function, no children or subproblems)
/composition isn't a base and it isn't terminal
/terminal is an endpoint likely to be called by the application (ex: attack, ac)
/terminal-composition is a tree which takes in a foreign actor's tree (ex: that subproblem is computed and can't be recomputed with the given information). For instance, damage taken receives a foreign actor's damage tree, calculates its own subproblems (damage taken reductions, etc.) to produce a new tree.

Any rolls need to be frozen through a closure so that they don't reroll anytime a .total() function is called.

Tags are a system which holds contexts. They are mutated onto the Owner type as a first step of a terminal handler function. For instance, attack will add the relevantSlot's tags as well as a 'standard attack' tag. These are one of the few impure parts of the system.

Tests should make use of format.ts for early visualization and then hasNodeMatching to confirm the existence of child nodes (or the root). This allows tests to become structural documentation.