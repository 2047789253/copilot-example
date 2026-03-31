---
description: "Generate comprehensive unit tests for selected code. Use when you need test cases with edge cases, error scenarios, and mocking."
argument-hint: "Paste your function or class code here"
---

# Generate Unit Tests

Generate comprehensive unit tests for the provided code with the following requirements:

## Test Coverage
- **Happy path**: Normal usage scenarios
- **Edge cases**: Boundary conditions, empty inputs, null values
- **Error scenarios**: Exception handling, invalid inputs
- **Mocking**: Mock external dependencies (APIs, databases, file systems)

## Best Practices
- Use descriptive test names following: `test[FunctionName][Scenario][Expected]`
- Include setup/teardown when needed
- Group related tests using test suites or describe blocks
- Add comments explaining complex test logic
- Keep tests focused and independent

## Test Framework
Detect the language and framework from the provided code:
- **JavaScript/TypeScript**: Jest, Vitest, or Mocha
- **Python**: pytest or unittest
- **Java**: JUnit or TestNG
- **Go**: testing package

## Output Format
```
[Language] - [Framework]

// Setup/imports
[necessary imports and setup]

// Test suite with multiple test cases
[test_case_1]
[test_case_2]
[test_case_3]
...
```

---

Paste your code below to generate tests:
