# Admin Portal Integration - Design Document

## Overview

This design document outlines the comprehensive integration of the admin portal for the Maharaja Palace Hotel Management System. The admin portal provides a unified interface for managing all hotel operations including rooms, bookings, banquet halls, restaurant tables, and users. The design focuses on connecting all UI components to their respective backend APIs with proper state management, error handling, and real-time data updates.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Portal (React)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │  Rooms   │  │ Bookings │  │  Users   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐                                │
│  │ Banquet  │  │Restaurant│                                │
│  └──────────┘  └──────────┘                                │
├─────────────────────────────────────────────────────────────┤
│              API Layer (axios with interceptors)            │
├─────────────────────────────────────────────────────────────┤
│                    Backend REST APIs                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │  Rooms   │  │ Bookings │  │ Banquet  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐                                               │
│  │Restaurant│                                               │
│  └──────────┘                                               │
├─────────────────────────────────────────────────────────────┤
│                    MongoDB Database                          │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

The admin portal follows a modular component architecture:

1. **AdminPage**: Main container with tab navigation
2. **Dashboard**: Overview with statistics and quick actions
3. **AdminRooms**: Room type and individual room management
4. **AdminBookings**: Unified booking management across all types
5. **AdminUsers**: User account management
6. **AdminBanquet**: Banquet hall management
7. **AdminRestaurant**: Restaurant table management

## Components and Interfaces

### 1. Dashboard Component

**Purpose**: Display real-time statistics and provide quick navigation

**State Management**:
```javascript
{
  stats: {
    totalUsers: number,
    activeBookings: number,
    todayRevenue: number,
    occupancyRate: number
  },
  loading: boolean,
  error: string | null
}
```

**API Integrations**:
- `GET /api/auth/users` - Fetch total users
- `GET /api/bookings` - Fetch all room bookings
- `GET /api/banquet/bookings` - Fetch banquet bookings
- `GET /api/restaurant/bookings` - Fetch restaurant bookings
- `GET /api/rooms` - Fetch all rooms for occupancy calculation

**Key Functions**:
- `loadDashboardStats()`: Aggregates data from multiple endpoints
- `calculateOccupancyRate()`: Computes current occupancy percentage
- `calculateTodayRevenue()`: Sums completed bookings for current day

### 2. AdminRooms Component

**Purpose**: Manage room types and individual rooms

**State Management**:
```javascript
{
  activeView: 'types' | 'rooms',
  roomTypes: RoomType[],
  rooms: Room[],
  loading: boolean,
  showModal: boolean,
  modalMode: 'create' | 'edit' | 'view',
  selectedItem: RoomType | Room | null,
  formData: RoomTypeFormData | RoomFormData
}
```

**API Integrations**:
- `GET /api/rooms/room-types` - Fetch all room types
- `POST /api/rooms/room-types` - Create new room type
- `PUT /api/rooms/room-types/:id` - Update room type
- `DELETE /api/rooms/room-types/:id` - Delete room type
- `GET /api/rooms` - Fetch all rooms
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room
- `PUT /api/rooms/:id/status` - Update room status
- `DELETE /api/rooms/:id` - Delete room

**Key Functions**:
- `handleCreateRoomType()`: Opens modal for new room type
- `handleSaveRoomType()`: Submits room type to backend
- `handleEditRoomType(id)`: Loads room type data for editing
- `handleDeleteRoomType(id)`: Deletes room type with confirmation
- `handleCreateRoom()`: Opens modal for new room
- `handleSaveRoom()`: Submits room to backend
- `handleUpdateRoomStatus(id, status)`: Updates room status immediately
- `handleEditRoom(id)`: Loads room data for editing
- `handleDeleteRoom(id)`: Deletes room with confirmation

### 3. AdminBookings Component

**Purpose**: View and manage all bookings across all types

**State Management**:
```javascript
{
  bookings: UnifiedBooking[],
  loading: boolean,
  filter: 'all' | 'room' | 'banquet' | 'restaurant',
  selectedBooking: UnifiedBooking | null,
  showDetails: boolean
}
```

**API Integrations**:
- `GET /api/bookings` - Fetch all room bookings
- `GET /api/banquet/bookings` - Fetch all banquet bookings
- `GET /api/restaurant/bookings` - Fetch all restaurant bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking

