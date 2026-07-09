import { useState } from 'react';
import PriceDisplay from '@/Components/PriceDisplay';
import ColorSelector from '@/Components/ColorSelector';
import SizeSelector from '@/Components/SizeSelector';
import AddToCartButton from '@/Components/AddToCartButton';
import ReviewList from '@/Components/ReviewList';

export default function ProductInfo({ product }) {
    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const handleAddToCart = ({ quantity }) => {
        // TODO: implementar lógica de carrito
        console.log('Add to cart:', { product, color: selectedColor, size: selectedSize, quantity });
    };

    return (
        <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <PriceDisplay
                price={product.active_price}
                salePrice={product.sale_price}
            />

            <ColorSelector
                colors={product.colors}
                selected={selectedColor}
                onChange={setSelectedColor}
            />

            <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onChange={setSelectedSize}
            />

            {product.size_guide && (
                <div className="size-guide">
                    <button
                        type="button"
                        className="size-guide-btn"
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                    >
                        <svg className="size-guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                        </svg>
                        Guía de tallas
                    </button>
                    {showSizeGuide && (
                        <div className="size-guide-content">
                            <p>{product.size_guide}</p>
                        </div>
                    )}
                </div>
            )}

            <AddToCartButton product={product} onAddToCart={handleAddToCart} />

            <ReviewList reviews={product.reviews} />

            <div className="product-description">
                <h3 className="product-description-title">Descripción</h3>
                <div className="product-description-content">
                    {product.description}
                </div>
            </div>
        </div>
    );
}
