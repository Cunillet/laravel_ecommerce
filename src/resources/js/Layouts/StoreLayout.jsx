import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import HeaderCart from '@/Components/HeaderCart';
import Footer from '@/Components/Footer';

export default function StoreLayout({ children, auth = null, hideAuthLinks = false }) {
    const { categories = [] } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                closeMenu();
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen, closeMenu]);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="store-layout">
            <header className="store-header">
                <div className="store-header-inner">
                    <Link href="/" className="store-logo">
                        Cuntras
                    </Link>

                    {categories.length > 0 && (
                        <nav className="store-categories-nav" aria-label="Categorías">
                            {categories.map((cat) => (
                                <div key={cat.id} className="store-cat-dropdown">
                                    <Link
                                        href={`/category/${cat.slug}`}
                                        className="store-cat-link"
                                    >
                                        {cat.name}
                                    </Link>
                                    {cat.children?.length > 0 && (
                                        <div className="store-cat-dropdown-menu">
                                            <div className="store-cat-dropdown-inner">
                                                {cat.children.map((child) => (
                                                    <Link
                                                        key={child.id}
                                                        href={`/category/${child.slug}`}
                                                        className="store-cat-sub-link"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    )}

                    <nav className="store-header-nav">
                        <HeaderCart />

                        {auth?.user ? (
                            <div className="store-user-menu" ref={menuRef}>
                                <button
                                    type="button"
                                    className="store-user-menu-btn"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                >
                                    {auth.user.name}
                                    <svg
                                        className={`store-user-menu-chevron ${menuOpen ? 'store-user-menu-chevron--open' : ''}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        width="14"
                                        height="14"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </button>

                                {menuOpen && (
                                    <div className="store-user-dropdown">
                                        <Link
                                            href={route('profile.index')}
                                            className="store-user-dropdown-link"
                                            onClick={closeMenu}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            Ver perfil
                                        </Link>
                                        <Link
                                            href={route('profile.addresses.index')}
                                            className="store-user-dropdown-link"
                                            onClick={closeMenu}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            Direcciones
                                        </Link>
                                        <Link
                                            href={route('profile.orders.index')}
                                            className="store-user-dropdown-link"
                                            onClick={closeMenu}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                                                <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
                                            </svg>
                                            Pedidos
                                        </Link>
                                        <div className="store-user-dropdown-divider" />
                                        <button
                                            type="button"
                                            className="store-user-dropdown-link"
                                            onClick={handleLogout}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                                <polyline points="16 17 21 12 16 7" />
                                                <line x1="21" y1="12" x2="9" y2="12" />
                                            </svg>
                                            Cerrar sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : !hideAuthLinks ? (
                            <>
                                <Link href={route('login')} className="store-header-link">
                                    Iniciar sesión
                                </Link>
                                <Link href={route('register')} className="btn-primary text-xs">
                                    Registrarse
                                </Link>
                            </>
                        ) : null}
                    </nav>
                </div>
            </header>

            <main className="store-main">
                {children}
            </main>

            <Footer />
        </div>
    );
}
