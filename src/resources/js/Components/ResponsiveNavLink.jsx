import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`responsive-nav-link ${active ? 'active' : 'inactive'} ${className}`}
        >
            {children}
        </Link>
    );
}
