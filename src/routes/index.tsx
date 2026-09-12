import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, ChevronDown, MapPin, Menu, X, Sparkles, Heart } from "lucide-react";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import openingLamp from "@/assets/opening-lamp.webp";
import courtyard from "@/assets/courtyard-journey.webp";
import corridor from "@/assets/pillared-corridor.webp";
import mandapam from "@/assets/grand-mandapam.webp";
import finalCourtyard from "@/assets/final-courtyard.webp";
import { ScrollJourney } from "@/components/cinematic/ScrollJourney";
import { InvitationGate } from "@/components/cinematic/InvitationGate";
import { TwoPathsScene } from "@/components/cinematic/TwoPathsScene";
import { AnimatedCouple } from "@/components/cinematic/AnimatedCharacter";
import { Countdown } from "@/components/wedding/Countdown";
import { RsvpForm } from "@/components/wedding/RsvpForm";
import { Button } from "@/components/ui/button";
import { weddingData } from "@/data/weddingData";
import { animationCoordinator } from "@/lib/animation-coordinator";
import { useCinematicParallax } from "@/hooks/use-cinematic-parallax";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aarav & Diya — A Journey to Forever" },
      {
        name: "description",
        content:
          "Join Aarav and Diya for their South Indian wedding celebration in Chennai on 18 January 2027.",
      },
      { property: "og:title", content: "Aarav & Diya — A Journey to Forever" },
      {
        property: "og:description",
        content: "With love, we invite you to celebrate our beautiful beginning in Chennai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvitationPage,
});

const navigation = [
  ["Story", "#story"],
  ["Wedding", "#wedding"],
  ["Celebration", "#venue"],
  ["Gallery", "#gallery"],
  ["RSVP", "#rsvp"],
] as const;

function InvitationPage() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      {!opened && <InvitationGate onOpened={() => setOpened(true)} />}
      <ScrollJourney active={opened}>
        <main className={opened ? "wedding-journey is-revealed" : "wedding-journey"}>
          <FloatingNavigation />
          <OpeningScene />
          <TwoPathsScene active={opened} />
          <StoryChapters />
          <MandapamScene />
          <CelebrationSection />
          <Gallery />
          <InvitationEnd />
        </main>
      </ScrollJourney>
    </>
  );
}

function FloatingNavigation() {
  const [open, setOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setOpen(false);
    animationCoordinator.scrollTo(target, { offset: -20 });
  };

  return (
    <nav className="floating-nav" aria-label="Invitation navigation">
      <a
        className="nav-monogram"
        href="#top"
        onClick={(e) => handleNavClick(e, "#top")}
        aria-label="Aarav and Diya, back to beginning"
      >
        A <span>&</span> D
      </a>
      <div className={open ? "nav-links is-open" : "nav-links"}>
        {navigation.map(([label, href]) => (
          <a key={href} href={href} onClick={(e) => handleNavClick(e, href)}>
            {label}
          </a>
        ))}
      </div>
      <Button
        className="menu-button"
        variant="outline"
        size="icon"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </Button>
    </nav>
  );
}

function SceneImage({
  src,
  alt,
  eager = false,
  depth = 0.2,
}: {
  src: string;
  alt: string;
  eager?: boolean;
  depth?: number;
}) {
  const parallaxRef = useCinematicParallax<HTMLImageElement>(depth, "all");

  return (
    <img
      ref={parallaxRef}
      data-scene-image
      src={src}
      alt={alt}
      width={1536}
      height={1024}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
    />
  );
}

