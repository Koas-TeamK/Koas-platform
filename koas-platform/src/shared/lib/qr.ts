// src/lib/qr.ts
export function parseNameSerialToken(): { name: string; serial: string; token: string } {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token") || "";

    // path 예: /maruon/0001  또는 /maruon/serial=0001
    const segs = url.pathname.split("/").filter(Boolean); // ["maruon","0001"] or ["maruon","serial=0001"]

    // name: 첫 번째 세그먼트 (예: "maruon")
    const name = segs[0] || url.searchParams.get("name") || "";

    // serial: 경로 2번째 or 쿼리
    let serial = url.searchParams.get("serial") || "";
    if (segs.length >= 2) {
        const second = segs[1];
        serial = second.startsWith("serial=") ? second.slice("serial=".length) : second;
    }

    return { name, serial, token };
}
