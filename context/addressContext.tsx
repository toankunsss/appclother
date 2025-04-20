import React, { createContext, useContext, useState, useCallback } from "react";
import {
  getAddressesByUserId,
  addAddressAPI,
  updateAddressAPI,
  deleteAddressAPI,
} from "../api/api";
import { useAuth } from "@/context/contextAuth";

interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  loading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (addressData: Omit<Address, "id">) => Promise<void>;
  updateAddress: (
    addressId: string,
    addressData: Partial<Address>
  ) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  defaultAddress: Address | null;
  selectAddress: (addressId: string) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAddresses = useCallback(async () => {
    if (user?.uid) {
      setLoading(true);
      try {
        const addressData = await getAddressesByUserId(user.uid);
        setAddresses(addressData);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  const addAddress = async (addressData: Omit<Address, "id">) => {
    try {
      await addAddressAPI(addressData);
      await fetchAddresses();
    } catch (error) {
      console.error("Error adding address:", error);
      throw error;
    }
  };

  const updateAddress = async (
    addressId: string,
    addressData: Partial<Address>
  ) => {
    try {
      await updateAddressAPI(addressId, addressData);
      await fetchAddresses();
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      await deleteAddressAPI(addressId);
      await fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  };

  const selectAddress = (addressId: string) => {
    setAddresses((currentAddresses) =>
      currentAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const defaultAddress =
    addresses.find((addr) => addr.isDefault) || addresses[0] || null;

  const value = {
    addresses,
    loading,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    defaultAddress,
    selectAddress,
  };

  return (
    <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};
