import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="page-title">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="page-content">
                <div className="page-content-inner space-y-6">
                    <div className="content-card p-4 sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="profile-section"
                        />
                    </div>

                    <div className="content-card p-4 sm:p-8">
                        <UpdatePasswordForm className="profile-section" />
                    </div>

                    <div className="content-card p-4 sm:p-8">
                        <DeleteUserForm className="profile-section" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
