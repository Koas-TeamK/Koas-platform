//PurchaseSection.tsx
import ProductTile from "./ProductTile";

export default function PurchaseSection() {
    return (
        <section className="flex m-0 gap-0 w-full h-full bg-[#c8bdb6]">
            <ProductTile
                className="relative flex-1"
                imgSrc="/img/chair/high-chair.png"
                titleKey="purchase.high.title"
                altKey="purchase.high.alt"
                href="#"
            />
            <ProductTile
                className="relative flex-1"
                imgSrc="/img/chair/mid-chair.png"
                titleKey="purchase.middle.title"
                altKey="purchase.middle.alt"
                href="#"
            />
        </section>
    );
}
