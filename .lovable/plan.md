# Read-only review: WiFi Penetration Testing Playbook

## Verdict and boundaries

**All 17 lessons and the historical story remain unchanged. Nothing was published, and no wireless tools or embedded attack scripts were run.** Checks used source inspection, upstream references, and the existing browser simulation.

The curriculum has substantial breadth: **292 displayed command blocks, each with an explanation, plus 28 script presentations**. Its main weaknesses are uneven practice depth, inaccurate success claims, technical contradictions, and incomplete defensive pairing. This is a targeted audit, not certification of every lesson or hardware/tool combination; some long reads were truncated.

## 1. Lesson inventory and practice coverage

Commands counts displayed command blocks, not shell lines inside scripts.

| # | Existing lesson | Commands | Lab steps | Quizzes |
|---|---|---:|---:|---:|
| 01 | Hardware Setup | 6 | 6 | 3 |
| 02 | Monitor Mode & Packet Capture | 21 | 8 | 5 |
| 03 | Network Discovery & Reconnaissance | 18 | 3 | 2 |
| 04 | WPA/WPA2 Handshake Capture | 18 | 4 | 2 |
| 05 | Deauthentication Attacks | 16 | 2 | 2 |
| 06 | Evil Twin & Rogue AP | 25 | 2 | 1 |
| 07 | WPS Vulnerabilities | 15 | 2 | 1 |
| 08 | Professional Reporting | 0 | 0 | 0 |
| 09 | Advanced Recon Tools | 29 | 2 | 1 |
| 10 | Online Brute Force Attacks | 11 | 1 | 1 |
| 11 | Automated Attack Frameworks | 12 | 1 | 1 |
| 12 | Advanced Evil Twin Tools | 20 | 1 | 1 |
| 13 | Advanced Cracking & Recovery | 21 | 2 | 1 |
| 14 | MITM & Network Attacks | 21 | 2 | 1 |
| 15 | Post-Exploitation & Firmware | 21 | 2 | 1 |
| 16 | Skills Assessment | 0 | 2 | 1 |
| 17 | Full Engagement Workflow | 38 | 0 | 0 |
| | **Total** | **292** | **40** | **24** |

Evidence: `src/components/ModulesOverview.tsx:14–30`; `src/data/interactiveExercises.ts:10–944`.

**15/17 lessons have labs and mindset data.** Reporting and Full Engagement have neither (`src/data/moduleMindsets.ts:9–396`). Reporting supplies templates; Skills Assessment supplies scenarios and grading criteria. The overview incorrectly advertises “16” modules and scripts in every module (`ModulesOverview.tsx:39–40`).

## 2. Explanation quality

**Preserve these strengths:** Monitor Mode explains alternative methods, disconnection risks, verification, and output fields (`src/components/modules/MonitorMode.tsx:226–299,405–451`). Reporting separates evidence, impact, recommendations, and verification (`src/components/ReportingSection.tsx:32–57`). Frameworks encourages learning manual methods and checking automation results (`src/components/modules/AutomatedFrameworks.tsx:81–101`).

**Improve consistency:** an explanation exists for every command block, but flag meanings, prerequisites, failure diagnosis, limitations, and recovery are uneven. For example, Wirespy installation receives only “Clone from GitHub and install Python dependencies” (`src/components/modules/AdvancedEvilTwin.tsx:310–319`). Later tool-heavy lessons often offer only one or two practice steps.

Reporting methodology still contains placeholders rather than a worked finding (`ReportingSection.tsx:88–95`). The written assessment has three broad scenarios, but its browser “FINAL EXAM” is only two command steps and one question (`src/components/modules/SkillsAssessment.tsx:4–62`; `interactiveExercises.ts:900–943`). This does not demonstrate full-engagement competence.

**Recommended additive standard:** objective → prerequisites/scope → command reasoning → expected evidence → failure diagnosis → defensive control → retest → report finding. Preserve all lessons; measure learning by these outcomes rather than command count.

## 3. Is the terminal real?

**No. It is a text-input simulator.** It matches stored command strings and prints predetermined output. It does not invoke a shell, access the Alfa adapter, or transmit wireless traffic (`src/components/CLISimulator.tsx:66–85,125–138`). Script panels copy text rather than executing it (`src/components/ScriptBlock.tsx:14–20,39–54`).

Existing features: scenarios, prominent task text, hints, selected command-specific errors, canned output, quizzes with explanations, progress, reset, and desktop mindset/tool/tip panels.

