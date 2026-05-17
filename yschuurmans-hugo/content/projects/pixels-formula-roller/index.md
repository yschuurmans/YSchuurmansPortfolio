---
title: "Pixels Formula Roller"
displayDate: "Q2 2026"
shortContent: "An Android-native companion app for Pixels electronic dice, built to make tabletop formula rolling faster, more tactile, and hardware-aware."
priority: 13
shown: true
headerImg: "final_app_icon.png"
visuals:
- "1.jpg"
- "2.jpg"
- "3.jpg"
- "4.jpg"
- "5.jpg"
- "6.jpg"
---

Pixels Formula Roller is an Android-native companion app for Pixels electronic dice. The goal of the project is to make tabletop rolling feel faster and more reliable on mobile devices while still keeping the real physical dice at the center of the experience.

I wanted to build it because the existing tooling handled a single die well, but once a roll needed several individual dice, older apps did not keep trying to reconnect. That meant a die could drop out and then stop being picked up again when it was rolled later, which made the experience unreliable for larger formulas.

Rather than treating dice rolls as abstract software randomization, the app works directly with the hardware. It discovers remembered Pixels dice, reconnects them automatically when the app launches or resumes, lights up the right dice for each roll, listens for the hardware results, and then evaluates and displays the final outcome.

The application is built with a React and TypeScript front end wrapped in a Capacitor Android shell. Native Android Bluetooth Low Energy handling lives behind a bridge so the web UI never talks to Bluetooth directly. Local state is managed with Zustand, and dice expressions are parsed through a dedicated service built around rpg-dice-roller.

From the user's side, the app focuses on saved formulas, formula editing, and roll history. Players can create standard RPG rolls, keep-highest and keep-lowest variants, and combined modifier formulas. Saved formulas sit on the main screen for quick access, and each formula can be opened, edited, rolled, or deleted without leaving the flow.

The UI also supports a character-sheet style workflow with skill-based rolls, advantage and disadvantage prompts, and reusable modal interactions. Recent rolls are stored locally so results are easy to review, and the app preserves formula order and other preferences on the device.

A major part of the project is the interaction between software and physical hardware. On launch and resume, the app scans for previously known Pixels dice and reconnects any that are available, which keeps repeat use low-friction. When a roll starts, it determines which dice are needed, sends the correct glow commands to the connected hardware, waits for the roll events to come back, and then computes the final result once all required values have been collected.

The interface uses a bold pixel-art aesthetic to match the tabletop and hardware theme, with strong contrast and a retro game-inspired presentation. Overall, the project aims to turn Pixels dice into a polished mobile-first companion for tabletop roleplaying: quick to use, hardware-aware, offline-friendly, and designed around the flow of real dice rolling rather than abstract digital input alone.
