# Solution — C02 Predict stack

## Output

```text
start
a-enter
b-enter
c
b-exit
a-exit
end
```

## Depth (approximate teaching model)

| Log | Depth idea |
|---|---|
| start | script |
| a-enter | script → a |
| b-enter | script → a → b |
| c | script → a → b → c |
| b-exit | script → a → b |
| a-exit | script → a |
| end | script |

## Why `b-exit` after `c`

`c` must return before `b` continues after the call.

## If `c` threw

`b-exit`, `a-exit`, and `end` would not run unless caught; stack would unwind via exception propagation.
