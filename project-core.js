// ═══════════════════════════════════════════════════════════════════
// project-core.js — Single source of truth for all project pages
//
// PURPOSE: Holds the master projects registry only.
// Script loading is handled via static <script> tags in each HTML
// to guarantee jQuery $(document).ready() fires correctly.
//
// TO ADD A NEW PROJECT: add one line to PROJECTS below, then copy
// the project HTML template and update the 3 marked values.
// ═══════════════════════════════════════════════════════════════════

// FORMAT: [id, "YYYYMMDD", "Author", "Display Name", "/url/", "Search Keywords"]
var PROJECTS = [
    [1, "20260214", "Hulash Chand", "Celestian Labs",               "/projects/celestian-labs/",             "Celestian Labs Agentic Artificial Intelligence"],
    [2, "20251113", "Hulash Chand", "System Design Architecture",   "/projects/system-design-architecture/", "System Design Architecture"],
    [3, "20251113", "Hulash Chand", "Bird Song Mathematical Model", "/projects/birdsong-mathematical-model/", "Bird Song Mathematical Model"],
    [4, "20241121", "Hulash Chand", "Leet Journey",                 "/projects/leetjourney-obsidian-notes/",  "Leet Journey Obsidian Notes"],
    [5, "20251121", "Hulash Chand", "Bhagavad Gita Telugu",         "/projects/bhagavad-gita-telugu/",        "Bhagavad Gita Telugu"]
];

// Expose globally so app.min8a54.js can access it
window.projects = PROJECTS;
