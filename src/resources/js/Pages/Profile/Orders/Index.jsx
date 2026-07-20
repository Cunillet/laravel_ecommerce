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

const statusColors = {
    pending: 'text-gray-500',
    confirmed: 'text-indigo-600',
    processing: 'text-blue-600',
    shipped: 'text-yellow-600',
    delivered: 'text-green-600',
    cancelled: 'text-red-600',
};

export default function OrdersIndex({ auth, orders }) {
    return (
        <StoreLayout auth={auth}>
            <Head title="Mis pedidos" />

            <div className="profile-page">
                <h1 className="auth-form-title">Mis pedidos</h1>

                {orders.length === 0 && (
                    <div className="content-card p-6">
                        <p className="text-center text-gray-500">
                            No tienes pedidos realizados.
                        </p>
                    </div>
                )}

                {orders.length > 0 && (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={route(
                                    'profile.orders.show',
                                    order.id,
                                )}
                                className="content-card order-row"
                            >
                                <div className="order-row-main">
                                    <div className="order-row-id">
                                        Pedido #{order.id}
                                    </div>
                                    <div className="order-row-date">
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </div>
                                    <div
                                        className={`order-row-status ${statusColors[order.status] || 'text-gray-500'}`}
                                    >
                                        {statusLabels[
                                            order.status
                                        ] || order.status}
                                    </div>
                                </div>
                                <div className="order-row-secondary">
                                    <span className="order-row-items">
                                        {order.items.length}{' '}
                                        {order.items.length === 1
                                            ? 'artículo'
                                            : 'artículos'}
                                    </span>
                                    <span className="order-row-total">
                                        {Number(
                                            order.total_amount,
                                        ).toFixed(2)}{' '}
                                        €
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
