# Project Explanation

Pathfinder/DND-type simulation systems.

Please for the love of god stop talking about circular type imports and leaving comments about them everywhere. They are not compiled.

# Major Systems
log2 is the center of most almost all calculations. It contains ModNodes which track an item, its children, and a total method which states how to add their children up (ex: sum, multiply, etc.).

To save tokens, do not explore the subfolders in that because they are just specific calculations. If relevant to a particular issue, then feel free but it should not be the default behavior.

# Subagents
Do not use more than one subagent at a time. User prefers being lean on token usage over speed.

# Answering prompts
Do not answer a prompt with more than 5 paragraphs. If more than that is required, say you'd like to talk about X and prompt the user for more information.