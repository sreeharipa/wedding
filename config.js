/* ============================================================
   WEDDING CONFIG — edit everything here. No other file needed.
   Times are India Standard Time (+05:30).
   ============================================================ */
window.WEDDING = {
  groom: { name: "Sreehari", full: "Sreehari" },
  bride: { name: "Akshaya", full: "Dr Akshaya" },

  titleEnglish: "Two hearts, one journey",

  // Portrait shown beside the names on the first screen
  heroPhoto: "photos/1.jpg",

  // Main celebration guests attend (countdown target)
  date: "2026-12-23T10:30:00+05:30",
  muhurtham: "10:30 – 11:00 AM",
  venue: {
    name: "Newline Orchid",
    address: "Outer Ring Road, East Nada, Guruvayur",
    mapUrl: "https://maps.google.com/?q=Newline+Orchid+Guruvayur"
  },

  // Quiet line under the main card about the family-only temple ceremony ("" to hide)
  privateNote: "The thalikettu will be held earlier that morning at Guruvayur Sreekrishna Temple, as a private ceremony with close family.",

  invitationMessage:
    "With the blessings of our elders and the grace of Guruvayurappan, we invite you and your family to join us on the auspicious occasion of our marriage.",

  // Small notes shown under the muhurtham card (leave [] to hide)
  notes: ["Presents in blessings only", "No reception on the previous day"],

  // Optional love-story timeline (leave [] to hide)
  story: [],

  families: {
    groom: {
      father: "Mr. N Prasanna Kumar",
      mother: "Mrs. Ajitha P Kumar",
      place: "Panchajanyam, Muthupilakadu West, Kollam"
    },
    bride: {
      father: "Mr. P S Jayakumar",
      mother: "Mrs. Bini Jayakumar",
      place: "Achutham, Medical College P.O, Thrissur"
    }
  },

  // timeText overrides the shown time; set date: "" to show "Date to be announced"
  events: [
    {
      name: "Wedding Celebration",
      date: "2026-12-23T10:30:00+05:30",
      timeText: "10:30 – 11:00 AM",
      durationHours: 0.5,
      venue: "Newline Orchid",
      address: "Outer Ring Road, East Nada, Guruvayur",
      mapUrl: "https://maps.google.com/?q=Newline+Orchid+Guruvayur",
      highlight: true
    },
    {
      name: "Reception · Kollam",
      date: "2026-12-25T17:00:00+05:30",
      timeText: "5:00 – 9:00 PM",
      durationHours: 4,
      venue: "NJ Convention Centre",
      address: "Cinemaparambu, Poruvazhy P.O., Kollam",
      mapUrl: "https://maps.google.com/?q=NJ+Convention+Centre+Cinemaparambu+Poruvazhy"
    },
    {
      name: "Reception · Thiruvananthapuram",
      date: "2026-12-26T17:00:00+05:30",
      timeText: "5:00 – 8:30 PM",
      durationHours: 3.5,
      venue: "Al-Saj Gravity, Al-Saj International Convention Centre",
      address: "Kazhakoottam, Thiruvananthapuram",
      mapUrl: "https://maps.google.com/?q=Al-Saj+International+Convention+Centre+Kazhakoottam"
    }
  ],

  // Photo URLs or paths like "photos/1.jpg" (leave [] to show decorative frames)
  gallery: [
    "photos/2.jpg", "photos/6.jpg", "photos/3.jpg", "photos/5.jpg",
    "photos/4.jpg", "photos/7.jpg", "photos/1.jpg", "photos/8.jpg"
  ],

  // Engagement film from Google Drive (file must be shared "Anyone with the link")
  video: {
    driveId: "1g_Paed22WMXs10EDGcfQVfbfINohDRvC",
    poster: "photos/5.jpg",
    title: "Our Engagement Film"
  },

  // RSVP goes to WhatsApp. Country code + number, digits only, e.g. "919876543210"
  rsvpWhatsApp: "919647921150",
  rsvpDeadline: "",

  // Background music. youtubeId plays from YouTube (no file hosting needed).
  // Or set file: "music/song.mp3" to use your own audio file instead.
  song: {
    youtubeId: "xWggTb45brM",
    file: "",
    title: "Toosie Slide",
    artist: "Drake",
    start: 41, // seconds into the video to start (and loop back to)
    bpm: 81
  },

  hashtag: "#SreehariWedsAkshaya"
};
