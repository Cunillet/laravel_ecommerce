import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function CategoryFilters({ filters = {}, availableColors = [], categorySlug }) {
    const [name, setName] = useState(filters.name || '');
    const [selectedColors, setSelectedColors] = useState(
        Array.isArray(filters.colors) ? filters.colors : (filters.colors ? [filters.colors] : [])
    );
    const [priceMin, setPriceMin] = useState(filters.price_min || '');
    const [priceMax, setPriceMax] = useState(filters.price_max || '');

    const applyFilters = () => {
        const params = {};
        if (name.trim()) params.name = name.trim();
        if (selectedColors.length > 0) params.colors = selectedColors;
        if (priceMin) params.price_min = priceMin;
        if (priceMax) params.price_max = priceMax;

        router.get(`/category/${categorySlug}`, params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setName('');
        setSelectedColors([]);
        setPriceMin('');
        setPriceMax('');
        router.get(`/category/${categorySlug}`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleColor = (color) => {
        const value = color.value || color;
        setSelectedColors((prev) =>
            prev.includes(value)
                ? prev.filter((c) => c !== value)
                : [...prev, value]
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') applyFilters();
    };

    const hasActiveFilters = name || selectedColors.length > 0 || priceMin || priceMax;

    return (
        <aside className="filters-sidebar">
            <div className="filters-header">
                <h3 className="filters-title">Filtros</h3>
                {hasActiveFilters && (
                    <button type="button" className="filters-clear" onClick={clearFilters}>
                        Limpiar
                    </button>
                )}
            </div>

            <div className="filters-section">
                <label className="filters-label" htmlFor="filter-name">Nombre</label>
                <input
                    id="filter-name"
                    type="text"
                    className="filters-input"
                    placeholder="Buscar producto..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {availableColors.length > 0 && (
                <div className="filters-section">
                    <span className="filters-label">Color</span>
                    <div className="filters-colors">
                        {availableColors.filter(Boolean).map((color, i) => {
                            const value = color.value || color;
                            const isSelected = selectedColors.includes(value);
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    className={`filters-color-btn ${isSelected ? 'is-selected' : ''}`}
                                    style={{ backgroundColor: value }}
                                    title={color.name || value}
                                    onClick={() => toggleColor(color)}
                                    aria-label={color.name || value}
                                    aria-pressed={isSelected}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="filters-section">
                <span className="filters-label">Precio</span>
                <div className="filters-price-row">
                    <input
                        type="number"
                        className="filters-input filters-input-sm"
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        onKeyDown={handleKeyDown}
                        min="0"
                        step="0.01"
                    />
                    <span className="filters-price-sep">—</span>
                    <input
                        type="number"
                        className="filters-input filters-input-sm"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        onKeyDown={handleKeyDown}
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            <button
                type="button"
                className="btn-primary filters-apply"
                onClick={applyFilters}
            >
                Aplicar filtros
            </button>
        </aside>
    );
}
