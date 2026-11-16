# Wedding Invitation Website

A Kerala-style wedding invitation site: opening gate with wax seal, falling flower petals, nilavilakku lamp, kolam, kasavu borders, countdown, love story, families, events with maps and calendar links, a gallery, and an RSVP that goes to WhatsApp.

## Edit the details
Everything lives in **`config.js`**: names, dates, venues, events, families, photos, WhatsApp number and music.

- Photos: drop images in a `photos/` folder and list them in `gallery`, e.g. `"photos/1.jpg"`.
- Music: set `song.youtubeId` to any embeddable YouTube video, or `song.file` to your own mp3.
- RSVP: set `rsvpWhatsApp` to your number with country code, digits only (`91XXXXXXXXXX`).

## Run locally
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000.

Hosted on GitHub Pages: push to `main` and it updates automatically.
