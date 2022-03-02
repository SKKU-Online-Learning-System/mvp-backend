import express from 'express';

import { DB_promisePool as db, stat } from './../configs'


// express
const router = express.Router();


router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/db', async (req, res) => {
	const course = [
		{
			name: '[테스트] 스프링 핵심 원리 - 고급편',
			desc: '중급자를 위해 준비한 [백엔드, 웹 개발] 강의입니다. 스프링의 핵심 원리와 고급 기술들을 깊이있게 학습하고, 스프링을 자신있게 사용할 수 있습니다.',
			inst: 1,
			cat1: 1,
			cat2: 3,
			diff: 1
		},
		{
			name: '[테스트] 처음 배우는 리액트 네이티브',
			desc: '자바스크립트를 이용해서 모바일 앱을 만들 수 있는, 리액트 네이티브 입문자를 위한 강의입 니다. 리액트 네이티브를 개발할때 필요한 기초 지식을 익히고, 간단한 프로젝트를 진행합니다.',
			inst: 1,
			cat1: 1,
			cat2: 5,
			diff: 2
		},
		{
			name: '[테스트] Flutter 인스타그램 클론 2.0',
			desc: '이 강좌는 Firebase와 Flutter를 사용해서 간단한 서비스 앱을 어떻게 만들 수 있는지 방향성을 제시하는데 목적을 가지고 있습니다.',
			inst: 1,
			cat1: 1,
			cat2: 5,
			diff: 3
		},
		{
			name: '[테스트] Vue.js 시작하기 - Age of Vue.js',
			desc: 'Vue.js로 쉽게 웹 개발할 수 있도록 기본 개념과 핵심 기능에 대해서 학습하고 구현해봅니다. 강좌를 들으시고 나면 Vue.js로 프런트엔드 개발을 하시는게 재밌어질거에요.',
			inst: 1,
			cat1: 1,
			cat2: 2,
			diff: 1
		},
		{
			name: '[테스트] 코로나맵 개발자와 함께하는 지도서비스 만들기',
			desc: '코로나맵 개발자가 알려주는 지도서비스 만들기 강의입니다.',
			inst: 1,
			cat1: 1,
			cat2: 4,
			diff: 2
		},
		{
			name: '[테스트] AWS 클라우드 서비스 인프라 구축 이해와 해킹, 보안',
			desc: 'IT 서비스가 클라우드 환경으로 빠르게 전환되고 있습니다. 아마존 AWS 클라우드 환경 보안을 위해 알아야 할 기본적인 가상 인프라 구축부터, 각 영역별 보안 위협 모니터링, 취약점 진단 관점을 통해보안 실무를 배우게 됩니다.',
			inst: 1,
			cat1: 2,
			cat2: 12,
			diff: 3
		},
		{
			name: '[테스트] 리눅스 커널 해킹. A부터 Z까지',
			desc: '리눅스 커널의 각종 보호 기법과 그에 대한 우회 방안, 다양한 취약점들을 분석해보는 강의이며 강의별로 실습 예제가 제공 됩니다.',
			inst: 1,
			cat1: 2,
			cat2: 12,
			diff: 1
		},
		{
			name: '[테스트] 블록체인 기반의 스마트컨트랙트 개발',
			desc: '이더리움 기반의 DAPP 개발로 블록체인을 배워보세요. Smart Contract의 구현을 통해서 실전 개발에 대한 지식도 알 수 있습니다.',
			inst: 1,
			cat1: 2,
			cat2: 15,
			diff: 2
		},
		{
			name: '[테스트] 초보를 위한 도커 안내서',
			desc: '도커를 1도 모르는 입문자, 초보자분들을 위한 도커 안내서 입니다. 복잡한 내용을 제외하고 도커가 왜 인기가 많고 어떻게 사용하는지 빠르게 익힐 수 있도록 집중하였습니다.',
			inst: 1,
			cat1: 2,
			cat2: 14,
			diff: 3
		},
		{
			name: '[테스트] 패킷트레이서를 활용한 컴퓨터네트워크',
			desc: '컴퓨터 네트워크의 이론을 학습합니다. 시뮬레이션 프로그램을 사용하여 네트워크를 직접 구 성해봄으로써 네트워크에 대해서 확실하게 공부해보세요. 설명이 잘 되어 있는 강의 자료를 제공합니다.',
			inst: 1,
			cat1: 2,
			cat2: 13,
			diff: 1
		},
		{
			name: '[테스트] 증권 데이터 수집과 분석으로 신호와 소음 찾기',
			desc: '투자 강의가 아닙니다. 증권 데이터를 통한 데이터 수집, 분석과 시각화를 다룹니다. 다양한 데이터 포맷을 다루며 다양한 텍스트 전처리 기법을 익힙니다. 시계열 데이터의 시각화 기법과 스케일에 대한 표현 방법 주가 데이터를 해석하기 위한 몇 가지 기법을 다룹니다. 이 강의는 데이터 분석을 통해 인사이트 를 얻는 방법을 알아가는 강좌입니다. 주가 데이터를 통해 배운 내용을 시계열이 활용되는 수요량, 재고량,판매량, 트래픽량 등의 데이터를 수집, 분석, 시각화에 활용해 볼 수 있도록 구성 되어있습니다.',
			inst: 1,
			cat1: 3,
			cat2: 17,
			diff: 2
		},
		{
			name: '[테스트] 딥러닝 CNN 완벽 가이드 - Fundamental 편',
			desc: '딥러닝·CNN 핵심 이론부터 다양한 CNN 모델 구현 방법, 실전 문제를 통한 실무 딥러닝 개발노하우까지, 딥러닝 CNN 기술 전문가로 거듭나고 싶다면 이 강의와 함께하세요 :)',
			inst: 1,
			cat1: 3,
			cat2: 18,
			diff: 3
		},
		{
			name: '[테스트] 실전 인공지능으로 이어지는 딥러닝 개념 잡기',
			desc: '다양한 인공 신경망의 구조와 동작 원리를 이해하고 좋은 모델을 만드는데 필요한 필수 지식 을 전달하는 강의입니다.',
			inst: 1,
			cat1: 3,
			cat2: 18,
			diff: 1
		},
		{
			name: '[테스트] Node.js로 웹 크롤링하기',
			desc: '네이버, 아마존, 트위터, 유튜브, 페이스북, 인스타그램, unsplash.com 등의 사이트를 크롤링하며 실전에 적용해봅니다.',
			inst: 1,
			cat1: 3,
			cat2: 20,
			diff: 2
		},
		{
			name: '[테스트] [R을 R려줘] R 데이터 시각화',
			desc: 'R 기반 데이터 시각화를 가장 쉽게 설명한 강의. (거의) 다 알려드림. 마지막에는 COVID-19 �백백신 접종 데이터를 지도에 뿌려봅니다!',
			inst: 1,
			cat1: 3,
			cat2: 19,
			diff: 3
		},
		{
			name: '[테스트] 3dsmax 초급부터 전문가까지 - 한방에 끝내는 3dsmax 강좌',
			desc: '3DS MAX 의 모든것을 다루는 강좌. 입문자도 누구나 따라오기만 하면 전문가 수준으로 인도해주는 원샷 원킬 3DS max 강좌 입니다. 기본 개념부터 고급기술 노하우까지 재미있는 예제를 통해 하나하나 알려주는 친절하고도 방대한 강의 3DS MAX 는 이거 하나로 끝내보세요',
			inst: 1,
			cat1: 4,
			cat2: 22,
			diff: 1
		},
		{
			name: '[테스트] UX/UI 시작하기 : UI 디자인',
			desc: '신입 UI/UX 디자이너가 되고자 하거나, UI 디자인에 대해 알아보고 싶은 분들을 대상으로 한 UI 디자인 기초 강의입니다. UI 디자인에 대한 기본적인 지식 및 실무에서 꼭 알아야 할 디자인 팁 등을 배울 수 있습니다.',
			inst: 1,
			cat1: 4,
			cat2: 24,
			diff: 2
		},
		{
			name: '[테스트] 애니메이션과 이모티콘 만드는 진짜 애니메이트 클래스',
			desc: '나만의 애니메이션과 움직이는 이모티콘을 만들고 싶어하는 초보분들을 위한 어도비 애니메이트 수업입니다.',
			inst: 1,
			cat1: 4,
			cat2: 25,
			diff: 3
		},
		{
			name: '[테스트] 피그마로 콘텐츠 디자인하기',
			desc: '피그마는 UX/UI전용 툴이다? 아닙니다. 여러분의 썸네일, 광고소재, 상세페이지까지 피그마하나로 만들어보겠습니다.',
			inst: 1,
			cat1: 4,
			cat2: 25,
			diff: 2
		},
		{
			name: '[테스트] 유니티3D를 사용한 VR 제작 기초',
			desc: '유니티를 사용하여 VR 환경을 구축하며 VR 컨텐츠를 개발하기 위해 필요한 기본적인 기능을구현해봅니다.',
			inst: 1,
			cat1: 4,
			cat2: 28,
			diff: 1
		},
		{
			name: '[테스트] 진짜 현업에서 쓰이는 직장인의 실무 엑셀 - 데이터 가공부터 분석까지',
			desc: "현재 엑셀의 가장 트렌디한 방법으로 데이터를 효율적, 과학적으로 가공, 분석함에 '표준'이 되는 과정입니다.",
			inst: 1,
			cat1: 5,
			cat2: 31,
			diff: 3
		},
		{
			name: '[테스트] [한글NEO] 한번에 끝내는 문서작성 & ITQ 한글 자격증 취득',
			desc: '한글NEO 프로그램을 이용하여, 문서작성 기초부터 실무활용까지 그리고 자격증 취득까지 한번에! 기초가 부족하고 실무에서 문서작성을 원하는 분들이 이과정을 통해서 자격증도 취득하고, 문서작성을 할 수 있다고 자신있게 말씀드립니다.',
			inst: 1,
			cat1: 5,
			cat2: 31,
			diff: 1
		},
		{
			name: '[테스트] 비트윈 마케터가 7년 동안 실제로 해본 브랜드 마케팅 A to Z',
			desc: '‘커플앱 비트윈’ 마케터가 7년 동안 실제 집행한 브랜드 마케팅 사례를 통해, 수박 겉핥기식 이 아닌 진짜 현장에서 하는 고민과 해결 방법, 인사이트를 배울 수 있습니다.',
			inst: 1,
			cat1: 5,
			cat2: 32,
			diff: 2
		},
		{
			name: '[테스트] 3시간에 끝내는 디지털 마케팅의 모든 것',
			desc: '1) 디지털 마케팅의 거대한 흐름을 파악하여, 디지털 마케터가 되기위한 방법론들을 살펴봅니다. 2) 디지털 마케팅의 핵심 툴인 구글 애널리틱스를 맛보는 강의를 진행합니다.',
			inst: 1,
			cat1: 5,
			cat2: 32,
			diff: 3
		},
		{
			name: '[테스트] 비트코인 알고리즘 트레이딩 봇 개발',
			desc: '프로그래밍으로 나만의 수익모델을 만들어 보세요.',
			inst: 1,
			cat1: 5,
			cat2: 35,
			diff: 1
		},
		{
			name: '[테스트] 게임 엔진을 지탱하는 게임 수학',
			desc: '게임을 구성하는 가상 세계가 수학으로 어떻게 만들어지는지 기반에서부터 하나씩 다루는 강 의입니다. 기반 수학을 통해 게임 엔진의 구성 원리를 이해하고, 3차원 공간을 구성하는 실질적인 게임 수학 을 학습합니다.',
			inst: 1,
			cat1: 6,
			cat2: 37,
			diff: 2
		},
		{
			name: '[테스트] 선형대수학개론',
			desc: '이 강좌에서는 선형대수학개론을 다루며, 강의를 통해 선형대수학개론을 마스터할 수 있습니 다.',
			inst: 1,
			cat1: 6,
			cat2: 37,
			diff: 3
		},
		{
			name: '[테스트] 벡터 미적분학 시리즈1 - 미분 기초',
			desc: '이 강좌를 통해 수강생은 벡터 미적분학 (미적분2)에서 미분의 기초에 대해 다질 수 있습니다.',
			inst: 1,
			cat1: 6,
			cat2: 37,
			diff: 1
		},
		{
			name: '[테스트] 실무에서 바로 쓰는 영어 이메일',
			desc: "비즈니스 영어, 특히 이메일 작성에서 어려움을 겪으시는 분들이 빠른 시간 안에 치트키 쓰듯이 바로 바로 효과를 볼 수 있는 '외국계 무역 기업 현업 8년차' 영어 이메일 전문가의 노하우가 담긴 강의입니다.",
			inst: 1,
			cat1: 6,
			cat2: 38,
			diff: 2
		},
		{
			name: '[테스트] 스피킹 강자로 만들어주는 만능 영어회화패턴 12가지',
			desc: '전문영어강사의 현장 노하우가 담긴 체계적 & 통합적 패턴 강의로 영어실력을 끌어 올려보세 요. 영알못을 단기간에 영어 실력자로 만든 노하우, <영작-말하기-대화>의 Magical 3 Step을 경험해보세요.',
			inst: 1,
			cat1: 6,
			cat2: 38,
			diff: 3
		},
		{
			name: '[테스트] 오늘부터 개발자 - 개발자를 준비하기 전 꼭 알아야 할 것',
			desc: '오늘부터 (나도) 개발자! 개발자에 도전하는 분들을 위해 기본적인 개발 지식부터 준비 방법, 각종 노하우까지 전해드립니다.',
			inst: 1,
			cat1: 7,
			cat2: 40,
			diff: 1
		},
		{
			name: '[테스트] 비전공자를 위한 넓고 얇은 IT 지식 & 나의 개발 유형 알아보기! <M.B.I.T>',
			desc: '나의 개발 유형을 테스트해보자! MBTI아닌 MBIT! My Best IT personalities! 개발에 대한 전 반적인 내용을 살펴보고 나에게 가장 잘 맞는 개발 적성을 알아볼 수 있습니다.',
			inst: 1,
			cat1: 7,
			cat2: 40,
			diff: 2
		},
		{
			name: '[테스트] 퍼블리셔 취업 진짜 실전 가이드',
			desc: '퍼블리셔 취업을 위한 진짜 가이드 전자책(PDF)으로 효율적인 퍼블리싱 학습방법, 좋은 퍼블 리싱 강의 잘 가르치는 퍼블리싱 강사 고르는 안목, 신입이지만 경력자처럼 퍼블리싱하는 요령, 바람직한 코 딩 습관과 원칙, 개인 포트폴리오 홈페이지 제작 방법, 디자이너 개발자와의 협업 요령, 퍼블리셔로 알아야할 필수 사이트, 포토샵 UI 디자인 실력키우기 등 퍼블리셔 취업을 위해 반드시 알아야 하는 HTML+CSS+JQUERY 퍼블리싱 기본기를 상세하게 알려드립니다. 또한, 국비지원 퍼블리셔 과정에 대해 상세히 설명합니다.',
			inst: 1,
			cat1: 7,
			cat2: 40,
			diff: 3
		},
		{
			name: '[테스트] 스타트업 A to Z',
			desc: '스타트업에 대한 솔직한 얘기, 사업자 등록부터 지분 관계, 채용, 대출 한도까지 그동안 스타트업에 관련해 상담해드렸던 내용을 강의로 만들어 보았습니다!',
			inst: 1,
			cat1: 7,
			cat2: 42,
			diff: 1
		},
		{
			name: '[테스트] 스타트업 아이템발굴부터 투자유치까지',
			desc: '스타트업을 하고 싶지만 막연한 두려움과 방법을 몰라 고민하시는 분들께 구체적인 방법론을 제시합니다. 네이버, 카카오, 야후에서 근무했고 실제로 2번의 창업 경험이 있는 실무자가 알려주는 스타트업에 대한 모든 것! 아이템 선정부터 팀빌딩, 사업계획서 작성, 비즈니스모델 수립, 투자유치까지! 실제 현장에서 배운 생생한 노하우를 전달해드립니다. 준비된 창업만이 패가망신을 피할 수 있습니다.',
			inst: 1,
			cat1: 7,
			cat2: 42,
			diff: 2
		},
		{
			name: '[테스트] 직장인을 위한 자산관리 101',
			desc: '직장인을 위한 현실적인 자산관리와 투자 방법론을 다루는 101 강의입니다. 스스로의 투자 성향에 맞춘 포트폴리오를 구성하고 응용하는 방법을 다룹니다.',
			inst: 1,
			cat1: 8,
			cat2: 44,
			diff: 3
		},
		{
			name: '[테스트] 보통 직장인의 위대한 글쓰기',
			desc: '퇴근 후 나는 작가가 된다',
			inst: 1,
			cat1: 8,
			cat2: 44,
			diff: 1
		},
		{
			name: '[테스트] [기초스피치] 12년차 아나운서에게 배우는 말 잘하는 방법!',
			desc: '말을 잘하고 싶나요? 발표할 때 자꾸 긴장하나요? 12년차 아나운서 흥버튼에게 체계적으로 스피치를 배워 보세요. 당신의 인생이 달라질 겁니다.',
			inst: 1,
			cat1: 8,
			cat2: 44,
			diff: 2
		},
		{
			name: '[테스트] 배우면 평생 써먹는 일과 삶의 핵무기 - 돈이 되는 글쓰기',
			desc: '보고서, 마케팅, 유튜브, SNS! 당신이 어디서 무엇을 하든 글쓰기 능력이 성공을 좌우합니다. 독이 되는 글이 아닌, ‘돈’이 되는 글쓰기가 답! 대한민국 대표 글쓰기 코치가 전하는 <직장인을 위한 돈이 되는 글쓰기> 족집게 노하우에 주목해 보세요!',
			inst: 1,
			cat1: 8,
			cat2: 44,
			diff: 3
		},
		{
			name: '[테스트] 리그 오브 레전드 프로게이머처럼 플레이하기:BASIC',
			desc: '리그 오브 레전드를 플레이할 때 꼭 필요한 기본 개념과 상황에 맞는 플레이를 기초부터 차근차근 알려드립니다.',
			inst: 1,
			cat1: 8,
			cat2: 44,
			diff: 1
		}
	];
	const course_hashtag = [
	[1, 1],
	[1, 9],
	[2, 1],
	[3, 2],
	[4, 2],
	[5, 3],
	[6, 3],
	[7, 4],
	[8, 4],
	[9, 5],
	[9, 14],
	[10, 5],
	[11, 6],
	[11, 7],
	[12, 6],
	[13, 7],
	[14, 8],
	[15, 8],
	[16, 9],
	[17, 10],
	[18, 10],
	[19, 11],
	[20, 11],
	[21, 12],
	[21, 13],
	[22, 12],
	[23, 13],
	[24, 14],
	[25, 15],
	[26, 15],
	[27, 16],
	[28, 16],
	[29, 17],
	[30, 17],
	[30, 24],
	[30, 31],
	[30, 33],
	[31, 18],
	[32, 18],
	[33, 19],
	[33, 23],
	[34, 19],
	[35, 20],
	[36, 20],
	[37, 21],
	[38, 21],
	[39, 22],
	[40, 22],
	[40, 29],
	[40, 30],
	[41, 23],
	[42, 24],
	[43, 25],
	[43, 36],
	[44, 25],
	[45, 26],
	[45, 27],
	[45, 28],
	[46, 27],
	[47, 26],
	[47, 40],
	[48, 28],
	[49, 29],
	[49, 30],
	[50, 31],
	[50, 32],
	[51, 32],
	[52, 33],
	[53, 34],
	[53, 35],
	[54, 34],
	[54, 35],
	[55, 36],
	[56, 37],
	[56, 38],
	[56, 39],
	[57, 37],
	[57, 38],
	[57, 39],
	[58, 40]
	];
	const hashtag = [
		{
		"id": 1,
		"tag": "Back-End"
		},
		{
		"id": 2,
		"tag": "Spring"
		},
		{
		"id": 3,
		"tag": "React Native"
		},
		{
		"id": 4,
		"tag": "앱개발"
		},
		{
		"id": 5,
		"tag": "Flutter"
		},
		{
		"id": 6,
		"tag": "클론코딩"
		},
		{
		"id": 7,
		"tag": "Front-End"
		},
		{
		"id": 8,
		"tag": "Vue.js"
		},
		{
		"id": 9,
		"tag": "Node.js"
		},
		{
		"id": 10,
		"tag": "Express"
		},
		{
		"id": 11,
		"tag": "정보보안"
		},
		{
		"id": 12,
		"tag": "AWS"
		},
		{
		"id": 13,
		"tag": "Linux"
		},
		{
		"id": 14,
		"tag": "블록체인"
		},
		{
		"id": 15,
		"tag": "개발"
		},
		{
		"id": 16,
		"tag": "Docker"
		},
		{
		"id": 17,
		"tag": "네트워크"
		},
		{
		"id": 18,
		"tag": "프로토콜"
		},
		{
		"id": 19,
		"tag": "데이터 분석"
		},
		{
		"id": 20,
		"tag": "Python"
		},
		{
		"id": 21,
		"tag": "딥러닝"
		},
		{
		"id": 22,
		"tag": "CNN"
		},
		{
		"id": 23,
		"tag": "인공신경망"
		},
		{
		"id": 24,
		"tag": "웹 크롤링"
		},
		{
		"id": 25,
		"tag": "데이터 시각화"
		},
		{
		"id": 26,
		"tag": "R"
		},
		{
		"id": 27,
		"tag": "3D 모델링"
		},
		{
		"id": 28,
		"tag": "3ds MAX"
		},
		{
		"id": 29,
		"tag": "UX/UI"
		},
		{
		"id": 30,
		"tag": "취업"
		},
		{
		"id": 31,
		"tag": "애니메이션"
		},
		{
		"id": 32,
		"tag": "이모티콘"
		},
		{
		"id": 33,
		"tag": "콘텐츠 마케팅"
		},
		{
		"id": 34,
		"tag": "Figma"
		},
		{
		"id": 35,
		"tag": "Unity"
		},
		{
		"id": 36,
		"tag": "VR/AR"
		},
		{
		"id": 37,
		"tag": "Excel"
		},
		{
		"id": 38,
		"tag": "MS-Office"
		},
		{
		"id": 39,
		"tag": "한컴오피스"
		},
		{
		"id": 40,
		"tag": "실무"
		},
		{
		"id": 41,
		"tag": "PR"
		},
		{
		"id": 42,
		"tag": "디지털 마케팅"
		},
		{
		"id": 43,
		"tag": "투자"
		},
		{
		"id": 44,
		"tag": "Pandas"
		},
		{
		"id": 45,
		"tag": "수학"
		},
		{
		"id": 46,
		"tag": "선형대수학"
		},
		{
		"id": 47,
		"tag": "게임"
		},
		{
		"id": 48,
		"tag": "미적분"
		},
		{
		"id": 49,
		"tag": "영어"
		},
		{
		"id": 50,
		"tag": "면접"
		},
		{
		"id": 51,
		"tag": "자기계발"
		},
		{
		"id": 52,
		"tag": "웹 퍼블리싱"
		},
		{
		"id": 53,
		"tag": "창업"
		},
		{
		"id": 54,
		"tag": "경영"
		},
		{
		"id": 55,
		"tag": "재테크"
		},
		{
		"id": 56,
		"tag": "집필"
		},
		{
		"id": 57,
		"tag": "글쓰기"
		},
		{
		"id": 58,
		"tag": "E-Sports"
		}
	];
	const cat1 = [
		{
		"id": 1,
		"name": "개발 · 프로그래밍"
		},
		{
		"id": 2,
		"name": "보안 · 네트워크"
		},
		{
		"id": 3,
		"name": "데이터 사이언스"
		},
		{
		"id": 4,
		"name": "크리에이티브"
		},
		{
		"id": 5,
		"name": "직무 · 마케팅"
		},
		{
		"id": 6,
		"name": "학문 · 외국어"
		},
		{
		"id": 7,
		"name": "커리어"
		},
		{
		"id": 8,
		"name": "교양"
		}
	];
	const cat2 = [
		{
		"id": 1,
		"name": "웹 개발",
		"cat1_id": 1
		},
		{
		"id": 2,
		"name": "프론트엔드",
		"cat1_id": 1
		},
		{
		"id": 3,
		"name": "백엔드",
		"cat1_id": 1
		},
		{
		"id": 4,
		"name": "풀스택",
		"cat1_id": 1
		},
		{
		"id": 5,
		"name": "모바일 앱 개발",
		"cat1_id": 1
		},
		{
		"id": 6,
		"name": "프로그래밍 언어",
		"cat1_id": 1
		},
		{
		"id": 7,
		"name": "알고리즘 · 자료구조",
		"cat1_id": 1
		},
		{
		"id": 8,
		"name": "데이터 사이언스",
		"cat1_id": 1
		},
		{
		"id": 9,
		"name": "데이터베이스",
		"cat1_id": 1
		},
		{
		"id": 10,
		"name": "데브옵스 · 인프라",
		"cat1_id": 1
		},
		{
		"id": 11,
		"name": "게임 개발",
		"cat1_id": 1
		},
		{
		"id": 12,
		"name": "보안",
		"cat1_id": 2
		},
		{
		"id": 13,
		"name": "시스템",
		"cat1_id": 2
		},
		{
		"id": 14,
		"name": "클라우드",
		"cat1_id": 2
		},
		{
		"id": 15,
		"name": "블록체인",
		"cat1_id": 2
		},
		{
		"id": 16,
		"name": "기타",
		"cat1_id": 2
		},
		{
		"id": 17,
		"name": "데이터 분석",
		"cat1_id": 3
		},
		{
		"id": 18,
		"name": "인공지능",
		"cat1_id": 3
		},
		{
		"id": 19,
		"name": "데이터 시각화",
		"cat1_id": 3
		},
		{
		"id": 20,
		"name": "데이터 수집 · 처리",
		"cat1_id": 3
		},
		{
		"id": 21,
		"name": "기타",
		"cat1_id": 3
		},
		{
		"id": 22,
		"name": "CAD · 3D 모델링",
		"cat1_id": 4
		},
		{
		"id": 23,
		"name": "웹 퍼블리싱",
		"cat1_id": 4
		},
		{
		"id": 24,
		"name": "UX/UI",
		"cat1_id": 4
		},
		{
		"id": 25,
		"name": "그래픽 디자인",
		"cat1_id": 4
		},
		{
		"id": 26,
		"name": "디자인 툴",
		"cat1_id": 4
		},
		{
		"id": 27,
		"name": "사진 · 영상",
		"cat1_id": 4
		},
		{
		"id": 28,
		"name": "VR/AR",
		"cat1_id": 4
		},
		{
		"id": 29,
		"name": "사운드",
		"cat1_id": 4
		},
		{
		"id": 30,
		"name": "기타",
		"cat1_id": 4
		},
		{
		"id": 31,
		"name": "오피스",
		"cat1_id": 5
		},
		{
		"id": 32,
		"name": "마케팅",
		"cat1_id": 5
		},
		{
		"id": 33,
		"name": "기획 · 전략 · PM",
		"cat1_id": 5
		},
		{
		"id": 34,
		"name": "업무 자동화",
		"cat1_id": 5
		},
		{
		"id": 35,
		"name": "금융 · 경영",
		"cat1_id": 5
		},
		{
		"id": 36,
		"name": "기타",
		"cat1_id": 5
		},
		{
		"id": 37,
		"name": "수학",
		"cat1_id": 6
		},
		{
		"id": 38,
		"name": "외국어",
		"cat1_id": 6
		},
		{
		"id": 39,
		"name": "기타",
		"cat1_id": 6
		},
		{
		"id": 40,
		"name": "취업 · 이직",
		"cat1_id": 7
		},
		{
		"id": 41,
		"name": "개인 브랜딩",
		"cat1_id": 7
		},
		{
		"id": 42,
		"name": "창업",
		"cat1_id": 7
		},
		{
		"id": 43,
		"name": "기타",
		"cat1_id": 7
		},
		{
		"id": 44,
		"name": "교양",
		"cat1_id": 8
		}
	];

	// CREATE TABLE
	try {
		await db.query(`CREATE TABLE course
		(
			id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
			title VARCHAR(100) NOT NULL,
			description TEXT NOT NULL,
			inst_id BIGINT NOT NULL,
			cat1 INT NOT NULL,
			cat2 INT NOT NULL,
			thumbnail VARCHAR(200) NULL,
			difficulty INT NOT NULL,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
		);`);
		await db.query(`CREATE TABLE user
		(
			id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
			email VARCHAR(50) NOT NULL UNIQUE,
			password VARCHAR(200) NOT NULL,
			name VARCHAR(20) NOT NULL,
			sex INT NOT NULL,
			phone VARCHAR(20) NOT NULL,
			birth DATE NOT NULL,
			joined DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			description VARCHAR(200),
			privilege INT NOT NULL DEFAULT 4,
			salt VARCHAR(200) NOT NULL
		);`);
		await db.query(`CREATE TABLE cat1
		(
			id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
			name VARCHAR(30) NOT NULL
		);`);
		await db.query(`CREATE TABLE cat2
		(
			id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
			name VARCHAR(30) NOT NULL,
			cat1_id BIGINT NOT NULL
		);`);
		await db.query(`CREATE TABLE hashtag
		(
			id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
			tag VARCHAR(20) NOT NULL
		);`);
		await db.query(`CREATE TABLE course_hashtag
		(
			course_id BIGINT NOT NULL,
			hashtag_id BIGINT NOT NULL
		);`);
	} catch (err) {
		return res.json(stat(500, err.message));
	}
	
	// course
	course.forEach(async (e) => {
		await db.query(`INSERT INTO course(title, description, inst_id, cat1, cat2, thumbnail, difficulty) VALUES(?, ?, ?, ?, ?, ?, ?)`,
		[e.name, e.desc, e.inst, e.cat1, e.cat2, 'no thumbnail', e.diff])
			.catch(err => res.json(stat(500, err.message)));
	});
	// course_hashtag
	course_hashtag.forEach(async (e) => {
		await db.query(`INSERT INTO course_hashtag(course_id, hashtag_id) VALUES(?, ?)`,
		[e[0], e[1]])
			.catch(err => res.json(stat(500, err.message)));
	});
	// hashtag
	hashtag.forEach(async (e) => {
		await db.query(`INSERT INTO hashtag(tag) VALUES(?)`,
		[e.tag])
			.catch(err => res.json(stat(500, err.message)));
	});
	// cat1
	cat1.forEach(async (e) => {
		await db.query(`INSERT INTO cat1(name) VALUES(?)`,
		[e.name])
			.catch(err => res.json(stat(500, err.message)));
	});
	// cat2
	cat2.forEach(async (e) => {
		await db.query(`INSERT INTO cat2(name, cat1_id) VALUES(?, ?)`,
		[e.name, e.cat1_id])
			.catch(err => res.json(stat(500, err.message)));
	});

	return res.json
})


export default router;
