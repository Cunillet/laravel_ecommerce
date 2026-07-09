import { Link, usePage } from '@inertiajs/react';
import HeaderCart from '@/Components/HeaderCart';

export default function StoreLayout({ children, auth = null }) {
    const { categories = [] } = usePage().props;

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
                            <Link href={route('dashboard')} className="store-header-link">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="store-header-link">
                                    Iniciar sesión
                                </Link>
                                <Link href={route('register')} className="btn-primary text-xs">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="store-main">
                {children}
            </main>
        </div>
    );
}
