function MealIngredientList({ ingredients, onRemoveIngredient }) {
    const { formatIngredient } = window.FB;

    if (!ingredients?.length) {
        return <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>No ingredients</p>;
    }

    return (
        <ul style={{
            margin: 0,
            paddingLeft: '1.25rem',
            fontSize: '13px',
            color: 'var(--text-primary)',
            columnCount: ingredients.length > 2 ? 2 : 1,
            columnGap: '1.5rem'
        }}>
            {ingredients.map((ingredient, index) => (
                <li
                    key={`${ingredient.catalogItemId}-${index}`}
                    style={{
                        breakInside: 'avoid',
                        marginBottom: '4px'
                    }}
                >
                    {formatIngredient(ingredient)}
                    {onRemoveIngredient && (
                        <button
                            type="button"
                            onClick={() => onRemoveIngredient(index)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                marginLeft: '4px',
                                color: 'var(--fill-danger)',
                                fontSize: '14px',
                                fontWeight: '600',
                                lineHeight: 1,
                                verticalAlign: 'baseline',
                                cursor: 'pointer'
                            }}
                            aria-label={`Remove ${ingredient.name} from meal`}
                        >
                            −
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.MealIngredientList = MealIngredientList;
