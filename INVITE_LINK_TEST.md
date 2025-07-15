# Invite Link Testing Guide

## How to Test the Invite Link Feature

### Step 1: Create a Group and Get Invite Link
1. Start the application (`npm run dev` in frontend-browntable)
2. Login/signup as User A
3. Go to `/booking` and create a group
4. Click "Invite members" → this takes you to `/invite`
5. Copy the invite link from the page (it will look like `http://localhost:5173/join?code=abc123`)

### Step 2: Test with Unauthenticated User
1. Open a new incognito/private browser window
2. Paste the invite link directly in the address bar
3. **Expected behavior**: 
   - Should redirect to login page
   - After login/signup, should automatically join the group
   - Should land on group order page

### Step 3: Test with Authenticated User
1. Login as User B in a regular browser window
2. Paste the invite link directly in the address bar
3. **Expected behavior**:
   - Should show "Join Group Order" page
   - Should join the group after clicking "Join Group"
   - Should land on group order page

## Console Logging
The implementation includes detailed console logging with emojis:
- 🔒 User not authenticated
- 🔑 Login successful  
- 🎫 Found pending invite code
- 🔍 Checking for auto-join
- ✨ Auto-joining group
- 🎯 Navigating to group order page

Check the browser console to see the flow in action.

## Key Features Implemented
- [x] Invite links work for unauthenticated users
- [x] Automatic redirect to login/signup
- [x] Preserve invite code during authentication
- [x] Auto-join after authentication
- [x] Support for both login and signup flows
- [x] Navigate to group order page after joining
- [x] Proper error handling and loading states

## File Changes Made
- `JoinGroupPage.tsx` - Main invite logic
- `LoginPage.tsx` - Handle pending invites after login
- `SignupPage.tsx` - Handle pending invites after signup
- `App.tsx` - Made /join route public (not protected)

## Testing URLs
Replace `abc123` with actual invite codes:
- `http://localhost:5173/join?code=abc123`
- Test with different invite codes
- Test with invalid/expired codes 