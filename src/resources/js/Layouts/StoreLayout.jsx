import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import HeaderCart from '@/Components/HeaderCart';
import Footer from '@/Components/Footer';

export default function StoreLayout({ children, auth = null, hideAuthLinks = false }) {
    const { categories = [] } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openCatId, setOpenCatId] = useState(null);
    const [mobileOpenCatId, setMobileOpenCatId] = useState(null);
    const menuRef = useRef(null);
    const catRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const closeCat = useCallback(() => setOpenCatId(null), []);
    const closeMobileMenu = useCallback(() => {
        setMobileMenuOpen(false);
        setMobileOpenCatId(null);
    }, []);

    const toggleMobileCat = (id) => {
        setMobileOpenCatId((prev) => (prev === id ? null : id));
    };

    const toggleCat = (id) => {
        setOpenCatId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                closeMenu();
            }
            if (catRef.current && !catRef.current.contains(e.target)) {
                closeCat();
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && !e.target.closest('.store-mobile-menu-btn')) {
                closeMobileMenu();
            }
        };

        if (menuOpen || openCatId !== null || mobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen, openCatId, mobileMenuOpen, closeMenu, closeCat, closeMobileMenu]);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="store-layout">
            <header className="store-header">
                <div className="store-header-inner">
                    <div className="store-header-left">
                        <Link href="/" className="store-logo">
                            Cuntras
                        </Link>

                        {categories.length > 0 && (
                            <nav className="store-categories-nav" aria-label="Categorías" ref={catRef}>
                                {categories.map((cat) => (
                                    <div key={cat.id} className="store-cat-dropdown">
                                        <button
                                            type="button"
                                            className="store-cat-link"
                                            onClick={() => toggleCat(cat.id)}
                                        >
                                            {cat.name}
                                            {cat.children?.length > 0 && (
                                                <svg
                                                    className={`store-cat-chevron ${openCatId === cat.id ? 'store-cat-chevron--open' : ''}`}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    width="12"
                                                    height="12"
                                                >
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            )}
                                        </button>
                                        {cat.children?.length > 0 && openCatId === cat.id && (
                                            <div className="store-cat-dropdown-menu">
                                                <div className="store-cat-dropdown-inner">
                                                    <Link
                                                        href={`/category/${cat.slug}`}
                                                        className="store-cat-sub-link"
                                                        onClick={closeCat}
                                                    >
                                                        Ver todo en {cat.name}
                                                    </Link>
                                                    {cat.children.map((child) => (
                                                        <Link
                                                            key={child.id}
                                                            href={`/category/${child.slug}`}
                                                            className="store-cat-sub-link"
                                                            onClick={closeCat}
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
                    </div>

                    <nav className="store-header-nav">
                        <button
                            type="button"
                            className="store-mobile-menu-btn"
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            aria-label="Menú"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                                {mobileMenuOpen ? (
                                    <>
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </>
                                ) : (
                                    <>
                                        <line x1="3" y1="6" x2="21" y2="6" />
                                        <line x1="3" y1="12" x2="21" y2="12" />
                                        <line x1="3" y1="18" x2="21" y2="18" />
                                    </>
                                )}
                            </svg>
                        </button>

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

            {mobileMenuOpen && (
                <div className="store-mobile-menu" ref={mobileMenuRef}>
                    <nav className="store-mobile-menu-nav">
                        {categories.map((cat) => (
                            <div key={cat.id} className="store-mobile-cat">
                                <button
                                    type="button"
                                    className="store-mobile-cat-link"
                                    onClick={() => toggleMobileCat(cat.id)}
                                >
                                    {cat.name}
                                    {cat.children?.length > 0 && (
                                        <svg
                                            className={`store-mobile-cat-chevron ${mobileOpenCatId === cat.id ? 'store-mobile-cat-chevron--open' : ''}`}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            width="14"
                                            height="14"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    )}
                                </button>
                                {cat.children?.length > 0 && mobileOpenCatId === cat.id && (
                                    <div className="store-mobile-subcats">
                                        <Link
                                            href={`/category/${cat.slug}`}
                                            className="store-mobile-sub-link"
                                            onClick={closeMobileMenu}
                                        >
                                            Ver todo en {cat.name}
                                        </Link>
                                        {cat.children.map((child) => (
                                            <Link
                                                key={child.id}
                                                href={`/category/${child.slug}`}
                                                className="store-mobile-sub-link"
                                                onClick={closeMobileMenu}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="store-mobile-menu-footer">
                        {auth?.user ? (
                            <>
                                <div className="store-mobile-user-name">{auth.user.name}</div>
                                <Link href={route('profile.index')} className="store-mobile-menu-link" onClick={closeMobileMenu}>
                                    Ver perfil
                                </Link>
                                <Link href={route('profile.addresses.index')} className="store-mobile-menu-link" onClick={closeMobileMenu}>
                                    Direcciones
                                </Link>
                                <Link href={route('profile.orders.index')} className="store-mobile-menu-link" onClick={closeMobileMenu}>
                                    Pedidos
                                </Link>
                                <button type="button" className="store-mobile-menu-link store-mobile-menu-link--logout" onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className="store-mobile-menu-link" onClick={closeMobileMenu}>
                                    Iniciar sesión
                                </Link>
                                <Link href={route('register')} className="store-mobile-menu-link" onClick={closeMobileMenu}>
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}

            <main className="store-main">
                {children}
            </main>

            <Footer />
        </div>
    );
}
