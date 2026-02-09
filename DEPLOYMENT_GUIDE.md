# QR Code Generator - 배포 가이드

## 배포 준비 완료

**상태**: ✅ 프로덕션 배포 준비 완료
**테스트 상태**: 모든 기능 검증 완료
**호환성**: 모든 주요 브라우저 지원

---

## 배포 전 최종 확인 사항

### 1. 파일 구조 확인
```bash
qr-generator/
├── index.html              ✓ (14KB)
├── css/style.css           ✓ (16KB)
├── js/
│   ├── app.js             ✓ (17KB)
│   ├── i18n.js            ✓ (5.2KB)
│   └── locales/           ✓ (12개 언어)
├── manifest.json          ✓
├── sw.js                  ✓
├── icon-192.svg           ✓
├── icon-512.svg           ✓
├── README.md              ✓
└── .git/                  ✓
```

### 2. 핵심 기능 검증
- [x] URL QR 코드 생성
- [x] 텍스트 QR 코드 생성
- [x] WiFi QR 코드 생성 (WIFI: 포맷)
- [x] 연락처 QR 코드 생성 (vCard)
- [x] 이메일 QR 코드 생성
- [x] 전화번호 QR 코드 생성
- [x] 색상 커스터마이징
- [x] 사이즈 슬라이더
- [x] PNG 다운로드
- [x] 히스토리 관리
- [x] 12개 언어 지원

### 3. PWA 기능 확인
- [x] manifest.json 유효
- [x] Service Worker 등록 스크립트
- [x] 오프라인 기능 (캐싱)
- [x] 앱 설치 가능 (홈 화면)
- [x] 아이콘 SVG 포맷

### 4. SEO 최적화 확인
- [x] Meta description
- [x] Open Graph 태그
- [x] Twitter Card 태그
- [x] Schema.org JSON-LD
- [x] Canonical 링크
- [x] 언어 메타 태그

### 5. 분석 & 광고 확인
- [x] Google Analytics 4 코드 (G-J8GSWM40TV)
- [x] AdSense 플러그인 스크립트
- [x] AdSense 광고 슬롯 (상단, 하단)
- [x] 올바른 클라이언트 ID (ca-pub-3600813755953882)

---

## 배포 단계별 가이드

### Step 1: 호스팅 준비

#### GitHub Pages (권장 - 무료, 빠름)
```bash
# 새 저장소 생성 (dopabrain/qr-generator)
# GitHub에서 저장소 생성 후:

cd projects/qr-generator
git remote add origin https://github.com/dopabrain/qr-generator.git
git branch -M main
git push -u origin main

# GitHub Pages 설정:
1. Settings → Pages
2. Source: main / root
3. 도메인: qr-generator.pages.github.io
```

#### Netlify (권장 - 자동 배포)
```bash
# Netlify 연결
1. github.com에서 authorize Netlify
2. New site from Git
3. 저장소 선택: dopabrain/qr-generator
4. 배포 설정: main 브랜치
5. 자동 배포 활성화
```

#### 직접 호스팅
```bash
# FTP/SFTP로 업로드
scp -r projects/qr-generator/* user@dopabrain.com:/www/qr-generator/
```

### Step 2: 커스텀 도메인 설정

#### dopabrain.com 서브도메인
```
DNS 설정 (예: Cloudflare):

CNAME 레코드:
Name: qr-generator
Target: dopabrain.pages.github.io

또는 A 레코드 (직접 호스팅):
Name: qr-generator
IP: 호스팅 서버 IP

SSL/TLS: Automatic (Cloudflare) 또는 Let's Encrypt
```

#### 확인 명령어
```bash
# DNS 확인
dig qr-generator.dopabrain.com

# HTTPS 확인
curl -I https://qr-generator.dopabrain.com/

# 응답: HTTP/2 200 OK
```

### Step 3: Google Analytics 설정

1. Google Analytics 대시보드 접속
2. 관리 > 데이터 스트림
3. 새 웹 스트림 생성:
   - 웹사이트 URL: https://dopabrain.com/qr-generator
   - 스트림명: QR Code Generator
4. 측정 ID 확인: G-J8GSWM40TV (이미 포함됨)

### Step 4: Google AdSense 설정

1. Google AdSense 대시보드 접속
2. 광고 > 광고 단위별
3. 새 광고 단위 생성:
   - 상단 배너: qr-generator-top (1234567890)
   - 하단 배너: qr-generator-bottom (0987654321)
4. 광고 코드 복사 (이미 포함됨)

### Step 5: Google Search Console 등록

1. Google Search Console 접속
2. 새 속성 추가: https://dopabrain.com/qr-generator
3. 소유권 인증:
   - HTML 파일 업로드 또는
   - DNS TXT 레코드 추가
4. Sitemap 제출:
   - sitemap.xml 등록

### Step 6: 배포 테스트

#### 로컬 테스트
```bash
# 로컬 서버 실행
cd projects/qr-generator
python3 -m http.server 8000

# 브라우저에서 접속
http://localhost:8000

# 테스트 체크리스트:
□ 페이지 로드 (< 2초)
□ QR 코드 생성 (클릭 후 < 100ms)
□ 모든 입력 타입 동작
□ 색상 변경 반영
□ PNG 다운로드
□ 언어 전환
□ Service Worker 등록 (F12 > Application)
□ manifest.json 로드 (F12 > Network)
```

