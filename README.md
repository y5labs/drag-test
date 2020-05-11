# Drag Test

## Operations

- Given segment array, generate edges including shared
- Given segment index, start or end + delta generate new segment array

Operations:
  Resize start of i
  Resize end of i
  Resize start and end of i
  Move i
  New start at end at
  Split i at x


## Behaviour

FSM

Idle
-> Start on empty
-> Start on event
-> Start on single edge
-> Start on shared edge

## Creating
Start on empty
- Record start time offset
-> Creating

Move while creating
- For the time period start to current
- Overlay delete covered time
-> Creating

Esc while creating
- Cancel drag
-> Idle

End while creating
- For the time period start to current
- Delete covered time
- Create timeperiod start to current
-> Idle

## Moving
Start on event
- Record event
-> Moving

Move while moving
- For the moved time period
- Overlay delete covered time
-> Moving

Esc while moving
- Cancel drag
-> Idle

End while moving
- For the time period start to current
- Delete covered time
- Update event
-> Idle

## Resizing
Start on single edge
- Record event
-> Resizing

Move while resizing
- Expand or contract event by delta
- Including potentially resizing past negative
- If past negative reset and resize from other direction
- Overlay delete covered time
-> Resizing

Esc while resizing
- Cancel drag
-> Idle

End while resizing
- Expand or contract event by delta
- Including potentially resizing past negative
- If past negative reset and resize from other direction
- Delete covered time
-> Idle

## 


- Click and drag on empty to create a new event.
- Snap to 5 minute intervals.
- Click and drag on an event to move (keep duration the same)
- Click on the edge of an event to resize.
- Move into another event to temp reduce size or remove entirely.
- Release drag to commit.
- Click and drag on a shared edge to resize both events
- Click once on an event to bring up editor
- Tap delete key to delete selected event.