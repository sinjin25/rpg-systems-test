# TimeTravelLog — Design Notes (DEFERRED)

Status: parked until the core systems are fixed. This is a feasibility + architecture record,
not a spec. See `types.ts` in this folder for the in-progress type sketch.

## Goal
Divorce presentation from simulation: rebuild the presentation layer from pure data.
Approach = **render-only event stream** — the log is replayed for display; the engine is
NEVER re-run. Consequence: we do NOT need seeds or a roll-log; storing evaluated outcomes
makes the log self-contained (all the RNG-reproduction fragility disappears).

## Feasibility verdict
Feasible. `FrozenModNode` (evaluate `total()` -> number, recurse children) is the correct move
and solves the closure problem for results. Size is a non-issue (~25k events worst case; the
lever is payload/event, not count). Current `types.ts` is on the right track but insufficient
as written (see blocking issues).

## Architecture: fine-grained event stream
- `TimeTravelLog = Array<Event>`, discriminated on `{ kind: AllEventTypes }`.
- **Identity/state split:** immutable per-actor identity (cs, feats, equipment names, id) stored
  ONCE in an initial roster; each event snapshots only the MUTABLE slice of AFFECTED actors
  (health, speed, status summary, ability cursors). Main size lever (~200B vs ~3KB/snapshot).
- **Full-per-affected-actor snapshots, NOT field-level patches.** This is self-healing: a missed
  event is corrected by the next event touching that actor, and it lets us instrument the code
  one mutation site at a time without corrupting the log.
- **source vs affected are distinct roles.** `affected` is a SET (decayEnemyKilled, AoE, on-kill
  all touch multiple actors). Some events carry NO state delta (a miss) -> snapshot is optional.
- **Emit on mutation, not on evaluation.** No-op decays and per-ModNode "checks" are not
  time-travel steps. Any "why did this apply" reasoning belongs in a separate debug channel.
- Persistence (if ever needed): NDJSON, one event per line, appendable during the sim.

## Blocking issues in the current types.ts
1. Actor snapshots (`actor`, `actorsEndState`) are still raw `Actor2` -> two problems:
   - Mutation-in-place: `instantiateActor` keeps the SAME owner ref; the sim mutates in place,
     so reference snapshots would ALL show the final state. Must deep-copy the mutable slice.
   - Serializability: `Actor2.owner` (fs/ss/es/as/relevantSlot) holds closures. Needs a
     `FrozenActor` (plain mutable state + id) if the log ever crosses a JSON boundary.
2. `relevantSlot` aliases `es.mainhand` by identity; `StatusExpirationEnemyKilled.enemy` is a live
   cross-actor health ref -> must become an actor id when frozen.
3. No stable actor identity exists (actors compared by ===). A data log needs explicit ids.

## FrozenAbilityModNode is the odd one out
Unlike an attack (`StandardActionResult` bundles all rolls -> self-narrating), an `AbilityModNode`
is a POST-RESOLUTION LEAF. `generateAbilityModNodes` (actor2/act/ability.ts:39-47) computes
dc/save/didSave then DISCARDS them, returning only the branch's payloads. So a frozen node cannot
express:
- the save story (saveType / roll / dc / didSave) — consumed and thrown away upstream,
- the ability identity (no name/key on the node; only known in selectAndPrepAbility, ability.ts:108-111),
- grouping (one cast = AbilityModNode[]; onUse + onSave/onFailedSave can all fire).
Plus: the `StatusEffect` payload branch is still closure-bearing (needs a FrozenStatusEffect:
displayName/description/persists + expiration summary, enemy-ref -> id); `target` ('ally'|'target'
|'self') is a ROLE resolved to an actor only in handleAbilityModNodes (ability.ts:72-89); a
`ModNode` payload is damage/heal-ambiguous (handleAmnModNode always damages today, ability.ts:57).

Resolution: DON'T freeze the node. Assemble an `ability-cast` event from the three sites that
hold the story (selectAndPrepAbility = identity, generateAbilityModNodes = save/dc,
handleAbilityModNodes = target->id):

    { kind: 'ability-cast', casterId,
      ability: { key, displayName },
      save?: { saveType, dc, roll, didSave },
      outcomes: Array<{ affectedId,
        effect: { kind: 'damage'|'heal', amount: FrozenModNode }
              | { kind: 'status', status: FrozenStatusEffect } }> }

This also absorbs the earlier multi-target / "finishing cleave" concern.

## Instrumentation strategy (how to capture events for a mutator like decayRoundsElapsed)
- Do NOT diff before/after to DETECT what happened: it needs a pre-clone (as costly as a
  snapshot), recovers less than the function already knew, and can't tell natural expiry from an
  onExpiration replacement. Diffing is only OK as a way to produce the state snapshot, never the event.
- Mutators RETURN their own outcome as DOMAIN FACTS (not log entries): e.g.
  `type StatusChange = {key,kind:'decremented',remaining} | {key,kind:'expired'} | {key,kind:'replaced',replacedByKey}`.
  Today these functions return void and silently swallow their outcome — that's the real defect.
- A thin GENERIC RECORDER lives at the SIMULATION SEAM (not injected into the domain fn):
  `record(actorId, eventKind, changes)` -> if non-empty, push one event + attach the frozen
  snapshot of the affected actor. Domain fn knows nothing about the log; recorder knows nothing
  about status internals. Wrap at call sites (index.ts:71, index.ts:56, round.ts:27), not by
  passing a log sink into the mutator.
- Return richness SCALES with decision content: pure decays return {key,kind}; `decaySaveSucceeded`
  (decay.ts:55-69) rolls a d20 and must additionally return {roll, dc, didSave} per status.
- Because the full snapshot is ground truth for STATE, the change-list is only for
  narration/attribution — getting it minimal/wrong never corrupts playback state. Not a one-way door.

## Pure/impure split — selective, not universal
Split into pure-decide + impure-apply ONLY when: the decision consumes randomness we must capture
(decaySaveSucceeded, attack/ability saves), the branch is worth unit-testing without mutation
(generateAbilityModNodes is already half this shape), or we'd want to preview before committing.
For the plain decrements (decayRoundsElapsed/SpeedElapsed/ActionsElapsed) it's ceremony — the
"what" and "how" are the same line; use mutate-and-report. A DOGMATIC universal split goes too
far here because: (a) `onExpiration` is generative — a truly pure "what changes" would have to run
the closure and carry a live, non-serializable StatusEffect into apply; (b) `decaySaveSucceeded`
is irreducibly impure (rolls a d20 first). The recorder only consumes the RETURN VALUE, so mixed
styles are fine — the standardized seam is the return type, not purity. This is "functional core,
imperative shell," but a full pure-core conversion is a big refactor we don't need for this goal.

## Full mutable-state set a snapshot must cover
health.curr/temporary; speed.remainder/canAct; owner.ss (status add/remove — decay*, ability
status payloads, on-kill triggers); owner.as[cat].index (ability rotation cursor); transient
owner.relevantSlot.

## When we return (TODO)
- Enumerate `AllEventTypes` taxonomy (round-start, initiative, turn, attack, ability-cast, decay,
  status-added/removed, death, fight-end).
- Define `FrozenActor` + initial roster (identity/state split) and `FrozenStatusEffect`.
- Decide ability-event granularity: one composite `ability-cast` vs atomic sub-events (open).
- Instrumentation checklist (~8 mutation sites): health/apply-damage.ts, status-sheet2/decay.ts,
  actor2/round.ts, actor2/act/ability.ts, the attack path in simulate2/index.ts,
  handlePotentialDeath + trigger/apply.ts (on-kill).
