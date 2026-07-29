function DuplicateFridgeConfirmModal({ existingAmount, expirySummary, onCancel, onConfirm }) {
    const { modalOverlay, modalCard } = window.FB_STYLES;

    return (
        <div style={modalOverlay} onClick={onCancel}>
            <div style={{ ...modalCard, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <p style={{ fontSize: '15px', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                    Item already in fridge ({existingAmount}). Add another?
                </p>
                {expirySummary && !expirySummary.isSeasoning && (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>
                        {expirySummary.expiresText}
                    </p>
                )}
                {expirySummary && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '1.25rem',
                        fontSize: '12px'
                    }}>
                        <i
                            className="ti ti-circle-filled"
                            style={{ fontSize: '8px', color: expirySummary.statusColor }}
                            aria-hidden="true"
                        ></i>
                        <span style={{ color: expirySummary.statusColor }}>{expirySummary.statusText}</span>
                    </div>
                )}
                {!expirySummary && <div style={{ marginBottom: '1.25rem' }} />}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)',
                            border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1, padding: '10px', background: 'var(--fill-accent)', color: 'var(--on-accent)',
                            border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px'
                        }}
                    >
                        Add another
                    </button>
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.DuplicateFridgeConfirmModal = DuplicateFridgeConfirmModal;
