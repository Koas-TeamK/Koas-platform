import ProductViewer from "@/components/calmstand/ProductViewer"

export default function CalmStandPage() {
    return (
        <div className="w-3/4 m-auto mt-30">
            <div className="text-3xl text-black text-center text-bold p-5">CalmStand 미리보기</div>
            <div className="
                border border-black/50 rounded-xl p-1
            ">
                {/* 3D 뷰어가 렌더링될 영역의 크기를 반드시 지정해야 합니다. */}
                <div style={{ height: '500px', width: '100%', margin: '0 auto' }}>
                    <ProductViewer />
                </div>

            </div>
        </div>
    );
}