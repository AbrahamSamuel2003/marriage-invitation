import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import courtyard from "@/assets/courtyard-journey.webp";
import { AnimatedCharacter, CharacterState } from "./AnimatedCharacter";
import { Heart, Sparkles } from "lucide-react";

export function TwoPathsScene({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const [characterState, setCharacterState] = useState<CharacterState>("idle");
  const [isCoupleHeartActive, setIsCoupleHeartActive] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const [canTap, setCanTap] = useState(true);

  // User-triggered "Tap the couple" interaction
  const triggerCoupleInteraction = useCallback(() => {
    if (!canTap) return;
    setCanTap(false);
    setIsCoupleHeartActive(true);
    setHeartBurst(true);
    setCharacterState("heart");

    const coupleEl = rootRef.current?.querySelector(".paths-couple");
    if (coupleEl) {
      gsap
        .timeline()
        .fromTo(
          ".interactive-heart-burst",
          { scale: 0.3, opacity: 0, y: 15 },
          { scale: 1.4, opacity: 1, y: -45, duration: 0.85, ease: "back.out(2)" },
          0,
        )
        .to(
          ".interactive-heart-burst",
          { opacity: 0, y: -85, duration: 0.55, ease: "power2.in" },
          0.85,
        );
    }

    setTimeout(() => {
      setIsCoupleHeartActive(false);
      setHeartBurst(false);
      setCharacterState("idle");
    }, 1900);

    setTimeout(() => {
      setCanTap(true);
    }, 2400);
  }, [canTap]);

  useEffect(() => {
    if (!active || !rootRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const mm = gsap.matchMedia(root);

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };
        const brideMove1 = isDesktop ? 12 : 5;
        const groomMove1 = isDesktop ? -12 : -5;
        const brideMoveTogether = isDesktop ? 68 : 20;
        const groomMoveTogether = isDesktop ? -68 : -20;
        const camScale1 = isDesktop ? 1.15 : 1.06;
        const camX = isDesktop ? 12 : 5;

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: isDesktop ? 0.4 : 0.15,
            pin: ".paths-viewport",
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              // Coordinate character state smoothly based on scroll progression
              if (p < 0.18) {
                setCharacterState("idle");
              } else if (p < 0.45) {
                setCharacterState("walking");
              } else if (p < 0.6) {
                setCharacterState("looking");
              } else if (p < 0.76) {
                setCharacterState("heart");
              } else if (p < 0.88) {
                setCharacterState("hands");
              } else {
                setCharacterState("hug");
              }
            },
          },
        });

        // 0.0 -> 0.9: Wide shot — two journeys start apart
        timeline
          .to(".paths-bg", { scale: 1.05, yPercent: -1 }, 0)
          .to(".path-bride-wrap", { xPercent: brideMove1, opacity: 1 }, 0)
          .to(".path-groom-wrap", { xPercent: groomMove1, opacity: 1 }, 0)
          .fromTo(".beat-wide", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.35 }, 0.05)
          .to(".beat-wide", { opacity: 0, y: -15, duration: 0.25 }, 0.7)

          // 0.9 -> 1.7: Bride perspective — jasmine & warm lamp light
          .to(
            ".paths-camera",
            { scale: camScale1, xPercent: camX, duration: 0.6, ease: "power1.inOut" },
            0.9,
          )
          .to(".glow-bride", { opacity: 0.9, duration: 0.5 }, 0.9)
          .to(".path-bride-wrap", { scale: 1.04, duration: 0.6 }, 0.9)
          .fromTo(".beat-bride", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 1.0)
          .to(".beat-bride", { opacity: 0, y: -15, duration: 0.25 }, 1.55)

          // 1.7 -> 2.5: Groom perspective — sunset amber
          .to(
            ".paths-camera",
            { scale: camScale1, xPercent: -camX, duration: 0.6, ease: "power1.inOut" },
            1.7,
          )
          .to(".glow-groom", { opacity: 0.9, duration: 0.5 }, 1.7)
          .to(".path-groom-wrap", { scale: 1.04, duration: 0.6 }, 1.7)
          .fromTo(".beat-groom", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 1.8)
          .to(".beat-groom", { opacity: 0, y: -15, duration: 0.25 }, 2.35)

          // 2.5 -> 3.6: Wide shot — characters smoothly approach each other
          .to(
            ".paths-camera",
            { scale: 1.02, xPercent: 0, duration: 0.7, ease: "power1.inOut" },
            2.5,
          )
          .to(".path-bride-wrap", { xPercent: brideMoveTogether, scale: 1.02, duration: 1.1 }, 2.5)
          .to(".path-groom-wrap", { xPercent: groomMoveTogether, scale: 1.02, duration: 1.1 }, 2.5)

          // 3.6 -> 4.6: The Two Hearts Moment (Two Hearts -> One Journey)
          .to(".heart-moment-aura", { opacity: 1, scale: 1.15, duration: 0.5 }, 3.5)
          .to(".heart-center-glow", { opacity: 1, scale: 1, duration: 0.45 }, 3.6)
          .fromTo(".beat-two", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35 }, 3.6)
          .to(".beat-two", { opacity: 0, y: -15, duration: 0.25 }, 4.1)
          .fromTo(".beat-one", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35 }, 4.15)
          .to(".beat-one", { opacity: 0, y: -15, duration: 0.25 }, 4.6)

          // 4.6 -> 5.5: Meeting & Warm Embrace
          .to(".meeting-light", { opacity: 1, scale: 1.2, duration: 0.5 }, 4.6)
          .to(".couple-hug-layer", { opacity: 1, duration: 0.6 }, 4.8)
          .to(".paths-camera", { scale: 0.98, yPercent: 2, duration: 0.7 }, 4.9)
          .fromTo(".beat-journey", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, 5.0)
          .to(".paths-couple", { yPercent: -2, scale: 0.98, duration: 0.7 }, 5.0);

        // Light up brass lamps along the wedding corridor as characters advance
        gsap.utils.toArray<HTMLElement>(".path-lamp").forEach((lamp, index) => {
          gsap.fromTo(
            lamp,
            { opacity: 0.1, scale: 0.7 },
            {
              opacity: 1,
              scale: 1.1,
              ease: "power1.out",
              scrollTrigger: {
                trigger: root,
                start: `${35 + index * 9}% center`,
                end: `${45 + index * 9}% center`,
                scrub: true,
              },
            },
          );
        });
      },
    );

    return () => {
      mm.revert();
    };
  }, [active]);

  return (
    <section id="story" className="two-paths" ref={rootRef} aria-labelledby="paths-heading">
      <div className="paths-viewport">
        <div className="paths-camera">
          {/* Background Layer with soft depth blur */}
          <img
            className="paths-bg"
            src={courtyard}
            alt="A jasmine-lined Tamil wedding courtyard glowing at sunset"
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
          />
          <div className="paths-shade" aria-hidden="true" />

          {/* Environmental Lights & Atmospheric Auras */}
          <div className="glow-bride" aria-hidden="true" />
          <div className="glow-groom" aria-hidden="true" />
          <div className="meeting-light" aria-hidden="true" />
          <div className="heart-moment-aura" aria-hidden="true" />

          {/* Brass hanging & standing lamps */}
          <div className="path-lamps" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} className={`path-lamp lamp-${i + 1}`}>
                <span className="lamp-flame" />
              </i>
            ))}
          </div>

          {/* Central Heart Moment Element */}
          <div className="heart-center-glow" aria-hidden="true">
            <div className="pulsing-heart-icon">
              <Heart size={38} fill="currentColor" />
            </div>
            <div className="floating-sparkles">
              <Sparkles size={20} className="sparkle sparkle-1" />
              <Sparkles size={16} className="sparkle sparkle-2" />
              <Sparkles size={18} className="sparkle sparkle-3" />
            </div>
          </div>

          {/* Tap-to-Interact Couple Container */}
          <div
            className={`paths-couple ${isCoupleHeartActive ? "is-reacting" : ""}`}
            onClick={triggerCoupleInteraction}
            role="button"
            tabIndex={0}
            aria-label="Tap the couple to share love"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                triggerCoupleInteraction();
              }
            }}
          >
            {/* Bride Figure with AnimatedCharacter Component */}
            <div className="path-bride-wrap">
              <AnimatedCharacter
                type="bride"
                state={characterState}
                name="Diya Rajendran"
                role="The Bride"
                interactive={false}
              />
            </div>

            {/* Groom Figure with AnimatedCharacter Component */}
            <div className="path-groom-wrap">
              <AnimatedCharacter
                type="groom"
                state={characterState}
                name="Aarav Krishnan"
                role="The Groom"
                interactive={false}
              />
            </div>

            {/* Gentle Warm Hug Overlay Lighting Effect */}
            <div className="couple-hug-layer" aria-hidden="true">
              <div className="hug-halo-light" />
            </div>

            {/* Interactive Heart Burst for Tap */}
            {heartBurst && (
              <div className="interactive-heart-burst" aria-hidden="true">
                <Heart size={44} fill="currentColor" />
                <span className="burst-text">Together Forever</span>
              </div>
            )}

            {/* Tap Hint Badge */}
            <div className="tap-couple-cue" aria-hidden="true">
              <Sparkles size={13} />
              <span>Tap the couple</span>
            </div>
          </div>

          {/* Story Narrative Typography Beats */}
          <div className="paths-beats" aria-live="polite">
            <h2 id="paths-heading" className="beat beat-wide">
              Two journeys
              <br />
              <span>begin apart.</span>
            </h2>
            <p className="beat beat-bride">Her path, lit by jasmine and evening lamplight.</p>
            <p className="beat beat-groom">His path, warmed by golden sunbeams and temple bells.</p>
            <p className="beat beat-two">Two Hearts</p>
            <p className="beat beat-one">One Journey</p>
            <p className="beat beat-journey">A beautiful beginning unfolds.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
