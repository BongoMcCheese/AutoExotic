"use client"

import type { SelectedService } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

interface PricingSummaryProps {
  selectedServices: SelectedService[]
  onClear: () => void
}

export function PricingSummary({ selectedServices, onClear }: PricingSummaryProps) {
  const total = selectedServices.reduce((sum, item) => sum + item.service.price * item.quantity, 0)

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Quote Summary</CardTitle>
        <CardDescription>
          {selectedServices.length > 0
            ? `${selectedServices.reduce((sum, item) => sum + item.quantity, 0)} items selected`
            : "No items selected"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedServices.length > 0 ? (
          <>
            <div className="space-y-2">
              {selectedServices.map((item) => (
                <div key={item.service.id} className="flex justify-between text-sm">
                  <span>
                    {item.service.name} x {item.quantity}
                  </span>
                  <span>${(item.service.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">Select products to see the pricing summary</div>
        )}
      </CardContent>
      {selectedServices.length > 0 && (
        <CardFooter>
          <Button variant="outline" onClick={onClear} className="flex items-center gap-1 w-full">
            <X className="h-4 w-4" />
            Clear All
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

