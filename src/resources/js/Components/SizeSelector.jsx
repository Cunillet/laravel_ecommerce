export default function SizeSelector({ sizes = [], selected, onChange }) {
    if (!sizes?.length) return null;

    return (
        <div className="selector">
            <span className="selector-label">Talla: <strong>{selected || 'Seleccionar'}</strong></span>
            <div className="size-options">
                {sizes.map((size, i) => (
                    <button
                        key={i}
                        type="button"
                        className={`size-option ${selected === size ? 'size-option--selected' : ''}`}
                        onClick={() => onChange(size)}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    );
}
