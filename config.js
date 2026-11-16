/* ============================================================
   WEDDING CONFIG — edit everything here. No other file needed.
   Times are India Standard Time (+05:30).
   ============================================================ */
window.WEDDING = {
  groom: { name: "Sreehari", full: "Sreehari P A" },
  bride: { name: "Bride", full: "Bride's Full Name" },

  // Malayalam title shown under the names (ഹൃദയം = "heart")
  titleMalayalam: "ഒന്നാകുന്ന രണ്ടു ഹൃദയങ്ങൾ",
  titleEnglish: "Two hearts, one journey",

  // Main ceremony
  date: "2027-02-14T10:30:00+05:30",
  muhurtham: "10:30 AM – 11:15 AM",
  venue: {
    name: "Guruvayur Sree Krishna Temple",
    address: "East Nada, Guruvayur, Thrissur, Kerala",
    mapUrl: "https://maps.google.com/?q=Guruvayur+Sree+Krishna+Temple"
  },

  invitationMessage:
    "Like two rivers meeting the sea, our paths have found each other. With the blessings of our elders and the grace of the divine, we begin a new chapter — and it would mean the world to have you there.",

  // Optional love-story timeline (leave [] to hide)
  story: [
    { year: "2019", title: "First Hello", text: "A chance meeting that neither of us knew would change everything." },
    { year: "2022", title: "Falling, Slowly", text: "Long calls, longer drives, and a thousand cups of chai." },
    { year: "2026", title: "The Question", text: "One knee, one ring, and the easiest 'yes' ever spoken." },
    { year: "2027", title: "Forever Begins", text: "Surrounded by family, under the gaze of the nilavilakku." }
  ],

  families: {
    groom: { father: "Father's Name", mother: "Mother's Name", place: "Hometown, Kerala" },
    bride: { father: "Father's Name", mother: "Mother's Name", place: "Hometown, Kerala" }
  },

  events: [
    {
      name: "Wedding (Muhurtham)",
      malayalam: "താലികെട്ട്",
      date: "2027-02-14T10:30:00+05:30",
      durationHours: 1,
      venue: "Guruvayur Sree Krishna Temple",
      address: "East Nada, Guruvayur, Thrissur",
      mapUrl: "https://maps.google.com/?q=Guruvayur+Sree+Krishna+Temple",
      dress: "Kasavu & traditional",
      highlight: true
    },
    {
      name: "Wedding Ceremony & Sadya",
      malayalam: "വിവാഹ സൽക്കാരം",
      date: "2027-02-14T12:00:00+05:30",
      durationHours: 3,
      venue: "Auditorium Name",
      address: "Guruvayur, Thrissur",
      mapUrl: "https://maps.google.com/?q=Guruvayur",
      dress: "Traditional"
    },
    {
      name: "Reception — Groom's Home",
      malayalam: "സ്വീകരണം · കൊല്ലം",
      date: "2027-02-15T17:00:00+05:30",
      durationHours: 4,
      venue: "Groom's Residence",
      address: "Kollam, Kerala",
      mapUrl: "https://maps.google.com/?q=Kollam",
      dress: "Festive"
    },
    {
      name: "Reception — Bride's Home",
      malayalam: "സ്വീകരണം · തിരുവനന്തപുരം",
      date: "2027-02-16T17:00:00+05:30",
      durationHours: 4,
      venue: "Bride's Residence",
      address: "Thiruvananthapuram, Kerala",
      mapUrl: "https://maps.google.com/?q=Thiruvananthapuram",
      dress: "Festive"
    }
  ],

  // Photo URLs or paths like "photos/1.jpg" (leave [] to show decorative frames)
  gallery: [],

  // RSVP goes to WhatsApp. Country code + number, digits only, e.g. "919876543210"
  rsvpWhatsApp: "",
  rsvpDeadline: "January 31, 2027",

  // Optional background music: path to an mp3, e.g. "music/song.mp3"
  music: "",

  hashtag: "#SreehariWeds2027"
};
