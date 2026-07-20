import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link } from '@inertiajs/react';

const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    processing: 'En proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
};

const methodLabels = {
    card: 'Tarjeta',
    transfer: 'Transferencia',
    paypal: 'PayPal',
    cash: 'Efectivo',
};

export default function OrdersShow({ auth, order }) {
    const payment = order.payment;

    return (
        <StoreLayout auth={auth}>
            <Head title={`Pedido #${order.id}`} />

            <div className="profile-page">
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href={route('profile.orders.index')}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        &larr; Volver
                    </Link>
                    <h1 className="auth-form-title mb-0">
                        Pedido #{order.id}
                    </h1>
                </div>

                <div className="space-y-6">
                    {/* Estado del pedido */}
                    <div className="content-card p-4 sm:p-6">
                        <h3 className="order-detail-section-title">
                            Estado del pedido
                        </h3>
                        <p className="order-detail-status">
                            {statusLabels[order.status] ||
                                order.status}
                        </p>
                        {order.notes && (
                            <p className="order-detail-notes">
                                {order.notes}
                            </p>
                        )}
                    </div>

                    {/* Artículos */}
                    <div className="content-card p-4 sm:p-6">
                        <h3 className="order-detail-section-title">
                            Artículos
                        </h3>
                        <div className="order-detail-items">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="order-detail-item"
                                >
                                    <div className="order-detail-item-info">
                                        <span className="order-detail-item-name">
                                            {item.product_name}
                                        </span>
                                        <span className="order-detail-item-qty">
                                            x{item.quantity}
                                        </span>
                                    </div>
                                    <span className="order-detail-item-price">
                                        {Number(
                                            item.product_price,
                                        ).toFixed(2)}{' '}
                                        €
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="order-detail-total">
                            <span>Total</span>
                            <span>
                                {Number(
                                    order.total_amount,
                                ).toFixed(2)}{' '}
                                €
                            </span>
                        </div>
                    </div>

                    {/* Pago */}
                    {payment && (
                        <div className="content-card p-4 sm:p-6">
                            <h3 className="order-detail-section-title">
                                Pago
                            </h3>
                            <div className="order-detail-payment">
                                <div className="order-detail-payment-row">
                                    <span>Método</span>
                                    <span>
                                        {methodLabels[
                                            payment.method
                                        ] || payment.method}
                                    </span>
                                </div>
                                <div className="order-detail-payment-row">
                                    <span>Estado</span>
                                    <span>{payment.status}</span>
                                </div>
                                {payment.transaction_id && (
                                    <div className="order-detail-payment-row">
                                        <span>
                                            Transacción
                                        </span>
                                        <span>
                                            {
                                                payment.transaction_id
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Dirección de envío */}
                    {order.shipping_address && (
                        <div className="content-card p-4 sm:p-6">
                            <h3 className="order-detail-section-title">
                                Dirección de envío
                            </h3>
                            <div className="order-detail-address">
                                <p>
                                    {
                                        order.shipping_address
                                            .full_name
                                    }
                                </p>
                                <p>
                                    {
                                        order.shipping_address
                                            .street
                                    }
                                </p>
                                <p>
                                    {order.shipping_address.city}
                                    {order.shipping_address
                                        .state &&
                                        `, ${order.shipping_address.state}`}
                                </p>
                                <p>
                                    {
                                        order.shipping_address
                                            .country
                                    }{' '}
                                    -{' '}
                                    {order.shipping_address.zip}
                                </p>
                                {order.shipping_address
                                    .phone && (
                                    <p>
                                        {
                                            order.shipping_address
                                                .phone
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}
