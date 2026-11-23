/* ============================================================
   WEDDING CONFIG — edit everything here. No other file needed.
   Times are India Standard Time (+05:30).
   ============================================================ */
window.WEDDING = {
  groom: { name: "Sreehari", full: "Sreehari" },
  bride: { name: "Akshaya", full: "Dr Akshaya" },

  titleEnglish: "Wedding Reception · Kollam",

  // Photo shown with each word in the intro
  introPhotos: {
    families: "photos/7.jpg",
    hometowns: "photos/3.jpg",
    apart: "photos/4.jpg",
    celebrations: "photos/10.jpg",
    date: "photos/9.jpg"
  },

  // Map points for the intro (hometowns + venue)
  introPins: {
    groom: { city: "Kollam", lat: 8.89, lon: 76.6 },
    bride: { city: "Thrissur", lat: 10.53, lon: 76.21 },
    venue: { city: "Guruvayur", lat: 10.594, lon: 76.041 }
  },

  // Portrait shown beside the names on the first screen
  heroPhoto: "photos/1.jpg",

  // The event this invitation is for (countdown, main card, maps, calendar)
  date: "2026-12-25T17:00:00+05:30",
  muhurtham: "5:00 – 9:00 PM",
  venue: {
    name: "NJ Convention Centre",
    city: "Kollam",
    address: "Cinemaparambu, Poruvazhy P.O., Kollam",
    mapUrl: "https://maps.google.com/?q=NJ+Convention+Centre+Cinemaparambu+Poruvazhy"
  },

  // The wedding itself (used by the intro's story: "where?" → Guruvayur, 23.12)
  weddingDate: "2026-12-23T10:30:00+05:30",


  invitationMessage:
    "With the blessings of our elders and the grace of Guruvayurappan, we are getting married in Guruvayur on 23 December. We warmly invite you and your family to celebrate with us at our wedding reception in Kollam.",

  // Small notes shown under the muhurtham card (leave [] to hide)
  notes: ["Presents in blessings only"],

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
      mother: "Dr. Bini Jayakumar",
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
      city: "Guruvayur", lat: 10.5945, lon: 76.0393,
      address: "Guruvayur",
      mapUrl: "https://maps.google.com/?q=Guruvayur+Sreekrishna+Temple",
      rsvp: false // listed as a ceremony, but not in the RSVP picker
    },
    {
      name: "Wedding Celebration",
      date: "2026-12-23T10:30:00+05:30",
      timeText: "10:30 – 11:00 AM",
      durationHours: 0.5,
      venue: "Newline Orchid",
      city: "Guruvayur", lat: 10.5960, lon: 76.0460,
      address: "Outer Ring Road, Guruvayur",
      mapUrl: "https://maps.google.com/?q=Newline+Orchid+Guruvayur"
    },
    {
      name: "Reception · Kollam",
      date: "2026-12-25T17:00:00+05:30",
      timeText: "5:00 – 9:00 PM",
      durationHours: 4,
      venue: "NJ Convention Centre",
      city: "Kollam", lat: 9.0700, lon: 76.6500,
      address: "Cinemaparambu, Poruvazhy P.O., Kollam",
      mapUrl: "https://maps.google.com/?q=NJ+Convention+Centre+Cinemaparambu+Poruvazhy",
      highlight: true
    },
    {
      name: "Reception · Thiruvananthapuram",
      date: "2026-12-26T17:00:00+05:30",
      timeText: "5:00 – 8:30 PM",
      durationHours: 3.5,
      venue: "Al-Saj Gravity, Al-Saj International Convention Centre",
      city: "Thiruvananthapuram", lat: 8.5700, lon: 76.8700,
      address: "Kazhakoottam, Thiruvananthapuram",
      mapUrl: "https://maps.google.com/?q=Al-Saj+International+Convention+Centre+Kazhakoottam"
    }
  ],

  // Photo URLs or paths like "photos/1.jpg" (leave [] to show decorative frames)
  gallery: [
    "photos/9.jpg", "photos/6.jpg", "photos/10.jpg", "photos/3.jpg",
    "photos/5.jpg", "photos/11.jpg", "photos/4.jpg", "photos/7.jpg",
    "photos/1.jpg", "photos/8.jpg"
  ],

  // Engagement film from Google Drive (file must be shared "Anyone with the link")
  video: {
    driveId: "1g_Paed22WMXs10EDGcfQVfbfINohDRvC",
    poster: "photos/5.jpg",
    title: "Our Engagement Film"
  },

  // RSVPs are saved as rows in a Google Sheet: paste the Apps Script web app URL (ends in /exec).
  // See rsvp-sheet.gs for the one-time setup. If this is empty, RSVPs fall back to WhatsApp.
  rsvpSheetUrl: "https://script.google.com/macros/s/AKfycbz4fJ2o8_NbLEqDb3v6GLkXkfX-VuOMunN9VEIpiOSfaJCBEG9IwOLTMqxzwdWzgwilsQ/exec",
  rsvpSide: "Groom's side (main site)",
  // WhatsApp fallback. Country code + number, digits only, e.g. "919876543210"
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

  hashtag: "#SreehariWedsAkshaya"
};
