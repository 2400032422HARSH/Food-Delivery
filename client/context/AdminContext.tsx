import React, { createContext, useContext, useState, ReactNode } from "react";
import { Restaurant, User, Coupon, mockRestaurants, mockUsers, mockCoupons } from "@shared/data";

interface AdminContextType {
  restaurants: Restaurant[];
  updateRestaurant: (updated: Restaurant) => void;
  users: User[];
  updateUser: (updated: User) => void;
  coupons: Coupon[];
  updateCoupon: (updated: Coupon) => void;
  deleteCoupon: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const updateRestaurant = (updated: Restaurant) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const updateUser = (updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const updateCoupon = (updated: Coupon) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
  };

  return (
    <AdminContext.Provider
      value={{
        restaurants,
        updateRestaurant,
        users,
        updateUser,
        coupons,
        updateCoupon,
        deleteCoupon,
        addCoupon,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
