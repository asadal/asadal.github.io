---
layout: post
title: "2진수, 8진수, 16진수, 10진수"
tags: [python, 파이썬, bin, oct, hex, int]
comments: true
---

#### 10진수 → 2진수, 8진수, 16진수

```python
format(42, 'b') # 101010
format(42, 'o') # 52
format(42, 'x') # 2a
format(42, 'X') # 2A
format(42, 'd') # 42

bin(42) # 0b101010
oct(42) # 0o52
hex(42) # 0x2a

bin(42)[2:]  # 101010
oct(42)[2:]  # 52
hex(42)[2:]  # 2a
```

#### 2진수, 8진수, 16진수 → 10진수

```python
int('101010', base=2) # 42
int('52', base=8) # 42
int('2a', base=16)  # 42
```

#### 10진법을 n진법으로 변환하기

```python
import string
alp = string.digits + string.ascii_uppercase
# "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
def num_change(d, base):
  q, r = divmod(d, base) # 10진수 d를 base진법 숫자로 나눈 몫과 나머지를 리턴
  i = alp[r] # base 진법에 해당하는 수를 변수 i에.
  return num_change(q, base) + i if q else i # 몫을 계속 base 진법으로 나눔. 몫이 0이 될 때까지.

n, b = map(int, input().split())
res = num_change(n, b)
print(res)
```

[문제 보기](https://www.acmicpc.net/problem/11005)
