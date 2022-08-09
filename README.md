## { CODE: '뚝딱' }
- 서비스 주소: https://bluefrog-six.vercel.app
- 서비스 설명 및 데모 영상: [Youtube](https://youtu.be/B_xjtqqtH-E)

## 소개
![182548678-85d2455f-dfd1-49ab-afa2-cc3414d62a1c](https://user-images.githubusercontent.com/81317358/183591293-6dabe4e1-60ed-49ef-b2ae-16923100d687.jpg)

## { CODE: '뚝딱' }
- 실시간 온라인 코딩 배틀 게임 프로젝트입니다. 게임에 참여한 유저들은 실시간으로 같은 알고리즘 문제를 전달받고 푼 결과에 따라 점수를 획득하여 레벨을 올릴 수 있습니다. 게임 모드는 개인전과 팀전으로 이루어지며 실시간으로 채점 결과를 받아볼 수 있습니다.
- 개인전
	- 상대 유저 채점 결과 실시간 업데이트
- 팀전
	- 공유 IDE 기능
	- 보이스 채팅 기능
- 채팅 기능
	- 읽지 않은 메시지 표시
- 팔로우 기능
	- 유저 팔로우 및 언팔로우
- 마이페이지
	- 최근 전적 및 랭킹 표시
- 채점 기능
	- 코드 실시간 채점


## 👩‍💻 API 
| 번호 | URL | 기능 | request | response | 
| ---------------------- | ------------------------- | -------------------------- | ------------------------- | ------------------------- |
| 1 | GET `/api/user/login` | 로그인 요청 | {{ Authorization: accessToken }} | jwt token
| 2 | GET `/api/user/info` | 유저 정보 요청 | {{ id: user.ObjId }}| {{ <br>gitId: 깃허브 아이디,<br> imgUrl: 프로필 이미지 url,<br> totalScore: 유저가 획득한 점수,<br> problemHistory: 유저가 푼 문제,<br> gameHistory: 유저가 참여한 게임 기록<br>}} 
| 3 | GET `/api/user/search` | 유저 검색 | {{ id: user.ObjId or 'getmyinformation' }} | {{ userInfo: 유저 정보 }}
| 4 | GET `/api/user/rank` | 랭크 요청 | {{ start: 시작 인덱스, count: 20 }} | {{ <br> userInfos: start~start+count만큼의 유저 정보 <br> }}
| 5 | GET `/api/code` | 로그인 요청 | {{ id: ObjId }} | {{ code: 유저 제출 코드 }}
| 6 | POST `/api/gamelog/` | 새로운 로그 생성 | {{ gitId : user_name }} | 너무 기네요~ 밑에 참고 |
| 7 | GET `/api/gamelog/` | 로그 요청 | {{ gitId : user_name }} | 너무 기네요~ 밑에 참고 |
| 8 | GET `/api/gamelog/problem` | 문제 랜덤 요청 | {{ id: problem.ObjId }} | {{ <br>_id: 문제번호,<br>title: 문제이름 ,<br>content: 문제설명,<br>inputText:입력값설명,<br>outputText:출력값설명,<br>examples: <br>[{<br>inputText:입력값예시 ,<br>outputText:출력값예시<br>}]<br>}}
| 9 | PUT `/api/gamelog/:mode` | 게임종료 후 게임로그 갱신 | parameters: solo/team <br> {{ <br>gameId: string(gameObjId) ,<br> language: 유저가 선택한 언어,<br> code: 유저가 제출한 코드, <br> passRate: 테스트케이스 통과율, <br>gitId:,<br> }} | | 
| 10 | POST `/api/judge/` | 채점요청 | {{ <br>gitId <br>code <br>problemId <br>language <br>gameLogId <br>submit <br>}} | {{ <br>results <br>passRate <br>msg <br>}} |

```
/* 4. game log createNew response */
{{
	problemId: {
		_id: 문제id,
		title: 문제제목,
		content: 문제 내용.,
		inputText: 인풋 설명,
		outputText: 아웃풋 설명,
		examples: [{ 
			inputText: 인풋 예시, outputText: 아웃풋예시 
		}]
	},
	userHistory: [{
			gitId: 깃아이디,
			language: ,
			code: ,
			ranking: 0,
			passRate: 0,
			submitAt: "유저 생성시간"
	}]
	_id: 게임로그 id,
	startAt: 게임시작시간,
}}
```
