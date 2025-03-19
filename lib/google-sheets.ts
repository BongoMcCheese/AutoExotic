export async function fetchSheetData() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Sheet1" // Default to Sheet1 if not specified

  if (!apiKey) {
    throw new Error("GOOGLE_SHEETS_API_KEY is not set")
  }

  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set")
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      console.error(`Google Sheets API Error: ${response.status} ${response.statusText}`)
      const errorData = await response.json()
      console.error("Error Details:", errorData)
      throw new Error(`Failed to fetch data from Google Sheets: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.values
  } catch (error: any) {
    console.error("Error fetching sheet data:", error)
    throw new Error(`Error fetching data from Google Sheets: ${error.message}`)
  }
}

export function parseSheetData(data: any[][]) {
  if (!data || data.length < 5) {
    console.warn("Not enough data rows in the sheet")
    return []
  }

  try {
    // Find the row with "Item" in it (the header row)
    let headerRowIndex = -1
    for (let i = 0; i < data.length; i++) {
      if (data[i].some((cell) => cell === "Item")) {
        headerRowIndex = i
        break
      }
    }

    if (headerRowIndex === -1) {
      console.warn('Could not find header row with "Item" in it')
      return []
    }

    // The next row should be the first data row
    const startRowIndex = headerRowIndex + 1

    // Extract the headers
    const headers = data[headerRowIndex]
    console.log("Found headers:", headers)

    // Find the indices of important columns
    const itemIndex = headers.findIndex((h) => h === "Item")
    const shopPriceIndex = headers.findIndex((h) => h === "Shop Price")

    if (itemIndex === -1) {
      console.warn("Could not find Item column")
      return []
    }

    if (shopPriceIndex === -1) {
      console.warn("Could not find Shop Price column")
      return []
    }

    // Process the data rows
    const services = []
    const serviceMap = new Map()

    // Helper function to categorize services
    const categorizeService = (name) => {
      name = name.toLowerCase()

      // Skip these specific items
      if (
        name === "none" ||
        name === "basic repair kit" ||
        name === "advanced repair kit" ||
        name === "pro repair kit"
      ) {
        return "Skip"
      }

      // Specific categorizations
      if (
        name === "repair" ||
        name === "government repair" ||
        name.includes("repair") ||
        (name.includes("government") && name.includes("repair"))
      ) {
        return "Repair"
      } else if (name.includes("turbo")) {
        return "Turbo"
      } else if (name.includes("restoration")) {
        return "Restoration Kits"
      } else if (name.includes("suspension")) {
        return "Suspensions"
      } else if (name.includes("brake")) {
        return "Brakes"
      } else if (name.includes("engine")) {
        return "Engines"
      } else if (name.includes("transmission")) {
        return "Transmissions"
      } else if (name.includes("tire") && !name.includes("kit")) {
        return "Tires"
      } else {
        // All other items go into "Services"
        return "Services"
      }
    }

    for (let i = startRowIndex; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length <= itemIndex || !row[itemIndex]) {
        // Skip empty rows or rows without an item name
        continue
      }

      const itemName = row[itemIndex]

      // Skip if no shop price
      if (!row[shopPriceIndex] || row[shopPriceIndex] === "") continue

      // Parse price, handling currency symbols and formatting
      const price = Number.parseFloat(String(row[shopPriceIndex]).replace(/[^0-9.-]+/g, ""))
      if (isNaN(price)) continue

      // Categorize the service
      const category = categorizeService(itemName)

      // Skip unwanted items
      if (category === "Skip") continue

      const service = {
        id: `${itemName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        name: itemName,
        price: price,
        category: category,
        description: itemName,
      }

      services.push(service)
    }

    console.log(`Parsed ${services.length} services from the sheet`)
    return services
  } catch (error) {
    console.error("Error parsing sheet data:", error)
    return []
  }
}

