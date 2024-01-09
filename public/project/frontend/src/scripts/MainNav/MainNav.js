export default class MainNav {
    constructor(node) {
        const $mainNavItems = node.querySelectorAll('li a');

        $mainNavItems.forEach(($mainNavItem) => {
            $mainNavItem.addEventListener('click', (e) => {
                e.preventDefault();
                const identifier = e.target.href.split('#')[1];
                const $target = document.getElementById(identifier);
                if ($target === null) {
                    console.log('No Section with the specified identifier found');
                    return;
                }
                $mainNavItems.forEach((el) => {
                    el.classList.remove('is-active');
                });
                $mainNavItem.classList.add(('is-active'));
                this.scrollTo(identifier);
            });
        });

        let observer;
        let options = {
            root: null,
            rootMargin: '0px',
            threshold: [0.75, 0.75]
        };

        observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const identifier = entry.target.id;
                    const $target = document.querySelector('a[href$="' + identifier + '"]');
                    $mainNavItems.forEach((el) => {
                        el.classList.remove('is-active');
                    });
                    $target.classList.add(('is-active'));
                }
            });
        }, options);

        const sections = document.querySelectorAll('section[id]');

        for (let i = 0; i < sections.length; i++) {
            if (sections[i].id === '') {
                continue;
            }
            observer.observe(sections[i]);
        }
    }

    scrollTo (id) {
        const element = document.getElementById(id);
        const y = element.getBoundingClientRect().top - 80;

        window.scrollTo({top: y, behavior: 'smooth'});
    }
}