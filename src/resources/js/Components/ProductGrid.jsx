import ProductTile from '@/Components/ProductTile';

export default function ProductGrid({ products = [] }) {
    if (products.length === 0) {
        return (
            <div className="product-grid-empty">
                <p>No se encontraron productos.</p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductTile key={product.id} product={product} />
            ))}
        </div>
    );
}
