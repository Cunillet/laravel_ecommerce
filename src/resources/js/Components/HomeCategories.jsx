import { Link } from '@inertiajs/react';

export default function HomeCategories({ categories }) {
    if (!categories?.length) return null;

    return (
        <section className="home-categories">
            <h2 className="section-title">Categorías</h2>
            <div className="home-categories-grid">
                {categories.map((category) => (
                    <div key={category.id} className="home-category-card">
                        <Link
                            href={`/category/${category.slug}`}
                            className="home-category-card-link"
                        >
                            <h3 className="home-category-name">{category.name}</h3>
                            {category.description && (
                                <p className="home-category-desc">{category.description}</p>
                            )}
                            <span className="home-category-count">
                                {category.products_count} producto{category.products_count !== 1 ? 's' : ''}
                            </span>
                        </Link>

                        {category.children?.length > 0 && (
                            <div className="home-category-children">
                                {category.children.map((child) => (
                                    <Link
                                        key={child.id}
                                        href={`/category/${child.slug}`}
                                        className="home-category-child-link"
                                    >
                                        {child.name}
                                        <span className="home-category-child-count">
                                            {child.products_count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
