function ImportHaulSection({
    haulImportPaste, setHaulImportPaste,
    haulImportPreview, haulImportError,
    haulImportSuccess,
    previewHaulImport, confirmHaulImport, clearHaulImport
}) {
    const { formatUnitLabel } = window.FB;
    const { categoryHeading } = window.FB_STYLES;

    const importableCount = haulImportPreview
        ? haulImportPreview.filter(row => row.status === 'ready' || row.status === 'unmatched').length
        : 0;

    const statusColor = (status) => {
        if (status === 'ready') return 'var(--text-success)';
        if (status === 'unmatched') return 'var(--text-warning)';
        return 'var(--text-danger)';
    };

    const statusLabel = (row) => {
        if (row.status === 'ready') return 'Matched';
        if (row.status === 'unmatched') return 'Not in grocery store';
        return row.error || 'Invalid';
    };

    return (
        <div className="meals-add-column-card">
            <p className="meals-import-instruction">
                Assuming agent prompt (home page) has been pasted, explain what you bought to your agent, then paste the response below.
            </p>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <textarea
                    id="haul-import-paste"
                    value={haulImportPaste}
                    onChange={(e) => setHaulImportPaste(e.target.value)}
                    placeholder="Paste response here"
                    rows={1}
                    className="meals-import-textarea"
                    aria-label="Paste Claude JSON response"
                />
                <button
                    type="button"
                    onClick={previewHaulImport}
                    disabled={!haulImportPaste.trim()}
                    className="import-preview-btn"
                >
                    Preview
                </button>
            </div>

            {(haulImportPaste || haulImportPreview) && (
                <button type="button" onClick={clearHaulImport} className="meals-clear-btn">Clear</button>
            )}

            {haulImportError && (
                <p className="meals-inline-error" role="alert">{haulImportError}</p>
            )}

            {haulImportSuccess && (
                <p className="meals-inline-success">Items added to your fridge.</p>
            )}

            {haulImportPreview && (
                <div className="meals-import-preview">
                    <h5 style={{ ...categoryHeading, marginTop: 0, marginBottom: '0.4rem' }}>Preview</h5>
                    {haulImportPreview.map(row => (
                        <div key={row.index} className="meals-preview-row">
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '11px', fontWeight: '500', margin: 0 }}>{row.name}</p>
                                <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: 0 }}>
                                    {row.status !== 'invalid'
                                        ? `${row.quantity} ${formatUnitLabel(row.unit)}`
                                        : row.error}
                                </p>
                                {row.status === 'unmatched' && (
                                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                                        Will prompt to add to grocery store
                                    </p>
                                )}
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: '500', color: statusColor(row.status), flexShrink: 0 }}>
                                {statusLabel(row)}
                            </span>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={confirmHaulImport}
                        disabled={importableCount === 0}
                        className="meals-add-btn"
                    >
                        Add {importableCount} item{importableCount === 1 ? '' : 's'} to fridge
                    </button>
                </div>
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.ImportHaulSection = ImportHaulSection;
