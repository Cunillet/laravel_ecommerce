import { Link } from '@inertiajs/react';
import HeaderCart from '@/Components/HeaderCart';

export default function StoreLayout({ children, auth = null }) {
    return (
        <div className="store-layout">
            <header className="store-header">
                <div className="store-header-inner">
                    <Link href="/" className="store-logo">
                        Cuntras
                    </Link>

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
