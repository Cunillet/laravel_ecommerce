import BannerSlide from '@/Components/BannerSlide';

export default function BannerGrid({ banners }) {
    if (!banners?.length) return null;

    const [primary, ...rest] = banners;

    return (
        <section className="hero-banner-grid">
            <div className="hero-banner-primary">
                <BannerSlide banner={primary} size="large" />
            </div>
            {rest.length > 0 && (
                <div className="hero-banner-side">
                    {rest.slice(0, 2).map((banner) => (
                        <BannerSlide key={banner.id} banner={banner} size="small" />
                    ))}
                </div>
            )}
        </section>
    );
}
