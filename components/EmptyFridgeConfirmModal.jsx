function EmptyFridgeConfirmModal({ itemCount, onCancel, onConfirm }) {
    const { modalOverlay, modalCard } = window.FB_STYLES;
    const label = itemCount === 1 ? '1 item' : `${itemCount} items`;

    return (
        <div style={modalOverlay} onClick={onCancel}>
            <div style={{ ...modalCard, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 8px 0' }}>Empty fridge?</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
                    Remove all {label} from your fridge. This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
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
                        onClick={onConfirm}
                        style={{
                            flex: 1, padding: '10px', background: 'var(--fill-danger)', color: '#ffffff',
                            border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px'
                        }}
                    >
                        Empty fridge
                    </button>
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.EmptyFridgeConfirmModal = EmptyFridgeConfirmModal;
