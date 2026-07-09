import StarRating from '@/Components/StarRating';

export default function ReviewCard({ review }) {
    return (
        <div className="review-card">
            <div className="review-card-header">
                <span className="review-card-author">{review.user?.name || 'Anónimo'}</span>
                <StarRating rating={review.rating} size="sm" />
            </div>
            {review.comment && (
                <p className="review-card-comment">{review.comment}</p>
            )}
            <span className="review-card-date">
                {new Date(review.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </span>
        </div>
    );
}
