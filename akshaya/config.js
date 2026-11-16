/* ============================================================
   BRIDE-SIDE WEDDING CONFIG (akshaya/) — bride's name first, no Kollam reception.
   WEDDING CONFIG — edit everything here. No other file needed.
   Times are India Standard Time (+05:30).
   ============================================================ */
window.WEDDING = {
  groom: { name: "Sreehari", full: "Sreehari" },
  bride: { name: "Dr Akshaya", full: "Dr Akshaya" },
  brideFirst: true,

  titleEnglish: "Guruvayur, Kerala",

  // Map points for the intro (hometowns + venue)
  introPins: {
    groom: { city: "Kollam", lat: 8.89, lon: 76.6 },
    bride: { city: "Thrissur", lat: 10.53, lon: 76.21 },
    venue: { city: "Guruvayur", lat: 10.594, lon: 76.041 }
  },

  // Portrait shown beside the names on the first screen
  heroPhoto: "../photos/1.jpg",

  // Main celebration guests attend (countdown target)
  date: "2026-12-23T10:30:00+05:30",
  muhurtham: "10:30 – 11:00 AM",
  venue: {
    name: "Newline Orchid",
    address: "Outer Ring Road, East Nada, Guruvayur",
    mapUrl: "https://maps.google.com/?q=Newline+Orchid+Guruvayur"
  },


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

  // timeText overrides the shown time; set date: "" to show "Date to be announced";
  // rsvp: false keeps an event out of the RSVP picker
  events: [
    {
      name: "Thalikettu",
      date: "2026-12-23T08:00:00+05:30",
      timeText: "8:00 – 9:00 AM",
      durationHours: 1,
      venue: "Guruvayur Sreekrishna Temple",
      address: "East Nada, Guruvayur",
      mapUrl: "https://maps.google.com/?q=Guruvayur+Sreekrishna+Temple",
      rsvp: false // listed as a ceremony, but not in the RSVP picker
    },
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
      name: "Reception · Thiruvananthapuram",
      date: "2026-12-26T17:00:00+05:30",
      timeText: "5:00 – 8:30 PM",
      durationHours: 3.5,
      venue: "Al-Saj Gravity, Al-Saj International Convention Centre",
      address: "Kazhakoottam, Thiruvananthapuram",
      mapUrl: "https://maps.google.com/?q=Al-Saj+International+Convention+Centre+Kazhakoottam"
    }
  ],

  // Photo URLs or paths like "../photos/1.jpg" (leave [] to show decorative frames)
  gallery: [
    "../photos/9.jpg", "../photos/6.jpg", "../photos/10.jpg", "../photos/3.jpg",
    "../photos/5.jpg", "../photos/11.jpg", "../photos/4.jpg", "../photos/7.jpg",
    "../photos/1.jpg", "../photos/8.jpg"
  ],

  // Engagement film from Google Drive (file must be shared "Anyone with the link")
  video: {
    driveId: "1g_Paed22WMXs10EDGcfQVfbfINohDRvC",
    poster: "../photos/5.jpg",
    title: "Our Engagement Film"
  },

  // RSVP goes to WhatsApp. Country code + number, digits only, e.g. "919876543210"
  rsvpWhatsApp: "919647921150",
  rsvpDeadline: "",

  // Background music. youtubeId plays from YouTube (no file hosting needed).
  // Or set file: "music/song.mp3" to use your own audio file instead.
  song: {
    youtubeId: "VHA4kfSTCHM",
    file: "",
    title: "Paripalaya Raghunatha",
    artist: "",
    start: 0, // seconds into the video to start (and loop back to)
    bpm: 90
  },

  hashtag: "#AkshayaWedsSreehari"
};
