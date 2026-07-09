import { Link } from '@inertiajs/react';

export default function ProductTile({ product }) {
    const price = product.active_price;
    const salePrice = product.sale_price;
    const hasSale = salePrice?.amount && salePrice.amount < price?.amount;

    return (
        <Link href={`/product/${product.slug}`} className="product-tile">
            <div className="product-tile-image">
                {product.primary_image ? (
                    <img
                        src={product.primary_image.url}
                        alt={product.name}
                        loading="lazy"
                    />
                ) : (
                    <div className="product-tile-image-placeholder" />
                )}
            </div>

            <div className="product-tile-body">
                <h3 className="product-tile-name">{product.name}</h3>

                <div className="product-tile-price">
                    {hasSale ? (
                        <>
                            <span className="product-tile-price-original">
                                {Number(price.amount).toFixed(2)} €
                            </span>
                            <span className="product-tile-price-sale">
                                {Number(salePrice.amount).toFixed(2)} €
                            </span>
                        </>
                    ) : price ? (
                        <span className="product-tile-price-standard">
                            {Number(price.amount).toFixed(2)} €
                        </span>
                    ) : null}
                </div>

                {product.colors?.length > 0 && (
                    <div className="product-tile-colors">
                        {product.colors.filter(Boolean).map((color, i) => (
                            <span
                                key={i}
                                className="product-tile-color"
                                style={{ backgroundColor: color.value || color }}
                                title={color.name || color}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}
