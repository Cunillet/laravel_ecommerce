import StoreLayout from '@/Layouts/StoreLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function AddressForm({ auth, address }) {
    const isEditing = !!address;

    const { data, setData, post, put, processing, errors } = useForm({
        label: address?.label ?? '',
        full_name: address?.full_name ?? '',
        street: address?.street ?? '',
        city: address?.city ?? '',
        state: address?.state ?? '',
        zip: address?.zip ?? '',
        country: address?.country ?? '',
        phone: address?.phone ?? '',
        is_default: address?.is_default ?? false,
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('profile.addresses.update', address.id));
        } else {
            post(route('profile.addresses.store'));
        }
    };

    return (
        <StoreLayout auth={auth}>
            <Head
                title={
                    isEditing
                        ? 'Editar dirección'
                        : 'Nueva dirección'
                }
            />

            <div className="auth-form-wrapper">
                <div className="auth-card">
                    <h1 className="auth-form-title">
                        {isEditing
                            ? 'Editar dirección'
                            : 'Nueva dirección'}
                    </h1>

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel
                                htmlFor="label"
                                value="Etiqueta"
                            />
                            <TextInput
                                id="label"
                                name="label"
                                value={data.label}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData(
                                        'label',
                                        e.target.value,
                                    )
                                }
                                placeholder="Ej: Casa, Trabajo"
                                required
                            />
                            <InputError
                                message={errors.label}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="full_name"
                                value="Nombre completo"
                            />
                            <TextInput
                                id="full_name"
                                name="full_name"
                                value={data.full_name}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData(
                                        'full_name',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.full_name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="street"
                                value="Dirección"
                            />
                            <TextInput
                                id="street"
                                name="street"
                                value={data.street}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData(
                                        'street',
                                        e.target.value,
                                    )
                                }
                                placeholder="Calle, número, piso"
                                required
                            />
                            <InputError
                                message={errors.street}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="city"
                                    value="Ciudad"
                                />
                                <TextInput
                                    id="city"
                                    name="city"
                                    value={data.city}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            'city',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.city}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="state"
                                    value="Provincia"
                                />
                                <TextInput
                                    id="state"
                                    name="state"
                                    value={data.state}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            'state',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.state}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel
                                    htmlFor="zip"
                                    value="Código postal"
                                />
                                <TextInput
                                    id="zip"
                                    name="zip"
                                    value={data.zip}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            'zip',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.zip}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="country"
                                    value="País"
                                />
                                <TextInput
                                    id="country"
                                    name="country"
                                    value={data.country}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            'country',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.country}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="phone"
                                value="Teléfono"
                            />
                            <TextInput
                                id="phone"
                                name="phone"
                                value={data.phone}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData(
                                        'phone',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_default}
                                    onChange={(e) =>
                                        setData(
                                            'is_default',
                                            e.target.checked,
                                        )
                                    }
                                    className="form-checkbox"
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Establecer como dirección
                                    principal
                                </span>
                            </label>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-4">
                            <Link
                                href={route(
                                    'profile.addresses.index',
                                )}
                                className="btn-secondary"
                            >
                                Cancelar
                            </Link>
                            <PrimaryButton disabled={processing}>
                                {isEditing
                                    ? 'Guardar cambios'
                                    : 'Crear dirección'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </StoreLayout>
    );
}
