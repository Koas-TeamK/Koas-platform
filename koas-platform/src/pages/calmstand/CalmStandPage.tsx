import ProductViewer from "@/components/calmstand/ProductViewer"

export default function CalmStandPage() {
    return (
        <div className="w-3/4 m-auto mt-30">
            <div className="text-3xl text-black text-center text-bold p-5">CalmStand 미리보기</div>
            <div className="
                border border-black/50 rounded-xl p-1
            ">
                <div style={{ height: '500px', width: '100%', margin: '0 auto' }}>
                    <ProductViewer />
                </div>

            </div>
        </div>
    );
}