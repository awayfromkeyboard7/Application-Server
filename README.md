## ๐ฉโ๐ป API 
| ๋ฒํธ | URL | ๊ธฐ๋ฅ | request | response | 
| ---------------------- | ------------------------- | -------------------------- | ------------------------- | ------------------------- |
| 1 | GET `/api/login` | ๋ก๊ทธ์ธ ์์ฒญ |  | {{ url: ๊นํ๋ธ ๋ก๊ทธ์ธ ์์ฒญ url }}
| 2 | GET `/api/user/get-info` | ์ ์  ์ ๋ณด๋ฅผ ๊ฐ์ ธ์จ๋ค. | | {{ <br>gitId: ๊นํ๋ธ ์์ด๋,<br> imgUrl: ํ๋กํ ์ด๋ฏธ์ง url,<br> totalScore: ์ ์ ๊ฐ ํ๋ํ ์ ์,<br> problemHistory: ์ ์ ๊ฐ ํผ ๋ฌธ์ ,<br> gameHistory: ์ ์ ๊ฐ ์ฐธ์ฌํ ๊ฒ์ ๊ธฐ๋ก<br>}} 
| 3 | GET `/api/problem` | ๋ฌธ์  ํ๋๋ฅผ ๋๋ค์ผ๋ก ๊ฐ์ ธ์จ๋ค. |  | {{ <br>_id: ๋ฌธ์ ๋ฒํธ,<br>title: ๋ฌธ์ ์ด๋ฆ ,<br>content: ๋ฌธ์ ์ค๋ช,<br>inputText:์๋ ฅ๊ฐ์ค๋ช,<br>outputText:์ถ๋ ฅ๊ฐ์ค๋ช,<br>examples: <br>[{<br>inputText:์๋ ฅ๊ฐ์์ ,<br>outputText:์ถ๋ ฅ๊ฐ์์<br>}]<br>}}
| 4 | POST `/api/gamelog/createNew` | ์๋ก์ด ๋ก๊ทธ๋ฅผ ์์ฑํ๋ค | {{ gitId : user_name }} | ๋๋ฌด ๊ธฐ๋ค์~ ๋ฐ์ ์ฐธ๊ณ  |
| 5 | POST `/api/gamelog/update` | ๊ฒ์์ข๋ฃ ํ ๊ฒ์๋ก๊ทธ๋ฅผ ๊ฐฑ์ ํ๋ค. | {{ <br>gameId: string(gameObjId) ,<br> language: ์ ์ ๊ฐ ์ ํํ ์ธ์ด,<br> code: ์ ์ ๊ฐ ์ ์ถํ ์ฝ๋, <br> passRate: ํ์คํธ์ผ์ด์ค ํต๊ณผ์จ, <br>gitId:,<br> }} | | 
```
/* 4. game log createNew response */
{{
	problemId: {
		_id: ๋ฌธ์ id,
		title: ๋ฌธ์ ์ ๋ชฉ,
		content: ๋ฌธ์  ๋ด์ฉ.,
		inputText: ์ธํ ์ค๋ช,
		outputText: ์์ํ ์ค๋ช,
		examples: [{ 
			inputText: ์ธํ ์์, outputText: ์์ํ์์ 
		}]
	},
	userHistory: [{
			gitId: ๊น์์ด๋,
			language: ,
			code: ,
			ranking: 0,
			passRate: 0,
			submitAt: "์ ์  ์์ฑ์๊ฐ"
	}]
	_id: ๊ฒ์๋ก๊ทธ id,
	startAt: ๊ฒ์์์์๊ฐ,
}}
```


