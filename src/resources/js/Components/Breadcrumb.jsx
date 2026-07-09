import { Link } from '@inertiajs/react';

export default function Breadcrumb({ items = [] }) {
    if (items.length === 0) return null;

    return (
        <nav aria-label="breadcrumb" className="breadcrumb">
            <ol className="breadcrumb-list">
                <li className="breadcrumb-item">
                    <Link href="/" className="breadcrumb-link">Inicio</Link>
                    <span className="breadcrumb-separator" aria-hidden="true">/</span>
                </li>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={item.slug || index} className="breadcrumb-item">
                            {isLast ? (
                                <span className="breadcrumb-current" aria-current="page">
                                    {item.name}
                                </span>
                            ) : (
                                <>
                                    <Link href={item.href || `/category/${item.slug}`} className="breadcrumb-link">
                                        {item.name}
                                    </Link>
                                    <span className="breadcrumb-separator" aria-hidden="true">/</span>
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
