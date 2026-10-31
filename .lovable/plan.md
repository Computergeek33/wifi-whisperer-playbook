# Read-only curriculum review and recommendations

## Scope and verdict

**No lesson, story, source code, setting, or publishing state was changed. No wireless tools or embedded attack scripts were executed.** Browser checks exercised only the existing simulated interface, in a fresh session.

The playbook has substantial teaching material: **17 lessons, 292 displayed command blocks with a “Why” explanation each, and 28 embedded script presentations**. However, breadth is ahead of instructional consistency and assessment depth. The browser practice is useful rehearsal, **not a real terminal or proof of hardware proficiency**.

This is a source-based review with targeted browser checks, not certification of every instruction or tool. Some long lesson reads were truncated; findings below use inspected passages. Hardware compatibility, attack outcomes, and script recovery were not operationally tested.

## 1. Existing lessons and interactive coverage

“Commands” counts displayed `CommandBlock` instances, not individual shell lines inside scripts. Lab/quiz counts come from actual exercise objects.

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

**Inventory evidence:** `src/components/ModulesOverview.tsx:14–30`; lesson mapping in `src/pages/Index.tsx:15–33`. Practice definitions: `src/data/interactiveExercises.ts:10–944`.

- **15/17 lessons have labs and mindset data.** Reporting and Full Engagement have neither. The sidebar only appears inside desktop labs (`src/data/moduleMindsets.ts:9–396`; `src/components/ModuleView.tsx:31–58,79–91`).
- Reporting supplies four reusable templates rather than command training (`src/components/ReportingSection.tsx:156–173`). Skills Assessment supplies three written scenarios and a grading table (`src/components/modules/SkillsAssessment.tsx:4–62,162–197`).
- The overview still advertises **16** modules and promises scripts in every module, which does not match this inventory (`ModulesOverview.tsx:39–40`).

## 2. Depth and consistency of explanations

**Strong foundations worth preserving**

- Monitor Mode explains consequences, alternatives, verification, and output fields—not just syntax. It warns that stopping network services disconnects WiFi (`src/components/modules/MonitorMode.tsx:226–299,405–451`).
- Discovery explains channel/BSSID filters and capture fields (`src/components/modules/NetworkDiscovery.tsx:260–286,330–344`).
- Reporting separates evidence, impact, recommendations, verification, and references (`ReportingSection.tsx:32–57`).
- Frameworks explicitly recommend learning manual methods first and checking automation results (`src/components/modules/AutomatedFrameworks.tsx:81–101`).

**Where depth falls short**

- Having a “Why” field is consistent; explaining every flag, prerequisite, expected result, failure case, limitation, and recovery step is not. For example, Wirespy installation gets only “Clone from GitHub and install Python dependencies” (`src/components/modules/AdvancedEvilTwin.tsx:310–319`).
- Later practice is much thinner than the lessons: Advanced Evil Twin has 20 displayed commands but one practice step; Automated Frameworks has 12 but one.
- The written assessment spans corporate, hotel, and red-team scenarios. Its browser “FINAL EXAM” ends after two command steps and one prioritization question—not a full engagement (`SkillsAssessment.tsx:4–62`; `interactiveExercises.ts:900–943`).
- Reporting includes unfinished methodology placeholders rather than a worked finding and scored report-writing exercise (`ReportingSection.tsx:88–95`).

**Recommendation:** retain every lesson, adding a consistent learning layer: objective → prerequisites/scope → command reasoning → evidence interpretation → failure diagnosis → defensive control → retest → report finding. Measure depth by those outcomes, not command count.

## 3. What the interactive terminal actually does

It is a **React text-input simulator**. It compares answers with stored strings and prints predetermined output; it does not invoke a shell, read the filesystem, access the Alfa adapter, or transmit wireless traffic (`src/components/CLISimulator.tsx:6–16,66–85,125–138,251–297`). Script panels provide copying, not execution (`src/components/ScriptBlock.tsx:14–20,39–54`).

Existing features include scenarios, larger/brighter task text, hints, tailored errors for selected patterns, canned output, multiple-choice explanations, progress, reset, and desktop mindset/tool/tip panels.

**Learning and reliability issues**

