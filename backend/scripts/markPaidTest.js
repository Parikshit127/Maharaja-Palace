import axios from "axios";

const API = process.env.API_BASE || "http://localhost:5000/api";

const randomEmail = () => `test+${Date.now()}@example.com`;

const main = async () => {
  try {
    console.log("Starting mark-as-paid test against:", API);

    // 1) Register user
    const email = randomEmail();
    const password = "Password123!";
    const registerRes = await axios.post(`${API}/auth/register`, {
      firstName: "Test",
      lastName: "User",
      email,
      phone: "9999999999",
      password,
      confirmPassword: password,
    });

    const token = registerRes.data.token;
    console.log("Registered user:", email);

    const auth = { headers: { Authorization: `Bearer ${token}` } };

    // 2) Get a room
    const roomsRes = await axios.get(`${API}/rooms`);
    const rooms = roomsRes.data || [];
    if (!rooms.length) {
      console.error("No rooms available to create a booking. Aborting.");
      process.exit(1);
    }

    const room = rooms[0];
    const roomRate = room.price || 1000;

    // 3) Create a booking for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(tomorrow.getDate() + 1);

    const bookingRes = await axios.post(
      `${API}/bookings`,
      {
        room: room._id,
        checkInDate: tomorrow.toISOString(),
        checkOutDate: dayAfter.toISOString(),
        numberOfGuests: 1,
        roomRate: roomRate,
        bookingType: "full",
      },
      auth
    );

    const booking = bookingRes.data.booking;
    console.log("Created booking:", booking.bookingNumber, booking._id);

    // 4) Fetch booking details (before)
    const before = await axios.get(`${API}/bookings/${booking._id}`, auth);
    console.log(
      "Before status:",
      before.data.booking.paymentStatus,
      before.data.booking.status
    );

    // 5) Call mark-paid dev endpoint
    const markRes = await axios.put(
      `${API}/bookings/${booking._id}/mark-paid`,
      {},
      auth
    );
    console.log("Mark-paid response:", markRes.data.message || "OK");

    // 6) Fetch booking after
    const after = await axios.get(`${API}/bookings/${booking._id}`, auth);
    console.log(
      "After status:",
      after.data.booking.paymentStatus,
      after.data.booking.status
    );

    console.log("Test completed.");
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err.response?.data || err.message || err);
    process.exit(1);
  }
};

main();
