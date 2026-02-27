# Firebase Database Schema

## 컬렉션 구조

### 1. courseSettings/single
강좌 기본 설정 (1개 문서)

```ts
{
  startDate: Timestamp,  // 수업 시작일 (예: 2025-02-01)
  totalWeeks: 12         // 총 12주차 (고정)
}
```

---

### 2. sessions/{week-session}
각 회차 정보 (36개 문서: 1-1 ~ 12-3)

```ts
// 문서 ID: "2-1" (2주차 1회차)
{
  week: 2,               // 주차 (1~12)
  session: 1,            // 회차 (1=월, 2=수, 3=금)
  hasPractice: true,     // 실습 유무
  practiceTotalItems: 3, // 실습 개수
  hasQuiz: true,         // 퀴즈 유무
  notionPageId: ""       // 수업 노션 URL
}
```

**회차-요일 매핑 (고정):**
- 1회차 = 월요일
- 2회차 = 수요일
- 3회차 = 금요일

---

### 3. studentProgress/{userId}
학생별 진도 현황 (학생당 1개 문서)

```ts
// 문서 ID: Firebase Auth uid (예: "LUwb5e25RIXuDw1RuMu5JpBzTJy2")
{
  practices: {
    "2-1": {
      total: 3,           // 총 실습 개수 (sessions에서 가져옴)
      completed: [1, 3]   // 완료한 실습 번호 배열
    },
    "2-2": {
      total: 2,
      completed: []
    }
  },
  quizzes: ["2-1", "2-3"],  // 완료한 퀴즈 목록 ("주차-회차")
  updatedAt: Timestamp
}
```

---

### 4. instructorEmails/{email}
강사 이메일 등록 (로그인 권한 체크용)

```ts
// 문서 ID: 이메일 (예: "22000071@handong.ac.kr")
{
  // 필드 없음, 문서 존재 여부로 체크
}
```

---

### 5. studentEmails/{email}
학생 이메일 등록 (로그인 권한 체크용)

```ts
// 문서 ID: 이메일 (예: "1234@naver.com")
{
  // 필드 없음, 문서 존재 여부로 체크
}
```

---

### 6. users/{userId}
로그인한 사용자 정보

```ts
// 문서 ID: Firebase Auth uid
{
  id: "sadfmwklekfmweaoif",
  email: "1234@naver.com",
  name: "뉴스핌",
  role: "student" | "instructor",
  updatedAt: Timestamp
}
```

---

## 진도 상태 계산 로직

### 주차별 진도바 (1~12주차)
| 색상 | 조건 |
|------|------|
| 회색 | 미래 주차 (아직 안 옴) |
| 초록 | 모든 회차의 실습+퀴즈 완료 |
| 노랑 | 현재 주차 & 진행 중 |
| 빨강 | 과거 주차 & 미완료 있음 |

### 회차별 카드 (2-1, 2-2, 2-3)
| 상태 | 조건 |
|------|------|
| 미응시 (회색) | completed 배열이 비어있음 |
| 진행중 (노랑) | completed.length > 0 && < total |
| 완료 (초록) | completed.length === total && 퀴즈 완료 |

---

## 현재 주차 계산
- 기본: `startDate` + 현재 날짜로 계산
- 개발용 오버라이드: `.env.local`에서 설정
  ```
  NEXT_PUBLIC_DEV_OVERRIDE_WEEK=3
  NEXT_PUBLIC_DEV_OVERRIDE_DAY=2
  ```