Important limitations:

- Matching lowercases everything and collapses whitespace. Valid unlisted alternatives fail; meaningful case differences can incorrectly pass. This is not shell parsing (`CLISimulator.tsx:66–75`).
- The second wrong attempt reveals a hint; the third reveals an accepted answer (`:140–159`).
- Wrong quiz answers advance with no cumulative score/pass threshold, while completion says “All exercises passed” (`:88–99,171–187`). **Browser-confirmed:** a wrong answer advanced Hardware Setup.
- **21/24 correct answers are B**, encouraging position guessing (`interactiveExercises.ts`, `correctAnswer` fields).
- Quiz feedback disappears automatically after two seconds rather than waiting for Continue (`src/components/QuizQuestion.tsx:26–29`; `CLISimulator.tsx:274–279`).
- **Browser-confirmed:** two rapid accepted submissions duplicated the next step heading. No pending-submission lock protects timed advancement (`CLISimulator.tsx:118–138`).
- The lesson view does not receive completion; leaving the practice tab discards its local state (`src/components/ModuleView.tsx:63–91`).
- Canned output sometimes supports the wrong conclusion: listing Windows profiles claims cleartext passwords although only profile names appear (`interactiveExercises.ts:860–870`). Three station addresses sharing an OUI receive three manufacturers (`:359–370`).

**Recommendation:** clearly label simulation, assess interpretation/troubleshooting, separate completion from mastery, balance answer positions, allow review/retry, and prevent duplicate advancement.

## 4. Substantiated technical corrections

| Finding | Evidence |
|---|---|
| Driver guidance has aged | Setup clones unpinned `aircrack-ng/rtl8812au` (`src/components/HardwareSetup.tsx:108–116`). Its upstream README directs users toward mac80211 `rtw88`. Update against a tested compatibility matrix; this is not proof the adapter cannot work. |
| Unsupported Wacker option | Lesson teaches `--timeout 5` (`src/components/modules/OnlineBruteForce.tsx:230–232`); the inspected upstream argument parser defines no such option. No installed version is pinned. |
| Incorrect CPU claim | Full Engagement calls aircrack-ng “single-threaded” (`src/components/modules/FullEngagement.tsx:436–439`); upstream source selects multiple CPUs when available. |
| Enterprise overstatement | Online guessing is called the “ONLY way” for Enterprise networks (`OnlineBruteForce.tsx:108–114`), conflicting with the course’s rogue-RADIUS/offline-cracking lesson (`AdvancedEvilTwin.tsx:240–291`). |
| WPS guarantee contradicts limitations | “Will eventually find the PIN” (`FullEngagement.tsx:407–410`) conflicts with the course’s rate-limiting caveat (`src/components/modules/WPSAttacks.tsx:515–517`). |
| Reversed WPS lock status | Script counts `Yes` as unlocked and `No` as locked, opposite its own table (`WPSAttacks.tsx:72–80,348–353`). Static finding; not executed. |
| Capability output overclaims | Interface-combination output is presented as confirming packet injection (`FullEngagement.tsx:177–180`). It is not an operational injection test. |

## 5. Dependencies and reproducibility

The npm lock records **React 18.3.1, Vite 5.4.19, TypeScript 5.8.3, Tailwind 3.4.17, React Router 6.30.1**; manifest versions use ranges (`package.json:53–58,83–87`; corresponding `package-lock.json` entries). Vite 5 falls outside current official support families; unsupported does **not** establish a specific vulnerability.

Vitest, jsdom, and Testing Library declarations are absent from the npm lock’s root graph (`package.json:68–87` versus `package-lock.json:61–79`). Both npm and Bun lockfiles exist; binary Bun-lock parity was not verified. The existing example test only asserts `true` (`src/test/example.test.ts:1–7`). No clean-install or vulnerability scan was performed.

**Recommendation:** document tested Kali image/architecture, kernel, adapter, driver revision, tool versions, validation date, limitations, and recovery. Unpinned clones and system upgrades do not produce a reproducible hardware lab. Validate ARM packages and GPU-dependent lessons separately; do not assume everything works on the Pi.

## 6. Blue-team pairing and script safeguards

Defensive material exists: Evil Twin has dedicated defenses (`src/components/modules/EvilTwin.tsx:641–652`); Advanced Recon includes Kismet alerts (`src/components/modules/AdvancedRecon.tsx:147–151`); Online Brute Force warns about lockouts and defender coordination (`:124–127`); Reporting covers WPS, segmentation, WPA3/802.1X, firmware, and monitoring (`ReportingSection.tsx:105–122`).

