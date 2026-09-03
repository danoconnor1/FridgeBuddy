function RecipeCard({
    recipe, catalogItems, items, toggleRecipeShowQuantities,
    onEdit, onUpdateCalories, onAddToFridge,
    defaultExpanded = false
}) {
    const { RecipeIngredientList, CaloriesField, CollapsibleCard } = window.FBComponents;
    const {
        getRecipeDisplayCalories,
        getRecipeIngredientProgress,
        getDaysUntilExpiry,
        formatRecipeLinkLabel
    } = window.FB;

    const displayCalories = getRecipeDisplayCalories(recipe, catalogItems);
    const progress = getRecipeIngredientProgress(recipe, items, getDaysUntilExpiry, catalogItems);
    const progressTone = progress.percent >= 100
        ? 'complete'
        : progress.percent >= 50
            ? 'partial'
            : 'low';

    const progressMeta = recipe.ingredients?.length ? (() => {
        const size = 40;
        const stroke = 4;
        const radius = (size - stroke) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - progress.percent / 100);

        return (
            <span
                className={`recipe-card-progress recipe-card-progress--${progressTone}`}
                aria-label={`${progress.percent}% of ingredients in fridge`}
            >
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="recipe-card-progress-ring"
                    aria-hidden="true"
                >
                    <circle
                        className="recipe-card-progress-track"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        strokeWidth={stroke}
                    />
                    <circle
                        className="recipe-card-progress-fill"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </svg>
                <span className="recipe-card-progress-label">{progress.percent}%</span>
            </span>
        );
    })() : null;

    const cardBody = (
        <div className="recipe-card">
            <div className="recipe-card-body">
                <div className="recipe-card-header">
                    {defaultExpanded && (
                        <p className="recipe-card-name">{recipe.name}</p>
                    )}
                    <button
                        type="button"
                        onClick={() => toggleRecipeShowQuantities(recipe.id)}
                        className={`recipe-card-toggle-qty${recipe.showQuantities ? ' is-active' : ''}`}
                    >
                        {recipe.showQuantities ? 'Hide fridge quantities' : 'Show fridge quantities'}
                    </button>
                </div>
                {onUpdateCalories ? (
                    <div className="recipe-card-calories">
                        <CaloriesField
                            label="Calories"
                            value={displayCalories != null ? String(displayCalories) : ''}
                            onChange={(value) => onUpdateCalories(recipe.id, value)}
                            onAdjust={(delta) => {
                                const current = displayCalories ?? 0;
                                onUpdateCalories(recipe.id, String(window.FB.adjustCalories(current, delta)));
                            }}
                        />
                    </div>
                ) : displayCalories != null && (
                    <div className="recipe-card-calories">
                        <CaloriesField
                            label="Calories"
                            value={String(displayCalories)}
                            readOnly
                        />
                    </div>
                )}
                <RecipeIngredientList
                    ingredients={recipe.ingredients}
                    showQuantities={recipe.showQuantities}
                    fridgeItems={items}
                    catalogItems={catalogItems}
                />
                {recipe.url && (
                    <a
                        href={recipe.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="recipe-card-link"
                    >
                        {formatRecipeLinkLabel(recipe.url)}
                    </a>
                )}
            </div>
            {(onAddToFridge || onEdit) && (
                <div className="recipe-card-actions">
                    {onAddToFridge && (
                        <button
                            type="button"
                            onClick={() => onAddToFridge(recipe)}
                            disabled={!recipe.ingredients?.length}
                            className="recipe-card-add-fridge-btn"
                        >
                            Add to fridge
                        </button>
                    )}
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(recipe)}
                            className="recipe-card-edit-btn"
                            aria-label={`Edit ${recipe.name}`}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M4 20h4l10.5-10.5a2.828 2.828 0 1 0-4-4L4 16v4" />
                                <path d="M13.5 6.5l4 4" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    if (defaultExpanded) {
        return cardBody;
    }

    return (
        <CollapsibleCard
            title={recipe.name}
            meta={progressMeta}
            defaultExpanded={false}
        >
            {cardBody}
        </CollapsibleCard>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.RecipeCard = RecipeCard;
