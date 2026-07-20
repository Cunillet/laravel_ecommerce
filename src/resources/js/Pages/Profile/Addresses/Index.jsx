import StoreLayout from '@/Layouts/StoreLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function AddressesIndex({ auth, addresses }) {
    const deleteAddress = (address) => {
        if (
            window.confirm(
                `¿Eliminar la dirección "${address.label}"?`,
            )
        ) {
            router.delete(
                route('profile.addresses.destroy', address.id),
            );
        }
    };

    return (
        <StoreLayout auth={auth}>
            <Head title="Mis direcciones" />

            <div className="profile-page">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="auth-form-title mb-0">Mis direcciones</h1>
                    <Link
                        href={route('profile.addresses.create')}
                        className="btn-primary text-xs"
                    >
                        Nueva dirección
                    </Link>
                </div>

                {addresses.length === 0 && (
                    <div className="content-card p-6">
                        <p className="text-center text-gray-500">
                            No tienes direcciones registradas.
                        </p>
                        <div className="mt-4 text-center">
                            <Link
                                href={route(
                                    'profile.addresses.create',
                                )}
                                className="btn-primary text-xs"
                            >
                                Añadir dirección
                            </Link>
                        </div>
                    </div>
                )}

                {addresses.length > 0 && (
                    <div className="addresses-grid">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className="content-card address-card"
                            >
                                {address.is_default && (
                                    <span className="address-badge">
                                        Principal
                                    </span>
                                )}
                                <div className="address-card-body">
                                    <h3 className="address-card-label">
                                        {address.label}
                                    </h3>
                                    <p className="address-card-name">
                                        {address.full_name}
                                    </p>
                                    <p className="address-card-detail">
                                        {address.street}
                                    </p>
                                    <p className="address-card-detail">
                                        {address.city}
                                        {address.state &&
                                            `, ${address.state}`}
                                        , {address.zip}
                                    </p>
                                    <p className="address-card-detail">
                                        {address.country}
                                    </p>
                                    {address.phone && (
                                        <p className="address-card-detail">
                                            {address.phone}
                                        </p>
                                    )}
                                </div>
                                <div className="address-card-actions">
                                    <Link
                                        href={route(
                                            'profile.addresses.edit',
                                            address.id,
                                        )}
                                        className="btn-secondary text-xs"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() =>
                                            deleteAddress(address)
                                        }
                                        className="btn-danger text-xs"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
