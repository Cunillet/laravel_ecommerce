import ReviewCard from '@/Components/ReviewCard';

export default function ReviewList({ reviews = [] }) {
    if (!reviews?.length) {
        return (
            <div className="reviews-empty">
                <h3 className="reviews-title">Opiniones</h3>
                <p className="reviews-none">No hay opiniones aún. Sé el primero en opinar.</p>
            </div>
        );
    }

    return (
        <div className="reviews-list">
            <h3 className="reviews-title">Opiniones ({reviews.length})</h3>
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    );
}
