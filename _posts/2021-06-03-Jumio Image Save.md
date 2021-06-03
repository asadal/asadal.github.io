---
layout: post
title: "[파이썬] 주니어미디어오늘 기사 속 이미지 한꺼번에 내려받기"
author: "asadal"
tags: ["python", "파이썬", "request", "주니어미디어오늘", "이미지 저장"]
comments: true
use_math: true
---

주니어미디어오늘 기사 페이지에서 이미지만 일괄 내려받는 파이썬 코드. `urllib` 라이브러리의 `request` 함수를 이용해 미리 지정한 폴더에 일괄 내려받는다.

```python
import requests
from bs4 import BeautifulSoup
# from PIL import Image
import lxml
from urllib import request

BASE_FOLDER = "/Users/asadal/Downloads/mio_images/" # 저장할 기본 폴더
url = input("URL : ") # 기사 페이지 주소 입력

def save_jumio_images(url):
    res = requests.get(url)
    soup = BeautifulSoup(res.text, "lxml")
    imgs = soup.find_all("div", attrs={"class": "IMGFLOATING"})
    for num, img in enumerate(imgs):
        try:
            img_url = img.find("img")["src"] # 이미지 주소
            ext = img_url.split('.')[-1] # 이미지 확장자
            request.urlretrieve(img_url, BASE_FOLDER + str(num+1) + "." +   ext)
            print(num+1, "번째 이미지를 저장했습니다.")
        except:
            print("이미지 저장에 실패했습니다.")

save_jumio_images(url)
```

