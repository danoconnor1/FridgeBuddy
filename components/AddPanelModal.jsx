function AddPanelModal({ title, open, onClose, children }) {
    if (!open) return null;

    return (
        <div className="fb-add-panel-overlay" onClick={onClose}>
            <div
                className="fb-add-panel"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="fb-add-panel-title"
            >
                <div className="fb-add-panel-header">
                    <h2 id="fb-add-panel-title" className="fb-add-panel-title">{title}</h2>
                    <button
                        type="button"
                        className="fb-add-panel-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <div className="fb-add-panel-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.AddPanelModal = AddPanelModal;