Pairing is **uneven, not absent**. Add synthetic defender logs, expected observations, false positives, remediation, and before/after validation to every lesson; the assessment should grade defensive verification too.

**Static safety concerns:** a deauth script falls back to broad nearby-network disruption when its target file is invalid (`src/components/modules/DeauthAttacks.tsx:152–162`); another loops indefinitely (`:116–130`). Evil Twin flushes firewall tables and changes forwarding without restoring prior state (`EvilTwin.tsx:129–145,204–222`). Full Engagement restores state only at its normal ending (`FullEngagement.tsx:86–108`). Banners do not supply containment or recovery.

Any future operational script approval should require fail-closed scope, explicit disruptive-action authorization, bounded execution, saved state, and reliable recovery. None were run here.

## 7. Navigation, accessibility, and mobile

- Hardware Setup and Reporting top-navigation choices have no handlers: only Home/Modules are implemented (`src/components/Navigation.tsx:14–19`; `src/pages/Index.tsx:39–48`). Cards still open lessons.
- **Measured:** mindset help disappears at 390px; at 320px document width grows to 332px. At 390px there was no page overflow (`ModuleView.tsx:79–83`).
- **Measured:** command input has no associated label. Source also lacks live/log announcements and progress semantics (`CLISimulator.tsx:243–296`).
- Quiz choices lack selected-state semantics (`QuizQuestion.tsx:40–62`); mobile menu and sidebar disclosures lack appropriate names/expanded state (`Navigation.tsx:51–57`; `src/components/MindsetSidebar.tsx:23–38`).
- Sidebar text includes 10–11px sizes; no reduced-motion override was found (`MindsetSidebar.tsx:53–70`; `src/index.css:137–155`). Contrast and screen-reader usability remain unmeasured.
- Lesson selection is temporary page state, without stable lesson URLs (`src/App.tsx:16–21`; `Index.tsx:35–52`).

Recommend phone-accessible help, wrapping controls, readable text, labelled controls, keyboard/focus checks, announced feedback, and learner-controlled feedback timing. No runtime errors occurred in the targeted browser checks.

## 8. Feasible additive practice

**Browser-only, synthetic data:** AP/client inventory interpretation; authorization/scope decisions; fabricated frame/event timelines; staged error diagnosis; WIDS/authentication-log analysis; defensive-control selection; evidence-versus-inference questions; report writing and scoring. Explicitly label all synthetic evidence.

**Separate local authorized lab:** actual Pi/Alfa driver verification, capture fidelity, real radio behavior, service recovery, and real defensive telemetry. Use owned or explicitly authorized isolated equipment and an approved test plan. A normal browser cannot operate this adapter as a monitor-mode radio. Do not add a real shell/hardware bridge merely to make simulation feel authentic.

## 9. Historical story

**Preserved unchanged; technical claims remain unverified.** “DECLASSIFIED,” “true story,” and the WiFi/ARP/door-lock/CCTV chain appear in `src/components/WiFiStory.tsx:11–18,29–59`. The attribution names organizations but gives no traceable article/report identifiers (`:77–80`). General reporting of the event would not verify each mechanism. Any future source assessment should be separate from the preserved story and cite each specific claim.

## Recommended order — recommendations only

1. **Instructional trust/safety:** correct demonstrated contradictions and false success criteria; review script scope/recovery; establish a tested environment matrix.
2. **Honest, usable practice:** fix navigation and duplicate advancement; improve quizzes, completion semantics, accessibility, and phone help.
3. **Additive depth:** reporting/full-engagement simulations, deeper advanced labs, and consistent defensive evidence/retesting.
4. **Maintenance:** reconcile locks, plan supported dependency upgrades, and add meaningful behavior tests.

No implementation is authorized by this review; preserve all lessons and the story.

### Authoritative references checked

- Driver guidance: https://github.com/aircrack-ng/rtl8812au
- Wacker parser: https://github.com/blunderbuss-wctf/wacker/blob/master/wacker.py
- Aircrack-ng CPU handling: https://github.com/aircrack-ng/aircrack-ng/blob/master/src/aircrack-ng/aircrack-ng.c
- Vite support: https://vite.dev/releases

Upstream branches can change; these checks do not establish compatibility with an unpinned installed release. Hardware outcomes and historical claims were not independently verified.