## ๐ฒ ์ปค๋ฐ ์ปจ๋ฒค์ 
- Commit Header๋ฅผ ์ฌ์ฉํ๋ค 
- ์ปค๋ฐ ๋ฉ์์ง๋ ์ ๋ชฉ์ ์์ด๋ก ๋ณธ๋ฌธ์ ์์๋ณด๊ธฐ ์ฝ๊ฒ ํ๊ธ๋ก ์์ฑ.
- ๋ค๋ง, Commit Header๋ ์์ด๋ก ์์ฑ.
- [์ข์ git ์ปค๋ฐ ๋ฉ์์ง๋ฅผ ์์ฑํ๊ธฐ ์ํ 7๊ฐ์ง ์ฝ์ - https://meetup.toast.com/posts/106](https://meetup.toast.com/posts/106) ์ฐธ๊ณ  
์ดํ ์ฝ์์ ์ปค๋ฐ ๋ฉ์์ง๋ฅผ English๋ก ์์ฑํ๋ ๊ฒฝ์ฐ์ ์ต์ ํ๋์ด ์์ต๋๋ค. ํ๊ธ ์ปค๋ฐ ๋ฉ์์ง๋ฅผ ์์ฑํ๋ ๊ฒฝ์ฐ์๋ ๋ ์ ์ฐํ๊ฒ ์ ์ฉํ์๋ ์ข์ ๊ฒ ๊ฐ๋ค์.
  - ์ ๋ชฉ๊ณผ ๋ณธ๋ฌธ์ ํ ์ค ๋์ ๋ถ๋ฆฌํ๊ธฐ
  - ์ ๋ชฉ์ ์๋ฌธ ๊ธฐ์ค 50์ ์ด๋ด๋ก
  - ์ ๋ชฉ ์ฒซ๊ธ์๋ฅผ ๋๋ฌธ์๋ก
  - ์ ๋ชฉ ๋์ . ๊ธ์ง
  - ์ ๋ชฉ์ ๋ช๋ น์กฐ๋ก
  - ๋ณธ๋ฌธ์ ์ด๋ป๊ฒ๋ณด๋ค ๋ฌด์์, ์์ ๋ง์ถฐ ์์ฑํ๊ธฐ

### Commit Header
`feat`: ์ ๊ท ๊ธฐ๋ฅ ๊ตฌํ : ์ฌ์ฉ์๋ฅผ ์ํ ์  ๊ธฐ๋ฅ; ์๋ก์ด ๋น๋ ๊ด๋ จ ๊ธฐ๋ฅ์ ๋ฏธํฌํจ 
<br>
`fix`: ๋ฒ๊ทธ๋ ์๋ฌ ์์  : ์ฌ์ฉ์ ๋ฒ๊ทธ ์์ ; ๋น๋ ๊ด๋ จ ๋ฒ๊ทธ ํฝ์ค ๋ฏธํฌํจ
<br>
`refactor`: ๋ฆฌํฉํ ๋ง : Production Code ( ๋น์ฆ๋์ค ๋ก์ง ?)์ ์์ ์ฌํญ; ๋ณ์์ ์ด๋ฆ ๋ณ๊ฒฝ ํฌํจ.
<br>
`style`: ์ฝ๋ ์คํ์ผ ์์  : ํฌ๋ฉง, ์์ด๋ฒ๋ฆฐ ์ธ๋ฏธ ์ฝ๋ก  ๋ฑ; Production Code์ ์ฝ๋ ๋ณ๊ฒฝ์ด ์์.
<br>
`docs`: ๋ฌธ์ ์์ : ๋ฌธ์์ ๋ณ๊ฒฝ์ 
<br>
`test`: ํ์คํธ ์ฝ๋ : ๋น ์ง ํ์คํธ์ ์ถ๊ฐ, ํ์คํธ์ ๋ฆฌํฉํฐ๋ง; Production Code์ ๋ณ๊ฒฝ ์์
<br>
`chore`: ๊ทธ์ธ ๊ธฐํ : updating grunt tasks etc; Production Code์ ๋ณ๊ฒฝ ์์

### ์์
refactor: Delete plus function from practice/prac03/index.js 
ํ์ค๋๊ณ  
์ปค๋ฐ์ ๋ํ ์ค๋ช์๋๋ค. 

-----

## ํ๋ก์ ํธ ์ธ๋ถ์ฌํญ
