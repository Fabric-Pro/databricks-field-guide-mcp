---
name: learn-databricks
description: Teach Databricks concepts interactively, walk through diagrams, quiz understanding, or follow a role-based learning path.
---

<!-- heddle: pending #217 -->

Read [the session contract](../common.md).

1. For a named concept, call explore_concept. For a chapter, call start_here
   with topic. For a general request to learn, call start_here without arguments.
   For a requested role-based curriculum, call learn_path.
2. Open the returned card where supported. In text, teach one idea, ask one
   check question and wait. Explain mistakes from the cited section.
3. Use quiz_me to practice the topic. Send the reader's actual answers back
   to score them, then offer to revisit the missed topics.

Done for this turn: a working card or one question awaiting the learner.
At the session's end, give the score, weak topics and next step.
