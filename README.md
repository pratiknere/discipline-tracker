# Discipline Tracker

A personal daily-schedule tracker (Angular + Ionic + Capacitor) with native
Android notifications, streaks, and a calendar heatmap.

## Run as a web app (fastest way to try it)

```bash
npm install
npx ng serve
```

Open the printed localhost URL in your browser. Notifications won't fire on
web (Capacitor local-notifications is native-only) — for real reminders that
survive a locked phone, use the Android build below.

## Get the APK without installing Android Studio

This repo includes a GitHub Actions workflow (`.github/workflows/build-apk.yml`)
that builds a ready-to-install APK in the cloud every time you push to `main`.

1. Push this project to a GitHub repository (see commands below).
2. Go to your repo on github.com -> Actions tab.
3. Click into the latest "Build Android APK" run (it starts automatically on push).
4. Wait for it to finish (~5-10 min) - a green checkmark means success.
5. Scroll down to Artifacts and download `discipline-tracker-debug-apk`.
6. Unzip it - you'll get `app-debug.apk`.
7. Transfer that file to your phone (Google Drive, email to yourself, USB, etc.)
   and open it to install. Android will ask you to allow "install from
   unknown sources" the first time - that's expected for a non-Play-Store app.

## After installing - one-time phone settings

For reminders to survive the phone being locked or the app closed for a long
time, do this once after installing:

1. Open the app once, tap "Allow" when it asks for notification permission.
2. Go to Phone Settings -> Apps -> Discipline Tracker -> Battery, and set it
   to Unrestricted (not "Optimized" or "Restricted"). Exact wording varies:
   - Samsung: Settings -> Apps -> Discipline Tracker -> Battery -> Unrestricted
   - Xiaomi/MIUI: Settings -> Apps -> Manage apps -> Discipline Tracker ->
     Battery saver -> No restrictions, and enable Autostart for the app
   - Stock Android/Pixel: Settings -> Apps -> Discipline Tracker ->
     Battery -> Unrestricted
3. Edit your schedule anytime from the Settings tab in the app - saving
   automatically reschedules all reminders to match.

## Pushing this project to GitHub yourself

```bash
git init
git add .
git commit -m "Initial commit: discipline tracker app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Replace `<your-username>/<your-repo-name>` with your actual GitHub repo path
(create an empty repo on github.com first, no README/license needed there).

## Editing your schedule in code

Default blocks live in `src/app/services/schedule.service.ts` - edit the
`DEFAULT_BLOCKS` array directly if you'd rather not use the in-app Settings
page. Times are 24-hour `"HH:mm"` format.

## Project structure

```
src/app/
  models/            data shapes (ScheduleBlock, DayLog, StreakInfo)
  services/
    storage.service.ts        persistence (Capacitor Preferences)
    schedule.service.ts       your list of daily blocks
    log.service.ts            per-day done/partial/skipped status
    streak.service.ts         streak math (current + longest)
    notification.service.ts   native daily reminders
  pages/
    today/       daily checklist
    stats/       streaks + weekly completion
    calendar/    heatmap per activity
    settings/    edit schedule, triggers re-scheduling of reminders
  tabs/          bottom tab navigation shell
```
