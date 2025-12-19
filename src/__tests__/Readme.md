# Capture App – API Test Strategy

## 1. Purpose

This document defines the test strategy for **automated API testing** of the Capture App backend services.

The objective of API testing is to ensure that backend endpoints correctly implement business logic, handle data persistence, and return appropriate responses under both normal and error conditions.

Detailed API test cases are maintained in a separate Test Case document and are referenced from this strategy.

---

## 2. Scope

### In Scope
- Employee creation endpoints
- Review retrieval endpoints
- Review submission endpoints
- Request and response payload validation
- HTTP status code validation
- Error handling and edge cases
- Integration with MySQL database

### Out of Scope
- UI rendering and client-side behavior
- Database schema design validation
- Performance, load, and security testing

---

## 3. Test Approach

### Test Type
- Automated API testing
- Integration testing with real dependencies

### Frameworks & Tools
- **Vitest** – test runner and assertions
- **Supertest** – HTTP request execution

### Execution Model
- API server is started as part of test execution
- Tests run against a real MySQL test database
- Core dependencies (API, DB) are **not mocked**
- External services, if any, may be stubbed

---

## 4. Test Environment

| Component | Description |
|----------|-------------|
| API | Node.js + Express |
| Database | MySQL (dedicated test database) |
| Configuration | Test-specific environment variables |

---

## 5. Test Data Management

- Test data created dynamically via API calls
- Unique employee records generated per test
- Test data isolated per test run
- Cleanup performed via:
  - Teardown scripts
  - Database reset or truncation strategies

---

## 6. Entry and Exit Criteria

### Entry Criteria
- API service is running or can be started by tests
- Test database is accessible
- Environment configuration is available

### Exit Criteria
- All critical and high-priority API tests pass
- No unresolved critical API defects
- Regression test suite completed successfully

---

## 7. Defect Management

- Defects logged with:
  - Request and response payloads
  - Expected vs actual results
  - Relevant logs or stack traces
- Defects classified by severity:
  - Critical
  - High
  - Medium
  - Low

---

## 8. Test Artefacts

- Automated API test suite
- Test execution reports
- Defect reports
- Linked API test case documentation

---

## 9. Ownership and Maintenance

- API tests are maintained alongside backend code
- Tests are updated as endpoints or business logic change
- Failing tests must be investigated before release

---

## 10. Notes

This strategy supports end-to-end validation when combined with UI and Database test strategies.
