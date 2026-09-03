function SectionHeroHeader({ title, addLabel, onAdd, actions }) {
    return (
        <div className="fb-section-hero">
            <h2 className="fb-section-hero-title">{title}</h2>
            {(actions || addLabel) && (
                <div className="fb-section-hero-actions">
                    {addLabel && onAdd && (
                        <button
                            type="button"
                            className="fb-section-hero-add-btn"
                            onClick={onAdd}
                        >
                            {addLabel}
                        </button>
                    )}
                    {actions}
                </div>
            )}
        </div>
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.SectionHeroHeader = SectionHeroHeader;
