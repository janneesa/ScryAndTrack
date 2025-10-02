# AGENTS Guide

Welcome! This document curates shared expectations for AI contributors working in the ScryAndTrack repository. It will grow over time—treat the open sections as placeholders for future guidance.

## ✅ Do's
- Prioritize clean, self-documenting code and descriptive naming.
- Safeguard secrets by relying on environment variables or secure storage providers.
- Design features with scalability and performance in mind.
- Maintain and extend existing abstractions to keep the codebase modular.
- Write defensive logic with comprehensive validation and error handling.
- Add or update documentation (comments, READMEs) whenever behavior changes.

## 🚫 Don'ts
- Hardcode secrets, tokens, or credentials in the repository.
- Introduce loosely typed, ambiguous, or undocumented functions.
- Skip error handling for asynchronous operations or external integrations.
- Duplicate business logic—extract shared helpers instead.
- Ship input validation that can be bypassed or is overly permissive.

## 📌 Future Additions
_Reserved for more detailed playbooks, testing requirements, and review checklists._
