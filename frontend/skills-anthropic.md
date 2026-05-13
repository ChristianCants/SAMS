# anthropics/skills — skill-creator (1 skill)
Source: https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md

## Skill Development
- **anthropic-skill-creator** - The official Anthropic guide for creating, testing, evaluating, and iteratively improving Claude Skills. Covers the full lifecycle:
  - **Drafting**: Capturing intent, interviewing for requirements, writing SKILL.md with proper frontmatter and structure.
  - **Testing**: Running test cases with and without the skill (with and without baselines), spawning parallel subagents.
  - **Evaluation**: Quantitative benchmarking, qualitative review via the eval viewer, grading assertions against outputs.
  - **Iteration**: Improving skills based on feedback, running multiple iteration loops, blind A/B comparisons.
  - **Description Optimization**: Generating trigger eval queries, running the optimization loop to maximize skill triggering accuracy.
  - **Packaging**: Bundling the final skill into a `.skill` file for distribution and installation.
  - Platform-specific guidance for Claude.ai, Claude Code, and Cowork environments.
