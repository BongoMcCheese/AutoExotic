"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface DebugInfoProps {
  apiKey?: string
  spreadsheetId?: string
  sheetName?: string
  errorMessage?: string
}

export function DebugInfo({ apiKey, spreadsheetId, sheetName, errorMessage }: DebugInfoProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="absolute bottom-4 right-4">
          Debug Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Google Sheets Connection</DialogTitle>
          <DialogDescription>
            Information about your Google Sheets connection and how to fix common issues
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <h3 className="font-medium">Connection Status:</h3>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p>API Key: {apiKey ? "✅ Set" : "❌ Missing"}</p>
              <p>Spreadsheet ID: {spreadsheetId ? "✅ Set" : "❌ Missing"}</p>
              <p>Sheet Name: {sheetName ? `✅ Set to "${sheetName}"` : "❌ Missing (using 'Sheet1')"}</p>
              {errorMessage && <p className="text-destructive mt-2">Error: {errorMessage}</p>}
            </div>
          </div>

          <Separator />

        
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

