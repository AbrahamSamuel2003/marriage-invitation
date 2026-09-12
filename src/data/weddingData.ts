export const weddingData = {
  experienceTitle: "A Journey to Forever",
  bride: {
    firstName: "Diya",
    fullName: "Diya Rajendran",
    parents: "Mr. & Mrs. Rajendran",
  },
  groom: {
    firstName: "Aarav",
    fullName: "Aarav Krishnan",
    parents: "Mr. & Mrs. Krishnan",
  },
  wedding: {
    isoDate: "2027-01-18T09:30:00+05:30",
    displayDate: "18 January 2027",
    shortDate: "18.01.2027",
    time: "9:30 AM – 10:30 AM",
  },
  reception: {
    isoDate: "2027-01-17T18:30:00+05:30",
    displayDate: "17 January 2027",
    time: "6:30 PM onwards",
  },
  venue: {
    name: "Sri Lakshmi Narayana Temple",
    location: "Chennai, Tamil Nadu",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Sri%20Lakshmi%20Narayana%20Temple%20Chennai%20Tamil%20Nadu",
  },
  rsvp: {
    whatsappNumber: "919876543210",
  },
  invitationUrl: "https://eternalembrace.com",
  story: [
    { number: "01", title: "When two paths crossed." },
    { number: "02", title: "When conversations became memories." },
    { number: "03", title: "When two families became one." },
  ],
} as const;

export type WeddingData = typeof weddingData;
