//components/Popup.tsx
import { useEffect, useState } from "react";

export default function PosterPopup() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hideUntil = localStorage.getItem("hidePopupUntil");
        const now = new Date();

        if (!hideUntil || now > new Date(hideUntil)) {
            setOpen(true);
        }
    }, []);

    const handleClose = () => setOpen(false);

    const handleHide7Days = () => {
        const next = new Date();
        next.setDate(next.getDate() + 7);
        localStorage.setItem("hidePopupUntil", next.toISOString());
        setOpen(false);
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-opacity-60 z-50 flex justify-center items-center">
            <div className="w-full max-w-lg">
                <div>
                    <img
                        src="/img/comingSoonPoster.jpg"
                        alt="Coming Soon"
                        style={{
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            zIndex: -1,
                        }}
                    />
                </div>
                <div className="flex justify-around bg-black">
                    <button
                        onClick={handleHide7Days}
                        className="p-2 w-1/2 cursor-pointer "
                    >
                        7일간 보지 않기
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-2 w-1/2 cursor-pointer"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    )
}