function OpeningScene() {
  const copyParallaxRef = useCinematicParallax<HTMLDivElement>(0.4, "all");

  return (
    <section id="top" className="opening-scene" data-scene aria-labelledby="opening-title">
      <SceneImage
        src={openingLamp}
        alt="A glowing brass lamp in a flower-lined South Indian wedding entrance"
        eager
        depth={0.15}
      />
      <div className="opening-vignette" />
      <div className="particles" aria-hidden="true">
        {Array.from({ length: 22 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="opening-copy" ref={copyParallaxRef} data-opening-copy>
        <p className="eyebrow">Together with their families</p>
        <h1 id="opening-title">
          Aarav <span>&</span> Diya
        </h1>
        <p className="journey-title">A Journey to Forever</p>
        <span className="ornament" aria-hidden="true" />
        <p className="opening-date">18 January 2027</p>
      </div>
      <a
        className="scroll-cue"
        href="#story"
        onClick={(e) => {
          e.preventDefault();
          animationCoordinator.scrollTo("#story");
        }}
      >
        <span>Scroll to begin the journey</span>
        <ChevronDown size={17} aria-hidden="true" />
      </a>
    </section>
  );
}

function StoryChapters() {
  return (
    <section className="story-corridor" data-scene aria-labelledby="story-heading">
      <SceneImage
        src={corridor}
        alt="A pillared wedding corridor leading toward a warmly lit mandapam"
        depth={0.25}
      />
      <div className="corridor-shade" />
      <div className="chapters" data-scene-copy>
        <p className="eyebrow">A beautiful beginning unfolds</p>
        <h2 id="story-heading">Every step brought them closer.</h2>
        <div className="chapter-list">
          {weddingData.story.map((chapter) => (
            <article key={chapter.number} data-reveal>
              <span>Chapter {chapter.number}</span>
              <h3>{chapter.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MandapamScene() {
  return (
    <section id="wedding" className="mandapam-scene" data-scene aria-labelledby="wedding-heading">
      <SceneImage
        src={mandapam}
        alt="A grand jasmine-covered South Indian wedding mandapam at dusk"
        depth={0.2}
      />
      <div className="mandapam-shade" />
      <div className="petals" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="mandapam-copy" data-scene-copy>
        <p className="eyebrow">With joyful hearts</p>
        <h2 id="wedding-heading">The Wedding</h2>
        <span className="ornament" aria-hidden="true" />
        <p>{weddingData.wedding.displayDate}</p>
        <strong>{weddingData.wedding.time}</strong>
      </div>
    </section>
  );
}

function addToCalendar() {
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "DTSTART:20270118T040000Z",
    "DTEND:20270118T050000Z",
    `SUMMARY:${weddingData.groom.firstName} & ${weddingData.bride.firstName}'s Wedding`,
    `LOCATION:${weddingData.venue.name}, ${weddingData.venue.location}`,
    "DESCRIPTION:Aarav & Diya Wedding Ceremony",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type: "text/calendar" }));
  link.download = "aarav-diya-wedding.ics";
  link.click();
  URL.revokeObjectURL(link.href);
}

function CelebrationSection() {
  return (
    <section
      id="venue"
      className="celebration-section"
      data-scene
      aria-labelledby="details-heading"
    >
      {/* Rich Environmental Mandapam Background */}
      <SceneImage
        src={finalCourtyard}
        alt="Grand South Indian wedding mandapam illuminated in the evening with oil lamps"
        depth={0.18}
      />
      <div className="celebration-vignette" />

      {/* Atmospheric Foreground Elements */}
      <div className="celebration-lamps" aria-hidden="true">
        <div className="kuthu-vilakku lamp-left">
          <span className="vilakku-flame f-1" />
          <span className="vilakku-flame f-2" />
          <span className="vilakku-flame f-3" />
        </div>
        <div className="kuthu-vilakku lamp-right">
          <span className="vilakku-flame f-1" />
          <span className="vilakku-flame f-2" />
          <span className="vilakku-flame f-3" />
        </div>
      </div>

      <div className="celebration-petals" aria-hidden="true">
        {Array.from({ length: 14 }, (_, index) => (
          <i key={index} />
        ))}
      </div>

      <div className="celebration-content">
        {/* Animated Couple Presiding Gracefully Over The Celebration */}
        <div className="celebration-couple-presence" data-reveal>
          <AnimatedCouple state="idle" />
        </div>

        {/* Section Header */}
        <header className="celebration-header" data-reveal>
          <p className="eyebrow">The celebration</p>
          <h2 id="details-heading">Save the moments</h2>
          <span className="ornament" aria-hidden="true" />
        </header>

        {/* Event Schedule Cards */}
        <div className="event-list">
          <article className="event-card" data-reveal>
            <span className="event-badge">01</span>
            <div className="event-info">
              <p className="event-type">Muhurtham</p>
              <h3 className="event-title">{weddingData.wedding.displayDate}</h3>
              <strong className="event-time">{weddingData.wedding.time}</strong>
              <div className="event-gold-divider" aria-hidden="true" />
            </div>
          </article>

          <article className="event-card" data-reveal>
            <span className="event-badge">02</span>
            <div className="event-info">
              <p className="event-type">Reception</p>
              <h3 className="event-title">{weddingData.reception.displayDate}</h3>
              <strong className="event-time">{weddingData.reception.time}</strong>
              <div className="event-gold-divider" aria-hidden="true" />
            </div>
          </article>

          <article className="event-card" data-reveal>
            <span className="event-badge">03</span>
            <div className="event-info">
              <p className="event-type">Venue</p>
              <h3 className="event-title">{weddingData.venue.name}</h3>
              <strong className="event-time">{weddingData.venue.location}</strong>
              <div className="event-gold-divider" aria-hidden="true" />
            </div>
          </article>
        </div>

        {/* Action Buttons */}
        <div className="details-actions" data-reveal>
          <Button asChild className="map-btn">
            <a href={weddingData.venue.mapUrl} target="_blank" rel="noreferrer">
              <MapPin size={16} /> View on Google Maps
            </a>
          </Button>
          <Button variant="quiet" className="calendar-btn" onClick={addToCalendar}>
            <CalendarPlus size={16} /> Add to Calendar
          </Button>
        </div>

        {/* Family Blessing Section */}
        <div className="family-blessing" data-reveal>
          <p className="blessing-title">With the blessings of our families</p>
          <div className="family-grid">
            <div className="family-side family-bride" data-reveal>
              <span className="family-label">Bride’s Family</span>
              <strong className="family-parents">{weddingData.bride.parents}</strong>
            </div>

            <div className="family-knot-connector" aria-hidden="true">
              <span className="knot-line knot-left" />
              <div className="knot-monogram">
                <Heart size={16} fill="currentColor" />
              </div>
              <span className="knot-line knot-right" />
            </div>

            <div className="family-side family-groom" data-reveal>
              <span className="family-label">Groom’s Family</span>
              <strong className="family-parents">{weddingData.groom.parents}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const images = [
    {
      src: courtyard,
      alt: "Jasmine garlands and brass lamps along the wedding pathway",
      caption: "The welcome",
    },
    {
      src: corridor,
      alt: "Traditional pillared corridor dressed in maroon and ivory silk",
      caption: "The journey",
    },
    {
      src: mandapam,
      alt: "Grand South Indian mandapam illuminated for the ceremony",
      caption: "The promise",
    },
  ];

  return (
    <section id="gallery" className="gallery-section" data-scene aria-labelledby="gallery-heading">
      {/* Environmental Background with Halo Depth */}
      <SceneImage
        src={corridor}
        alt="Traditional South Indian pillared corridor with jasmine garlands"
        depth={0.16}
      />
      <div className="gallery-vignette" />
      <div className="gallery-petals" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <i key={i} />
        ))}
      </div>

      <header data-reveal>
        <p className="eyebrow">Glimpses of the celebration</p>
        <h2 id="gallery-heading">Woven in jasmine & light</h2>
        <span className="ornament" aria-hidden="true" />
      </header>
      <div className="gallery-flow">
        {images.map((image, index) => (
          <figure key={image.caption} className={`gallery-item item-${index + 1}`} data-reveal>
            <div className="gallery-img-wrap">
              <img
                src={image.src}
                alt={image.alt}
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
              />
              <div className="gallery-sheen" />
              <span className="gallery-corner-ornament top-left" aria-hidden="true">
                ✦
              </span>
              <span className="gallery-corner-ornament bottom-right" aria-hidden="true">
                ✦
              </span>
            </div>
            <figcaption>
              <span>0{index + 1}</span>
              {image.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function InvitationEnd() {
  return (
    <>
      <section className="countdown-section" aria-labelledby="countdown-heading">
        <p className="eyebrow">The celebration begins in</p>
        <h2 id="countdown-heading">Until we say “I do”</h2>
        <Countdown />
      </section>
      <section id="rsvp" className="rsvp-section" data-scene aria-labelledby="rsvp-heading">
        {/* Rich Environmental Background with Halo Depth */}
        <SceneImage
          src={courtyard}
          alt="Traditional wedding entrance glowing with brass oil lamps and sunset light"
          depth={0.15}
        />
        <div className="rsvp-vignette" />
        <div className="rsvp-glow-aura" aria-hidden="true" />

        <div className="rsvp-heading" data-reveal>
          <p className="eyebrow">Your presence is our gift</p>
          <h2 id="rsvp-heading">We would be honoured to have you with us.</h2>
          <span className="ornament" aria-hidden="true" />
        </div>
        <div className="rsvp-card-wrapper" data-reveal>
          <RsvpForm />
        </div>
        <div className="qr-block" data-reveal>
          <div className="qr-frame">
            <QRCodeSVG
              value={weddingData.invitationUrl}
              size={120}
              bgColor="transparent"
              fgColor="currentColor"
            />
          </div>
          <p>Scan to open the invitation on mobile</p>
        </div>
      </section>
      <section className="final-scene" data-scene aria-labelledby="final-heading">
        <SceneImage
          src={finalCourtyard}
          alt="An illuminated Tamil wedding courtyard at blue hour"
          depth={0.15}
        />
        <div className="final-shade" />
        <div className="final-copy" data-scene-copy>
          <p className="final-statement">
            Two Hearts.
            <br />
            Two Families.
            <br />
            <span>One Beautiful Beginning.</span>
          </p>
          <h2 id="final-heading">
            Aarav <i>&</i> Diya
          </h2>
          <p className="final-date">{weddingData.wedding.shortDate}</p>
          <span className="ornament" aria-hidden="true" />
          <p className="final-blessing-note">With love, we invite you to celebrate with us.</p>
        </div>
      </section>
    </>
  );
}
