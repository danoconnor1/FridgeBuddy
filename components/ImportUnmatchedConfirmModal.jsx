function ImportUnmatchedConfirmModal({ title, description, items, onCancel, onConfirm }) {
    const { useState } = React;
    const { CATEGORIES, formatCategory, formatUnitLabel } = window.FB;
    const { modalOverlay, modalCard } = window.FB_STYLES;
    const [rows, setRows] = useState(() => items.map(item => ({ ...item })));

    const updateRow = (key, field, value) => {
        setRows(prev => prev.map(row => (row.key === key ? { ...row, [field]: value } : row)));
    };

    const selectedCount = rows.filter(row => row.addToCatalog).length;

    return (
        <div style={modalOverlay} onClick={onCancel}>
            <div style={{ ...modalCard, maxWidth: '420px', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 0.5rem 0' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.45 }}>
                    {description}
                </p>

                {rows.map(row => (
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
                                <span style={{ display: 'block', fontSize: '14px', fontWeight: '500' }}>{row.name}</span>
                                <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                    {row.quantity} {formatUnitLabel(row.unit)}
                                    {row.recipeName ? ` · ${row.recipeName}` : ''}
                                </span>
                            </span>
                        </label>
                        {row.addToCatalog && (
                            <label style={{ display: 'block', paddingLeft: '24px' }}>
                                <span style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Food group
                                </span>
                                <select
                                    value={row.category}
                                    onChange={(e) => updateRow(row.key, 'category', e.target.value)}
                                    style={{ marginBottom: 0, fontSize: '13px', padding: '8px 10px' }}
                                >
                                    {CATEGORIES.map(category => (
                                        <option key={category} value={category}>{formatCategory(category)}</option>
                                    ))}
                                </select>
                            </label>
                        )}
                    </div>
                ))}

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
                        onClick={() => onConfirm(rows)}
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
