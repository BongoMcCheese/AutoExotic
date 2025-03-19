import { Suspense } from "react"
import { getServices } from "@/app/actions"
import { PricingCalculator } from "@/components/pricing-calculator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { DebugInfo } from "@/components/debug-info"

export default async function Home() {
  let services = []
  let errorMessage = null

  try {
    services = await getServices()
  } catch (e: any) {
    errorMessage = e.message || "Unknown error loading services"
    console.error("Error loading services:", e)
  }

  // Check if environment variables are set (without exposing values)
  const hasApiKey = !!process.env.GOOGLE_SHEETS_API_KEY
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || ""
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || ""

  return (
    <div className="container mx-auto py-6 relative min-h-screen">
      <h1 className="mb-6 text-3xl font-bold text-center">Auto Exotic Pricing Calculator</h1>

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            <p>{errorMessage}</p>
            <p className="text-sm mt-1">Click the "Debug Info" button in the bottom right for troubleshooting help.</p>
          </AlertDescription>
        </Alert>
      )}

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <PricingCalculator initialServices={services} />
      </Suspense>

      <DebugInfo
        apiKey={hasApiKey ? "set" : undefined}
        spreadsheetId={spreadsheetId}
        sheetName={sheetName}
        errorMessage={errorMessage}
        isDiabled= true
      />
    </div>
  )
}

