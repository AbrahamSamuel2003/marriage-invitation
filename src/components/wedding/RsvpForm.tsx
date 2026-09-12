import { useState, type FormEvent } from "react";
import { Send, Share2, Check } from "lucide-react";
import { weddingData } from "@/data/weddingData";
import { Button } from "@/components/ui/button";

export function RsvpForm() {
  const [attendance, setAttendance] = useState("Yes, I'll be there");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const message = [
      `*Wedding RSVP — ${weddingData.groom.firstName} & ${weddingData.bride.firstName}*`,
      `*Name:* ${data.get("name")}`,
      `*Guests:* ${data.get("guests")}`,
      `*Attendance:* ${attendance}`,
      `*Message:* ${data.get("message") || "Wishing you a lifetime of joy!"}`,
    ].join("\n");

    window.open(
      `https://wa.me/${weddingData.rsvp.whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function shareInvitation() {
    const payload = {
      title: `${weddingData.groom.firstName} & ${weddingData.bride.firstName} — A Journey to Forever`,
      text: `Join us in celebrating the wedding of ${weddingData.groom.firstName} & ${weddingData.bride.firstName} in Chennai on ${weddingData.wedding.displayDate}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(payload);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setNotice("Invitation link copied to clipboard");
        setTimeout(() => {
          setCopied(false);
          setNotice("");
        }, 3000);
      }
    } catch {
      setNotice("Sharing was cancelled");
      setTimeout(() => setNotice(""), 2500);
    }
  }

  return (
    <div className="rsvp-layout" data-reveal>
      <form className="rsvp-form" onSubmit={submit}>
        <div className="form-row">
          <label className="input-group">
            <span>Your Name</span>
            <input name="name" required autoComplete="name" placeholder="Enter your full name" />
          </label>
          <label className="input-group">
            <span>Number of Guests</span>
            <input name="guests" type="number" min="1" max="10" defaultValue="1" required />
          </label>
        </div>

        <fieldset className="attendance-fieldset">
          <legend>Will you join us?</legend>
          <div className="attendance-options">
            {["Yes, I'll be there", "Send my wishes"].map((option) => (
              <label key={option} className="attendance-label">
                <input
                  type="radio"
                  name="attendance"
                  value={option}
                  checked={attendance === option}
                  onChange={() => setAttendance(option)}
                />
                <span className="attendance-pill">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="input-group">
          <span>A message for the couple</span>
          <textarea name="message" rows={3} placeholder="Write your heartfelt wishes here…" />
        </label>

        <div className="form-actions">
          <Button type="submit" className="rsvp-submit-btn">
            <Send size={15} aria-hidden="true" /> Send RSVP via WhatsApp
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rsvp-share-btn"
            onClick={shareInvitation}
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
            {copied ? "Link Copied" : "Share Invitation"}
          </Button>
        </div>

        {notice && (
          <p className="form-notice" role="status">
            {notice}
          </p>
        )}
      </form>
    </div>
  );
}
