# Missing Translations - Quick Fix Guide

## Issue
The following hardcoded text elements are NOT translating when you switch languages:

### Landing Page
1. **Features Section**:
   - "AI-Powered" + description
   - "Privacy First" + description  
   - "Instant Results" + description
   - "Fully Encrypted" + description

2. **FAQ Section**:
   - "Common questions" heading
   - "Everything you need to know..." subtitle
   - All 4 FAQ questions and answers

3. **"Powered by Advanced AI" chip**

### Upload Page
1. **"How It Works" card**:
   - Title and description
   - Step descriptions

2. **Upload section**:
   - "Upload Your Document"
   - "Supported formats: JPG, PNG, PDF (max 10MB)"
   - "Drag and drop here, or use the buttons below"
   - "Browse files" button
   - "Open camera" button

3. **Privacy notice**:
   - "Privacy First:" heading
   - Description text

4. **Bottom buttons**:
   - "Back to Home"
   - "Recent Results"
   - "View History"

### Recent/Results Pages
1. Error messages
2. "What you can do:" heading
3. Button text ("Upload a New Document", "View All History", "Back to Home")

### Dashboard
1. "Welcome back, [name]" text
2. Table headers ("Date", "Type", "Summary", "Confidence", "Actions")
3. "Analysis History" heading
4. Button text

## Solution

These elements are hardcoded in the components and need to:
1. Have translation keys added to `lib/translations.ts`
2. Be updated in the components to use `t('key')` instead of hardcoded text

## Quick Fix Priority

**HIGH PRIORITY** (most visible):
1. Landing page features
2. Landing page FAQ
3. Upload page "How It Works"
4. Dashboard welcome message

**MEDIUM PRIORITY**:
5. Upload page buttons and text
6. Recent/Results page messages

**LOW PRIORITY**:
7. Table headers
8. Minor UI text

Would you like me to add all these translation keys and update the components?
