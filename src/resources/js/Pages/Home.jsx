import { Head } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import BannerGrid from '@/Components/BannerGrid';
import FeaturedProducts from '@/Components/FeaturedProducts';
import HomeCategories from '@/Components/HomeCategories';

export default function Home({ auth, banners, featuredProducts, categories }) {
    return (
        <StoreLayout auth={auth}>
            <Head title="Inicio | Cuntras" />

            <BannerGrid banners={banners} />

            <div className="home-content">
                <FeaturedProducts products={featuredProducts} />
                <HomeCategories categories={categories} />
            </div>
        </StoreLayout>
    );
}
