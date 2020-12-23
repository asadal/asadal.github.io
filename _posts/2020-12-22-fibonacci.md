\---

layout: post

title: "백준 9625 - 피보나치 수열"

tags: [python, 파이썬, 백준, 피보나치 수열]

comments: true

\---

피보나치 수열. 숫자 n이 주어졌을 때 피보나치 수열의 n-1번째 값과 n번째 값 출력. 가장 간단한 방법.

```python
n = int(input())
a = 1
b = 0
for _ in range(n):
    a, b = b, a+b
print(a, b, sep=" ") # b가 n번째 피보나치 수.
```

[문제 보기](https://www.acmicpc.net/problem/9625)