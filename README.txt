JILL’S CLOSET V1.5

DEPLOYMENT
Extract this ZIP and upload its CONTENTS to the same deployment root as V1.4.
index.html must sit at that root, beside app.js, style.css, sw.js,
manifest.webmanifest, jillzcloset.png, icon-192.png and icon-512.png.
Use HTTPS (localhost also works for testing). Do not open index.html as a
local file. Keep the exact same origin (scheme + hostname + port) and browser
profile to retain the private wardrobe. A new host cannot access the old
host's IndexedDB: export a backup from V1.4 before moving, then import it.
Export a private backup before replacing the deployment as a precaution.
No wardrobe JSON or clothing photos are included in this package.

COMPATIBILITY AND PRIVACY
Retains JillsClosetDB, version 1, state store, main key. Existing item,
outfit, shopping, imageData and unknown saved fields are preserved. Adds
wearHistory and appVersion to that same record. Writes wait for the database
transaction to complete; a failed write restores the in-memory wardrobe.
Only the public app shell and logo/icons are cached by the service worker.
Photos and backups are never sent to a server. Backup export includes
items, outfits, shopping records, full recorded wear history and extra fields.
Import merges distinct item/outfit/history IDs, retaining existing matches.
V1.4 saved outfits' lastWorn dates seed wear history where available. Older
wear events were not recorded by V1.4 and cannot be reconstructed.

V1.5
Opens to Home; navigation: Home | Closet | Outfits | Wear | Shopping | More.
Home displays the uploaded logo, compatible outfit count, occasion shortcut,
and three most recently worn distinct outfits within the rolling 14-day view.
Wear shows the logo as a subtle watermark and suggests up to three distinct
complete owned looks. Recently worn combinations rank behind unworn looks;
optional vibe preference and diversity help rank the remaining choices.
If fewer than three valid looks exist, it explains the shortage rather than
inventing clothes or showing duplicates. Core order: Layer, Top, Bottom,
Shoes. A Dress replaces Top + Bottom, preserving existing Dress support.
Accessories and Purse/Bag can be added manually but are excluded from core
generation and outfit counts. Manual extras follow the ordered core pieces.
Outfit Edit preserves its ID and allows adding/removing individual pieces.
Wore This works on saved and generated looks; records date, piece IDs, name
and occasion, updating item counters. History displays today and the prior
13 local calendar days. Older records stay in private backups.
Archive hides pieces from generation and can be restored. Delete Item asks
for confirmation, removes the photo/item and saved-outfit references; history
keeps the original ID and indicates a deleted piece. There is no undo for
Delete. The detail heading uses item name, falling back to its category.

WHAT THE OUTFIT COUNT MEANS
Counts distinct top + bottom + shoes, or dress + shoes, with each optional
layer. Every piece is active and shares at least one supported occasion.
Neutral colors mix freely; recognized accent colors use one warm or cool
palette. Unbridged Polished/Relaxed conflicts are excluded. Blank metadata
is flexible. This is a metadata-based compatibility estimate, not image
recognition or a guarantee of aesthetic quality. Update tags to improve it.
The count is across supported occasions without counting a look twice.

UPDATES AND OFFLINE USE
The V1.5 service worker precaches a coherent shell including the actual logo.
It replaces Jill’s Closet caches only; IndexedDB and unrelated caches remain.
V1.4's installed worker may show the previous shell once while downloading
V1.5. Close/reopen or reload after it updates. V1.5 checks on startup; More
has Check for Updates. A controller update waits for current database saves
then reloads. Open online once before relying on offline mode. Future releases
must change the CACHE version in sw.js when changing public assets.
Serve sw.js with Cache-Control: no-cache (or no-store) and a JavaScript MIME
type. Avoid redirects of missing files to index.html. Keep asset paths relative.

This is a local-first app. Clearing website data or uninstalling a browser can
remove the private wardrobe. Keep exported backups somewhere private.

VALIDATION — OCTOBER 4, 2026
Browser checks used synthetic wardrobe records and synthetic solid-color
photos, not the user's private wardrobe. Verified import and reload, Home
count/history, core display order, outfit edit add/remove and field retention,
three distinct complete suggestions, Wore This and 14-day history, item-name
heading, persistent image rotation, Add Item persistence, Purse/Bag category,
Archive/Restore/Delete, modal background lock and independent scrolling.
Checked Home and Wear at a 390px mobile width; no horizontal overflow.
Verified new-logo watermark visually. Verified app/wardrobe/logo loading with
the local server stopped. Installed the actual stable V1.4 worker at a separate
test origin, imported items in V1.4, replaced the shell with V1.5, and confirmed
the same stored wardrobe and offline loading after the upgrade.
Nine isolated logic/storage/worker test groups also passed, including failed
transaction rollback, future-save recovery, unknown state-field retention,
legacy wear migration, deleted references, recent core matching with manual
accessories, Dress support, metadata validation and scoped cache cleanup.
JavaScript syntax and ZIP contents were validated. This does not substitute
for a device-specific Safari/iPhone install check after deployment.
