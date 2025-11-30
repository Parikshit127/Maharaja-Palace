import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MainLayout } from "./layout/MainLayout";
import { ProtectedRoute, AdminRoute } from "./layout/ProtectedRoute";

// Pages
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { RoomsPage } from "./pages/RoomsPage";
import { RoomDetailsPage } from "./pages/RoomDetailsPage";
import { BookingPage } from "./pages/BookingPage";
import { BanquetPage } from "./pages/BanquetPage";
import RestaurantPage from "./pages/RestaurantPage";
import RestaurantBookingPage from "./pages/RestaurantBookingPage";
import BanquetBookingPage from "./pages/BanquetBookingPage";
import { AdminPage } from "./pages/AdminPage";
import { GalleryPage } from "./pages/GalleryPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage";

import "./styles/globals.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main Layout Routes */}
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/rooms"
            element={
              <MainLayout>
                <RoomsPage />
              </MainLayout>
            }
          />
          <Route
            path="/rooms/:id"
            element={
              <MainLayout>
                <RoomDetailsPage />
              </MainLayout>
            }
          />

          {/* Banquet Routes */}
          <Route
            path="/banquet"
            element={
              <MainLayout>
                <BanquetPage />
              </MainLayout>
            }
          />
          <Route
            path="/banquets"
            element={
              <MainLayout>
                <BanquetPage />
              </MainLayout>
            }
          />

          {/* Restaurant Routes */}
          <Route
            path="/restaurant"
            element={
              <MainLayout>
                <RestaurantPage />
              </MainLayout>
            }
          />

          {/* General Booking Page */}
          <Route
            path="/booking"
            element={
              <MainLayout>
                <BookingPage />
              </MainLayout>
            }
          />

          {/* Booking Pages - Protected */}
          <Route
            path="/restaurant/book"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <RestaurantBookingPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/banquet/book"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BanquetBookingPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          {/* Add alternative route for banquet-booking (for compatibility) */}
          <Route
            path="/banquet-booking"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BanquetBookingPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Other Pages */}
          <Route
            path="/gallery"
            element={
              <MainLayout>
                <GalleryPage />
              </MainLayout>
            }
          />
          <Route
            path="/about"
            element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminPage />
                </MainLayout>
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFoundPage />
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
