// ============================================================
// ASEM VISION - Complete Bilingual Configuration
// All content preserved from original website
// ============================================================

export type Language = 'en' | 'ar';

export interface SiteConfig {
    language: string;
    siteTitle: string;
    siteDescription: string;
}

export interface NavLink {
    label: string;
    labelAr: string;
    targetId: string;
}

export interface NavigationConfig {
    brandMark: string;
    links: NavLink[];
}

export interface HeroConfig {
    eyebrow: string;
    eyebrowAr: string;
    titleLine1: string;
    titleLine1Ar: string;
    titleLine2: string;
    titleLine2Ar: string;
    description: string;
    descriptionAr: string;
    ctaPrimary: string;
    ctaPrimaryAr: string;
    ctaSecondary: string;
    ctaSecondaryAr: string;
}

export interface AboutConfig {
    tagline: string;
    taglineAr: string;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
    stats: { value: string; label: string; labelAr: string }[];
    image: string;
    quote: string;
    quoteAr: string;
}

export interface MissionConfig {
    tagline: string;
    taglineAr: string;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
}

export interface ServiceItem {
    icon: string;
    title: string;
    titleAr: string;
    desc: string;
    descAr: string;
    image: string;
}

export interface ServicesConfig {
    tagline: string;
    taglineAr: string;
    title: string;
    titleAr: string;
    items: ServiceItem[];
}

// Updated ExpertiseConfig to match the component needs
export interface ExpertiseConfig {
    tagline: string;
    taglineAr: string;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
    videoSrc: string;
    videoPoster: string;
    quote: string;
    quoteAr: string;
    stats?: { value: string; label: string; labelAr: string }[]; // optional
}

export interface ReachConfig {
    tagline: string;
    taglineAr: string;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
    countries: { flag: string; name: string; nameAr: string }[];
}

export interface ClientData {
    name: string;
    nameAr: string;
    logo: string;
}

export interface ClientsConfig {
    tagline: string;
    taglineAr: string;
    title: string;
    titleAr: string;
    clients: ClientData[];
}

export interface CampaignsConfig {
    tagline: string;
    taglineAr: string;
    title: string;
    titleAr: string;
    items: { text: string; textAr: string }[];
}

export interface DigitalConfig {
    tagline: string;
    taglineAr: string;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
}

export interface InvestmentConfig {
    tag: string;
    tagAr: string;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
    ctaPrimary: string;
    ctaPrimaryAr: string;
    ctaSecondary: string;
    ctaSecondaryAr: string;
    video: string;
    poster: string;
}

export interface ContactConfig {
    title1: string;
    title1Ar: string;
    title2: string;
    title2Ar: string;
    subtitle: string;
    subtitleAr: string;
    license: string;
    licenseAr: string;
    email: string;
    phone: string;
    whatsapp: string;
    cta: string;
    ctaAr: string;
}

export interface FooterConfig {
    tagline: string;
    taglineAr: string;
    links: { label: string; labelAr: string; href: string }[];
    copyright: string;
    copyrightAr: string;
}

// ============================================================
// CONFIG DATA
// ============================================================

export const siteConfig: SiteConfig = {
    language: 'en',
    siteTitle: 'Asem Vision | Integrated Marketing & Events - GCC',
    siteDescription: 'Premium marketing, events & brand activation across the GCC. Creating impactful campaigns since 2012.',
};

export const navigationConfig: NavigationConfig = {
    brandMark: 'AV',
    links: [
        { label: 'Home', labelAr: 'الرئيسية', targetId: 'home' },
        { label: 'About', labelAr: 'من نحن', targetId: 'about' },
        { label: 'Services', labelAr: 'خدماتنا', targetId: 'services' },
        { label: 'Expertise', labelAr: 'خبراتنا', targetId: 'expertise' },
        { label: 'Clients', labelAr: 'عملاؤنا', targetId: 'clients' },
        { label: 'Investment', labelAr: 'الاستثمار', targetId: 'investment' },
        { label: 'Contact', labelAr: 'تواصل معنا', targetId: 'contact' },
    ],
};

