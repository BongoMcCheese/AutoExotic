"use client"

import { useState } from "react"
import { Plus, Minus, Info } from "lucide-react"
import type { Service } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface ServiceSelectorProps {
  service: Service
  onSelect: (service: Service, quantity: number) => void
  selectedQuantity: number
}

export function ServiceSelector({ service, onSelect, selectedQuantity }: ServiceSelectorProps) {
  const [quantity, setQuantity] = useState(selectedQuantity)

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(0, newQuantity)
    setQuantity(validQuantity)
    onSelect(service, validQuantity)
  }

  return (
    <Card className={cn("transition-all", quantity > 0 ? "border-primary" : "")}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{service.name}</h3>
              {service.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{service.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-sm text-muted-foreground">${service.price.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

