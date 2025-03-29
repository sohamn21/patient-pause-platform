
import { WaitlistEntryType } from "@/components/restaurant/types";

// Customer helper utility functions to be reused across components
export const getCustomerName = (entry: WaitlistEntryType): string => {
  return entry.profiles ? 
    `${entry.profiles.first_name || ''} ${entry.profiles.last_name || ''}`.trim() : 
    "Customer";
};

export const getPhoneNumber = (entry: WaitlistEntryType): string => {
  return entry.profiles?.phone_number || "";
};

export const getEmail = (entry: WaitlistEntryType): string => {
  return entry.profiles?.email || "";
};