**Key Functions**:
- `loadAllBookings()`: Fetches and merges bookings from all sources
- `filterBookings(type)`: Filters bookings by type
- `calculateStats()`: Computes booking statistics
- `exportBookings()`: Generates CSV export
- `handleViewDetails(id)`: Shows detailed booking information
- `handleUpdateStatus(id, status)`: Updates booking status

### 4. AdminUsers Component

**Purpose**: View and manage user accounts

**State Management**:
```javascript
{
  users: User[],
  loading: boolean,
  selectedUser: User | null,
  showDetails: boolean,
  userBookings: Booking[]
}
```

**API Integrations**:
- `GET /api/auth/users` - Fetch all users
- `GET /api/auth/users/:id` - Fetch user details
- `GET /api/bookings/user/:userId` - Fetch user's bookings
- `PUT /api/auth/users/:id` - Update user details
- `PUT /api/auth/users/:id/status` - Activate/deactivate user

**Key Functions**:
- `loadUsers()`: Fetches all users from backend
- `handleViewUser(id)`: Shows detailed user information
- `loadUserBookings(userId)`: Fetches user's booking history
- `handleUpdateUser(id, data)`: Updates user information
- `handleToggleUserStatus(id)`: Activates/deactivates user account

### 5. AdminBanquet Component

**Purpose**: Manage banquet halls

**State Management**:
```javascript
{
  halls: BanquetHall[],
  loading: boolean,
  showForm: boolean,
  formData: BanquetHallFormData,
  editingHall: BanquetHall | null
}
```

**API Integrations**:
- `GET /api/banquet/halls` - Fetch all halls
- `POST /api/banquet/halls` - Create new hall
- `PUT /api/banquet/halls/:id` - Update hall
- `DELETE /api/banquet/halls/:id` - Delete hall

**Key Functions**:
- `loadHalls()`: Fetches all banquet halls
- `handleCreateHall()`: Opens form for new hall
- `handleSaveHall()`: Submits hall data to backend
- `handleEditHall(id)`: Loads hall data for editing
- `handleDeleteHall(id)`: Deletes hall with confirmation

### 6. AdminRestaurant Component

**Purpose**: Manage restaurant tables

**State Management**:
```javascript
{
  tables: RestaurantTable[],
  loading: boolean,
  showForm: boolean,
  formData: RestaurantTableFormData,
  editingTable: RestaurantTable | null
}
```

**API Integrations**:
- `GET /api/restaurant/tables` - Fetch all tables
- `POST /api/restaurant/tables` - Create new table
- `PUT /api/restaurant/tables/:id` - Update table
- `DELETE /api/restaurant/tables/:id` - Delete table

**Key Functions**:
- `loadTables()`: Fetches all restaurant tables
- `handleCreateTable()`: Opens form for new table
- `handleSaveTable()`: Submits table data to backend
- `handleEditTable(id)`: Loads table data for editing
- `handleDeleteTable(id)`: Deletes table with confirmation

## Data Models

### UnifiedBooking
```javascript
{
  _id: string,
  type: 'room' | 'banquet' | 'restaurant',
  bookingNumber: string,
  guest: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string
  },
  checkInDate?: Date,
  checkOutDate?: Date,
  eventDate?: Date,
  bookingDate?: Date,
  totalPrice: number,
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'completed' | 'cancelled',
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded',
  createdAt: Date
}
```

### RoomTypeFormData
```javascript
{
  name: string,
  description: string,
  basePrice: number,
  maxOccupancy: number,
  squareFeet: number,
  amenities: string[],
  features: string[],
  images: { url: string, alt: string }[]
}
```

### RoomFormData
```javascript
{
  roomNumber: string,
  roomType: string, // ObjectId reference
  floor: number,
  currentPrice: number,
  status: 'available' | 'occupied' | 'maintenance' | 'reserved'
}
```

### BanquetHallFormData
```javascript
{
  name: string,
  capacity: number,
  basePrice: number,
  description: string,
  amenities: string[]
}
```

