import { setup, getManager, show, addEventListener } from 'klaro/dist/klaro-no-css';
import 'klaro/dist/klaro.css';

window.klaroConfig = {
    version: 1,
    elementID: 'klaro',
    styling: {
        theme: ['light', 'top', 'wide'],
    },
    noAutoLoad: false,
    htmlTexts: true,
    embedded: false,
    groupByPurpose: true,
    storageMethod: 'cookie',
    cookieName: 'klaro',
    cookieExpiresAfterDays: 365,
    default: false,
    mustConsent: false,
    acceptAll: true,
    hideDeclineAll: false,
    hideLearnMore: false,
    translations: {
        de: {
            privacyPolicyUrl: '/datenschutz',
            consentModal: {
                title: 'Datenschutzeinstellungen',
                description:
                    'Hier können Sie einsehen und anpassen, welche Informationen wir über Sie sammeln und welche Dienste wir dafür verwenden.',
            },
            consentNotice: {
                description:
                    'Wir verwenden Cookies und ähnliche Technologien, um Inhalte zu personalisieren und die Zugriffe auf unsere Website zu analysieren.',
                learnMore: 'Mehr erfahren',
            },
            purposes: {
                analytics: 'Statistik',
                marketing: 'Marketing',
            },
            'google-tag-manager': {
                title: 'Google Tag Manager',
                description:
                    'Google Tag Manager wird verwendet, um die Nutzung unserer Website statistisch auszuwerten.',
            },
            youtube: {
                title: 'YouTube',
                description:
                    'YouTube wird verwendet, um Videos direkt auf unserer Website einzubetten.',
            },
        },
    },
    services: [
        {
            name: 'google-tag-manager',
            title: 'Google Tag Manager',
            purposes: ['analytics'],
            cookies: [/^_ga.*$/, /^_gid$/, /^_gat.*$/],
        },
        {
            name: 'youtube',
            title: 'YouTube',
            purposes: ['marketing'],
            cookies: [/^VISITOR_INFO1_LIVE$/, /^YSC$/, /^CONSENT$/, /^PREF$/],
            cookieDomains: ['.youtube.com'],
        },
    ],
};

setup(window.klaroConfig);

window.klaro = { getManager, show, addEventListener };