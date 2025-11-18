import ProductViewer from '@/components/calmStand/ProductViewer';

export default function CalmStandPage() {
    return (
        <div>
            <h1 className="text-black">제품 3D 모델 미리보기</h1>

            {/* 3D 뷰어가 렌더링될 영역의 크기를 반드시 지정해야 합니다. */}
            <div style={{ height: '500px', width: '80%', margin: '0 auto', border: '1px solid #ffffffff' }}>
                <ProductViewer />
            </div>

            <p>모델을 드래그하여 회전시키거나 스크롤하여 확대/축소할 수 있습니다.</p>
        </div>
    );
}