### RestaurantTableFormData
```javascript
{
  tableNumber: string,
  capacity: number,
  location: string,
  description: string
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Booking aggregation completeness
*For any* set of room bookings, banquet bookings, and restaurant bookings, the dashboard and bookings page should display the sum of all three counts as the total active bookings.
**Validates: Requirements 1.2, 4.1**

### Property 2: Revenue calculation accuracy
*For any* set of bookings with payment status 'completed', the displayed revenue should equal the sum of all totalPrice values from those bookings.
**Validates: Requirements 1.3, 4.3**

### Property 3: Occupancy rate calculation
*For any* set of rooms and current bookings, the occupancy rate should equal (number of occupied rooms / total rooms) * 100.
**Validates: Requirements 1.4**

### Property 4: Room type creation persistence
*For any* valid room type data submitted through the form, after successful creation, fetching the room types list should include the newly created room type with matching data.
**Validates: Requirements 2.2**

### Property 5: Edit form data population
*For any* room type selected for editing, the form fields should be populated with values that exactly match the room type's current data.
**Validates: Requirements 2.3, 3.4, 6.4, 7.4**

### Property 6: Room type update persistence
*For any* room type update submitted, after successful update, fetching the room type should return the updated values.
**Validates: Requirements 2.4**

### Property 7: Room type view completeness
*For any* room type viewed in detail mode, all fields including amenities array and images array should be displayed.
**Validates: Requirements 2.5**

### Property 8: Room creation persistence
*For any* valid room data submitted, after successful creation, fetching the rooms list should include the newly created room.
**Validates: Requirements 3.2**

### Property 9: Room status update immediacy
*For any* room status change via dropdown, the system should immediately send a PUT request and update the UI to reflect the new status.
**Validates: Requirements 3.3**

### Property 10: Booking filter correctness
*For any* booking type filter selected, the displayed bookings should only include bookings where the type field matches the selected filter.
**Validates: Requirements 4.2**

### Property 11: Booking statistics accuracy
*For any* set of bookings, the statistics should correctly calculate: total count, confirmed count (status === 'confirmed'), pending count (status === 'pending'), and total revenue (sum of completed payments).
**Validates: Requirements 4.3**

### Property 12: Booking detail completeness
*For any* booking selected for detail view, all booking fields including guest information, dates, price, status, and payment status should be displayed.
**Validates: Requirements 4.5**

### Property 13: User list completeness
*For any* set of users returned from the backend, the users page should display all users with their name, email, phone, role, and registration date.
**Validates: Requirements 5.1, 5.2**

### Property 14: User detail with booking history
*For any* user selected for detail view, the system should display the user's information and fetch their complete booking history from all booking types.
**Validates: Requirements 5.3**

### Property 15: Banquet hall creation persistence
*For any* valid banquet hall data submitted, after successful creation, fetching the halls list should include the newly created hall.
**Validates: Requirements 6.2**

### Property 16: Banquet hall list completeness
*For any* set of halls returned from the backend, the halls page should display all halls with their name, capacity, price, and description.
**Validates: Requirements 6.3**

### Property 17: Banquet hall update persistence
*For any* hall update submitted, after successful update, fetching the hall should return the updated values.
**Validates: Requirements 6.5**

### Property 18: Restaurant table creation persistence
*For any* valid table data submitted, after successful creation, fetching the tables list should include the newly created table.
**Validates: Requirements 7.2**

### Property 19: Restaurant table list with status
*For any* set of tables returned from the backend, the tables page should display all tables with their number, capacity, location, and current status.
**Validates: Requirements 7.3**

### Property 20: Restaurant table update persistence
*For any* table update submitted, after successful update, fetching the table should return the updated values.
**Validates: Requirements 7.5**

### Property 21: API success handling
*For any* successful API operation, the UI should update to reflect the new data and optionally display a success message.
**Validates: Requirements 8.2**

### Property 22: API error handling
*For any* failed API operation, the system should display an error message containing details about the failure.
**Validates: Requirements 8.3**

### Property 23: Authentication token inclusion
*For any* API request made by an authenticated admin, the request headers should include the authentication token.
**Validates: Requirements 10.3**

## Error Handling

### Error Categories

1. **Network Errors**
   - Connection timeout
   - Server unreachable
   - DNS resolution failure
   
   **Handling**: Display user-friendly message with retry option, maintain current UI state

2. **Authentication Errors (401)**
   - Token expired
   - Invalid token
   - Missing token
   
   **Handling**: Clear local storage, redirect to login page, display session expired message

3. **Authorization Errors (403)**
   - Insufficient permissions
   - Non-admin user attempting admin action
   
   **Handling**: Display permission denied message, redirect to appropriate page

4. **Validation Errors (400)**
   - Invalid form data
   - Missing required fields
   - Data type mismatches
   
   **Handling**: Display field-specific error messages, highlight invalid fields, prevent submission

5. **Resource Not Found (404)**
   - Deleted resource
   - Invalid ID
   
   **Handling**: Display not found message, redirect to list view, refresh data

6. **Server Errors (500)**
   - Database errors
   - Internal server errors
   
   **Handling**: Display generic error message, log error details, provide retry option

### Error Handling Implementation

```javascript
// Global error handler in API interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Authentication error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Authorization error
      showToast('You do not have permission to perform this action', 'error');
    } else if (error.response?.status === 400) {
      // Validation error
      return Promise.reject(error.response.data);
    } else if (error.response?.status === 404) {
      // Not found
      showToast('Resource not found', 'error');
    } else if (error.response?.status >= 500) {
      // Server error
      showToast('Server error. Please try again later.', 'error');
    } else if (error.request) {
      // Network error
      showToast('Network error. Please check your connection.', 'error');
    }
    return Promise.reject(error);
  }
);
```

### Component-Level Error Handling

Each component should implement:

1. **Try-Catch Blocks**: Wrap all API calls in try-catch
2. **Error State**: Maintain error state for displaying messages
3. **Loading State**: Show loading indicators during operations
4. **Optimistic Updates**: Update UI immediately, rollback on error
5. **User Feedback**: Display clear, actionable error messages

Example:
```javascript
const handleSaveRoom = async () => {
  setLoading(true);
  setError(null);
  
  try {
    await roomAPI.createRoom(formData);
    setShowModal(false);
    await loadData(); // Refresh list
    showToast('Room created successfully', 'success');
  } catch (error) {
    setError(error.response?.data?.message || 'Failed to create room');
    showToast('Failed to create room', 'error');
  } finally {
    setLoading(false);
  }
};
```

## Testing Strategy

### Unit Testing

Unit tests will verify specific component behaviors and edge cases:

1. **Component Rendering Tests**
   - Dashboard renders with loading state
   - Modal opens with correct form fields
   - Tables display correct columns
   - Cards display all required information

2. **State Management Tests**
   - State updates correctly on user actions
   - Form data updates on input changes
   - Filter state changes on button clicks
   - Modal state toggles correctly

3. **Calculation Tests**
   - Revenue calculation with various booking sets
   - Occupancy rate calculation with different room counts
   - Statistics calculation with edge cases (empty arrays, null values)

4. **Error Handling Tests**
   - Error messages display on API failures
   - Loading states show during operations
   - Optimistic updates rollback on errors

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** for JavaScript:

**Configuration**: Each property test will run a minimum of 100 iterations to ensure comprehensive coverage.

**Test Tagging**: Each property-based test will be tagged with a comment in this format:
```javascript
// **Feature: admin-portal-integration, Property 1: Booking aggregation completeness**
```

1. **Property 1: Booking aggregation completeness**
   - Generate random sets of room, banquet, and restaurant bookings
   - Verify total count equals sum of all three types
   - Tag: `**Feature: admin-portal-integration, Property 1: Booking aggregation completeness**`

2. **Property 2: Revenue calculation accuracy**
   - Generate random bookings with various prices and payment statuses
   - Verify revenue equals sum of completed booking prices
   - Tag: `**Feature: admin-portal-integration, Property 2: Revenue calculation accuracy**`

3. **Property 3: Occupancy rate calculation**
   - Generate random room sets and booking combinations
   - Verify occupancy rate formula: (occupied / total) * 100
   - Tag: `**Feature: admin-portal-integration, Property 3: Occupancy rate calculation**`

4. **Property 5: Edit form data population**
   - Generate random room types, rooms, halls, and tables
   - Verify form fields match selected item's data exactly
   - Tag: `**Feature: admin-portal-integration, Property 5: Edit form data population**`

5. **Property 10: Booking filter correctness**
   - Generate random mixed booking arrays
   - Apply each filter type
   - Verify filtered results only contain matching type
   - Tag: `**Feature: admin-portal-integration, Property 10: Booking filter correctness**`

6. **Property 11: Booking statistics accuracy**
   - Generate random booking sets with various statuses
   - Verify all statistics (total, confirmed, pending, revenue) are correct
   - Tag: `**Feature: admin-portal-integration, Property 11: Booking statistics accuracy**`

7. **Property 23: Authentication token inclusion**
   - Generate random API requests
   - Verify all requests include Authorization header with token
   - Tag: `**Feature: admin-portal-integration, Property 23: Authentication token inclusion**`

### Integration Testing

Integration tests will verify end-to-end workflows:

1. **Room Management Flow**
   - Create room type → Create room → Update status → View details
   - Verify data persistence across operations

2. **Booking Management Flow**
   - Load all bookings → Apply filters → View details → Export
   - Verify data consistency and filtering

3. **User Management Flow**
   - Load users → View user details → Load user bookings
   - Verify related data loading

4. **Authentication Flow**
   - Login as admin → Access admin routes → Token expiry → Redirect
   - Verify authorization checks

### Testing Tools

- **Unit Tests**: Jest + React Testing Library
- **Property-Based Tests**: fast-check
- **Integration Tests**: Cypress or Playwright
- **API Mocking**: MSW (Mock Service Worker)
- **Test Coverage**: Aim for 80%+ coverage on critical paths

## Implementation Notes

### State Management Approach

The admin portal uses React hooks for local state management:

- `useState` for component-level state
- `useEffect` for data fetching and side effects
- No global state management needed (Redux/Context) as components are independent

### API Call Patterns

All API calls follow this pattern:

```javascript
const loadData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await api.getData();
    setData(response.data);
  } catch (error) {
    setError(error.message);
    console.error('Error loading data:', error);
  } finally {
    setLoading(false);
  }
};
```

### Optimistic Updates

For immediate feedback, use optimistic updates:

```javascript
const handleUpdateStatus = async (id, newStatus) => {
  // Optimistic update
  const oldData = [...data];
  setData(data.map(item => 
    item._id === id ? { ...item, status: newStatus } : item
  ));
  
  try {
    await api.updateStatus(id, newStatus);
  } catch (error) {
    // Rollback on error
    setData(oldData);
    showToast('Failed to update status', 'error');
  }
};
```

### Loading States

Every data-fetching operation should show loading indicators:

```javascript
{loading ? (
  <div className="flex items-center justify-center py-20">
    <Loader className="w-8 h-8 animate-spin text-[#B8860B]" />
  </div>
) : (
  // Render data
)}
```

### Form Validation

Client-side validation before API calls:

```javascript
const validateForm = () => {
  const errors = {};
  
  if (!formData.name) errors.name = 'Name is required';
  if (!formData.price || formData.price <= 0) errors.price = 'Valid price required';
  if (!formData.capacity || formData.capacity <= 0) errors.capacity = 'Valid capacity required';
  
  return errors;
};

