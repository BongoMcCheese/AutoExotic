"use server"

import { fetchSheetData, parseSheetData } from "@/lib/google-sheets"

export type Service = {
  id: string
  name: string
  price: number
  category: string
  description: string
}

// Fallback data in case the API fails
const fallbackServices: Service[] = [
  {
    id: "repair",
    name: "Repair",
    price: 49.99,
    category: "Repair",
    description: "Standard repair service",
  },
  {
    id: "government-repair",
    name: "Government Repair",
    price: 149.99,
    category: "Repair",
    description: "Government repair service",
  },
  {
    id: "lock-pick",
    name: "Lock Pick",
    price: 29.99,
    category: "Services",
    description: "Lock pick tool",
  },
  {
    id: "spare-key",
    name: "Spare Key",
    price: 19.99,
    category: "Services",
    description: "Spare key",
  },
  {
    id: "spray-kit",
    name: "Spray Kit",
    price: 49.99,
    category: "Services",
    description: "Spray kit",
  },
  {
    id: "tire-kit",
    name: "Tire Kit",
    price: 39.99,
    category: "Services",
    description: "Tire kit",
  },
  {
    id: "standard-restoration-kit",
    name: "Standard Restoration Kit",
    price: 79.99,
    category: "Restoration Kits",
    description: "Standard restoration kit",
  },
  {
    id: "advanced-restoration-kit",
    name: "Advanced Restoration Kit",
    price: 129.99,
    category: "Restoration Kits",
    description: "Advanced restoration kit",
  },
  {
    id: "standard-suspension",
    name: "Standard Suspension",
    price: 299.99,
    category: "Suspensions",
    description: "Standard suspension",
  },
  {
    id: "performance-suspension",
    name: "Performance Suspension",
    price: 499.99,
    category: "Suspensions",
    description: "Performance suspension",
  },
  {
    id: "standard-brakes",
    name: "Standard Brakes",
    price: 199.99,
    category: "Brakes",
    description: "Standard brakes",
  },
  {
    id: "performance-brakes",
    name: "Performance Brakes",
    price: 349.99,
    category: "Brakes",
    description: "Performance brakes",
  },
  {
    id: "standard-engine",
    name: "Standard Engine",
    price: 999.99,
    category: "Engines",
    description: "Standard engine",
  },
  {
    id: "performance-engine",
    name: "Performance Engine",
    price: 1999.99,
    category: "Engines",
    description: "Performance engine",
  },
  {
    id: "standard-transmission",
    name: "Standard Transmission",
    price: 799.99,
    category: "Transmissions",
    description: "Standard transmission",
  },
  {
    id: "performance-transmission",
    name: "Performance Transmission",
    price: 1499.99,
    category: "Transmissions",
    description: "Performance transmission",
  },
  {
    id: "standard-tires",
    name: "Standard Tires",
    price: 399.99,
    category: "Tires",
    description: "Standard tires",
  },
  {
    id: "performance-tires",
    name: "Performance Tires",
    price: 699.99,
    category: "Tires",
    description: "Performance tires",
  },
  {
    id: "turbo",
    name: "Turbo",
    price: 899.99,
    category: "Turbo",
    description: "Turbo upgrade",
  },
]

export async function getServices(): Promise<Service[]> {
  try {
    console.log("Fetching services from Google Sheets...")

    const data = await fetchSheetData()
    const services = parseSheetData(data)

    if (services.length === 0) {
      console.warn("No services found in Google Sheets, using fallback data")
      return fallbackServices
    }

    console.log(`Successfully retrieved ${services.length} services`)
    return services
  } catch (error: any) {
    console.error("Error getting services:", error)
    console.log("Using fallback service data")

    return fallbackServices
  }
}

