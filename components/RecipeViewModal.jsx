function RecipeViewModal({ recipe, catalogItems, items, toggleRecipeShowQuantities, closeViewRecipeModal }) {
    const { RecipeCard } = window.FBComponents;
    const { modalOverlay, modalCard } = window.FB_STYLES;

    if (!recipe) return null;

    return (
        <div style={modalOverlay} onClick={closeViewRecipeModal}>
            <div
                style={{ ...modalCard, maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}
                onClick={(e) => e.stopPropagation()}
            >
                <RecipeCard
                    recipe={recipe}
                    catalogItems={catalogItems}
                    items={items}
                    toggleRecipeShowQuantities={toggleRecipeShowQuantities}
                />
            </div>
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipeViewModal = RecipeViewModal;
