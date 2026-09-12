import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import openingLamp from "@/assets/opening-lamp.webp";
import { weddingData } from "@/data/weddingData";

type Phase = "closed" | "opening" | "done";

export function InvitationGate({ onOpened }: { onOpened: () => void }) {
  const [phase, setPhase] = useState<Phase>("closed");
  const gateRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      timelineRef.current?.kill();
    };
  }, []);

  const openInvitation = useCallback(() => {
    if (phase !== "closed" || !gateRef.current) return;
    setPhase("opening");

    const gate = gateRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      document.body.style.overflow = "";
      setPhase("done");
      onOpened();
    };

    if (reduced) {
      const reducedTimeline = gsap.timeline({ onComplete: finish });
      reducedTimeline
        .to(gate.querySelector(".gate-hint"), { opacity: 0, duration: 0.1 })
        .to(gate.querySelectorAll(".card-panel"), {
          rotateY: (index) => (index === 0 ? -145 : 145),
          duration: 0.4,
          ease: "power2.inOut",
        })
        .to(gate, { opacity: 0, duration: 0.3 });
      timelineRef.current = reducedTimeline;
      return;
    }

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });

    timeline
      .set(gate.querySelector(".gate-world"), { visibility: "visible" })
      .to(
        gate.querySelector(".gate-hint"),
        { opacity: 0, y: 12, duration: 0.3, ease: "power2.in" },
        0,
      )
      .to(
        gate.querySelector(".gate-card"),
        {
          yPercent: -4,
          z: 110,
          rotateX: 4,
          rotateZ: -0.5,
          filter: "drop-shadow(0 60px 100px rgba(0,0,0,0.85))",
          duration: 0.7,
          ease: "power2.out",
        },
        0,
      )
      .to(
        gate.querySelector(".gate-reflection"),
        { xPercent: 220, opacity: 0.85, duration: 0.75, ease: "power2.inOut" },
        0.05,
      )
      // Open panels simultaneously like a royal wedding card
      .to(
        gate.querySelector(".panel-left"),
        { rotateY: -160, duration: 1.15, ease: "power3.inOut" },
        0.45,
      )
      .to(
        gate.querySelector(".panel-right"),
        { rotateY: 160, duration: 1.15, ease: "power3.inOut" },
        0.45,
      )
      .to(gate.querySelector(".card-seal"), { opacity: 0, scale: 1.5, duration: 0.4 }, 0.45)
      // Reveal inner card text
      .fromTo(
        gate.querySelector(".card-inner-content"),
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.65, ease: "power2.out" },
        0.75,
      )
      // Golden light rays burst outward
      .to(
        gate.querySelector(".gate-glow"),
        { opacity: 1, scale: 1.8, duration: 1.1, ease: "power2.out" },
        1.05,
      )
      .to(
        gate.querySelector(".gate-rays"),
        { opacity: 0.85, scale: 1.35, duration: 1.15, ease: "power2.out" },
        1.1,
      )
      .to(gate.querySelector(".gate-dust"), { opacity: 1, duration: 0.7 }, 1.15)
      .to(
        gate.querySelector(".gate-petals"),
        { opacity: 1, yPercent: 22, duration: 1.4, ease: "power1.out" },
        1.2,
      )
      // Temple world appears behind
      .to(
        gate.querySelector(".gate-world"),
        { opacity: 1, scale: 1, duration: 1.4, ease: "power2.inOut" },
        1.55,
      )
      // Camera zooms through the invitation directly into the world
      .to(
        gate.querySelector(".gate-card"),
        { z: 850, scale: 3.2, opacity: 0, duration: 1.45, ease: "power3.in" },
        1.65,
      )
      .to(
        gate.querySelector(".panel-left"),
        { xPercent: -120, opacity: 0, duration: 1.0, ease: "power2.in" },
        1.8,
      )
      .to(
        gate.querySelector(".panel-right"),
        { xPercent: 120, opacity: 0, duration: 1.0, ease: "power2.in" },
        1.8,
      )
      .to(
        gate.querySelector(".gate-world"),
        { scale: 1.06, duration: 1.2, ease: "power1.inOut" },
        2.1,
      )
      .to(gate.querySelector(".gate-atmosphere"), { opacity: 0, duration: 0.6 }, 2.6)
      .to(gate, { opacity: 0, duration: 0.6, ease: "power2.out" }, 2.85);

    timelineRef.current = timeline;
  }, [phase, onOpened]);

  if (phase === "done") return null;

  return (
    <div
      ref={gateRef}
      className={`invitation-gate phase-${phase}`}
      role="dialog"
      aria-label="Wedding invitation"
      style={{ pointerEvents: phase === "opening" ? "none" : "auto" }}
    >
      <div className="gate-world" aria-hidden="true">
        <img src={openingLamp} alt="" width={1536} height={1024} decoding="async" />
        <span />
      </div>
      <div className="gate-pattern" aria-hidden="true" />
      <div className="gate-atmosphere" aria-hidden="true">
        <div className="gate-glow" />
        <div className="gate-rays" />
        <div className="gate-dust">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className="gate-petals">
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>

      <button
        className="gate-stage"
        type="button"
        onClick={openInvitation}
        disabled={phase !== "closed"}
        aria-label="Open invitation with one tap"
      >
        <span className="gate-card">
          <span className="card-inner">
            <span className="card-inner-content">
              <span className="card-ornament-top" aria-hidden="true">
                ⚜
              </span>
              <span className="card-name">AARAV</span>
              <span className="card-ornament" aria-hidden="true">
                ✵
              </span>
              <span className="card-name">DIYA</span>
              <small>Together with their families</small>
            </span>
          </span>
          <span className="card-panel panel-left">
            <span className="panel-frame">
              <em>Wedding Invitation</em>
              <strong>{weddingData.groom.firstName.toUpperCase()}</strong>
              <span className="panel-motif" aria-hidden="true">
                ✦
              </span>
            </span>
          </span>
          <span className="card-panel panel-right">
            <span className="panel-frame">
              <em>{weddingData.wedding.shortDate}</em>
              <strong>{weddingData.bride.firstName.toUpperCase()}</strong>
              <span className="panel-motif" aria-hidden="true">
                ✦
              </span>
            </span>
          </span>
          <span className="gate-reflection" aria-hidden="true" />
          <span className="card-seal" aria-hidden="true">
            &
          </span>
        </span>
        <span className="gate-hint">
          <span>Tap to Open Invitation</span>
          <small className="gate-subhint">A cinematic journey awaits</small>
        </span>
      </button>
    </div>
  );
}
