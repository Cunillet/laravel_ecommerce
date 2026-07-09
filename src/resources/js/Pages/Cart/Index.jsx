import StoreLayout from '@/Layouts/StoreLayout';

export default function CartIndex({ items, total }) {
    return (
        <StoreLayout>
            <div className="store-container">
                <div className="cart-empty">
                    <h1>Tu carrito</h1>
                    <p>Tu carrito está vacío.</p>
                </div>
            </div>
        </StoreLayout>
    );
}
