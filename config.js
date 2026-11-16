/* ============================================================
   WEDDING CONFIG — edit everything here. No other file needed.
   Times are India Standard Time (+05:30).
   ============================================================ */
window.WEDDING = {
  groom: { name: "Sreehari", full: "Sreehari" },
  bride: { name: "Akshaya", full: "Dr Akshaya" },

  // Malayalam title shown under the names
  titleMalayalam: "ഒന്നാകുന്ന രണ്ടു ഹൃദയങ്ങൾ",
  titleEnglish: "Two hearts, one journey",

  // Main ceremony (countdown target)
  date: "2026-12-23T08:00:00+05:30",
  muhurtham: "8:00 AM – 9:00 AM",
  venue: {
    name: "Guruvayur Sreekrishna Temple",
    address: "East Nada, Guruvayur, Thrissur",
    mapUrl: "https://maps.google.com/?q=Guruvayur+Sreekrishna+Temple"
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

  // timeText overrides the shown time; set date: "" to show "Date to be announced"
  events: [
    {
      name: "Thalikettu",
      malayalam: "താലികെട്ട്",
      date: "2026-12-23T08:00:00+05:30",
      timeText: "Muhurtham 8:00 – 9:00 AM",
      durationHours: 1,
      venue: "Guruvayur Sreekrishna Temple",
      address: "East Nada, Guruvayur",
      mapUrl: "https://maps.google.com/?q=Guruvayur+Sreekrishna+Temple",
      highlight: true
    },
    {
      name: "Wedding Celebration",
      malayalam: "വിവാഹം",
      date: "2026-12-23T10:30:00+05:30",
      timeText: "10:30 – 11:00 AM",
      durationHours: 0.5,
      venue: "Newline Orchid",
      address: "Outer Ring Road, East Nada, Guruvayur",
      mapUrl: "https://maps.google.com/?q=Newline+Orchid+Guruvayur"
    },
    {
      name: "Reception · Kollam",
      malayalam: "വിവാഹ സൽക്കാരം · കൊല്ലം",
      date: "2026-12-25T17:00:00+05:30",
      timeText: "5:00 – 9:00 PM",
      durationHours: 4,
      venue: "NJ Convention Centre",
      address: "Cinemaparambu, Poruvazhy P.O., Kollam",
      mapUrl: "https://maps.google.com/?q=NJ+Convention+Centre+Cinemaparambu+Poruvazhy"
    },
    {
      name: "Reception · Thiruvananthapuram",
      malayalam: "സ്വീകരണം · തിരുവനന്തപുരം",
      date: "2026-12-26T17:00:00+05:30",
      timeText: "5:00 – 8:30 PM",
      durationHours: 3.5,
      venue: "Al-Saj Gravity, Al-Saj International Convention Centre",
      address: "Kazhakoottam, Thiruvananthapuram",
      mapUrl: "https://maps.google.com/?q=Al-Saj+International+Convention+Centre+Kazhakoottam"
    }
  ],

  // Photo URLs or paths like "photos/1.jpg" (leave [] to show decorative frames)
  gallery: [],

  // RSVP goes to WhatsApp. Country code + number, digits only, e.g. "919876543210"
  rsvpWhatsApp: "919647921150",
  rsvpDeadline: "",

  // Background music. youtubeId plays from YouTube (no file hosting needed).
  // Or set file: "music/song.mp3" to use your own audio file instead.
  song: {
    youtubeId: "dElRVQFqj-k",
    file: "",
    title: "Marry You",
    artist: "Bruno Mars",
    bpm: 145
  },

  hashtag: "#SreehariWedsAkshaya"
};
