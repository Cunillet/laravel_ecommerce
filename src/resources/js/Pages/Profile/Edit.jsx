import StoreLayout from '@/Layouts/StoreLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <StoreLayout auth={auth}>
            <Head title="Mi perfil" />

            <div className="auth-form-wrapper">
                <div className="auth-card space-y-6">
                    <h1 className="auth-form-title">Editar perfil</h1>

                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />

                    <UpdatePasswordForm />

                    <DeleteUserForm />
                </div>
            </div>
        </StoreLayout>
    );
}
