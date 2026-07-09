import { Head } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import ProductImageGallery from '@/Components/ProductImageGallery';
import ProductInfo from '@/Components/ProductInfo';

export default function Show({ product, auth }) {
    return (
        <StoreLayout auth={auth}>
            <Head title={product.name} />

            <div className="product-page">
                <div className="product-page-inner">
                    <ProductImageGallery
                        images={product.images}
                        primaryImage={product.primary_image}
                    />

                    <ProductInfo product={product} />
                </div>
            </div>
        </StoreLayout>
    );
}