export const heroConfig: HeroConfig = {
    eyebrow: 'Integrated Marketing, Events & Brand Activation Across the GCC',
    eyebrowAr: 'حلول تسويق متكاملة وتنظيم فعاليات في دول الخليج',
    titleLine1: 'We Create Impactful',
    titleLine1Ar: 'نضع علامتك التجارية',
    titleLine2: 'Brand Experiences.',
    titleLine2Ar: 'في القمة.',
    description: 'We connect brands with their audiences through creativity, strategy, and flawless execution across the Gulf region.',
    descriptionAr: 'نربط العلامات التجارية بجمهورها من خلال الإبداع والاستراتيجية والتنفيذ الاحترافي عبر منطقة الخليج.',
    ctaPrimary: 'Explore Services',
    ctaPrimaryAr: 'استكشف خدماتنا',
    ctaSecondary: 'Start Your Project',
    ctaSecondaryAr: 'ابدأ مشروعك',
};
export const aboutConfig: AboutConfig = {
    tagline: 'Since 2012',
    taglineAr: 'منذ 2012',
    title: 'Creating Impactful Brand Experiences Since 2012',
    titleAr: 'نصنع تجارب علامات تجارية مؤثرة منذ 2012',
    body: 'We connect brands with their audiences through creativity, strategy, and flawless execution across the Gulf region. From field marketing to digital campaigns, we deliver measurable results.',
    bodyAr: 'نربط العلامات التجارية بجمهورها من خلال الإبداع والاستراتيجية والتنفيذ الاحترافي عبر منطقة الخليج. من التسويق الميداني إلى الحملات الرقمية، نقدم نتائج قابلة للقياس.',
    stats: [
        { value: '150+', label: 'Campaigns', labelAr: 'حملة' },
        { value: '12+', label: 'Markets', labelAr: 'سوق' },
        { value: '98%', label: 'Client Retention', labelAr: 'استبقاء العملاء' },
    ],
    image: 'images/1778137111.png', // adjust path to your actual image
    quote: 'We turn ideas into impact, and impact into legacy.',
    quoteAr: 'نحول الأفكار إلى تأثير، والتأثير إلى إرث.',
};

export const expertiseConfig: ExpertiseConfig = {
    tagline: 'Core Competencies',
    taglineAr: 'الكفاءات الأساسية',
    title: 'Our Expertise Since 2012',        // optional: change year to 2012 if you prefer
    titleAr: 'خبرتنا منذ 2012',
    body: 'With over a decade of cross‑industry innovation, we deliver high‑impact marketing campaigns, brand activations, and event management across the GCC. Every project is an opportunity to create lasting connections.',
    bodyAr: 'مع أكثر من عقد من الابتكار عبر الصناعات، نقدم حملات تسويقية عالية التأثير، وتنشيط العلامات التجارية، وإدارة الفعاليات في جميع أنحاء الخليج. كل مشروع هو فرصة لخلق روابط دائمة.',
    videoSrc: 'videos/Why-Partner.mp4',
    videoPoster: 'images/expertise-poster.jpg',
    quote: 'Strategic creativity that moves markets.',
    quoteAr: 'إبداع استراتيجي يحرك الأسواق.',
    stats: [
        { value: '150+', label: 'Campaigns', labelAr: 'حملة' },
        { value: '12+', label: 'Markets Served', labelAr: 'سوق مخدوم' },
        { value: '98%', label: 'Client Retention', labelAr: 'استبقاء العملاء' },
    ],
};

export const missionConfig: MissionConfig = {
    tagline: 'Our Mission',
    taglineAr: 'رسالتنا',
    title: 'Empowering Brands Through Strategy.',
    titleAr: 'تمكين العلامات باستراتيجية.',
    body: 'To empower brands and organizations through creative marketing solutions, strategic outreach, and impactful campaigns that build trust and enhance visibility across the Middle East.',
    bodyAr: 'تمكين العلامات التجارية والمؤسسات من خلال حلول تسويقية مبتكرة واستراتيجيات فعالة وحملات مؤثرة تعزز الثقة وتزيد من الظهور في منطقة الشرق الأوسط.',
};

