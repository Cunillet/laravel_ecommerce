import { useState } from 'react';

export default function AddToCartButton({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);

    const handleAdd = () => {
        onAddToCart?.({ product, quantity });
        setQuantity(1);
    };

    return (
        <div className="add-to-cart">
            <div className="quantity-selector">
                <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                >
                    −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                    type="button"
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                >
                    +
                </button>
            </div>

            <button type="button" className="btn-primary btn-lg add-to-cart-btn" onClick={handleAdd}>
                Añadir al carrito
            </button>
        </div>
    );
}
