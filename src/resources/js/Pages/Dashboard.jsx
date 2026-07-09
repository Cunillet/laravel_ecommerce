import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="page-title">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="page-content">
                <div className="page-content-inner">
                    <div className="content-card">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
