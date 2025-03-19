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

          <div className="space-y-2">
            <h3 className="font-medium">How to Find Your Spreadsheet ID:</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>
                <strong>Open your Google Sheet</strong>
              </li>
              <li>
                <strong>Look at the URL in your browser</strong>
                <p>The URL will look something like:</p>
                <p className="text-xs bg-muted p-1 rounded mt-1 break-all">
                  https://docs.google.com/spreadsheets/d/
                  <span className="font-bold text-primary">1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms</span>
                  /edit#gid=0
                </p>
              </li>
              <li>
                <strong>Copy the highlighted part</strong>
                <p>This is your spreadsheet ID. It should be a long string of letters, numbers, and symbols.</p>
              </li>
              <li>
                <strong>Update your environment variable</strong>
                <p>Set GOOGLE_SHEETS_SPREADSHEET_ID to this value in your Vercel project settings.</p>
              </li>
            </ol>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Expected Sheet Format:</h3>
            <p className="text-sm text-muted-foreground">
              Your Google Sheet should have headers in the first row with columns for:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              <li>Service Name (required)</li>
              <li>Price (required)</li>
              <li>Category (optional)</li>
              <li>Description (optional)</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


