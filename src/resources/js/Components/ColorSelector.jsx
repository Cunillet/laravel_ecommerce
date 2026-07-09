export default function ColorSelector({ colors = [], selected, onChange }) {
    if (!colors?.length) return null;

    return (
        <div className="selector">
            <span className="selector-label">Color: <strong>{selected?.name || 'Seleccionar'}</strong></span>
            <div className="color-options">
                {colors.map((color, i) => (
                    <button
                        key={i}
                        type="button"
                        className={`color-swatch ${selected?.value === color.value ? 'color-swatch--selected' : ''}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                        onClick={() => onChange(color)}
                        aria-label={color.name}
                    />
                ))}
            </div>
        </div>
    );
}
