import { Link, usePage } from '@inertiajs/react';

export default function HeaderCart() {
    const { cart_count = 0 } = usePage().props;

    return (
        <Link href={route('cart.index')} className="header-cart" aria-label="Carrito">
            <svg className="header-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-4 4 4 4 0 01-4-4" />
            </svg>
            {cart_count > 0 && <span className="header-cart-badge">{cart_count}</span>}
        </Link>
    );
}
