# Salem 보드게임 사회자 어플리케이션

이 프로젝트는 간단한 React 어플리케이션을 Nginx로 서빙하기 위해 Docker를 사용합니다.

## Docker 실행 방법

요청하신 `docker run` 명령어 및 빌드 방법을 정리해두었습니다.

### 1. Docker 이미지 빌드

먼저 현재 디렉토리 (`salem`) 에서 Docker 이미지를 빌드합니다. 터미널을 열고 다음 명령어를 실행해주세요.

```bash
docker build -t salem-moderator .
```

### 2. Docker 컨테이너 실행

빌드가 완료되면 다음 명령어로 컨테이너를 실행합니다.

```bash
docker run -d -p 8080:80 --name salem-app salem-moderator
```

- `-p 8080:80` : 호스트의 `8080` 포트를 Nginx 컨테이너의 `80` 포트로 연결합니다. 
- 이제 브라우저에서 `http://localhost:8080` 으로 접속하시면 어플리케이션을 사용할 수 있습니다.

### 종료 방법

컨테이너를 멈추고 삭제하려면 다음 명령어를 사용하세요.

```bash
docker stop salem-app
docker rm salem-app
```
