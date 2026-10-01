# Security Specification: G-Compass Firestore Security

## 1. Data Invariants
- `test_results/{resultId}`: Anyone can submit a new assessment record if the payload has valid string sizes and required fields.
- `test_results` read/list/delete: Protected. Can be read by anyone for individual results lookup with ID, or by admin.
- `settings/{settingId}`: Anyone can read application status (`isAppActive`) to see if tests are currently open. Updates allowed for settings configuration.

## 2. Payloads & Validation Rules
- Document IDs must satisfy `isValidId(id)`: length <= 128 characters, matching `^[a-zA-Z0-9_\-]+$`.
- Strings must satisfy length limits to prevent Denial of Wallet attacks.
- Settings document must have valid boolean `isAppActive` and non-empty `schoolName`.
