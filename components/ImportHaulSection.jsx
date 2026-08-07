function ImportHaulSection({
    haulImportPaste, setHaulImportPaste,
    haulImportPreview, haulImportError,
    haulImportSuccess,
    previewHaulImport, confirmHaulImport, clearHaulImport
}) {
    const { formatUnitLabel } = window.FB;

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

            <div className="import-paste-row">
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
                    <h5 className="import-preview-heading">Preview</h5>
                    {haulImportPreview.map(row => (
                        <div key={row.index} className="meals-preview-row">
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p className="preview-row-name">{row.name}</p>
                                <p className="preview-row-detail">
                                    {row.status !== 'invalid'
                                        ? `${row.quantity} ${formatUnitLabel(row.unit)}`
                                        : row.error}
                                </p>
                                {row.status === 'unmatched' && (
                                    <p className="preview-row-note">
                                        Will prompt to add to grocery store
                                    </p>
                                )}
                            </div>
                            <span className="preview-row-status" style={{ color: statusColor(row.status) }}>
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
