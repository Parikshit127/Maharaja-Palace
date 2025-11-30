# Implementation Plan

- [x] 1. Set up backend API endpoints for admin operations
  - Create missing PUT and DELETE endpoints for room types, rooms, halls, and tables
  - Add user detail and user bookings endpoints
  - Add booking status update endpoint
  - Implement proper admin authorization middleware on all admin routes
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.4_

- [x] 2. Implement Dashboard with real-time statistics
  - Create API service functions to fetch all required data
  - Implement `loadDashboardStats()` to aggregate data from multiple endpoints
  - Implement `calculateOccupancyRate()` for room occupancy calculation
  - Implement `calculateTodayRevenue()` for revenue calculation
  - Add loading states and error handling
  - Connect quick action buttons to navigation
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 2.1 Write property test for booking aggregation
  - **Property 1: Booking aggregation completeness**
  - **Validates: Requirements 1.2, 4.1**

- [ ]* 2.2 Write property test for revenue calculation
  - **Property 2: Revenue calculation accuracy**
  - **Validates: Requirements 1.3, 4.3**

- [ ]* 2.3 Write property test for occupancy rate
  - **Property 3: Occupancy rate calculation**
  - **Validates: Requirements 1.4**

- [x] 3. Complete Room Type Management functionality
  - Implement `handleEditRoomType()` to load and populate form with existing data
  - Implement `handleUpdateRoomType()` to send PUT request and refresh list
  - Implement `handleDeleteRoomType()` with confirmation dialog
  - Implement `handleViewRoomType()` to display detailed information
  - Add proper error handling and user feedback for all operations
  - Add form validation before submission
  - _Requirements: 2.3, 2.4, 2.5, 2.6_

- [ ]* 3.1 Write property test for room type edit form population
  - **Property 5: Edit form data population**
  - **Validates: Requirements 2.3**

- [ ]* 3.2 Write property test for room type update persistence
  - **Property 6: Room type update persistence**
  - **Validates: Requirements 2.4**

- [ ]* 3.3 Write property test for room type view completeness
  - **Property 7: Room type view completeness**
  - **Validates: Requirements 2.5**

- [x] 4. Complete Individual Room Management functionality
  - Implement `handleEditRoom()` to load and populate form with existing data
  - Implement `handleUpdateRoom()` to send PUT request and refresh list
  - Implement `handleDeleteRoom()` with confirmation dialog
  - Ensure `handleUpdateRoomStatus()` works with optimistic updates and rollback on error
  - Add proper error handling and user feedback for all operations
  - _Requirements: 3.4, 3.5, 3.6_

- [ ]* 4.1 Write property test for room edit form population
  - **Property 5: Edit form data population**
  - **Validates: Requirements 3.4**

- [ ]* 4.2 Write property test for room status update
  - **Property 9: Room status update immediacy**
  - **Validates: Requirements 3.3**

- [x] 5. Enhance Booking Management with filtering and details
  - Ensure `loadAllBookings()` correctly fetches from all three booking types
  - Implement booking type filtering with state management
  - Implement `calculateStats()` for real-time statistics
  - Implement `handleViewDetails()` to show detailed booking information
  - Implement `exportBookings()` to generate CSV export
  - Add loading states and error handling
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ]* 5.1 Write property test for booking filter
  - **Property 10: Booking filter correctness**
  - **Validates: Requirements 4.2**

- [ ]* 5.2 Write property test for booking statistics
  - **Property 11: Booking statistics accuracy**
  - **Validates: Requirements 4.3**

- [ ]* 5.3 Write property test for booking detail completeness
  - **Property 12: Booking detail completeness**
  - **Validates: Requirements 4.5**

- [x] 6. Complete User Management functionality
  - Ensure `loadUsers()` fetches all users from backend
  - Implement `handleViewUser()` to show detailed user information
  - Implement `loadUserBookings()` to fetch user's booking history from all types
  - Implement `handleUpdateUser()` for editing user details
  - Implement `handleToggleUserStatus()` for activating/deactivating users
  - Add loading states and error handling with retry option
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 6.1 Write property test for user list completeness
  - **Property 13: User list completeness**
  - **Validates: Requirements 5.1, 5.2**

- [ ]* 6.2 Write property test for user detail with bookings
  - **Property 14: User detail with booking history**
  - **Validates: Requirements 5.3**