- Matching lowercases the entire command and collapses whitespace. Valid unlisted alternatives fail; meaningful case differences in filenames, SSIDs, and arguments can pass incorrectly (`CLISimulator.tsx:66–75`). This is not shell parsing.
- The second wrong command reveals a hint; the third reveals an accepted answer (`:140–159`).
- Wrong quiz answers still advance, with no accumulated score or pass threshold; final copy nevertheless says “All exercises passed” (`:88–99,171–187`). **Browser-confirmed:** a wrong first quiz answer advanced Hardware Setup to step two.
- **21 of 24 answers are B**, making position guessing unusually effective (`interactiveExercises.ts`, all `correctAnswer` entries).
- Explanations disappear automatically after two seconds. There is no learner-controlled Continue (`src/components/QuizQuestion.tsx:26–29`; `CLISimulator.tsx:171–187,274–279`).
- **Browser-confirmed:** submitting an accepted non-quiz command twice rapidly duplicated the next step heading. Advancement has no pending lock; timer cancellation is also absent from reset (`CLISimulator.tsx:118–138,184–210`).
- Completion is not passed back to the lesson view; overview statuses are hardcoded. Leaving the practice tab unmounts its local state (`ModuleView.tsx:63–91`; `ModulesOverview.tsx:14–30`).
- Some canned results teach unsupported conclusions: listing Windows profiles claims cleartext passwords, although output shows only profile names (`interactiveExercises.ts:860–870`). Three client MACs sharing one OUI are assigned three manufacturers (`:359–370`).

**Recommendation:** describe it clearly as simulated practice; assess interpretation and troubleshooting, not exact-string recall. Separate “completed” from “demonstrated understanding,” vary answer positions, allow review/retry, and prevent duplicate advancement.

## 4. Confirmed corrections and version concerns

These are distinguishable from merely old-looking examples.

| Finding | Evidence and consequence |
|---|---|
| Driver recommendation has aged | Hardware Setup recommends an unpinned `aircrack-ng/rtl8812au` clone (`HardwareSetup.tsx:108–116`). Its upstream README retrieved during this review explicitly marks these drivers deprecated and points to `rtw88`. This calls for a tested compatibility update—not a claim the adapter cannot work. |
| Wacker option mismatch | The lesson teaches `--timeout 5` (`src/components/modules/OnlineBruteForce.tsx:230–232`); upstream `wacker.py:206–213` defines no such argument. No tool version is pinned to justify a different interface. |
| Incorrect CPU claim | Full Engagement calls aircrack-ng “single-threaded” (`src/components/modules/FullEngagement.tsx:436–439`). Upstream help documents CPU selection with all CPUs as default. |
| Enterprise attack overstatement | Online Brute Force says online guessing is the “ONLY way” to attack Enterprise networks (`OnlineBruteForce.tsx:108–114`), conflicting with the course’s own rogue-RADIUS capture/offline-cracking content (`AdvancedEvilTwin.tsx:240–291`). |
| WPS guarantees conflict | Full Engagement says guessing “will eventually find the PIN” (`FullEngagement.tsx:407–410`), while WPS teaches that rate limiting may prevent completion (`src/components/modules/WPSAttacks.tsx:515–517`). |
| WPS lock-state logic reversed | Script counts `Yes` as unlocked and `No` as locked, opposite the lesson’s table (`WPSAttacks.tsx:72–80,348–353`). Static finding; not executed. |
| Adapter verification overclaims | Interface-combination output is presented as confirming packet injection (`FullEngagement.tsx:177–180`). Capability text alone is not an operational injection test. |

**App dependencies:** npm lock records React 18.3.1, Vite 5.4.19, TypeScript 5.8.3, Tailwind 3.4.17, and React Router 6.30.1. Manifest ranges use `^`, not exact pins (`package.json:53–58,83–87`; `package-lock.json` corresponding package entries). Vite 5 is outside the current official support families; that alone does **not** establish a specific vulnerability.

**Reproducibility:** Vitest, jsdom, and Testing Library declarations are missing from the npm lock’s root dependency graph (`package.json:68–87` versus `package-lock.json:61–79`). Both npm and Bun locks exist; binary Bun-lock parity was not verified. The existing test only asserts `true` (`src/test/example.test.ts:1–7`).

**Recommendation:** establish one tested environment matrix: Kali image/architecture, kernel, driver revision, adapter identification, tool versions, validation date, known limitations, and recovery procedure. Verify ARM package availability and GPU-dependent lessons separately; the Pi setup does not prove every listed tool works. Do not mass-upgrade dependencies without compatibility checks.

## 5. Blue-team pairing and script safeguards

Defensive teaching is **present but uneven**:

- Evil Twin has a dedicated defense section covering certificate validation, rogue-AP detection, and auto-connect (`src/components/modules/EvilTwin.tsx:641–652`).
- Advanced Recon includes named Kismet alerts (`src/components/modules/AdvancedRecon.tsx:147–151`).
- Online Brute Force warns about lockouts and coordinating with defenders (`OnlineBruteForce.tsx:124–127`).
- Reporting recommends disabling WPS, segmentation, WPA3/802.1X, firmware updates, and monitoring (`ReportingSection.tsx:105–122`).

There is no equally developed detection-and-retest exercise paired with every technique. Add synthetic defender logs, expected observations, false-positive discussion, remediation, and a before/after validation task for each lesson.