export const servicesConfig: ServicesConfig = {
    tagline: 'Services',
    taglineAr: 'خدماتنا',
    title: 'Integrated Solutions.',
    titleAr: 'حلول متكاملة.',
    items: [
        {
            icon: 'megaphone',
            title: 'Marketing Campaigns',
            titleAr: 'الحملات التسويقية',
            desc: 'Promotional & field marketing campaigns designed for maximum impact',
            descAr: 'حملات ترويجية وميدانية مصممة لأقصى تأثير',
            image: 'images/service-marketing.jpg',
        },
        {
            icon: 'users',
            title: 'Event Management',
            titleAr: 'تنظيم الفعاليات',
            desc: 'Full-service festival, conference & corporate event execution',
            descAr: 'تنفيذ متكامل للمهرجانات والمؤتمرات والفعاليات المؤسسية',
            image: 'images/service-events.jpg',
        },
        {
            icon: 'target',
            title: 'Product Launches',
            titleAr: 'تدشين المنتجات',
            desc: 'Strategic debuts that capture attention and drive adoption',
            descAr: 'إطلاق استراتيجي يجذب الانتباه ويعزز الاعتماد',
            image: 'images/service-launches.jpg',
        },
        {
            icon: 'monitor',
            title: 'Digital Marketing',
            titleAr: 'التسويق الرقمي',
            desc: 'Content strategy & multi-platform campaign management',
            descAr: 'إستراتيجية المحتوى وإدارة الحملات عبر المنصات',
            image: 'images/service-digital.jpg',
        },
        {
            icon: 'palette',
            title: 'Creative Production',
            titleAr: 'الإنتاج الإبداعي',
            desc: 'Graphic design, media production & brand identity development',
            descAr: 'التصميم الجرافيكي، الإنتاج الإعلامي، وتطوير الهوية',
            image: 'images/service-creative.jpg',
        },
        {
            icon: 'zap',
            title: 'Multi-Channel Execution',
            titleAr: 'التنفيذ متعدد القنوات',
            desc: 'Seamless campaign delivery across all touchpoints',
            descAr: 'تنفيذ متفرد للحملات الترويجيه عبر القنوات الرقمية',
            image: 'images/service-multichannel.jpg',
        },
    ],
};

export const reachConfig: ReachConfig = {
    tagline: 'Geographic Reach',
    taglineAr: 'نطاق العمل',
    title: 'Pan-GCC Coverage.',
    titleAr: 'تغطية شاملة للخليج.',
    body: 'We operate across multiple markets, delivering campaigns with efficiency and scalability tailored to each audience and cultural context.',
    bodyAr: 'نعمل عبر عدة أسواق وننفذ الحملات بكفاءة عالية مع مراعاة خصوصية كل سوق وجمهور مستهدف وسياق ثقافي.',
    countries: [
        { flag: '🇸🇦', name: 'Saudi Arabia', nameAr: 'السعودية' },
        { flag: '🇦🇪', name: 'UAE', nameAr: 'الإمارات' },
        { flag: '🇰🇼', name: 'Kuwait', nameAr: 'الكويت' },
        { flag: '🇶🇦', name: 'Qatar', nameAr: 'قطر' },
        { flag: '🇧🇭', name: 'Bahrain', nameAr: 'البحرين' },
        { flag: '🇴🇲', name: 'Oman', nameAr: 'عمان' },
    ],
};

export const clientsConfig: ClientsConfig = {
    tagline: 'Our Clients',
    taglineAr: 'عملاؤنا',
    title: 'Trusted By Leading Brands.',
    titleAr: 'يثق بنا رواد السوق.',
    clients: [
        { name: 'Samsung Mobile', nameAr: 'سامسونج موبايل', logo: 'logos/samsung.png' },
        { name: 'London Dairy', nameAr: 'لندن ديري', logo: 'logos/london-dairy.png' },
        { name: 'Capo Dairy', nameAr: 'كابو للألبان', logo: 'logos/capo.png' },
        { name: 'Sayga', nameAr: 'سيقا', logo: 'logos/sayga.png' },
        { name: 'Livguard', nameAr: 'ليفغارد', logo: 'logos/livguard.png' },
        { name: 'Chisage', nameAr: 'شيساج', logo: 'logos/chisage.png' },
        { name: 'Black Dragon', nameAr: 'بلاك دراقون', logo: 'logos/black-dragon.png' },
        { name: 'Gold & Sun', nameAr: 'قولد إن صن', logo: 'logos/gold-sun.png' },
        { name: 'Tang', nameAr: 'تانج', logo: 'logos/tang.png' },
        { name: 'Unilever', nameAr: 'يونيلفر', logo: 'logos/unilever.png' },
        { name: 'IGLOO', nameAr: 'آي جلو', logo: 'logos/igloo.png' },
        { name: 'US AID', nameAr: 'الوكالة الأمريكية للتنمية الدولية', logo: 'logos/usaid.png' },
        { name: 'UNFPA', nameAr: 'صندوق الأمم المتحدة للسكان', logo: 'logos/unfpa.png' },
        { name: 'Save the Children', nameAr: 'إنقاذ الطفل', logo: 'logos/save-the-children.png' },
        { name: 'EUROCAKE', nameAr: 'يورو كيك', logo: 'logos/eurocake.png' },
        { name: 'WHO', nameAr: 'منظمة الصحة العالمية', logo: 'logos/WHO.png' },
    ],
};

