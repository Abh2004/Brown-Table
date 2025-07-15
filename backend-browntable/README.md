# The Brown Table - Backend API

Backend API for The Brown Table restaurant booking and group ordering platform.

## Features

- **Group Management**: Create and manage dining groups
- **Menu System**: Multiple menu categories (starters, mains, beverages)
- **Order Management**: Real-time group ordering with member-specific items
- **Invite System**: Generate and share group invitation links
- **Real-time Updates**: Track order changes by group members

## API Endpoints

### Groups
- `POST /api/groups/create-group` - Create a new group
- `GET /api/groups/:groupId` - Get group details
- `PUT /api/groups/:groupId/update` - Update group details
- `GET /api/groups/:groupId/group-order` - Get group order details

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/menu1` - Get starters & appetizers
- `GET /api/menu/menu2` - Get mains & entrees
- `GET /api/menu/menu3` - Get beverages
- `GET /api/menu/item/:itemId` - Get specific menu item

### Orders
- `POST /api/orders/:groupId/update-order` - Update group order
- `GET /api/orders/:groupId` - Get group order
- `PUT /api/orders/:orderId/status` - Update order status
- `DELETE /api/orders/:groupId/item/:itemId` - Remove item from order

### Invites
- `POST /api/invites/invite-member` - Generate invite link
- `POST /api/invites/join` - Join group using invite code
- `GET /api/invites/group/:inviteCode` - Get group info by invite code
- `POST /api/invites/accept/:groupId` - Accept group invitation

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

3. **Setup MongoDB:**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud)
   - Update `MONGODB_URI` in `.env`

4. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/browntable
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h
INVITE_LINK_EXPIRES_IN=168h
MAX_GROUP_MEMBERS=10
```

## Database Models

### Group
- Group information, members, and booking details
- Supports up to 20 members per group
- Tracks admin permissions and member acceptance status

### User
- User profiles with avatar and preferences
- Automatic color assignment for group visualization

### Order
- Group orders with items organized by member
- Automatic calculation of totals, service charges, and taxes
- Real-time status tracking

### MenuItem
- Menu items with categories, pricing, and dietary information
- Support for availability and nutritional data

## Frontend Integration

The API is designed to work seamlessly with the React frontend. Key integration points:

1. **Context Sync**: API responses match frontend context structures
2. **Real-time Updates**: Order changes reflect immediately across all group members
3. **Invite Flow**: Shareable links for easy group joining
4. **Menu Structure**: Hierarchical menu organization matching frontend components

## Development

```bash
# Start with hot reload
npm run dev

# Check API health
curl http://localhost:3001/api/health
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secret
4. Configure proper CORS origins
5. Set up process manager (PM2, Docker, etc.)

## License

MIT License 