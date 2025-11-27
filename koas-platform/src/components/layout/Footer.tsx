import KoasLogoUrl from '@/assets/koas-logo.svg';

export default function Footer() {
    return (
        <footer className="px-4 py-6 text-sm text-black bg-white">
            <div className="flex flex-col mt-4 text-xs leading-5 sm:mt-7 sm:leading-normal">
                <img src={KoasLogoUrl} alt="KOAS" className="h-16 w-16 inline-block align-middle" />
                <div className="space-y-2 space-x-4 ">
                    <span>(주)코아스</span>
                    <span>대표: 민경중, 노병구</span>
                    <span>사업자등록번호: 117-81-09929</span>
                    <p>주소: (07222) 서울특별시 영등포구 선유로52길 17 코아스 빌딩</p>
                    <p className="text-xs text-neutral-600">관리자: team-K | 본 페이지는 KOAS 마이크로 홈페이지입니다.</p>
                    <p className="text-xs text-neutral-600">Copyright © 2025 KOAS CO., LTD. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
