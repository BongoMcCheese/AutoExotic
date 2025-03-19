"use client"

import { useState } from "react"
import type { Service } from "@/app/actions"
import type { SelectedService } from "@/lib/types"
import { ServiceSelector } from "@/components/service-selector"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface ServiceCategoryProps {
  category: string
  services: Service[]
  selectedServices: SelectedService[]
  onServiceSelect: (service: Service, quantity: number) => void
  isDropdown?: boolean
}

export function ServiceCategory({
  category,
  services,
  selectedServices,
  onServiceSelect,
  isDropdown = false,
}: ServiceCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [quantity, setQuantity] = useState(1)

  const getSelectedQuantity = (serviceId: string) => {
    const selected = selectedServices.find((s) => s.service.id === serviceId)
    return selected ? selected.quantity : 0
  }

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    if (service) {
      setSelectedService(service)

      // Check if this service is already selected
      const existingService = selectedServices.find((s) => s.service.id === serviceId)
      if (existingService) {
        setQuantity(existingService.quantity)
      } else {
        setQuantity(1)
      }
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (selectedService) {
      setQuantity(newQuantity)
      onServiceSelect(selectedService, newQuantity)
    }
  }

  const handleAddToQuote = () => {
    if (selectedService) {
      onServiceSelect(selectedService, quantity)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{category}</h2>
        {isDropdown && services.length > 3 && (
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" />
                Show All
              </>
            )}
          </Button>
        )}
      </div>

      {isDropdown ? (
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select onValueChange={handleServiceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${category}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedService && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(Math.max(0, quantity - 1))}
                        disabled={quantity === 0}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button onClick={handleAddToQuote}>Add to Quote</Button>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
                  {services.map((service) => (
                    <ServiceSelector
                      key={service.id}
                      service={service}
                      selectedQuantity={getSelectedQuantity(service.id)}
                      onSelect={onServiceSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceSelector
              key={service.id}
              service={service}
              selectedQuantity={getSelectedQuantity(service.id)}
              onSelect={onServiceSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

