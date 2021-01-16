---
layout: post
title: "백준 12790 - Mini Fantasy War"
author: "asadal"
tags: ["python", "파이썬", "백준", "사칙연산"]
comments: true
---

##### 문제

> 넥슨지티에서는 최근 SRPG "슈퍼 판타지 워"의 후속작으로 "미니 판타지 워"를 출시하였다. 전편과 마찬가지로, 미니 판타지 워에서도 각 캐릭터의 전투력을 계산하여야 한다. 각 캐릭터의 전투력은 단순히 각 캐릭터의 능력치의 가중 합으로 계산된다. 전투력 계산은 굉장히 간단한 로직이지만 게임 곳곳에 쓰이는 만큼, Being은 다른 프로그래머로 하여금 이 로직을 구현하여 자신의 것과 교차검증하고자 한다. 그리하여 당신은 이 전투력을 구현하는 작업을 맡게 되었다.
>
> 능력치는 모두 네 종류 존재한다. 이는 각각 HP, MP, 공격력, 방어력이다. 각 캐릭터는 기본 능력치 4종을 바탕으로 장비를 장착할 수 있다. 각 장비는 능력치를 변화시키는데, 그 변화되는 양이 입력으로 주어진다. 따라서 캐릭터의 최종 능력치는 기본 능력치와 장비 능력치의 합으로 구성된다. **단, HP와 MP는 1보다 작은 경우 1로 간주하며, 공격력은 0보다 작은 경우 0으로 간주한다. 방어력은 음수 여부에 상관하지 않는다.**
>
> 결정된 능력치에 따른 캐릭터의 최종 전투력은 아래와 같다:
>
> 전투력 = 1 * (HP) + 5 * (MP) + 2 * (공격력) + 2 * (방어력)
>
> 각 캐릭터의 기본 능력치와 장비에 의해 변화되는 능력치의 증감량이 주어질 때, 최종 전투력을 구하는 프로그램을 작성하여라.

##### 입력

>입력의 첫 줄에는 능력치를 계산하여야 하는 캐릭터의 수, 또는 테스트 케이스의 수 *T* (1 ≤ *T* ≤ 1000) 가 주어진다.
>
>다음 *T* 행에 걸쳐 각각 8개의 정수가 주어진다. 처음 네 개의 정수는 각각 캐릭터의 기본 HP, MP, 공격력, 방어력이다. 이 값들은 1 이상 999 이하로 주어진다. 다음 네 개의 정수는 각각 캐릭터의 장비에 의해 증감되는 HP, MP, 공격력, 방어력이다. 이 값들은 -999 이상 999 이하로 주어진다.

##### 출력

> 각 캐릭터, 즉 각 테스트 케이스마다 한 줄에 하나씩 캐릭터의 최종 전투력을 출력한다.

아래처럼 풀면 틀린다. (`h<1 and m<1 and/or a<0`일 경우 틀림.)

```python
for _ in range(int(input())):
    h1, m1, a1, d1, h2, m2, a2, d2 = map(int, input().split())
    h, m, a, d = h1+h2, m1+m2, a1+a2, d1+d2
    if h < 1:
        h = 1
    elif m < 1:
        m = 1
    elif a < 0:
        a = 0
    print((1*h)+(5*m)+(2*a)+(2*d))
```

아래처럼 풀면 되고,

```python
for _ in range(int(input())):
    h1, m1, a1, d1, h2, m2, a2, d2 = map(int, input().split())
    h, m, a, d = h1+h2, m1+m2, a1+a2, d1+d2
    if h < 1:
        h = 1
    if m < 1:
        m = 1
    if a < 0:
        a = 0
    print((1*h)+(5*m)+(2*a)+(2*d))
```

아래처럼 짜도 된다.

```python
for _ in range(int(input())):
    h1, m1, a1, d1, h2, m2, a2, d2 = map(int, input().split())
    h, m, a, d = h1+h2, m1+m2, a1+a2, d1+d2
    print((max([h, 1])*1)+(max([m, 1])*5)+(max([a, 0])*2)+(2*d))
```

더 줄이면 복잡해보이니 생략.

[[문제 보기](https://www.acmicpc.net/problem/12790)]