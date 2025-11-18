import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Environment } from '@react-three/drei';

// 모델 로딩 컴포넌트의 Props 타입을 정의합니다.
interface ProductModelProps {
    url: string;
}

// 3D 모델 로딩 컴포넌트
function ProductModel({ url }: ProductModelProps) {
    // useGLTF 훅을 사용하여 GLB/GLTF 모델을 로드합니다.
    // 이 훅은 모델의 구조를 담은 Three.js 객체들을 반환합니다.
    // 로딩 시 Suspense가 필요합니다.
    const { scene } = useGLTF(url);

    // 로드된 씬(scene)을 primitive로 렌더링합니다.
    // scene은 Group 객체이며, 내부의 Mesh, Material 등을 포함합니다.
    return <primitive object={scene} scale={1} />;
}

export default function ProductViewer() {
    return (
        // 캔버스 컴포넌트: 3D 렌더링이 일어날 DOM 요소를 정의합니다.
        <Canvas
            // 카메라 위치 설정 (x, y, z)
            camera={{ position: [2, 2, 2], fov: 75 }}
            style={{ width: '100%', height: '500px', background: '#ffffffff' }}
        >
            {/* Suspense는 모델 로딩이 완료될 때까지 기다립니다. */}
            <Suspense fallback={
                <mesh>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color="gray" />
                </mesh>
            }>

                {/* ✨ 빛 (Lighting) 설정: 모델에 입체감을 부여합니다. */}
                {/* AmbientLight: 모든 방향에서 들어오는 빛 (모델의 전체 밝기를 높임) */}
                <ambientLight intensity={0.3} />

                {/* SpotLight: 특정 방향에서 비추는 빛 (그림자 및 하이라이트 생성) */}
                <spotLight position={[5, 10, 5]} intensity={1} angle={0.3} penumbra={1} castShadow />

                <Environment preset="city" />

                {/* ✨ 제품 모델 로드 */}
                <ProductModel url="/calmStand/CES_1.glb" />

                {/* ✨ 카메라 컨트롤: 마우스로 모델을 회전/줌 할 수 있게 해줍니다. */}
                <OrbitControls enableZoom={true} />

            </Suspense>
        </Canvas>
    );
}