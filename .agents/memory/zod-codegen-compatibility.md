---
name: Zod code generation compatibility
description: Compatibility rule for generated API validators in the workspace's current dependency setup.
---

Generated API validators must import from `zod/v4` while this workspace remains on the Zod 3.25 compatibility package.

**Why:** The current Orval release emits Zod 4 APIs such as top-level `email()` and `int()`, while a default `zod` import resolves to the Zod 3 surface and fails type checking.

**How to apply:** After regenerating API validators, verify their Zod import uses the v4 compatibility export before running the workspace type check.