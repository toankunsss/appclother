import React, { createContext, useContext, useState, ReactNode } from "react";

interface AddressType {
  id: string;
  address: string;
  label?: string;
  [key: string]: any;
}

interface AddressContextType {
  selectedAddress: AddressType | null;
  setSelectedAddress: (address: AddressType | null) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);
  return (
    <AddressContext.Provider value={{ selectedAddress, setSelectedAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) throw new Error("useAddress must be used within AddressProvider");
  return context;
};
