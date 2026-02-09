# QR Code Generator

무료 온라인 QR 코드 생성 도구입니다. URL, 텍스트, WiFi, 연락처, 이메일, 전화번호를 QR 코드로 변환하고 색상을 커스터마이징한 후 PNG 형식으로 다운로드할 수 있습니다.

## 주요 기능

### 다양한 입력 타입
- **URL**: 웹사이트 링크를 QR 코드로 변환
- **텍스트**: 일반 텍스트 메시지를 QR 코드로 변환
- **WiFi**: WiFi 네트워크 정보 (SSID, 비밀번호, 보안타입)를 QR 코드로 변환
- **연락처**: 이름, 전화, 이메일 정보를 vCard 형식 QR 코드로 변환
- **이메일**: 이메일 주소를 mailto 링크로 변환
- **전화번호**: 전화번호를 tel 링크로 변환

### 색상 커스터마이징
- QR 코드 색상(전경색) 조정 가능
- 배경색 커스터마이징
- 실시간 미리보기

### 사이즈 조절
- 100px ~ 500px 범위에서 자유롭게 크기 조절
- 슬라이더로 부드러운 조정

### 히스토리 관리
- 최근 생성된 QR 코드 5개 저장
- 히스토리에서 이전 QR 코드 빠르게 복원

### PNG 다운로드
- 생성된 QR 코드를 PNG 형식으로 다운로드
- 고품질 이미지 지원

### 12개 언어 지원
- 한국어 (Korean)
- English (English)
- 中文 (Simplified Chinese)
- हिन्दी (Hindi)
- Русский (Russian)
- 日本語 (Japanese)
- Español (Spanish)
- Português (Portuguese)
- Bahasa Indonesia (Indonesian)
- Türkçe (Turkish)
- Deutsch (German)
- Français (French)

## 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PWA**: Progressive Web App 지원 (offline 작동)
- **Storage**: LocalStorage를 통한 히스토리 저장
- **Analytics**: Google Analytics 4 (GA4) 연동
- **Advertising**: Google AdSense 광고 지원
- **Internationalization**: i18n 다국어 지원

## 파일 구조

```
qr-generator/
├── index.html           # 메인 HTML 파일
├── manifest.json        # PWA 설정
├── sw.js               # Service Worker
├── icon-192.svg        # 앱 아이콘 (192x192)
├── icon-512.svg        # 앱 아이콘 (512x512)
├── README.md           # 이 파일
├── css/
│   └── style.css       # 전체 스타일 (다크모드, 반응형)
└── js/
    ├── app.js          # 메인 애플리케이션 로직
    ├── i18n.js         # 국제화(i18n) 모듈
    └── locales/
        ├── ko.json     # 한국어 번역
        ├── en.json     # 영어 번역
        ├── zh.json     # 중국어 번역
        ├── hi.json     # 힌디어 번역
        ├── ru.json     # 러시아어 번역
        ├── ja.json     # 일본어 번역
        ├── es.json     # 스페인어 번역
        ├── pt.json     # 포르투갈어 번역
        ├── id.json     # 인도네시아어 번역
        ├── tr.json     # 터키어 번역
        ├── de.json     # 독일어 번역
        └── fr.json     # 프랑스어 번역
```

## 사용 방법

### 웹에서 사용
1. https://dopabrain.com/qr-generator/ 접속
2. 입력 타입 선택 (URL, 텍스트, WiFi 등)
3. 필요한 정보 입력
4. (선택사항) 색상 및 사이즈 커스터마이징
5. "PNG 다운로드" 버튼으로 저장

### PWA 앱으로 설치
1. 모바일 브라우저에서 앱 메뉴 → "홈 화면에 추가" 선택
2. 또는 데스크톱 Chrome에서 주소 표시줄의 설치 버튼 클릭
3. 설치 후 다른 앱처럼 사용 가능 (오프라인에서도 작동)

## 디자인 특징

