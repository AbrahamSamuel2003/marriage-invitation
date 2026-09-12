import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animationCoordinator } from "@/lib/animation-coordinator";

export function ScrollJourney({
  children,
  active = true,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    // Initialize the unified animation engine
    animationCoordinator.init();

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Opening scene entrance
      gsap.from("[data-opening-copy] > *", {
        opacity: 0,
        y: 28,
        scale: 0.96,
        duration: 1.2,
        stagger: 0.18,
        ease: "power3.out",
        delay: 0.25,
      });

      // 2. Continuous scene background depth and scale scrubbing
      gsap.utils.toArray<HTMLElement>("[data-scene]").forEach((scene) => {
        const image = scene.querySelector<HTMLElement>("[data-scene-image]");
        const copy = scene.querySelector<HTMLElement>("[data-scene-copy]");

        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.1, yPercent: -3 },
            {
              scale: 1.0,
              yPercent: 3,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        if (copy) {
          gsap.fromTo(
            copy,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: copy,
                start: "top 82%",
                once: true,
              },
            },
          );
        }
      });

      // 3. Staggered reveal for cards, details, and chapters
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    }, containerRef);

    // Subtle pointer trail for gold sparkles
    const onPointerMove = (e: MouseEvent) => {
      const sparkle = document.createElement("span");
      sparkle.className = "cursor-gold-dust";
      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;
      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 750);
    };

    // Throttle cursor trail on desktop only
    let lastTime = 0;
    const throttledPointer = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime > 45) {
        lastTime = now;
        onPointerMove(e);
      }
    };

    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", throttledPointer, { passive: true });
    }

    animationCoordinator.refreshScrollTriggers();

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", throttledPointer);
    };
  }, [active]);

  return <div ref={containerRef}>{children}</div>;
}
