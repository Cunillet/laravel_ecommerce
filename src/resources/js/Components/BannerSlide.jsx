import { Link } from '@inertiajs/react';

const ALIGN_MAP = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
};

export default function BannerSlide({ banner, size = 'large' }) {
    const { image, title, subtitle, link, position_h, position_v } = banner;

    const content = (
        <div
            className={`hero-banner hero-banner--${size}`}
            style={{ backgroundImage: `url(${image})` }}
        >
            <div className="hero-banner-overlay" />
            <div
                className="hero-banner-content"
                style={{
                    alignItems: ALIGN_MAP[position_v] ?? 'center',
                    justifyContent: ALIGN_MAP[position_h] ?? 'center',
                }}
            >
                <div className="hero-banner-text">
                    {title && <h2 className="hero-banner-title">{title}</h2>}
                    {subtitle && <p className="hero-banner-subtitle">{subtitle}</p>}
                </div>
            </div>
        </div>
    );

    if (link) {
        return <Link href={link}>{content}</Link>;
    }

    return content;
}