const handleSubmit = async () => {
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }
  
  // Proceed with API call
};
```

### Backend API Requirements

The following backend endpoints need to be implemented or verified:

**Room Management:**
- `PUT /api/rooms/room-types/:id` - Update room type
- `DELETE /api/rooms/room-types/:id` - Delete room type
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

**Booking Management:**
- `PUT /api/bookings/:id/status` - Update booking status

**User Management:**
- `GET /api/auth/users/:id` - Get user details
- `GET /api/bookings/user/:userId` - Get user's bookings
- `PUT /api/auth/users/:id` - Update user
- `PUT /api/auth/users/:id/status` - Toggle user status

**Banquet Management:**
- `PUT /api/banquet/halls/:id` - Update hall
- `DELETE /api/banquet/halls/:id` - Delete hall

**Restaurant Management:**
- `PUT /api/restaurant/tables/:id` - Update table
- `DELETE /api/restaurant/tables/:id` - Delete table

**Statistics:**
- `GET /api/admin/stats` - Get dashboard statistics (optional aggregation endpoint)

### Security Considerations

1. **Role-Based Access Control**: All admin routes must verify user role
2. **Token Validation**: Backend must validate JWT tokens on every request
3. **Input Sanitization**: Sanitize all user inputs before database operations
4. **Rate Limiting**: Implement rate limiting on admin endpoints
5. **Audit Logging**: Log all admin actions for accountability

### Performance Optimizations

1. **Pagination**: Implement pagination for large lists (bookings, users)
2. **Debouncing**: Debounce search and filter operations
3. **Caching**: Cache frequently accessed data (room types, halls)
4. **Lazy Loading**: Load data only when tabs are activated
5. **Memoization**: Use React.memo for expensive components