### 2026 UI/UX 트렌드 적용
- **Glassmorphism 2.0**: 기능적인 blur 효과
- **Microinteractions**: 부드러운 호버/탭 애니메이션
- **다크 모드 우선**: 진정한 다크 배경 (#0f0f23)
- **미니멀리스트 플로우**: 넉넉한 여백, 한 화면에 한 가지 액션
- **진행상황 시각화**: QR 데이터 크기, 버전 표시
- **개인화**: 언어 선택, 색상 커스터마이징 저장
- **접근성**: 색상 대비 충분함, 44px+ 터치 타겟

### 색상 팔레트
- **주 색상**: #1abc9c (청록)
- **배경**: #0f0f23 (진한 파란색)
- **텍스트**: #e0e0f8 (밝은 보라)
- **강조**: 그라데이션 (청록 → 진한 청록)

## QR 코드 알고리즘

이 앱은 **순수 JavaScript로 구현된 간단한 QR 코드 생성 알고리즘**을 사용합니다:

- Finder Pattern (위치 마크) 생성
- Timing Pattern (타이밍 패턴) 생성
- 데이터 인코딩 (UTF-8)
- Canvas API를 통한 렌더링

### 특수 포맷 지원
- **WiFi**: `WIFI:T:WPA;S:SSID;P:PASSWORD;;` 형식
- **vCard**: `MECARD:N:Name;TEL:Phone;EMAIL:Email;;` 형식
- **이메일**: `mailto:` 프로토콜
- **전화**: `tel:` 프로토콜

## 오프라인 기능

Service Worker를 통해 다음 기능을 오프라인에서도 사용할 수 있습니다:
- QR 코드 생성
- 색상 커스터마이징
- 히스토리 로드
- 언어 변경

네트워크가 필요한 기능:
- 번역 파일 초기 로드 (이후 캐시됨)
- Google Analytics (오프라인 시 기록하지 않음)
- 광고 로드

## 성능 최적화

- **번들 크기**: ~100KB (gzip 압축 시 ~30KB)
- **초기 로드**: <1초 (로컬 테스트)
- **캐싱**: 모든 자산 Service Worker 캐시
- **번역 로딩**: 필요할 때만 로드

## 접근성 (A11y)

- **WCAG 2.1 AA** 기준 준수
- 색상 대비: 최소 4.5:1
- 터치 타겟: 최소 44x44px
- 키보드 네비게이션: Tab, Enter, Space 지원
- 스크린 리더: aria-label, role 속성 포함
- 모션 선호도 존중: `prefers-reduced-motion` 미디어 쿼리

## 모바일 최적화

- **반응형 디자인**: 320px ~ 1440px 화면 지원
- **터치 친화적**: 44px 이상 버튼 크기
- **자동 조정**: 가로/세로 모드 전환 지원
- **성능**: 모바일에서 60fps 애니메이션

## SEO 최적화

- Schema.org 마크업 (WebApplication)
- Open Graph 메타태그
- Twitter Card 메타태그
- hreflang 태그 (다국어)
- 구조화된 데이터 (JSON-LD)

## 분석 & 통계

Google Analytics 4를 통해 다음을 추적합니다:
- 페이지 뷰
- 사용자 상호작용 (입력 타입 선택, 다운로드)
- 세션 시간
- 사용자 언어 선호도
- 디바이스 정보

## 광고 정책

- AdSense 배너 광고 (상단, 하단)
- 광고 없음: 광고 차단 시 자동 제거
- 광고 콘텐츠: Google AdSense 자동 배치

## 향후 개선 사항

- [ ] 인앱 결제 (광고 제거)
- [ ] 고급 QR 코드 옵션 (로고 삽입, 보정도)
- [ ] 이미지 업로드 → QR 코드 생성
- [ ] QR 코드 인식 (카메라)
- [ ] 일괄 QR 코드 생성 (CSV)
- [ ] 커스텀 QR 코드 템플릿

## 라이선스

Copyright © 2026 DopaBrain. All rights reserved.

이 프로젝트는 저작권 보호를 받습니다. 상업적 재사용, 재배포는 금지됩니다.

## 문의

버그 리포트 및 기능 제안: hello@dopabrain.com
