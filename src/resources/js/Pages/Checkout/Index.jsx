import { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import HeaderCart from '@/Components/HeaderCart';

export default function CheckoutIndex({ items, total, itemCount, addresses, isGuest }) {
    const { auth } = usePage().props;
    const [loginMode, setLoginMode] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const [useDifferentBilling, setUseDifferentBilling] = useState(false);
    const [shippingAddressId, setShippingAddressId] = useState(
        addresses.find((a) => a.is_default)?.id || addresses[0]?.id || '',
    );
    const [billingAddressId, setBillingAddressId] = useState('');

    // New address inline form
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        label: '',
        full_name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
    });

    // Guest address form
    const [guestEmail, setGuestEmail] = useState('');
    const [shippingData, setShippingData] = useState({
        full_name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
    });
    const [billingData, setBillingData] = useState({
        full_name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
    });

    // Payment
    const [payment, setPayment] = useState({
        card_number: '',
        expiry: '',
        cvc: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const canSubmit = !submitting &&
        // Shipping address
        (isGuest
            ? shippingData.full_name && shippingData.street && shippingData.city && shippingData.zip && shippingData.country && shippingData.phone
            : !!shippingAddressId) &&
        // Billing address (when different from shipping)
        (!useDifferentBilling || (isGuest
            ? billingData.full_name && billingData.street && billingData.city && billingData.zip && billingData.country && billingData.phone
            : !!billingAddressId)) &&
        // Payment info
        payment.card_number && payment.expiry && payment.cvc;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');

        try {
            const res = await fetch(route('checkout.login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });

            const data = await res.json();

            if (data.success) {
                window.location.reload();
            } else {
                setLoginError(data.message || 'Error al iniciar sesión.');
            }
        } catch {
            setLoginError('Error de conexión.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleCreateAddress = async () => {
        try {
            const res = await fetch(route('profile.addresses.store'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: JSON.stringify(newAddress),
            });

            const data = await res.json();

            if (res.ok) {
                setShowNewAddress(false);
                setNewAddress({ label: '', full_name: '', street: '', city: '', state: '', zip: '', country: '', phone: '' });
                window.location.reload();
            } else {
                setSubmitError(data.message || 'Error al crear dirección.');
            }
        } catch {
            setSubmitError('Error de conexión.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError('');

        const payload = { payment, use_different_billing: useDifferentBilling };

        if (!isGuest) {
            payload.shipping_address_id = shippingAddressId;
            if (useDifferentBilling) {
                payload.billing_address_id = billingAddressId;
            }
        } else {
            payload.guest_email = guestEmail;
            payload.shipping_address_data = shippingData;
            if (useDifferentBilling) {
                payload.billing_address_data = billingData;
            }
        }

        router.post(route('checkout.store'), payload, {
            onError: (errors) => {
                const firstError = Object.values(errors).flat()[0];
                setSubmitError(firstError || 'Error al procesar el pedido.');
                setSubmitting(false);
            },
            onSuccess: () => {
                // Redirect handled by server
            },
        });
    };

    const hasItems = items && items.length > 0;

    if (!hasItems) {
        return (
            <StoreLayout auth={auth}>
                <div className="cart-empty" style={{ minHeight: '60vh' }}>
                    <h2>Tu carrito está vacío</h2>
                    <p>Añade productos antes de proceder al checkout.</p>
                    <Link href="/" className="btn-primary">Ir a la tienda</Link>
                </div>
            </StoreLayout>
        );
    }

    return (
        <StoreLayout auth={auth}>
            <div className="checkout-page">
                <div className="checkout-header">
                    <h1 className="checkout-title">Checkout</h1>
                </div>

                {submitError && (
                    <div className="checkout-error">{submitError}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="checkout-layout">
                        {/* Left: Form */}
                        <div className="checkout-form">
                            {/* Step 1: Login or Guest */}
                            {isGuest && (
                                <div className="checkout-section">
                                    <h2 className="checkout-section-title">¿Ya tienes cuenta?</h2>

                                    {loginMode ? (
                                        <form onSubmit={handleLogin} className="checkout-login-form">
                                            <div className="form-row">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-input"
                                                    value={loginEmail}
                                                    onChange={(e) => setLoginEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-row">
                                                <label className="form-label">Contraseña</label>
                                                <input
                                                    type="password"
                                                    className="form-input"
                                                    value={loginPassword}
                                                    onChange={(e) => setLoginPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {loginError && <p className="form-error">{loginError}</p>}
                                            <div className="checkout-login-actions">
                                                <button type="submit" className="btn-primary" disabled={loginLoading}>
                                                    {loginLoading ? 'Iniciando...' : 'Iniciar sesión'}
                                                </button>
                                                <button type="button" className="btn-secondary" onClick={() => { setLoginMode(false); setLoginError(''); }}>
                                                    Seguir como invitado
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="checkout-guest-actions">
                                            <button type="button" className="btn-primary" onClick={() => setLoginMode(true)}>
                                                Iniciar sesión
                                            </button>
                                            <p className="checkout-guest-note">
                                                O continúa como invitado rellenando los datos siguientes.
                                            </p>
                                        </div>
                                    )}

                                    {!loginMode && (
                                        <div className="form-row">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-input"
                                                value={guestEmail}
                                                onChange={(e) => setGuestEmail(e.target.value)}
                                                required
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 2: Shipping Address */}
                            <div className="checkout-section">
                                <h2 className="checkout-section-title">Dirección de envío</h2>

                                {!isGuest && addresses.length > 0 ? (
                                    <>
                                        <div className="address-select-list">
                                            {addresses.map((addr) => (
                                                <label key={addr.id} className={`address-select-option ${shippingAddressId === addr.id ? 'address-select-option--selected' : ''}`}>
                                                    <input
                                                        type="radio"
                                                        name="shipping_address_id"
                                                        value={addr.id}
                                                        checked={shippingAddressId === addr.id}
                                                        onChange={(e) => setShippingAddressId(Number(e.target.value))}
                                                    />
                                                    <div className="address-select-details">
                                                        <strong>{addr.label}</strong>
                                                        <span>{addr.full_name}</span>
                                                        <span>{addr.street}, {addr.city}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        <button type="button" className="btn-secondary text-sm" onClick={() => setShowNewAddress(!showNewAddress)}>
                                            {showNewAddress ? 'Cancelar' : '+ Nueva dirección'}
                                        </button>
                                    </>
                                ) : null}

                                                {showNewAddress && (
                                                    <div className="checkout-new-address">
                                                        <div className="form-row">
                                                            <label className="form-label">Etiqueta</label>
                                                            <input className="form-input" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} placeholder="Ej: Casa, Trabajo" required />
                                                        </div>
                                                        <div className="form-row">
                                                            <label className="form-label">Nombre completo</label>
                                                            <input className="form-input" value={newAddress.full_name} onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })} required />
                                                        </div>
                                                        <div className="form-row">
                                                            <label className="form-label">Dirección</label>
                                                            <input className="form-input" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} required />
                                                        </div>
                                                        <div className="form-row form-row--half">
                                                            <div>
                                                                <label className="form-label">Ciudad</label>
                                                                <input className="form-input" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required />
                                                            </div>
                                                            <div>
                                                                <label className="form-label">Estado/Provincia</label>
                                                                <input className="form-input" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                                                            </div>
                                                        </div>
                                                        <div className="form-row form-row--half">
                                                            <div>
                                                                <label className="form-label">Código postal</label>
                                                                <input className="form-input" value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} required />
                                                            </div>
                                                            <div>
                                                                <label className="form-label">País</label>
                                                                <input className="form-input" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} required />
                                                            </div>
                                                        </div>
                                                        <div className="form-row">
                                                            <label className="form-label">Teléfono</label>
                                                            <input className="form-input" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} required />
                                                        </div>
                                                        <button type="button" className="btn-primary" onClick={handleCreateAddress}>Guardar dirección</button>
                                                    </div>
                                                )}

                                {isGuest && (
                                    <div className="checkout-guest-address">
                                        <div className="form-row">
                                            <label className="form-label">Nombre completo</label>
                                            <input className="form-input" value={shippingData.full_name} onChange={(e) => setShippingData({ ...shippingData, full_name: e.target.value })} required />
                                        </div>
                                        <div className="form-row">
                                            <label className="form-label">Dirección</label>
                                            <input className="form-input" value={shippingData.street} onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })} required />
                                        </div>
                                        <div className="form-row form-row--half">
                                            <div>
                                                <label className="form-label">Ciudad</label>
                                                <input className="form-input" value={shippingData.city} onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label className="form-label">Estado/Provincia</label>
                                                <input className="form-input" value={shippingData.state} onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-row form-row--half">
                                            <div>
                                                <label className="form-label">Código postal</label>
                                                <input className="form-input" value={shippingData.zip} onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })} required />
                                            </div>
                                            <div>
                                                <label className="form-label">País</label>
                                                <input className="form-input" value={shippingData.country} onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })} required />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <label className="form-label">Teléfono</label>
                                            <input className="form-input" value={shippingData.phone} onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })} required />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Step 3: Billing Address */}
                            <div className="checkout-section">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={!useDifferentBilling}
                                        onChange={(e) => setUseDifferentBilling(!e.target.checked)}
                                    />
                                    <span>Usar la misma dirección para facturación</span>
                                </label>

                                {useDifferentBilling && (
                                    <div className="checkout-billing-section">
                                        <h2 className="checkout-section-title">Dirección de facturación</h2>

                                        {!isGuest && addresses.length > 0 ? (
                                            <>
                                                <div className="address-select-list">
                                                    {addresses.map((addr) => (
                                                        <label key={addr.id} className={`address-select-option ${billingAddressId === addr.id ? 'address-select-option--selected' : ''}`}>
                                                            <input
                                                                type="radio"
                                                                name="billing_address_id"
                                                                value={addr.id}
                                                                checked={billingAddressId === addr.id}
                                                                onChange={(e) => setBillingAddressId(Number(e.target.value))}
                                                            />
                                                            <div className="address-select-details">
                                                                <strong>{addr.label}</strong>
                                                                <span>{addr.full_name}</span>
                                                                <span>{addr.street}, {addr.city}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </>
                                        ) : null}

                                        {isGuest && (
                                            <div className="checkout-guest-address">
                                                <div className="form-row">
                                                    <label className="form-label">Nombre completo</label>
                                                    <input className="form-input" value={billingData.full_name} onChange={(e) => setBillingData({ ...billingData, full_name: e.target.value })} required />
                                                </div>
                                                <div className="form-row">
                                                    <label className="form-label">Dirección</label>
                                                    <input className="form-input" value={billingData.street} onChange={(e) => setBillingData({ ...billingData, street: e.target.value })} required />
                                                </div>
                                                <div className="form-row form-row--half">
                                                    <div>
                                                        <label className="form-label">Ciudad</label>
                                                        <input className="form-input" value={billingData.city} onChange={(e) => setBillingData({ ...billingData, city: e.target.value })} required />
                                                    </div>
                                                    <div>
                                                        <label className="form-label">Estado/Provincia</label>
                                                        <input className="form-input" value={billingData.state} onChange={(e) => setBillingData({ ...billingData, state: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="form-row form-row--half">
                                                    <div>
                                                        <label className="form-label">Código postal</label>
                                                        <input className="form-input" value={billingData.zip} onChange={(e) => setBillingData({ ...billingData, zip: e.target.value })} required />
                                                    </div>
                                                    <div>
                                                        <label className="form-label">País</label>
                                                        <input className="form-input" value={billingData.country} onChange={(e) => setBillingData({ ...billingData, country: e.target.value })} required />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <label className="form-label">Teléfono</label>
                                                    <input className="form-input" value={billingData.phone} onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })} required />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Step 4: Payment */}
                            <div className="checkout-section">
                                <h2 className="checkout-section-title">Pago</h2>
                                <p className="checkout-section-desc">Introduce los datos de tu tarjeta (simulación)</p>
                                <div className="checkout-payment-form">
                                    <div className="form-row">
                                        <label className="form-label">Número de tarjeta</label>
                                        <input
                                            className="form-input"
                                            value={payment.card_number}
                                            onChange={(e) => setPayment({ ...payment, card_number: e.target.value })}
                                            placeholder="4242 4242 4242 4242"
                                            required
                                        />
                                    </div>
                                    <div className="form-row form-row--half">
                                        <div>
                                            <label className="form-label">Fecha de caducidad</label>
                                            <input
                                                className="form-input"
                                                value={payment.expiry}
                                                onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                                                placeholder="MM/AA"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">CVC</label>
                                            <input
                                                className="form-input"
                                                value={payment.cvc}
                                                onChange={(e) => setPayment({ ...payment, cvc: e.target.value })}
                                                placeholder="123"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" className="btn-primary btn-lg checkout-submit-btn" disabled={!canSubmit || submitting}>
                                {submitting ? 'Procesando...' : `Pagar ${Number(total).toFixed(2)} €`}
                            </button>
                        </div>

                        {/* Right: Cart Summary */}
                        <div className="checkout-summary">
                            <h3 className="checkout-summary-title">Resumen del pedido</h3>

                            <div className="checkout-summary-items">
                                {items.map((item) => (
                                    <div key={item.id} className="checkout-summary-item">
                                        <div className="checkout-summary-item-img">
                                            {item.product.image ? (
                                                <img src={item.product.image} alt={item.product.name} />
                                            ) : (
                                                <div className="checkout-summary-item-placeholder" />
                                            )}
                                        </div>
                                        <div className="checkout-summary-item-info">
                                            <span className="checkout-summary-item-name">{item.product.name}</span>
                                            <span className="checkout-summary-item-qty">x{item.quantity}</span>
                                        </div>
                                        <span className="checkout-summary-item-price">{Number(item.subtotal).toFixed(2)} €</span>
                                    </div>
                                ))}
                            </div>

                            <div className="checkout-summary-total">
                                <span>Total</span>
                                <span>{Number(total).toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </StoreLayout>
    );
}
