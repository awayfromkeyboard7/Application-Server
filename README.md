## 👩‍💻 API 
| 번호 | URL | 기능 | request | response | 
| ---------------------- | ------------------------- | -------------------------- | ------------------------- | ------------------------- |
| 1 | GET `/api/gamelog/createNew` | 새로운 게임로그를 생성한다. |  | {{ \_id :  , place_name:,  category:, user_id:, likes(수):, comments(수):, recommend_reason:, }}
| 2 | POST `/api/gamelog/update` | 게임종료 후 게임로그를 갱신한다. | {
	gameId: string(gameObjId),
	language: 유저가 선택한 언어,
	code: 유저가 제출한 코드, 
	passRate: {통과한 테스트케이스}/{전체 테스트케이스 수}, 
	gitId: 유저 git id
} | 





## 👲 커밋 컨벤션 
- Commit Header를 사용한다 
- 커밋 메시지는 제목은 영어로 본문은 알아보기 쉽게 한글로 작성.
- 다만, Commit Header는 영어로 작성.
- [좋은 git 커밋 메시지를 작성하기 위한 7가지 약속 - https://meetup.toast.com/posts/106](https://meetup.toast.com/posts/106) 참고 
이하 약속은 커밋 메시지를 English로 작성하는 경우에 최적화되어 있습니다. 한글 커밋 메시지를 작성하는 경우에는 더 유연하게 적용하셔도 좋을 것 같네요.
  - 제목과 본문을 한 줄 띄워 분리하기
  - 제목은 영문 기준 50자 이내로
  - 제목 첫글자를 대문자로
  - 제목 끝에 . 금지
  - 제목은 명령조로
  - 본문은 어떻게보다 무엇을, 왜에 맞춰 작성하기

### Commit Header
`feat`: 신규 기능 구현 : 사용자를 위한 신 기능; 새로운 빌드 관련 기능은 미포함 
<br>
`fix`: 버그나 에러 수정 : 사용자 버그 수정; 빌드 관련 버그 픽스 미포함
<br>
`refactor`: 리팩토링 : Production Code ( 비즈니스 로직 ?)의 수정사항; 변수의 이름 변경 포함.
<br>
`style`: 코드 스타일 수정 : 포멧, 잊어버린 세미 콜론 등; Production Code의 코드 변경이 없음.
<br>
`docs`: 문서 작업 : 문서의 변경점
<br>
`test`: 테스트 코드 : 빠진 테스트의 추가, 테스트의 리팩터링; Production Code의 변경 없음
<br>
`chore`: 그외 기타 : updating grunt tasks etc; Production Code의 변경 없음

### 예시
refactor: Delete plus function from practice/prac03/index.js 
한줄띄고 
커밋에 대한 설명입니다. 

-----

## 프로젝트 세부사항
