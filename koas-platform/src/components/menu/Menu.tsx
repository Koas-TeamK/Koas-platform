// // components/menu/Menu.tsx
// import { useEffect } from "react";
// import { createPortal } from "react-dom";
// import { XMarkIcon } from "@heroicons/react/24/solid";

// type MenuProps = {
//     open: boolean;
//     onClose: () => void;
// };

// export default function Menu({ open, onClose }: MenuProps) {
//     useEffect(() => {
//         const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
//         window.addEventListener("keydown", onKey);
//         return () => window.removeEventListener("keydown", onKey);
//     }, [onClose]);

//     useEffect(() => {
//         if (!open) return;
//         const prev = document.body.style.overflow;
//         document.body.style.overflow = "hidden";
//         return () => { document.body.style.overflow = prev; };
//     }, [open]);

//     return createPortal(
//         <>
//             {/* overlay */}
//             <div
//                 onClick={onClose}
//                 className={[
//                     "fixed inset-0 z-[190] bg-black/40 transition-opacity duration-300",
//                     open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
//                 ].join(" ")}
//             />

//             {/* 모바일 드로어 (오른쪽) */}
//             <aside
//                 role="dialog"
//                 aria-modal="true"
//                 aria-hidden={!open}
//                 className={[
//                     "md:hidden fixed top-0 right-0 z-[200] h-dvh w-[320px] transition-transform duration-300 will-change-transform",
//                     open ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none",
//                     // 섀도우 누출 방지: 열릴 때만 섀도우, 배경은 패널로 이동
//                     open ? "shadow-2xl" : "shadow-none",
//                     "flex flex-col bg-black/50", // 필요 없으면 bg 제거 가능
//                 ].join(" ")}
//             >
//                 <div className="flex items-center justify-end px-4 h-[64px] border-b">
//                     <button type="button" aria-label="닫기" onClick={onClose} className="p-2 hover:bg-black/50 rounded-md">
//                         <XMarkIcon className="w-6 h-6" />
//                     </button>
//                 </div>

//                 <nav className="p-4 space-y-2">
//                     <a href="/about" className="block px-2 py-2 rounded hover:bg-black/50">About</a>
//                     <a href="/products" className="block px-2 py-2 rounded hover:bg-black/50">Products</a>
//                     <a href="/contact" className="block px-2 py-2 rounded hover:bg-black/50">Contact</a>
//                 </nav>
//             </aside>

//             {/* 데스크탑 드롭다운 (위에서 슬라이드) */}
//             <aside
//                 role="dialog"
//                 aria-modal="true"
//                 aria-hidden={!open}
//                 className={[
//                     "hidden md:flex fixed left-1/2 top-0 z-[200] -translate-x-1/2",
//                     "h-[50vh] max-h-[80vh] overflow-y-auto",
//                     "transition-transform duration-500 ease-out will-change-transform",
//                     open ? "translate-y-[calc(50vh-50%)] pointer-events-auto" : "-translate-y-full pointer-events-none",
//                     // ← 여기서 섀도우가 새고 있었음
//                     open ? "shadow-2xl" : "shadow-none",
//                     "w-[100vh] bg-black/50", // 필요시 w-[min(960px,100vw)]로 교체 추천
//                 ].join(" ")}
//             >
//                 <div className="flex items-center justify-end px-4 h-[64px] border-b">
//                     <button type="button" aria-label="닫기" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
//                         <XMarkIcon className="w-6 h-6" />
//                     </button>
//                 </div>

//                 <nav className="p-4 space-y-2">
//                     <a href="/about" className="block px-2 py-2 rounded hover:bg-black/50">About</a>
//                     <a href="/products" className="block px-2 py-2 rounded hover:bg-black/50">Products</a>
//                     <a href="/contact" className="block px-2 py-2 rounded hover:bg-black/50">Contact</a>
//                 </nav>
//             </aside>
//         </>,
//         document.body
//     );
// }