**Static safety findings:** some embedded scripts are unsuitable to treat as ready-to-run professional automation. The deauth script defaults to broad nearby-network disruption if its target file is missing/invalid (`DeauthAttacks.tsx:152–162`); another loops continuously (`:116–130`). Evil Twin flushes host firewall tables and changes forwarding without restoring prior state (`EvilTwin.tsx:129–145,204–222`). Full Engagement restores state only at its normal ending, not through an exit trap (`FullEngagement.tsx:86–108`). Authorization banners do not supply containment or recovery.

**Recommendation:** separate any future script review from browser learning. Require fail-closed scope, explicit authorization for disruptive actions, bounded execution, saved state, and reliable recovery before operational approval. None were run here.

## 6. Accessibility, navigation, and phone use

**Confirmed through browser interaction**

- Top-navigation Hardware Setup and Reporting do nothing; only Home/Modules are handled (`src/components/Navigation.tsx:14–19`; `src/pages/Index.tsx:39–48`). The lesson cards still work.
- Mindset help is visible at desktop width but disappears at 390px (`ModuleView.tsx:79–83`).
- At 320px, document width reached **332px** and the practice control extended beyond the viewport. At 390px, document width matched the viewport. Do not generalize overflow to every phone size.
- The command input has no associated label or `aria-label`. No page runtime errors occurred during these targeted checks.

**Source-confirmed accessibility gaps**

- Terminal updates lack log/live announcements; progress is visual only (`CLISimulator.tsx:243–271`).
- Quiz selection has no checked/pressed semantics (`QuizQuestion.tsx:40–62`).
- Mobile menu lacks an accessible name/expanded state (`Navigation.tsx:51–57`); sidebar disclosures lack expanded state (`src/components/MindsetSidebar.tsx:23–38`).
- Sidebar text is often 10–11px (`MindsetSidebar.tsx:53–70`); animations lack a reduced-motion override (`src/index.css:137–155`). Contrast and screen-reader usability remain unmeasured.
- Only `/` and a catch-all are routed; lesson selection is temporary page state, so stable lesson links/history are absent (`src/App.tsx:16–21`; `Index.tsx:35–52`).

**Recommendation:** phone-accessible help, wrapping controls, readable text, labelled controls, announced feedback, keyboard/focus testing, and user-controlled feedback timing.

## 7. Feasible additive practice

| Browser practice using synthetic data | Separate local authorized hardware lab |
|---|---|
| Interpret AP/client inventories and scope boundaries | Verify the actual adapter, driver, and kernel combination |
| Inspect fabricated frame/event timelines and explain conclusions | Establish actual capture fidelity and radio behavior |
| Diagnose staged configuration and command errors | Validate real service recovery and hardware limitations |
| Compare PMF/WPS/enterprise policy before/after | Test controls on owned/explicitly authorized isolated equipment |
| Pair synthetic WIDS/authentication logs with remediation | Observe real defender telemetry under an approved test plan |
| Write and grade an evidence-based report | Collect actual authorized evidence for the report |

A normal browser cannot operate this Alfa adapter as a monitor-mode radio. Browser exercises can teach decisions safely without adding a real shell or hardware bridge. Advanced software-radio labs can run separately in a local VM, but are not equivalent to browser-only practice or real RF validation.

## 8. Historical story: preserved, not authenticated

The story remains unchanged. It claims “DECLASSIFIED,” a “true story,” and a detailed WiFi/ARP/door-lock/CCTV chain (`src/components/WiFiStory.tsx:11–18,29–59`). Its source line names organizations but provides no traceable article, report identifier, or document (`:77–80`).

**The specific technical chain is unverified—not established fact and not automatically disproved.** General coverage of the event would not substantiate each claimed mechanism. Any future source assessment should be separate from the preserved story and require exact citations for each claim.

## 9. Prioritized recommendations — no implementation authorized

1. **Priority 1: instructional trust and operational safety.** Address confirmed contradictions, false success criteria, deprecated guidance, script scope/recovery risks, and the absence of a tested version matrix.
2. **Priority 2: usable, honest practice.** Fix navigation and duplicate advancement; improve quiz review, answer balance, accessibility, phone help, and completion semantics.
3. **Priority 3: additive depth.** Add reporting and full-engagement simulations, deepen one-step advanced labs, and pair every lesson with defensive evidence and retesting.
4. **Priority 4: maintainability.** Reconcile lockfiles, plan supported dependency upgrades, and replace placeholder tests with behavior/learning-rule checks.

All recommendations preserve the existing 17 lessons and historical story. Any implementation requires a separate scope decision.

### Authoritative references checked

- Driver README: https://github.com/aircrack-ng/rtl8812au
- Wacker argument parser: https://github.com/blunderbuss-wctf/wacker/blob/master/wacker.py
- Aircrack-ng help/source: https://github.com/aircrack-ng/aircrack-ng/blob/master/src/aircrack-ng/aircrack-ng.c
- Vite support policy: https://vite.dev/releases

Upstream references were retrieved during this review; changing upstream branches are not pinned historical releases. No comprehensive dependency-vulnerability scan, hardware test, or independent historical verification was performed.