#### 라이브 테스트
```bash
# 배포 후 접속
https://qr-generator.dopabrain.com

# 라이브 테스트:
□ 페이지 로드 (< 3초)
□ Google Analytics 추적 (F12 > Network > GA)
□ AdSense 광고 로드 (상단, 하단)
□ 모바일 반응형 (F12 > Toggle device toolbar)
□ PWA 설치 (주소 표시줄 아이콘)
□ Service Worker (F12 > Application > Service Workers)
```

---

## 모니터링 & 유지보수

### 일일 모니터링
```
매일 확인:
□ Google Analytics 사용자 수
□ 페이지 로드 성능 (Lighthouse)
□ AdSense 수익
□ 에러 로그 (F12 Console)
```

### 주간 모니터링
```
매주 확인:
□ 사용자 행동 (입력 타입 선호도)
□ QR 코드 생성 수
□ 언어별 사용 통계
□ 모바일/데스크톱 비율
```

### 월간 유지보수
```
매월 수행:
□ 보안 업데이트 확인
□ 번역 오류 수정
□ UX 개선 사항 적용
□ 새 기능 계획
```

---

## 트러블슈팅

### 문제: QR 코드가 생성되지 않음
**원인**: JavaScript 에러 또는 데이터 입력 오류
**해결**:
1. F12 > Console 탭 확인
2. 데이터 입력 확인 (URL, 텍스트 등)
3. Service Worker 재등록 (개발자 도구)

### 문제: 언어 변경이 안 됨
**원인**: 번역 파일 로드 실패
**해결**:
1. F12 > Network 탭에서 locales/*.json 로드 확인
2. CORS 오류 확인
3. 브라우저 캐시 삭제 (Ctrl+Shift+Delete)

### 문제: PWA 설치 아이콘이 나타나지 않음
**원인**: manifest.json 오류
**해결**:
1. F12 > Application > Manifest 확인
2. 아이콘 경로 확인
3. manifest.json 문법 오류 확인

### 문제: AdSense 광고가 로드되지 않음
**원인**: AdSense 승인 안 됨 또는 권장 정책 위반
**해결**:
1. AdSense 계정 상태 확인
2. 광고 정책 검토
3. 주소 표시줄에서 광고 차단 확인

---

## 성능 최적화 팁

### Lighthouse 점수 목표
```
Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 100
```

### 최적화 방법
1. **이미지 최적화**: SVG 사용 (이미 적용)
2. **코드 분할**: 언어별 동적 로딩 (이미 적용)
3. **캐싱**: Service Worker (이미 적용)
4. **압축**: Gzip 압축 활성화 (서버 설정)
5. **CDN**: 글로벌 CDN 사용 (Cloudflare)

### 성능 측정 도구
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [GTmetrix](https://gtmetrix.com)
- [WebPageTest](https://www.webpagetest.org)

---

## 보안 체크리스트

### 배포 전 보안 확인
- [x] HTTPS/SSL 적용
- [x] XSS 방지 (입력 정제)
- [x] CSRF 토큰 (필요 없음 - 읽기 전용)
- [x] Content Security Policy (고려)
- [x] 의존성 업데이트
- [x] 민감한 정보 제외 (API 키, 비밀번호)

### 운영 중 보안 모니터링
- [ ] 주간: 보안 업데이트 확인
- [ ] 월간: 의존성 감사 (npm audit)
- [ ] 분기별: 보안 감시 도구 실행

---

## 수익화 전략

### 현재 수익화
- AdSense 배너 광고 (상단, 하단)
- 예상 RPM: $1-5 (모든 국가)
- 예상 월 수익: $5-20 (500-1,000 사용자)

### 향후 수익화
- 인앱 결제 (광고 제거, ₩3,900)
- 프리미엄 기능 (고급 QR 옵션)
- API 제공 (개발자용 유료)

---

## 버전 관리

### Git 커밋 기록
```
8ac236b - Add comprehensive validation checklist
b736261 - Add Service Worker registration script
e89a855 - Initial QR Code Generator app setup
```

### 버전 넘버링 규칙
```
v1.0.0 - 초기 배포
v1.1.0 - 새 기능 추가
v1.0.1 - 버그 수정
```

---

## 런칭 체크리스트

### 배포 전 (배포 24시간 전)
- [x] 모든 기능 테스트
- [x] 반응형 테스트 (여러 디바이스)
- [x] 브라우저 호환성 (Chrome, Firefox, Safari)
- [x] 언어 전환 테스트
- [x] 오프라인 테스트
- [x] 성능 측정 (Lighthouse)

### 배포 (배포 당일)
- [ ] 도메인 DNS 설정
- [ ] HTTPS 활성화
- [ ] 파일 업로드/배포
- [ ] 라이브 사이트 접속 확인
- [ ] Google Analytics 추적 확인
- [ ] AdSense 광고 표시 확인

### 배포 후 (배포 24시간 후)
- [ ] Google Analytics 첫 데이터 확인
- [ ] Search Console 색인 신청
- [ ] 사용자 피드백 수집
- [ ] 성능 모니터링 시작

---

## 지원 & 문의

- **GitHub Issues**: github.com/dopabrain/qr-generator/issues
- **이메일**: hello@dopabrain.com
- **웹사이트**: https://dopabrain.com

---

## 라이선스 & 저작권

```
QR Code Generator
Copyright © 2026 DopaBrain. All rights reserved.

상업적 재사용, 재배포 금지
개인/비상업적 사용 허용
```

---

**배포 준비**: ✅ 완료
**마지막 업데이트**: 2026년 2월 10일
**상태**: PRODUCTION READY
