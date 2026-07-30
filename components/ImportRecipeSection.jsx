function ImportRecipeSection({
    recipeImportPaste, setRecipeImportPaste,
    recipeImportPreview, recipeImportError,
    recipeImportSuccess,
    previewRecipeImport, confirmRecipeImport, clearRecipeImport
}) {
    const { formatUnitLabel } = window.FB;
    const { categoryHeading } = window.FB_STYLES;

    const importableRecipeCount = recipeImportPreview
        ? recipeImportPreview.filter(recipe => {
            if (recipe.status === 'invalid') return false;
            return recipe.ingredients.some(row => row.status === 'ready' || row.status === 'unmatched');
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
                Assuming agent prompt (home page) has been pasted, paste or describe your recipe to your agent, then paste the response below.
            </p>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <textarea
                    id="recipe-import-paste"
                    value={recipeImportPaste}
                    onChange={(e) => setRecipeImportPaste(e.target.value)}
                    placeholder="Paste response here"
                    rows={1}
                    className="meals-import-textarea"
                    aria-label="Paste Claude JSON response"
                />
                <button
                    type="button"
                    onClick={previewRecipeImport}
                    disabled={!recipeImportPaste.trim()}
                    className="import-preview-btn"
                >
                    Preview
                </button>
            </div>

            {(recipeImportPaste || recipeImportPreview) && (
                <button type="button" onClick={clearRecipeImport} className="meals-clear-btn">Clear</button>
            )}

            {recipeImportError && (
                <p className="meals-inline-error" role="alert">{recipeImportError}</p>
            )}

            {recipeImportSuccess && (
                <p className="meals-inline-success">Recipes added.</p>
            )}

            {recipeImportPreview && (
                <div className="meals-import-preview">
                    <h5 style={{ ...categoryHeading, marginTop: 0, marginBottom: '0.4rem' }}>Preview</h5>
                    {recipeImportPreview.map(recipe => (
                        <div key={recipe.recipeIndex} style={{ marginBottom: '0.5rem' }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                                {recipe.name || 'Untitled recipe'}
                                {recipe.status === 'invalid' && (
                                    <span style={{ color: 'var(--text-danger)', fontWeight: '500', marginLeft: '4px' }}>
                                        {recipe.error}
                                    </span>
                                )}
                            </p>
                            {recipe.ingredients.map(row => (
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
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={confirmRecipeImport}
                        disabled={importableRecipeCount === 0}
                        className="meals-add-btn"
                    >
                        Add {importableRecipeCount} recipe{importableRecipeCount === 1 ? '' : 's'}
                    </button>
                </div>
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.ImportRecipeSection = ImportRecipeSection;
