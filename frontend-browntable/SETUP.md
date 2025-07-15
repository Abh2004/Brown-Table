# Frontend-Backend Integration Setup

This document explains how to connect the React frontend with the Express.js backend.

## Prerequisites

1. Backend server running on `http://localhost:3001`
2. MongoDB database connected
3. Frontend development server

## Setup Steps

### 1. Install Dependencies

```bash
cd frontend-browntable
npm install
```

This will install the newly added `axios` dependency for API calls.

### 2. Environment Configuration

Create a `.env` file in the frontend root:

```bash
# frontend-browntable/.env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. Start Backend Server

```bash
cd ../backend-browntable
npm run dev
```

Backend should be running on `http://localhost:3001`

### 4. Start Frontend Server

```bash
cd ../frontend-browntable
npm run dev
```

Frontend should be running on `http://localhost:5173`

## Integration Features

### ✅ Implemented

1. **Group Management**
   - Create group with booking details
   - Join group using invite codes
   - Load group information
   - Generate invite links

2. **Menu System**
   - Fetch menu data from backend
   - Fallback to local data if backend fails
   - Real-time menu loading

3. **Order Management**
   - Sync cart with backend automatically
   - Update group orders in real-time
   - Member-specific order tracking

4. **API Integration**
   - Comprehensive API service layer
   - Error handling and loading states
   - Request/response logging

### 🔄 API Endpoints Used

- `POST /api/groups/create-group` - Create new group
- `GET /api/groups/:groupId` - Get group details
- `GET /api/menu` - Get menu data
- `POST /api/orders/:groupId/update-order` - Update group order
- `POST /api/invites/join` - Join group via invite
- `POST /api/invites/invite-member` - Generate invite link

### 🎯 Key Files Modified

- `src/services/api.ts` - API service layer
- `src/context/BookingContext.tsx` - Backend integration for orders
- `src/context/groupMemebersContext.tsx` - Backend integration for groups
- `src/hooks/useMenu.ts` - Menu data fetching
- `src/components/BookingInterface.tsx` - Group creation
- `src/components/MenuItems.tsx` - Menu integration
- `src/components/JoinGroupPage.tsx` - Join group functionality

## Testing the Integration

### 1. Create a Group

1. Go to `/booking`
2. Fill in arrival/departure times and date
3. Click "Invite members" or "Order for all"
4. Group should be created in backend
5. Check backend logs for group creation confirmation

### 2. Menu Loading

1. Go to `/menu`
2. Menu items should load from backend
3. If backend fails, fallback to local data
4. Check browser network tab for API calls

### 3. Add Items to Cart

1. Add items to cart from menu
2. Cart changes should sync with backend automatically
3. Check backend logs for order update calls

### 4. Join Group (Future)

1. Use invite link from created group
2. Fill in name and join
3. Should appear in group members list

## Development Notes

- API calls are automatically logged to console
- Error handling with user-friendly messages
- Loading states for better UX
- Automatic fallback to demo data when backend unavailable
- Debounced API calls to prevent spam

## Production Considerations

- Update `VITE_API_BASE_URL` for production backend
- Implement proper user authentication
- Add retry logic for failed API calls
- Implement proper error boundaries
- Add offline support capabilities 