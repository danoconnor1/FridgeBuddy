function ImportMealSection({
    mealImportPaste, setMealImportPaste,
    mealImportPreview, mealImportError,
    mealImportSuccess,
    mealImportRemoveFromFridge, setMealImportRemoveFromFridge,
    mealImportAddToRecipes, setMealImportAddToRecipes,
    previewMealImport, confirmMealImport, clearMealImport
}) {
    const { formatUnitLabel } = window.FB;

    const importableCount = mealImportPreview
        ? mealImportPreview.filter(meal => {
            if (meal.status === 'invalid') return false;
            return meal.ingredients.some(row => row.status === 'ready' || row.status === 'unmatched');
        }).length
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
                Assuming agent prompt (home page) has been pasted, describe your meal to your agent, then paste the response below.
            </p>

            <div className="import-paste-row">
                <textarea
                    value={mealImportPaste}
                    onChange={(e) => setMealImportPaste(e.target.value)}
                    placeholder="Paste response here"
                    rows={1}
                    className="meals-import-textarea"
                    aria-label="Paste Claude JSON response"
                />
                <button
                    type="button"
                    onClick={previewMealImport}
                    disabled={!mealImportPaste.trim()}
                    className="import-preview-btn"
                >
                    Preview
                </button>
            </div>

            {(mealImportPaste || mealImportPreview) && (
                <button type="button" onClick={clearMealImport} className="meals-clear-btn">Clear</button>
            )}

            {mealImportError && (
                <p className="meals-inline-error" role="alert">{mealImportError}</p>
            )}

            {mealImportSuccess && (
                <p className="meals-inline-success">Meals logged.</p>
            )}

            {mealImportPreview && (
                <div className="meals-import-preview">
                    <h5 className="import-preview-heading">Preview</h5>
                    {mealImportPreview.map(meal => (
                        <div key={meal.recipeIndex} style={{ marginBottom: '0.5rem' }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                                {meal.name || 'Untitled meal'}
                                {meal.status === 'invalid' && (
                                    <span style={{ color: 'var(--text-danger)', fontWeight: '500', marginLeft: '4px' }}>
                                        {meal.error}
                                    </span>
                                )}
                            </p>
                            {meal.ingredients.map(row => (
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
                        </div>
                    ))}

                    <label className="meals-option-check">
                        <input
                            type="checkbox"
                            checked={mealImportRemoveFromFridge}
                            onChange={(e) => setMealImportRemoveFromFridge(e.target.checked)}
                        />
                        Remove ingredients from fridge
                    </label>
                    <label className="meals-option-check">
                        <input
                            type="checkbox"
                            checked={mealImportAddToRecipes}
                            onChange={(e) => setMealImportAddToRecipes(e.target.checked)}
                        />
                        Add to recipes
                    </label>

                    <button
                        type="button"
                        onClick={confirmMealImport}
                        disabled={importableCount === 0}
                        className="meals-add-btn"
                    >
                        Log {importableCount} meal{importableCount === 1 ? '' : 's'}
                    </button>
                </div>
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.ImportMealSection = ImportMealSection;
