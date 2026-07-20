import { router, Link, usePage } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';

export default function CartIndex({ items, total, itemCount }) {
    const { auth } = usePage().props;

    const handleUpdateQuantity = (cartItemId, quantity) => {
        router.patch(route('cart.update', { cartItem: cartItemId }), {
            quantity: Math.max(1, quantity),
        }, {
            preserveScroll: true,
        });
    };

    const handleRemoveItem = (cartItemId) => {
        router.delete(route('cart.destroy', { cartItem: cartItemId }), {
            preserveScroll: true,
        });
    };

    const hasItems = items && items.length > 0;

    return (
        <StoreLayout auth={auth}>
            <div className="cart-page store-container">
                <h1 className="cart-page-title">Tu carrito</h1>

                {hasItems ? (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {items.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-image">
                                        {item.product.image ? (
                                            <img src={item.product.image} alt={item.product.name} />
                                        ) : (
                                            <div className="cart-item-image-placeholder" />
                                        )}
                                    </div>

                                    <div className="cart-item-info">
                                        <Link href={route('product.show', item.product.slug)} className="cart-item-name">
                                            {item.product.name}
                                        </Link>

                                        <div className="cart-item-price">
                                            {item.product.sale_price ? (
                                                <>
                                                    <span className="cart-item-sale-price">
                                                        {Number(item.product.sale_price).toFixed(2)} €
                                                    </span>
                                                    <span className="cart-item-original-price">
                                                        {Number(item.product.price).toFixed(2)} €
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{Number(item.product.price).toFixed(2)} €</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="cart-item-quantity">
                                        <button
                                            type="button"
                                            className="quantity-btn"
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button
                                            type="button"
                                            className="quantity-btn"
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item-subtotal">
                                        {Number(item.subtotal).toFixed(2)} €
                                    </div>

                                    <button
                                        type="button"
                                        className="cart-item-remove"
                                        onClick={() => handleRemoveItem(item.id)}
                                        aria-label="Eliminar producto"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3 className="cart-summary-title">Resumen del pedido</h3>

                            <div className="cart-summary-row">
                                <span>Productos ({itemCount})</span>
                                <span>{Number(total).toFixed(2)} €</span>
                            </div>

                            <div className="cart-summary-row cart-summary-total">
                                <span>Total</span>
                                <span>{Number(total).toFixed(2)} €</span>
                            </div>

                            <button type="button" className="btn-primary btn-lg cart-checkout-btn" disabled>
                                Proceder al pago
                            </button>
                            <p className="cart-checkout-note">El pago estará disponible próximamente.</p>
                        </div>
                    </div>
                ) : (
                    <div className="cart-empty">
                        <svg className="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-4 4 4 4 0 01-4-4" />
                        </svg>
                        <h2>Tu carrito está vacío</h2>
                        <p>Parece que aún no has añadido productos a tu carrito.</p>
                        <Link href="/" className="btn-primary">Ir a la tienda</Link>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
