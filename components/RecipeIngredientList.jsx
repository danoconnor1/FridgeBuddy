function RecipeIngredientList({ ingredients, showQuantities, fridgeItems, catalogItems }) {
    const {
        getIngredientFridgeAvailability,
        formatRecipeIngredientWithFridge,
        getDaysUntilExpiry,
        recipeIngredientStatusColors
    } = window.FB;

    return (
        <ul style={{
            margin: 0,
            paddingLeft: '1.25rem',
            fontSize: '13px',
            columnCount: ingredients.length > 2 ? 2 : 1,
            columnGap: '1.5rem'
        }}>
            {ingredients.map((ingredient, index) => {
                const availability = getIngredientFridgeAvailability(
                    ingredient,
                    fridgeItems,
                    getDaysUntilExpiry,
                    catalogItems
                );
                return (
                    <li
                        key={index}
                        style={{
                            breakInside: 'avoid',
                            marginBottom: '4px',
                            color: recipeIngredientStatusColors[availability.status]
                        }}
                    >
                        {formatRecipeIngredientWithFridge(ingredient, availability, showQuantities)}
                    </li>
                );
            })}
        </ul>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipeIngredientList = RecipeIngredientList;