- [x] 7. Complete Banquet Hall Management functionality
  - Ensure `handleSubmit()` creates halls and refreshes list
  - Implement `handleEditHall()` to load and populate form with existing data
  - Implement `handleUpdateHall()` to send PUT request and refresh list
  - Implement `handleDeleteHall()` with confirmation dialog
  - Add proper error handling and user feedback
  - Add form validation
  - _Requirements: 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ]* 7.1 Write property test for hall edit form population
  - **Property 5: Edit form data population**
  - **Validates: Requirements 6.4**

- [ ]* 7.2 Write property test for hall update persistence
  - **Property 17: Banquet hall update persistence**
  - **Validates: Requirements 6.5**

- [x] 8. Complete Restaurant Table Management functionality
  - Ensure `handleSubmit()` creates tables and refreshes list
  - Implement `handleEditTable()` to load and populate form with existing data
  - Implement `handleUpdateTable()` to send PUT request and refresh list
  - Implement `handleDeleteTable()` with confirmation dialog
  - Add proper error handling and user feedback
  - Add form validation
  - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ]* 8.1 Write property test for table edit form population
  - **Property 5: Edit form data population**
  - **Validates: Requirements 7.4**

- [ ]* 8.2 Write property test for table update persistence
  - **Property 20: Restaurant table update persistence**
  - **Validates: Requirements 7.5**

- [x] 9. Implement comprehensive error handling and user feedback
  - Add toast notification system for success/error messages
  - Implement global error handler in API interceptor
  - Add loading indicators to all data-fetching operations
  - Implement optimistic updates with rollback for status changes
  - Add retry functionality for network errors
  - Ensure 401 errors redirect to login page
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 9.1 Write property test for API success handling
  - **Property 21: API success handling**
  - **Validates: Requirements 8.2**

- [ ]* 9.2 Write property test for API error handling
  - **Property 22: API error handling**
  - **Validates: Requirements 8.3**

- [ ] 10. Implement authentication and authorization
  - Add admin role check middleware to all admin backend routes
  - Ensure API interceptor includes authentication token in all requests
  - Implement token expiration handling with redirect
  - Add authorization error handling (403)
  - Create admin route guard component for frontend
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 10.1 Write property test for authentication token inclusion
  - **Property 23: Authentication token inclusion**
  - **Validates: Requirements 10.3**

- [x] 11. Add missing API endpoints to frontend API service
  - Add `updateRoomType(id, data)` to roomAPI
  - Add `deleteRoomType(id)` to roomAPI
  - Add `updateRoom(id, data)` to roomAPI
  - Add `deleteRoom(id)` to roomAPI
  - Add `updateBookingStatus(id, status)` to bookingAPI
  - Add `getUserDetails(id)` to authAPI
  - Add `getUserBookings(userId)` to bookingAPI
  - Add `updateUser(id, data)` to authAPI
  - Add `toggleUserStatus(id)` to authAPI
  - Add `updateHall(id, data)` to banquetAPI
  - Add `deleteHall(id)` to banquetAPI
  - Add `updateTable(id, data)` to restaurantAPI
  - Add `deleteTable(id)` to restaurantAPI
  - _Requirements: 2.4, 3.4, 3.5, 5.3, 6.5, 7.5_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Add form validation to all admin forms
  - Add validation for room type form (name, price, occupancy, square feet)
  - Add validation for room form (room number, floor, price)
  - Add validation for banquet hall form (name, capacity, price)
  - Add validation for restaurant table form (table number, capacity)
  - Display field-specific error messages
  - Prevent submission with invalid data
  - _Requirements: 2.2, 3.2, 6.2, 7.2_

- [ ] 14. Implement CSV export functionality
  - Create `exportBookings()` function to generate CSV from booking data
  - Include all booking fields in export
  - Format dates and prices appropriately
  - Trigger browser download
  - _Requirements: 4.4_

- [ ] 15. Add confirmation dialogs for destructive actions
  - Add confirmation dialog component
  - Implement confirmation for room type deletion
  - Implement confirmation for room deletion
  - Implement confirmation for hall deletion
  - Implement confirmation for table deletion
  - Implement confirmation for user deactivation
  - _Requirements: 3.5_

- [ ] 16. Optimize performance with pagination and caching
  - Implement pagination for bookings list
  - Implement pagination for users list
  - Add debouncing to search/filter operations
  - Cache room types and halls data
  - Implement lazy loading for tab content
  - _Requirements: Performance optimization_

- [ ] 17. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
