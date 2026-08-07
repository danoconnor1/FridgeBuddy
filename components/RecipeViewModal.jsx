function RecipeViewModal({ recipe, catalogItems, items, toggleRecipeShowQuantities, closeViewRecipeModal }) {
    const { RecipeCard } = window.FBComponents;

    if (!recipe) return null;

    return (
        <div className="fb-modal-overlay" onClick={closeViewRecipeModal}>
            <div className="fb-modal-card" onClick={(e) => e.stopPropagation()}>
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
