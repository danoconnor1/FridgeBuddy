function EditRecipeModal({
    catalogItems, editRecipeName, setEditRecipeName,
    editRecipeCalories, setEditRecipeCalories, adjustEditRecipeCalories,
    editDraftIngredients, setEditDraftIngredients,
    addIngredientRowToList, updateIngredientInList, adjustIngredientQuantityInList, removeIngredientRowFromList,
    closeEditRecipeModal, saveRecipeEdit, deleteRecipeFromModal
}) {
    const { RecipeIngredientEditor, CaloriesField } = window.FBComponents;
    const { modalOverlay, modalCard } = window.FB_STYLES;

    return (
        <div style={modalOverlay} onClick={closeEditRecipeModal}>
            <div style={{ ...modalCard, maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 1rem 0' }}>Edit recipe</h3>
                <label style={{ display: 'block', marginBottom: '12px' }}>
                    <span style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' }}>Recipe name</span>
                    <input type="text" placeholder="Recipe name" value={editRecipeName} onChange={(e) => setEditRecipeName(e.target.value)} style={{ marginBottom: 0 }} />
                </label>
                {catalogItems.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 12px 0' }}>
                        Add items in the Grocery store before adding ingredients.
                    </p>
                ) : (
                    <>
                        <RecipeIngredientEditor
                            ingredients={editDraftIngredients}
                            setIngredients={setEditDraftIngredients}
                            catalogItems={catalogItems}
                            updateIngredientInList={updateIngredientInList}
                            adjustIngredientQuantityInList={adjustIngredientQuantityInList}
                            removeIngredientRowFromList={removeIngredientRowFromList}
                        />
                        <button
                            onClick={() => addIngredientRowToList(setEditDraftIngredients)}
                            style={{
                                width: '100%', padding: '10px', background: 'transparent', color: 'var(--fill-accent)',
                                border: '1px dashed var(--fill-accent)', borderRadius: 'var(--radius)', fontWeight: '500',
                                fontSize: '14px', marginBottom: '1rem', cursor: 'pointer'
                            }}
                        >
                            Add item
                        </button>
                        <CaloriesField
                            label="Calories"
                            value={editRecipeCalories}
                            onChange={setEditRecipeCalories}
                            onAdjust={adjustEditRecipeCalories}
                            hint="Defaults to ingredient estimate; adjust to override"
                        />
                    </>
                )}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button onClick={closeEditRecipeModal} style={{ flex: 1, padding: '10px', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Cancel</button>
                    <button onClick={saveRecipeEdit} style={{ flex: 1, padding: '10px', background: 'var(--fill-accent)', color: 'var(--on-accent)', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Save</button>
                </div>
                <button onClick={deleteRecipeFromModal} style={{ width: '100%', padding: '10px', background: 'var(--fill-danger)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius)', fontWeight: '500', fontSize: '14px' }}>Delete</button>
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.EditRecipeModal = EditRecipeModal;
