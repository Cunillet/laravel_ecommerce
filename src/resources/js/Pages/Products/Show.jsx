import { Head } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import ProductImageGallery from '@/Components/ProductImageGallery';
import ProductInfo from '@/Components/ProductInfo';

export default function Show({ product, auth, breadcrumb }) {
    return (
        <StoreLayout auth={auth}>
            <Head title={product.name} />

            <div className="product-page">
                <Breadcrumb items={breadcrumb || []} />

                <div className="product-page-inner product-layout">
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