export const campaignsConfig: CampaignsConfig = {
    tagline: 'Campaigns',
    taglineAr: 'حملاتنا',
    title: 'Impactful Activations.',
    titleAr: 'تفعيلات مؤثرة.',
    items: [
        { text: 'Product launches across markets', textAr: 'تدشين المنتجات في الأسواق' },
        { text: 'Brand activations and promotions', textAr: 'الحملات الترويجية وتنشيط العلامات' },
        { text: 'Public awareness campaigns', textAr: 'حملات التوعية المجتمعية' },
        { text: 'Youth and community initiatives', textAr: 'مبادرات الشباب والمجتمع' },
        { text: 'Retail and mall activations', textAr: 'الفعاليات داخل المراكز التجارية' },
    ],
};

export const investmentConfig: InvestmentConfig = {
    tag: 'Global Investment Solutions',
    tagAr: 'حلول الاستثمار العالمية',
    title: 'Expand Beyond Borders With Strategic Global Investments',
    titleAr: 'توسع عبر الحدود مع استثمارات عالمية استراتيجية',
    body: 'We help visionary businesses and investors unlock premium international opportunities through intelligent market positioning, luxury branding, and high-impact global expansion strategies tailored for the GCC market.',
    bodyAr: 'نساعد الشركات والمستثمرين ذوي الرؤية على اكتشاف الفرص الدولية المتميزة من خلال التموضع الذكي في الأسواق، والعلامات التجارية الفاخرة، واستراتيجيات التوسع العالمي عالية التأثير المصممة خصيصًا لسوق الخليج.',
    ctaPrimary: 'Explore Opportunities',
    ctaPrimaryAr: 'استكشف الفرص',
    ctaSecondary: 'Learn More',
    ctaSecondaryAr: 'اعرف المزيد',
    video: 'investment-video.mp4',
    poster: 'expand-horizons.jpg',
};

export const contactConfig: ContactConfig = {
    title1: "Let's Create",
    title1Ar: 'لنبتكر',
    title2: 'Together.',
    title2Ar: 'معاً.',
    subtitle: "Ready to elevate your brand presence across the GCC? Our team is ready to bring your vision to life.",
    subtitleAr: 'جاهز لرفع حضور علامتك التجارية عبر الخليج؟ فريقنا مستعد لتحويل رؤيتك إلى واقع.',
    license: 'Dubai Economy & Tourism License No. 1623128',
    licenseAr: 'رخصة دائرة الاقتصاد والسياحة دبي رقم ١٦٢٣١٢٨',
    email: 'info@asemvision.com',
    phone: '+971 50 582 2373',
    whatsapp: '+971505822373',
    cta: 'Start a Conversation',
    ctaAr: 'ابدأ محادثة',
};

export const footerConfig: FooterConfig = {
    tagline: 'Dubai \u2022 Integrated Marketing Solutions',
    taglineAr: 'دبي \u2022 حلول تسويق متكاملة',
    links: [
        { label: 'Privacy', labelAr: 'الخصوصية', href: '#' },
        { label: 'Terms', labelAr: 'الشروط', href: '#' },
        { label: 'Careers', labelAr: 'وظائف', href: '#' },
    ],
    copyright: '\u00A9 2026 ASEM VISION. All Rights Reserved.',
    copyrightAr: '\u00A9 2026 عاصم فيجن. جميع الحقوق محفوظة.',
};

// Rolling words for the philosophy carousel (3D ring)
export const rollingWords = [
    'CREATIVITY',
    'STRATEGY',
    'EXECUTION',
    'IMPACT',
    'VISION',
    'EXCELLENCE',
];