"use client"

import { useState, useEffect } from "react"
import type { Service } from "@/app/actions"
import type { SelectedService } from "@/lib/types"
import { ServiceCategory } from "@/components/service-category"
import { ServiceFilter } from "@/components/service-filter"
import { PricingSummary } from "@/components/pricing-summary"

interface PricingCalculatorProps {
  initialServices: Service[]
}

export function PricingCalculator({ initialServices }: PricingCalculatorProps) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [filteredServices, setFilteredServices] = useState<Service[]>(initialServices)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])

  // Define the order of categories
  const categoryOrder = [
    "Repair",
    "Services",
    "Restoration Kits",
    "Suspensions",
    "Brakes",
    "Engines",
    "Transmissions",
    "Tires",
    "Turbo",
  ]

  // Get unique categories from services and sort them according to our preferred order
  const categories = Array.from(new Set(services.map((service) => service.category)))
    .filter((category) => categoryOrder.includes(category))
    .sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b))

  useEffect(() => {
    let result = services

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter((service) => service.category === selectedCategory)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (service) => service.name.toLowerCase().includes(query) || service.description.toLowerCase().includes(query),
      )
    }

    setFilteredServices(result)
  }, [services, selectedCategory, searchQuery])

  const handleServiceSelect = (service: Service, quantity: number) => {
    setSelectedServices((prev) => {
      // Remove the service if quantity is 0
      if (quantity === 0) {
        return prev.filter((item) => item.service.id !== service.id)
      }

      // Update quantity if service already exists
      const existingIndex = prev.findIndex((item) => item.service.id === service.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = { service, quantity }
        return updated
      }

      // Add new service
      return [...prev, { service, quantity }]
    })
  }

  const handleClearAll = () => {
    setSelectedServices([])
  }

  // Group services by category
  const servicesByCategory = categories.reduce<Record<string, Service[]>>((acc, category) => {
    acc[category] = filteredServices.filter((service) => service.category === category)
    return acc
  }, {})

  // Check if we have any services to display
  const hasServices = services.length > 0
  const hasFilteredServices = filteredServices.length > 0

  // Determine which categories should be displayed as dropdowns
  const dropdownCategories = ["Restoration Kits", "Suspensions", "Brakes", "Engines", "Transmissions", "Tires"]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-6 md:col-span-2">
        {hasServices ? (
          <>
            <ServiceFilter
              categories={categories}
              onCategoryChange={setSelectedCategory}
              onSearchChange={setSearchQuery}
            />

            {hasFilteredServices ? (
              Object.entries(servicesByCategory).map(
                ([category, services]) =>
                  services.length > 0 && (
                    <ServiceCategory
                      key={category}
                      category={category}
                      services={services}
                      selectedServices={selectedServices}
                      onServiceSelect={handleServiceSelect}
                      isDropdown={dropdownCategories.includes(category)}
                    />
                  ),
              )
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium">No products available</h3>
            <p className="text-muted-foreground">
              Please check your Google Sheets connection or add products to your spreadsheet
            </p>
          </div>
        )}
      </div>

      <div>
        <PricingSummary selectedServices={selectedServices} onClear={handleClearAll} />
      </div>
    </div>
  )
}

