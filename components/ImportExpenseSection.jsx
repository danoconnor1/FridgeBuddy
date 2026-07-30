function ImportExpenseSection({
    expenseImportPaste, setExpenseImportPaste,
    expenseImportPreview, expenseImportError,
    expenseImportSuccess,
    previewExpenseImport, confirmExpenseImport, clearExpenseImport
}) {
    const { formatExpenseCategory, formatExpensePrice } = window.FB;
    const { categoryHeading } = window.FB_STYLES;

    const importableExpenseCount = expenseImportPreview
        ? expenseImportPreview.filter(expense => {
            if (expense.status === 'invalid') return false;
            if (expense.price != null) return true;
            return expense.items.some(row => row.status === 'ready');
        }).length
        : 0;

    const statusColor = (status) => {
        if (status === 'ready') return 'var(--text-success)';
        return 'var(--text-danger)';
    };

    const statusLabel = (row) => (row.status === 'ready' ? 'Ready' : row.error || 'Invalid');

    return (
        <div className="meals-add-column-card">
            <p className="meals-import-instruction">
                Assuming agent prompt (home page) has been pasted, paste, describe, or include a screenshot of your receipt to your agent, then paste the response below.
            </p>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <textarea
                    id="expense-import-paste"
                    value={expenseImportPaste}
                    onChange={(e) => setExpenseImportPaste(e.target.value)}
                    placeholder="Paste response here"
                    rows={1}
                    className="meals-import-textarea"
                    aria-label="Paste Claude JSON response"
                />
                <button
                    type="button"
                    onClick={previewExpenseImport}
                    disabled={!expenseImportPaste.trim()}
                    className="import-preview-btn"
                >
                    Preview
                </button>
            </div>

            {(expenseImportPaste || expenseImportPreview) && (
                <button type="button" onClick={clearExpenseImport} className="meals-clear-btn">Clear</button>
            )}

            {expenseImportError && (
                <p className="meals-inline-error" role="alert">{expenseImportError}</p>
            )}

            {expenseImportSuccess && (
                <p className="meals-inline-success">Expenses added.</p>
            )}

            {expenseImportPreview && (
                <div className="meals-import-preview">
                    <h5 style={{ ...categoryHeading, marginTop: 0, marginBottom: '0.4rem' }}>Preview</h5>
                    {expenseImportPreview.map(expense => (
                        <div key={expense.expenseIndex} style={{ marginBottom: '0.5rem' }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                                {expense.title || 'Untitled expense'}
                                {expense.status !== 'invalid' && (
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500', marginLeft: '6px' }}>
                                        · {formatExpenseCategory(expense.category)}
                                        {expense.date ? ` · ${expense.date}` : ''}
                                        {expense.price != null ? ` · ${formatExpensePrice(expense.price)}` : ''}
                                    </span>
                                )}
                                {expense.status === 'invalid' && (
                                    <span style={{ color: 'var(--text-danger)', fontWeight: '500', marginLeft: '4px' }}>
                                        {expense.error}
                                    </span>
                                )}
                            </p>
                            {expense.items.map(row => (
                                <div key={row.itemIndex} className="meals-preview-row">
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '11px', fontWeight: '500', margin: 0 }}>{row.name}</p>
                                        <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: 0 }}>
                                            {row.status === 'ready'
                                                ? formatExpensePrice(row.price)
                                                : row.error}
                                        </p>
                                    </div>
                                    <span style={{ fontSize: '10px', fontWeight: '500', color: statusColor(row.status), flexShrink: 0 }}>
                                        {statusLabel(row)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={confirmExpenseImport}
                        disabled={importableExpenseCount === 0}
                        className="meals-add-btn"
                    >
                        Add {importableExpenseCount} expense{importableExpenseCount === 1 ? '' : 's'}
                    </button>
                </div>
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.ImportExpenseSection = ImportExpenseSection;
