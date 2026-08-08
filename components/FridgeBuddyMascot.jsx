function FridgeBuddyMascot({ className }) {
    return (
        <span
            className={className}
            aria-hidden="true"
            dangerouslySetInnerHTML={{
                __html: window.FB.buildMascotSvgMarkup({ useCssVars: true, includeBackground: false })
            }}
        />
    );
}

window.FBComponents = window.FBComponents || {};
window.FBComponents.FridgeBuddyMascot = FridgeBuddyMascot;
