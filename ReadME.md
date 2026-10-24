# AZ-900 Readiness Tracker (Unofficial)

A dashboard that turns practice scores into a clear answer to "Am I ready for AZ-900?" and tells the learner what to study next.

> **Unofficial.** Not affiliated with or endorsed by Microsoft. All questions are original and based on the public [AZ-900 skills outline on Microsoft Learn](https://learn.microsoft.com/credentials/certifications/azure-fundamentals/). No real exam questions, no Microsoft logos.

Built for the "Building Smarter Exam Prep Tools from Our Own Learning Journey" challenge (Progress: Readiness Tracker).

## Features
- **Practice tab:** 5-question sets per topic, shuffled answers, instant feedback and an explanation after every answer
- **Overall readiness score:** weighted by each topic's share of the exam (midpoints of Microsoft's published ranges)
- **Per-topic bars:** score, attempts, trend arrow and an 80% target marker
- **Status labels:** Exam-ready (80%+), Almost there (65-79%), Needs work (below 65%)
- **"Study next" recommendation:** points to your weakest or untouched topic
- **Exam-date countdown**
- **Log scores from other practice tests** (e.g. 7 out of 10)
- Progress saved in the browser (localStorage), light/dark mode, mobile friendly, no dependencies

## How readiness is calculated
For each topic, the score is the pooled accuracy of the last 3 attempts, so recent progress counts more than old mistakes. The overall score is the weighted average of topics you have attempted. The 80% target is a self-set safety margin, not an official pass mark.

## Run locally
Open `index.html` in any browser. No build step.



## Deploy (GitHub Pages)
Settings → Pages → Deploy from branch → `main` / root.

## Add questions
Edit the `Q` array in `index.html`: `[topic, question, correct, wrong1, wrong2, wrong3, explanation]`, where topic is `C`, `A` or `G`.

## License
MIT