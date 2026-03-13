(function () {
    const ease = "power2.inOut";

    function normalizePath(pathname) {
        const parts = pathname.split('/').filter(Boolean);
        return parts.length ? parts[parts.length - 1] : 'index.html';
    }

    function shouldHandleLink(link) {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href === '#') return false;
        if (link.target === '_blank' || link.hasAttribute('download')) return false;
        if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;

        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return false;

        const current = normalizePath(window.location.pathname);
        const next = normalizePath(url.pathname);
        return current !== next;
    }

    function setNavHidden(hidden) {
        document.body.classList.toggle('is-transitioning', hidden);
    }

    function revealTransition() {
        return new Promise((resolve) => {
            gsap.set(".block",{scaleY:1});
            gsap.to(".block", { 
                duration: 1,
                scaleY: 0,
                stagger:{
                    each:0.1,
                    from:"start",
                    grid:"auto",
                    axis:"x",
                },
                ease: ease,
                onComplete: resolve,
            });
        });
    }

    function animateTransition() {
        return new Promise((resolve) => {
            gsap.set(".block",{visibility:"visible", scaleY:0});
            gsap.to(".block", { 
                duration: 1, 
                scaleY: 1,
                stagger:{
                    each:0.1,
                    from:"start",
                    grid:[2,5],
                    axis:"x",
                },
                ease: ease,
                onComplete: resolve,
            });
        });
    }

    function handleLinkClick(event) {
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const link = event.currentTarget;
        if (!shouldHandleLink(link)) return;
        event.preventDefault();
        const href = link.getAttribute('href');

        const navigate = () => {
            if (window.spaNavigate) {
                window.spaNavigate(href);
            } else {
                window.location.href = href;
            }
        };

        if (window.gsap) {
            setNavHidden(true);
            animateTransition().then(navigate);
        } else {
            navigate();
        }
    }

    function initTransitions() {
        document.querySelectorAll('a').forEach((link) => {
            if (link.dataset.transitionBound) return;
            link.dataset.transitionBound = 'true';
            link.addEventListener('click', handleLinkClick);
        });

        if (window.gsap) {
            setNavHidden(true);
            revealTransition().then(() => {
                gsap.set(".block",{visibility:"hidden"});
                setNavHidden(false);
            });
        }
    }

    window.initTransitions = initTransitions;
    document.addEventListener('DOMContentLoaded', initTransitions);
})();
