import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Environment } from '@react-three/drei';

interface ProductModelProps {
    url: string;
}

// 3D 모델 로딩 컴포넌트
function ProductModel({ url }: ProductModelProps) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={1} />;
}

export default function ProductViewer() {
    return (
        <Canvas
            // 카메라 위치 설정 (x, y, z)
            camera={{ position: [2, 2, 2], fov: 10 }}
            style={{ width: '100%', height: '500px', background: '#ffffffff' }}
        >
            <Suspense fallback={
                <mesh>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color="gray" />
                </mesh>
            }>
                <ambientLight intensity={0.3} />

                <spotLight position={[5, 10, 5]} intensity={1} angle={0.3} penumbra={1} castShadow />

                <Environment preset="city" />

                <ProductModel url="/calmStand/CES.glb" />

                <OrbitControls enableZoom={true} />

            </Suspense>
        </Canvas>
    );
}