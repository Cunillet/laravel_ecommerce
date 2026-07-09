import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import CategoryFilters from '@/Components/CategoryFilters';
import ProductGrid from '@/Components/ProductGrid';

export default function CategoryShow({ category, products, filters, availableColors, auth }) {
    const breadcrumbItems = (category.ancestors || []).map((a) => ({
        slug: a.slug,
        name: a.name,
    }));

    const hasFilters = filters?.name || filters?.colors?.length > 0 || filters?.price_min || filters?.price_max;

    return (
        <StoreLayout auth={auth}>
            <Head title={category.name} />

            <div className="category-page">
                <Breadcrumb items={breadcrumbItems} />

                <div className="category-header">
                    <h1 className="category-title">{category.name}</h1>
                    {category.description && (
                        <p className="category-description">{category.description}</p>
                    )}
                </div>

                <div className="category-layout">
                    <CategoryFilters
                        filters={filters}
                        availableColors={availableColors}
                        categorySlug={category.slug}
                    />

                    <div className="category-main">
                        <div className="category-meta">
                            <span className="category-count">
                                {products.total} producto{products.total !== 1 ? 's' : ''}
                                {hasFilters ? ' encontrados' : ''}
                            </span>
                        </div>

                        <ProductGrid products={products.data} />

                        {products.last_page > 1 && (
                            <div className="pagination">
                                {products.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`pagination-link ${link.active ? 'is-active' : ''} ${!link.url ? 'is-disabled' : ''}`}
                                        preserveState
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
