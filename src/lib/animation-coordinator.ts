import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Register GSAP plugins globally once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type ParallaxTarget = {
  element: HTMLElement;
  depth: number; // 0 (fixed) to 1 (full movement)
  direction?: "all" | "x" | "y";
};

class AnimationCoordinator {
  private lenis: Lenis | null = null;
  private isReducedMotion: boolean = false;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private targetMouseX: number = 0;
  private targetMouseY: number = 0;
  private rafId: number | null = null;
  private parallaxTargets: Set<ParallaxTarget> = new Set();
  private isInitialized: boolean = false;

  public init() {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;
    this.isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!this.isReducedMotion) {
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      this.initSmoothScroll(isFinePointer);
      if (isFinePointer) {
        this.initPointerTracker();
      }
    }
  }

  private initSmoothScroll(isFinePointer: boolean) {
    // Only use virtual smooth scrolling on desktop devices with fine pointer (mouse/trackpad).
    // On touch devices, native 120Hz hardware momentum scrolling is preserved for zero lag.
    if (!isFinePointer) return;

    this.lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      syncTouch: false,
    });

    this.lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    const updateLenis = (time: number) => {
      this.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
  }

  private initPointerTracker() {
    const onPointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and 1
      this.targetMouseX = (e.clientX / innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Render loop for smooth lerped parallax (Desktop only)
    const loop = () => {
      this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
      this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;

      this.parallaxTargets.forEach((target) => {
        if (!target.element.isConnected) {
          this.parallaxTargets.delete(target);
          return;
        }

        const moveX = target.direction === "y" ? 0 : this.mouseX * target.depth * 20;
        const moveY = target.direction === "x" ? 0 : this.mouseY * target.depth * 20;

        target.element.style.setProperty("--parallax-x", `${moveX.toFixed(2)}px`);
        target.element.style.setProperty("--parallax-y", `${moveY.toFixed(2)}px`);
      });

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  public registerParallax(target: ParallaxTarget) {
    if (this.isReducedMotion || !window.matchMedia("(pointer: fine)").matches) {
      return () => {};
    }
    this.parallaxTargets.add(target);
    return () => {
      this.parallaxTargets.delete(target);
    };
  }

  public scrollTo(
    target: string | HTMLElement,
    options?: { offset?: number; immediate?: boolean },
  ) {
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        offset: options?.offset ?? 0,
        immediate: options?.immediate ?? false,
      });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  public refreshScrollTriggers() {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }

  public destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.parallaxTargets.clear();
    this.isInitialized = false;
  }
}

export const animationCoordinator = new AnimationCoordinator();
