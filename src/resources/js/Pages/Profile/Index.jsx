import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link } from '@inertiajs/react';

export default function ProfileIndex({
    auth,
    addressesCount,
    defaultAddress,
    recentOrders,
    completedOrdersCount,
    totalOrdersCount,
}) {
    return (
        <StoreLayout auth={auth}>
            <Head title="Mi Perfil" />

            <div className="profile-page">
                <h1 className="auth-form-title">Mi Perfil</h1>

                <div className="profile-hub-grid">
                    {/* Datos personales */}
                    <div className="content-card profile-hub-card">
                        <div className="profile-hub-card-header">
                            <h3 className="profile-hub-card-title">
                                Datos personales
                            </h3>
                        </div>
                        <div className="profile-hub-card-body">
                            <p className="profile-hub-label">Nombre</p>
                            <p className="profile-hub-value">
                            {auth.user.name}
                            </p>

                            <p className="profile-hub-label">Email</p>
                            <p className="profile-hub-value">
                                {auth.user.email}
                            </p>

                            {auth.user.phone && (
                                <>
                                    <p className="profile-hub-label">
                                        Teléfono
                                    </p>
                                    <p className="profile-hub-value">
                                        {auth.user.phone}
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="profile-hub-card-footer">
                            <Link
                                href={route('profile.edit')}
                                className="btn-secondary"
                            >
                                Editar perfil
                            </Link>
                        </div>
                    </div>

                    {/* Direcciones */}
                    <div className="content-card profile-hub-card">
                        <div className="profile-hub-card-header">
                            <h3 className="profile-hub-card-title">
                                Direcciones
                            </h3>
                        </div>
                        <div className="profile-hub-card-body">
                            <p className="profile-hub-stat">
                                {addressesCount}{' '}
                                {addressesCount === 1
                                    ? 'dirección registrada'
                                    : 'direcciones registradas'}
                            </p>

                            {defaultAddress && (
                                <div className="profile-hub-address-default">
                                    <p className="profile-hub-label">
                                        Principal
                                    </p>
                                    <p className="profile-hub-value">
                                        {defaultAddress.label} —{' '}
                                        {defaultAddress.street},{' '}
                                        {defaultAddress.city}
                                    </p>
                                </div>
                            )}

                            {addressesCount === 0 && (
                                <p className="profile-hub-empty">
                                    Aún no has registrado ninguna
                                    dirección.
                                </p>
                            )}
                        </div>
                        <div className="profile-hub-card-footer">
                            <Link
                                href={route('profile.addresses.index')}
                                className="btn-secondary"
                            >
                                Gestionar direcciones
                            </Link>
                        </div>
                    </div>

                    {/* Pedidos */}
                    <div className="content-card profile-hub-card">
                        <div className="profile-hub-card-header">
                            <h3 className="profile-hub-card-title">
                                Pedidos
                            </h3>
                        </div>
                        <div className="profile-hub-card-body">
                            <p className="profile-hub-stat">
                                {totalOrdersCount}{' '}
                                {totalOrdersCount === 1
                                    ? 'pedido realizado'
                                    : 'pedidos realizados'}
                            </p>

                            <p className="profile-hub-stat">
                                {completedOrdersCount}{' '}
                                {completedOrdersCount === 1
                                    ? 'completado'
                                    : 'completados'}
                            </p>

                            {recentOrders.length > 0 && (
                                <div className="profile-hub-recent-orders">
                                    <p className="profile-hub-label">
                                        Últimos pedidos
                                    </p>
                                    <ul className="profile-hub-order-list">
                                        {recentOrders.map((order) => (
                                            <li key={order.id}>
                                                <Link
                                                    href={route(
                                                        'profile.orders.show',
                                                        order.id,
                                                    )}
                                                    className="profile-hub-order-link"
                                                >
                                                    <span>
                                                        Pedido #
                                                        {order.id}
                                                    </span>
                                                    <span className="profile-hub-order-status">
                                                        {order.status}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {totalOrdersCount === 0 && (
                                <p className="profile-hub-empty">
                                    Aún no has realizado ningún pedido.
                                </p>
                            )}
                        </div>
                        <div className="profile-hub-card-footer">
                            <Link
                                href={route('profile.orders.index')}
                                className="btn-secondary"
                            >
                                Ver todos los pedidos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </StoreLayout>
    );
}
