import { useState, useCallback, useEffect, useRef } from "react";
import brideImg from "@/assets/bride.png";
import groomImg from "@/assets/groom.png";
import { Heart, Sparkles } from "lucide-react";
import gsap from "gsap";

export type CharacterType = "bride" | "groom";
export type CharacterState =
  "idle" | "walking" | "looking" | "smiling" | "waving" | "shy" | "heart" | "hands" | "hug";

interface AnimatedCharacterProps {
  type: CharacterType;
  state?: CharacterState;
  className?: string;
  name: string;
  role: string;
  onTap?: () => void;
  interactive?: boolean;
}

export function AnimatedCharacter({
  type,
  state = "idle",
  className = "",
  name,
  role,
  onTap,
  interactive = true,
}: AnimatedCharacterProps) {
  const [internalState, setInternalState] = useState<CharacterState>(state);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [canInteract, setCanInteract] = useState(true);
  const [showHeartParticle, setShowHeartParticle] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const charRef = useRef<HTMLDivElement>(null);

  // Sync external state changes
  useEffect(() => {
    setInternalState(state);
  }, [state]);

  // Viewport visibility observer to prevent background timer drain
  useEffect(() => {
    const el = charRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "120px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Natural periodic eye blinking (only active when visible on screen)
  useEffect(() => {
    if (!isVisible) return;
    let timeoutId: number;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 180);

      const nextInterval = 3500 + Math.random() * 2500;
      timeoutId = window.setTimeout(triggerBlink, nextInterval);
    };

    timeoutId = window.setTimeout(triggerBlink, 2500);
    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  // Interactive tap/click handler
  const handleClick = useCallback(() => {
    if (!interactive || !canInteract) return;
    setCanInteract(false);
    setIsReacting(true);
    setShowHeartParticle(true);
    setInternalState("heart");

    if (onTap) onTap();

    if (charRef.current) {
      gsap
        .timeline()
        .to(charRef.current.querySelector(".character-img"), {
          scale: 1.05,
          y: -6,
          duration: 0.35,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        })
        .fromTo(
          charRef.current.querySelector(".character-tap-heart"),
          { scale: 0.3, opacity: 0, y: 0 },
          { scale: 1.3, opacity: 1, y: -45, duration: 0.8, ease: "back.out(2)" },
          0,
        )
        .to(
          charRef.current.querySelector(".character-tap-heart"),
          { opacity: 0, y: -80, duration: 0.5, ease: "power2.in" },
          0.8,
        );
    }

    setTimeout(() => {
      setInternalState(state);
      setIsReacting(false);
      setShowHeartParticle(false);
    }, 1900);

    setTimeout(() => {
      setCanInteract(true);
    }, 2400);
  }, [interactive, canInteract, onTap, state]);

  const imgSrc = type === "bride" ? brideImg : groomImg;

  return (
    <div
      ref={charRef}
      className={`animated-character-container character-${type} state-${internalState} ${
        isReacting ? "is-reacting" : ""
      } ${className}`}
      onClick={handleClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`${name}, ${role}`}
      onKeyDown={(e) => {
        if (interactive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="character-body-wrap">
        {/* Main Character Image with Breathing and Sway Layers */}
        <div className="character-img-layer">
          <img
            src={imgSrc}
            alt={`${name} in traditional South Indian wedding attire`}
            className={`character-img ${isBlinking ? "is-blinking" : ""}`}
            width={1024}
            height={1536}
            loading="lazy"
            decoding="async"
          />

          {/* Saree/Cloth Breeze Overlay */}
          <div className="character-cloth-breeze" aria-hidden="true" />

          {/* Gentle Jasmine Petal Ambient Aura for Bride */}
          {type === "bride" && (
            <div className="bride-jasmine-aura" aria-hidden="true">
              <span className="jasmine-petal p-1" />
              <span className="jasmine-petal p-2" />
              <span className="jasmine-petal p-3" />
            </div>
          )}

          {/* Gold Zari Shimmer for Groom */}
          {type === "groom" && (
            <div className="groom-gold-aura" aria-hidden="true">
              <span className="gold-sparkle s-1" />
              <span className="gold-sparkle s-2" />
            </div>
          )}
        </div>

        {/* Dynamic State Overlay Effects */}
        {internalState === "heart" && (
          <div className="heart-gesture-overlay" aria-hidden="true">
            <Heart size={28} className="glowing-heart-icon" fill="currentColor" />
          </div>
        )}

        {/* Interactive Tap Heart Particle */}
        {showHeartParticle && (
          <div className="character-tap-heart" aria-hidden="true">
            <Heart size={32} fill="currentColor" />
            <Sparkles size={16} className="tap-sparkle" />
          </div>
        )}
      </div>

      {/* Caption Tag */}
      <figcaption className="character-caption-tag">
        <span className="caption-role">{role}</span>
        <strong className="caption-name">{name}</strong>
      </figcaption>
    </div>
  );
}

interface AnimatedCoupleProps {
  state?: CharacterState;
  className?: string;
  onCoupleTap?: () => void;
}

export function AnimatedCouple({
  state = "idle",
  className = "",
  onCoupleTap,
}: AnimatedCoupleProps) {
  const [coupleState, setCoupleState] = useState<CharacterState>(state);
  const [isCoupleHeartActive, setIsCoupleHeartActive] = useState(false);
  const [showCenterHeart, setShowCenterHeart] = useState(false);
  const [canTap, setCanTap] = useState(true);
  const coupleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCoupleState(state);
  }, [state]);

  const triggerCoupleTap = useCallback(() => {
    if (!canTap) return;
    setCanTap(false);
    setIsCoupleHeartActive(true);
    setShowCenterHeart(true);
    setCoupleState("heart");

    if (onCoupleTap) onCoupleTap();

    if (coupleRef.current) {
      gsap
        .timeline()
        .fromTo(
          coupleRef.current.querySelector(".couple-center-heart-burst"),
          { scale: 0.3, opacity: 0, y: 15 },
          { scale: 1.4, opacity: 1, y: -50, duration: 0.85, ease: "back.out(2)" },
        )
        .to(
          coupleRef.current.querySelector(".couple-center-heart-burst"),
          { opacity: 0, y: -90, duration: 0.55, ease: "power2.in" },
          0.85,
        );
    }

    setTimeout(() => {
      setCoupleState(state);
      setIsCoupleHeartActive(false);
      setShowCenterHeart(false);
    }, 2000);

    setTimeout(() => {
      setCanTap(true);
    }, 2500);
  }, [canTap, onCoupleTap, state]);

  return (
    <div
      ref={coupleRef}
      className={`animated-couple-group state-${coupleState} ${
        isCoupleHeartActive ? "is-reacting" : ""
      } ${className}`}
      onClick={triggerCoupleTap}
      role="button"
      tabIndex={0}
      aria-label="Aarav and Diya together. Tap to celebrate their love."
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          triggerCoupleTap();
        }
      }}
    >
      {/* Bride Character */}
      <AnimatedCharacter
        type="bride"
        state={coupleState}
        name="Diya Rajendran"
        role="The Bride"
        interactive={false}
      />

      {/* Center Heart Burst & Romantic Aura */}
      <div className="couple-center-connection" aria-hidden="true">
        <div className="center-heart-pulse">
          <Heart size={34} fill="currentColor" />
        </div>
        {showCenterHeart && (
          <div className="couple-center-heart-burst">
            <Heart size={42} fill="currentColor" />
            <span className="burst-title">Two Hearts &bull; One Journey</span>
          </div>
        )}
      </div>

      {/* Groom Character */}
      <AnimatedCharacter
        type="groom"
        state={coupleState}
        name="Aarav Krishnan"
        role="The Groom"
        interactive={false}
      />

      {/* Romantic Hug Halo & Soft Petals Overlay */}
      <div className="couple-hug-halo" aria-hidden="true">
        <div className="hug-ambient-glow" />
        <div className="hug-falling-petals">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className={`hug-petal-fall p-${i + 1}`} />
          ))}
        </div>
      </div>

      {/* Interactive Cue Badge */}
      <div className="couple-tap-cue" aria-hidden="true">
        <Sparkles size={13} />
        <span>Tap the couple</span>
      </div>
    </div>
  );
}
