import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="auth-layout">
            <div>
                <Link href="/">
                    <ApplicationLogo className="auth-logo" />
                </Link>
            </div>

            <div className="auth-card">
                {children}
            </div>
        </div>
    );
}
