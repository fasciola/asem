import type { UseLanguageReturn } from './hooks/useLanguage';
import AboutSection from './sections/AboutSection';
import MissionSection from './sections/MissionSection';
import ServicesSection from './sections/ServicesSection';
import ExpertiseSection from './sections/ExpertiseSection';
import ImpactStatsSection from './sections/ImpactStatsSection';
import EventsBand from './sections/EventsBand';
import LaunchScene from './sections/LaunchScene';
import ReachSection from './sections/ReachSection';
import ClientsSection from './sections/ClientsSection';
import InvestmentSection from './sections/InvestmentSection';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';
import CampaignsMergedSection from './sections/CampaignsSection';

export default function BelowFold({ lang }: { lang: UseLanguageReturn }) {
    return (
        <>
                <div id="about" style={{ position: 'relative', zIndex: 2 }}>
                    <AboutSection lang={lang} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <MissionSection lang={lang} />
                </div>

                <div id="services" style={{ position: 'relative', zIndex: 2 }}>
                    <ServicesSection lang={lang} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <EventsBand lang={lang} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <LaunchScene lang={lang} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <ImpactStatsSection lang={lang} />
                </div>

                <div id="expertise" style={{ position: 'relative', zIndex: 2 }}>
                    <ExpertiseSection lang={lang} />
                </div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <ReachSection lang={lang} />
                </div>

                <div id="clients" style={{ position: 'relative', zIndex: 2 }}>
                    <ClientsSection lang={lang} />
                </div>

                <div id="campaigns" style={{ position: 'relative', zIndex: 2 }}>
                    <CampaignsMergedSection lang={lang} />
                </div>

                <div id="investment" style={{ position: 'relative', zIndex: 2 }}>
                    <InvestmentSection lang={lang} />
                </div>

                <div id="contact" style={{ position: 'relative', zIndex: 2 }}>
                    <ContactSection lang={lang} />
                </div>

                <div id="footer" style={{ position: 'relative', zIndex: 2 }}>
                    <FooterSection lang={lang} />
                </div>
        </>
    );
}
