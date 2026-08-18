export default class MainNav {
    constructor(node) {
        const burger = document.querySelector('[data-burger]');
        const $mainNavItems = node.querySelectorAll('li a');

        burger.addEventListener('click', () => {
            if (burger.classList.contains('is-active')) {
                burger.classList.remove('is-active');
                node.classList.remove('is-active');
            } else {
                burger.classList.add('is-active');
                node.classList.add('is-active');
            }
        });

        $mainNavItems.forEach(($mainNavItem) => {
            $mainNavItem.addEventListener('click', (e) => {
                e.preventDefault();
                const identifier = e.target.href.split('#')[1];
                const $target = document.getElementById(identifier);
                if ($target === null) {
                    console.log(`No Section with the identifier: ${identifier}found`);
                    return;
                }

                node.classList.remove('is-active');
                burger.classList.remove('is-active');

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
            rootMargin: `-${window.innerHeight / 3}px`,
            threshold: [0, 0]
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

        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}