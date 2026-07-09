export default function PriceDisplay({ price, salePrice = null }) {
    const hasSale = salePrice?.amount && salePrice.amount < price.amount;

    return (
        <div className="price-display">
            {hasSale ? (
                <>
                    <span className="price-original">{Number(price.amount).toFixed(2)} €</span>
                    <span className="price-sale">{Number(salePrice.amount).toFixed(2)} €</span>
                    <span className="price-badge">
                        -{Math.round((1 - salePrice.amount / price.amount) * 100)}%
                    </span>
                </>
            ) : (
                <span className="price-standard">{Number(price.amount).toFixed(2)} €</span>
            )}
        </div>
    );
}
