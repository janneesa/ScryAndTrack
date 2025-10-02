## Do's

- Prioritize clean, self-documenting code and descriptive naming.
- Add doc style comments explaining functions and attributes.
- Safeguard secrets by relying on environment variables or secure storage providers.
- Design features with scalability and performance in mind.
- Maintain and extend existing abstractions to keep the codebase modular.
- Write defensive logic with comprehensive validation and error handling.
- Add or update documentation (comments, READMEs) whenever behavior changes.
- Use tailwind custom classes and variables if they are defined.

## Don'ts

- Hardcode secrets, tokens, or credentials in the repository.
- Introduce loosely typed, ambiguous, or undocumented functions.
- Skip error handling for asynchronous operations or external integrations.
- Duplicate business logic—extract shared helpers instead.
- Ship input validation that can be bypassed or is overly permissive.
