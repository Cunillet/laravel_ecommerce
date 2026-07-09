import { useState } from 'react';

export default function ProductImageGallery({ images = [], primaryImage }) {
    const mainImage = primaryImage || images?.[0];
    const [selected, setSelected] = useState(mainImage?.id || null);

    const current = images?.find((img) => img.id === selected) || mainImage;
    const gallery = images?.filter((img) => img.id !== selected) || [];

    if (!current) {
        return <div className="gallery-placeholder">Sin imagen</div>;
    }

    return (
        <div className="product-gallery">
            <div className="gallery-main">
                <img
                    src={current.url}
                    alt="Producto"
                    className="gallery-main-img"
                />
            </div>
            {gallery.length > 0 && (
                <div className="gallery-thumbs">
                    {gallery.map((img) => (
                        <button
                            key={img.id}
                            type="button"
                            className="gallery-thumb"
                            onClick={() => setSelected(img.id)}
                        >
                            <img src={img.url} alt="" className="gallery-thumb-img" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
