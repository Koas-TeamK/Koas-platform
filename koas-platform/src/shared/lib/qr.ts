// src/lib/qr.ts
export function parseNameSerialToken(): { name: string; serial: string; token: string } {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token") || "";

    const segs = url.pathname.split("/").filter(Boolean);

    const name = segs[0] || url.searchParams.get("name") || "";

    let serial = url.searchParams.get("serial") || "";
    if (segs.length >= 2) {
        const second = segs[1];
        serial = second.startsWith("serial=") ? second.slice("serial=".length) : second;
    }

    return { name, serial, token };
}
