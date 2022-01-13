# 도커

### 시작

```
$ sudo service docker start
$ sudo docker-compose up -d
```

### 동작 중인 컨테이너 확인

```
$ docker ps
```

### 정지된 컨테이너 확인

```
$ docker ps -a
```

### 컨테이너 삭제
```
$ docker rm [컨테이너ID]
```

### 컨테이너 여러 개 삭제
```
$ docker rm [컨테이너ID], [컨테이너ID]
```

### 컨테이너 모두 삭제
```
$ docker rm `docker ps -a -q`
```

### 현재 이미지 확인
```
$ docker images
```

### 이미지 삭제
```
$ docker rmi [이미지ID]
```

### 컨테이너를 삭제하기 전에 이미지를 삭제할 경우
#### -f를 붙이면 컨테이너도 강제 삭제
```
$ docker rmi -f [이미지ID]
```

***

# MySQL

```
$ mysql -u root -i
```

### 모든 권한 부여 

```
# MySQL 7 이하
mysql> grant all privileges on [DB이름].* to '계정ID'@'%' identified by '비밀번호' with grant option; # 계정 생성 & 모든 권한 부여
mysql> flush privileges;
```

```
# MySQL 8
mysql> create  user '계정ID'@'%' identified by '비밀번호'; # 계정 생성
mysql> grant all privileges on [DB이름].* to '계정ID'@'%' with grant option;
mysql> flush privileges;
```



***

# Apache2

### 시작, 중지, 재시작, 상태 보기

```
$ sudo service apache2 start
$ sudo service apache2 stop
$ sudo service apache2 restart
$ sudo service apache2 status
```





***

# PHP 7.4.3



