export default function Footer() {
    const year = new Date().getFullYear();

    const paymentMethods = [
        { name: 'Visa', icon: '💳' },
        { name: 'Mastercard', icon: '💳' },
        { name: 'PayPal', icon: '📧' },
        { name: 'Apple Pay', icon: '🍎' },
        { name: 'Google Pay', icon: '🔵' },
        { name: 'Bizum', icon: '📱' },
    ];

    return (
        <footer className="store-footer">
            <div className="store-footer-inner">
                <div className="store-footer-payments">
                    <span className="store-footer-label">Métodos de pago:</span>
                    <div className="store-footer-icons">
                        {paymentMethods.map((method) => (
                            <span
                                key={method.name}
                                className="store-footer-payment-icon"
                                title={method.name}
                            >
                                {method.icon}
                                <span className="store-footer-payment-name">{method.name}</span>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="store-footer-copyright">
                    &copy; {year} Cuntras. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
