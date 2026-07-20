import ProductTile from '@/Components/ProductTile';

export default function FeaturedProducts({ products }) {
    if (!products?.length) return null;

    return (
        <section className="featured-products">
            <h2 className="section-title">Productos Destacados</h2>
            <div className="featured-products-grid">
                {products.map((product) => (
                    <ProductTile key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
