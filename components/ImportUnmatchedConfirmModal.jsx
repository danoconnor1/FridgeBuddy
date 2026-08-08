function ImportUnmatchedConfirmModal({ title, description, items, onCancel, onConfirm }) {
    const { useState } = React;
    const {
        CATEGORIES, UNITS, formatCategory, formatUnitLabel,
        parseIngredientQuantity, roundIngredientQuantity, MIN_INGREDIENT_QTY
    } = window.FB;
    const { modalOverlay, modalCard } = window.FB_STYLES;
    const [rows, setRows] = useState(() => items.map(item => ({ ...item })));
    const foodCategories = CATEGORIES.filter(category => category !== 'leftovers');

    const updateRow = (key, field, value) => {
        setRows(prev => prev.map(row => (row.key === key ? { ...row, [field]: value } : row)));
    };

    const adjustRowQuantity = (key, delta) => {
        setRows(prev => prev.map(row => {
            if (row.key !== key) return row;
            const current = parseIngredientQuantity(row.quantity);
            return { ...row, quantity: roundIngredientQuantity(current + delta) };
        }));
    };

    const selectedCount = rows.filter(row => row.addToCatalog).length;

    const handleConfirm = () => {
        onConfirm(rows.map(row => ({
            ...row,
            name: row.name.trim(),
            quantity: roundIngredientQuantity(parseIngredientQuantity(row.quantity))
        })));
    };

    return (
        <div style={modalOverlay} onClick={onCancel}>
            <div style={{ ...modalCard, maxWidth: '420px', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 0.5rem 0' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
                    {description}
                </p>

                {rows.map(row => {
                    const itemQuantity = parseIngredientQuantity(row.quantity);
                    return (
                        <div
                            key={row.key}
                            style={{
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                padding: '0.75rem',
                                marginBottom: '0.65rem',
                                background: 'var(--surface-0)'
                            }}
                        >
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: row.addToCatalog ? '0.65rem' : 0 }}>
                                <input
                                    type="checkbox"
                                    checked={row.addToCatalog}
                                    onChange={(e) => updateRow(row.key, 'addToCatalog', e.target.checked)}
                                    style={{ marginTop: '3px', flexShrink: 0 }}
                                />
                                <span style={{ flex: 1, minWidth: 0 }}>
                                    {row.addToCatalog ? (
                                        <span style={{ display: 'block', fontSize: '14px', fontWeight: '500' }}>Add to grocery store</span>
                                    ) : (
                                        <span style={{ display: 'block', fontSize: '14px', fontWeight: '500' }}>{row.name}</span>
                                    )}
                                    {!row.addToCatalog && (
                                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {row.quantity} {formatUnitLabel(row.unit)}
                                        </span>
                                    )}
                                    {row.recipeName && (
                                        <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {row.recipeName}
                                        </span>
                                    )}
                                </span>
                            </label>
                            {row.addToCatalog && (
                                <div className="import-unmatched-fields">
                                    <label style={{ display: 'block', marginBottom: '0.65rem' }}>
                                        <span style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                            Name
                                        </span>
                                        <input
                                            type="text"
                                            value={row.name}
                                            onChange={(e) => updateRow(row.key, 'name', e.target.value)}
                                            style={{ marginBottom: 0, fontSize: '13px', padding: '8px 10px', width: '100%' }}
                                        />
                                    </label>
                                    <div className="ingredient-editor-row import-unmatched-qty-row">
                                        <button
                                            type="button"
                                            onClick={() => adjustRowQuantity(row.key, -1)}
                                            disabled={itemQuantity <= MIN_INGREDIENT_QTY}
                                            className="fb-step-btn ingredient-editor-dec"
                                            aria-label={`Decrease quantity for ${row.name}`}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            value={row.quantity === '' || row.quantity == null ? '' : row.quantity}
                                            onChange={(e) => {
                                                const raw = e.target.value;
                                                if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
                                                    updateRow(row.key, 'quantity', raw);
                                                }
                                            }}
                                            onBlur={() => {
                                                updateRow(row.key, 'quantity', roundIngredientQuantity(row.quantity));
                                            }}
                                            className="ingredient-editor-qty-input"
                                            aria-label={`Quantity for ${row.name}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => adjustRowQuantity(row.key, 1)}
                                            className="fb-step-btn ingredient-editor-inc"
                                            aria-label={`Increase quantity for ${row.name}`}
                                        >
                                            +
                                        </button>
                                        <select
                                            value={row.unit || 'piece'}
                                            onChange={(e) => updateRow(row.key, 'unit', e.target.value)}
                                            className="ingredient-editor-unit"
                                            aria-label={`Unit for ${row.name}`}
                                        >
                                            {UNITS.map(unit => (
                                                <option key={unit.abbr} value={unit.abbr}>{formatUnitLabel(unit)}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <label style={{ display: 'block' }}>
                                        <span style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                            Food group
                                        </span>
                                        <select
                                            value={row.category}
                                            onChange={(e) => updateRow(row.key, 'category', e.target.value)}
                                            style={{ marginBottom: 0, fontSize: '13px', padding: '8px 10px', width: '100%' }}
                                        >
                                            {foodCategories.map(category => (
                                                <option key={category} value={category}>{formatCategory(category)}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                            )}
                        </div>
                    );
                })}

                <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)',
                            border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        style={{
                            flex: 1, padding: '10px', background: 'var(--fill-accent)', color: 'var(--on-accent)',
                            border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px'
                        }}
                    >
                        Continue{selectedCount > 0 ? ` (${selectedCount} new)` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.ImportUnmatchedConfirmModal = ImportUnmatchedConfirmModal;
