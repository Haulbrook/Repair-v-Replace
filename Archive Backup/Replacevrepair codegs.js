// Replace v Repair
// code.gs
//
// Web App Functions
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Asset Management System')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function testWebAppConnection() {
  return {
    message: "Connected successfully",
    timestamp: new Date().toISOString(),
    assetsCount: getAssets().length
  };
}

// Get Assets from Sheet
// Replace your getAssets function with this bulletproof version
function getAssets() {
  console.log('getAssets called');
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      console.error('No active spreadsheet found');
      return []; // Return empty array, not null
    }
    
    // Try to get the Assets sheet
    const sheet = spreadsheet.getSheetByName('Assets');
    if (!sheet) {
      console.error('Assets sheet not found');
      // Try to create it
      initializeSpreadsheet();
      const newSheet = spreadsheet.getSheetByName('Assets');
      if (!newSheet) {
        return []; // Return empty array, not null
      }
    }
    
    const data = sheet.getDataRange().getValues();
    console.log('Sheet data rows:', data.length);
    
    if (!data || data.length <= 1) {
      console.log('No data rows found');
      return []; // Return empty array, not null
    }
    
    const assets = [];
    for (let i = 1; i < data.length; i++) {
      try {
        if (data[i][0]) { // If Asset ID exists
          const asset = {
            id: String(data[i][0] || ''),
            name: String(data[i][1] || 'Unknown'),
            category: String(data[i][2] || 'Unknown'),
            purchaseDate: data[i][3] ? new Date(data[i][3]).toISOString() : '',
            replacementCost: Number(data[i][4]) || 0,
            threshold: Number(data[i][5]) || 50,
            thresholdAmount: Number(data[i][6]) || 0,
            totalRepairs: Number(data[i][7]) || 0,
            percentOfReplacement: Number(data[i][8]) || 0,
            status: String(data[i][9] || 'GOOD'),
            daysSincePurchase: isNaN(Number(data[i][10])) ? 0 : Number(data[i][10])
          };
          assets.push(asset);
        }
      } catch (rowError) {
        console.error('Error processing row ' + i + ':', rowError);
        // Continue processing other rows
      }
    }
    
    console.log('Returning ' + assets.length + ' assets');
    return assets; // Always return an array
    
  } catch (error) {
    console.error('Error in getAssets:', error.toString());
    console.error('Stack:', error.stack);
    // Return empty array on error, never null or undefined
    return [];
  }
}

// Also add this simple test function
function simpleTest() {
  try {
    const result = getAssets();
    return {
      success: true,
      count: result ? result.length : 0,
      firstAsset: result && result.length > 0 ? result[0] : null,
      type: typeof result,
      isArray: Array.isArray(result)
    };
  } catch (e) {
    return {
      success: false,
      error: e.toString()
    };
  }
}
// Get Repairs from Sheet
function getRepairs() {
  console.log('getRepairs called');
  
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Repairs');
    
    if (!sheet) {
      console.log('Repairs sheet does not exist');
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    console.log('Repairs sheet has ' + data.length + ' rows (including header)');
    
    if (data.length <= 1) {
      console.log('No repair data found');
      return [];
    }
    
    const repairs = [];
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0] !== '') {
        // Convert date to string format for proper serialization
        let repairDateStr = '';
        if (data[i][2]) {
          try {
            if (data[i][2] instanceof Date) {
              // Format as YYYY-MM-DD string
              repairDateStr = Utilities.formatDate(data[i][2], Session.getScriptTimeZone(), 'yyyy-MM-dd');
            } else {
              repairDateStr = String(data[i][2]);
            }
          } catch (e) {
            console.error('Date conversion error for row ' + i + ':', e);
            repairDateStr = '';
          }
        }
        
        const repair = {
          repairId: String(data[i][0]),
          assetId: String(data[i][1] || ''),
          repairDate: repairDateStr, // Use string format
          partName: String(data[i][3] || ''),
          partCost: Number(data[i][4]) || 0,
          laborHours: Number(data[i][5]) || 0,
          laborRate: Number(data[i][6]) || 0,
          laborCost: Number(data[i][7]) || 0,
          totalCost: Number(data[i][8]) || 0,
          runningTotal: Number(data[i][9]) || 0,
          percentOfReplacement: Number(data[i][10]) || 0,
          notes: String(data[i][11] || ''),
          timestamp: data[i][12] ? String(data[i][12]) : ''
        };
        
        repairs.push(repair);
        console.log('Added repair: ' + repair.repairId + ' for ' + repair.assetId + ' on ' + repair.repairDate);
      }
    }
    
    console.log('Returning ' + repairs.length + ' repairs');
    return repairs;
    
  } catch (error) {
    console.error('Error in getRepairs: ' + error.toString());
    return [];
  }
}

// Alternative: Return repairs as simple test to verify data exists
function getRepairsSimple() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Repairs');
    
    if (!sheet) return { error: 'No Repairs sheet' };
    
    const data = sheet.getDataRange().getValues();
    
    // Return simplified data for testing
    const repairs = [];
    for (let i = 1; i < data.length && i < 4; i++) { // Just first 3 repairs
      if (data[i][0]) {
        repairs.push({
          id: String(data[i][0]),
          asset: String(data[i][1]),
          date: String(data[i][2]),
          part: String(data[i][3]),
          cost: Number(data[i][8]) || 0
        });
      }
    }
    
    return {
      totalRows: data.length - 1,
      sampleData: repairs
    };
    
  } catch (e) {
    return { error: e.toString() };
  }
}

// Add new repair
// Replace your addRepair function in Code.gs with this fixed version
function addRepair(repairData) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Get sheets
    let repairsSheet = spreadsheet.getSheetByName('Repairs');
    if (!repairsSheet) {
      initializeSpreadsheet();
      repairsSheet = spreadsheet.getSheetByName('Repairs');
      if (!repairsSheet) {
        return { success: false, message: 'Could not create Repairs sheet' };
      }
    }
    
    const assetsSheet = spreadsheet.getSheetByName('Assets');
    if (!assetsSheet) {
      return { success: false, message: 'Assets sheet not found' };
    }
    
    // Find the asset
    const assetData = assetsSheet.getDataRange().getValues();
    let assetInfo = null;
    let assetRowIndex = -1;
    
    for (let i = 1; i < assetData.length; i++) {
      if (String(assetData[i][0]) === String(repairData.assetId)) {
        assetInfo = {
          id: assetData[i][0],
          name: assetData[i][1] || 'Unknown',
          replacementCost: Number(assetData[i][4]) || 0,
          currentTotalRepairs: Number(assetData[i][7]) || 0
        };
        assetRowIndex = i + 1; // Sheet rows are 1-indexed
        break;
      }
    }
    
    if (!assetInfo) {
      return { success: false, message: 'Asset not found: ' + repairData.assetId };
    }
    
    // Calculate costs
    const partCost = Number(parseFloat(repairData.partCost)) || 0;
    const laborHours = Number(parseFloat(repairData.laborHours)) || 0;
    const laborRate = Number(parseFloat(repairData.laborRate)) || 0;
    const laborCost = laborHours * laborRate;
    const totalCost = partCost + laborCost;
    const runningTotal = assetInfo.currentTotalRepairs + totalCost;
    const percentOfReplacement = assetInfo.replacementCost > 0 ? 
      runningTotal / assetInfo.replacementCost : 0;
    
    // Generate repair ID
    const repairId = 'REP' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMddHHmmss');
    
    // Add repair record
    const newRow = [
      repairId,
      repairData.assetId,
      new Date(repairData.repairDate),
      repairData.partName || '',
      partCost,
      laborHours,
      laborRate,
      laborCost,
      totalCost,
      runningTotal,
      percentOfReplacement,
      repairData.notes || '',
      new Date()
    ];
    
    repairsSheet.appendRow(newRow);
    
    // Update asset sheet - Column H (Total Repairs) and Column I (% of Replacement)
    assetsSheet.getRange(assetRowIndex, 8).setValue(runningTotal); // Column H
    assetsSheet.getRange(assetRowIndex, 9).setValue(percentOfReplacement); // Column I
    
    // IMPORTANT: Update Status based on percentage
    let status = 'GOOD';
    if (percentOfReplacement >= 0.75) {
      status = 'REPLACE NOW';
    } else if (percentOfReplacement >= 0.60) {
      status = 'WARNING - Consider';
    } else if (percentOfReplacement >= 0.40) {
      status = 'MONITOR';
    }
    
    // Update Column J (Status)
    assetsSheet.getRange(assetRowIndex, 10).setValue(status);
    
    console.log('Updated asset: ' + assetInfo.id + 
                ', Total repairs: ' + runningTotal + 
                ', Percentage: ' + (percentOfReplacement * 100).toFixed(1) + '%' +
                ', Status: ' + status);
    
    const formattedRunningTotal = Number(runningTotal).toFixed(2);
    const formattedPercentage = (Number(percentOfReplacement) * 100).toFixed(1);
    
    return { 
      success: true, 
      message: `Repair added for ${assetInfo.name}! Total: $${formattedRunningTotal} (${formattedPercentage}% of $${assetInfo.replacementCost}). Status: ${status}`,
      runningTotal: Number(runningTotal),
      percentOfReplacement: Number(percentOfReplacement),
      status: status
    };
    
  } catch (error) {
    console.error('Error in addRepair:', error);
    return { success: false, message: 'Error: ' + error.toString() };
  }
}


// Also add this test function to verify repair adding works
function addTestRepair() {
  const testData = {
    assetId: 'Echo Blower PB-580T',
    repairDate: new Date().toISOString().split('T')[0],
    partName: 'Test Part',
    partCost: '100',
    laborHours: '1',
    laborRate: '80',
    notes: 'Test repair entry'
  };
  
  return addRepair(testData);
}

// Get Dashboard Statistics
function getDashboardStats() {
  try {
    const assets = getAssets();
    const repairs = getRepairs();
    
    // Initialize stats
    const stats = {
      totalAssets: 0,
      needReplacement: 0,
      warnings: 0,
      good: 0,
      totalRepairCost: 0,
      repairCount: repairs.length,
      averageRepairCost: 0,
      topProblems: []
    };
    
    // Count real assets (exclude any error entries)
    const validAssets = assets.filter(a => 
      a.id && !['ERROR', 'NO_DATA', 'SHEET_ERROR'].includes(a.id)
    );
    
    stats.totalAssets = validAssets.length;
    
    // Count by status - check all variations of status text
    validAssets.forEach(asset => {
      const status = (asset.status || 'GOOD').toUpperCase();
      
      // Add to total repair cost
      stats.totalRepairCost += Number(asset.totalRepairs) || 0;
      
      // Categorize by status
      if (status.includes('REPLACE')) {
        stats.needReplacement++;
      } else if (status.includes('WARNING')) {
        stats.warnings++;
      } else if (status.includes('MONITOR')) {
        stats.warnings++; // Count MONITOR as warnings for dashboard
      } else {
        stats.good++;
      }
    });
    
    // Calculate average repair cost from repairs data
    if (repairs.length > 0) {
      const totalCost = repairs.reduce((sum, r) => sum + (Number(r.totalCost) || 0), 0);
      stats.averageRepairCost = totalCost / repairs.length;
    }
    
    // Get top problem assets (highest repair costs)
    stats.topProblems = validAssets
      .filter(a => (Number(a.totalRepairs) || 0) > 0)
      .sort((a, b) => (Number(b.totalRepairs) || 0) - (Number(a.totalRepairs) || 0))
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        name: a.name,
        totalRepairs: Number(a.totalRepairs) || 0,
        percentOfReplacement: Number(a.percentOfReplacement) || 0,
        status: a.status
      }));
    
    console.log('Dashboard stats:', JSON.stringify(stats));
    return stats;
    
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return {
      totalAssets: 0,
      needReplacement: 0,
      warnings: 0,
      good: 0,
      totalRepairCost: 0,
      repairCount: 0,
      averageRepairCost: 0,
      topProblems: []
    };
  }
}
// Helper function to update asset formulas
function updateAssetFormulas(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    // Update threshold amount formula (column G)
    for (let i = 2; i <= lastRow; i++) {
      sheet.getRange(i, 7).setFormula(`=E${i}*F${i}/100`);
      // Update days since purchase (column K)
      sheet.getRange(i, 11).setFormula(`=IF(D${i}="","",TODAY()-D${i})`);
    }
  }
}

function recalculateAllStatuses() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const assetsSheet = spreadsheet.getSheetByName('Assets');
    
    if (!assetsSheet) {
      return 'Assets sheet not found';
    }
    
    const lastRow = assetsSheet.getLastRow();
    let updated = 0;
    
    for (let row = 2; row <= lastRow; row++) {
      // Get values
      const replacementCost = Number(assetsSheet.getRange(row, 5).getValue()) || 0; // Column E
      const totalRepairs = Number(assetsSheet.getRange(row, 8).getValue()) || 0; // Column H
      
      if (replacementCost > 0) {
        // Calculate percentage
        const percentage = totalRepairs / replacementCost;
        
        // Update percentage (Column I)
        assetsSheet.getRange(row, 9).setValue(percentage);
        
        // Determine status
        let status = 'GOOD';
        if (percentage >= 0.75) {
          status = 'REPLACE NOW';
        } else if (percentage >= 0.60) {
          status = 'WARNING - Consider';
        } else if (percentage >= 0.40) {
          status = 'MONITOR';
        }
        
        // Update status (Column J)
        assetsSheet.getRange(row, 10).setValue(status);
        updated++;
      }
    }
    
    return 'Updated ' + updated + ' asset statuses';
    
  } catch (error) {
    console.error('Error recalculating statuses:', error);
    return 'Error: ' + error.toString();
  }
}

function checkAssetStatus(assetId) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const assetsSheet = spreadsheet.getSheetByName('Assets');
  const data = assetsSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(assetId)) {
      const replacementCost = Number(data[i][4]) || 0;
      const totalRepairs = Number(data[i][7]) || 0;
      const percentage = Number(data[i][8]) || 0;
      const status = data[i][9];
      
      return {
        assetId: assetId,
        name: data[i][1],
        replacementCost: replacementCost,
        totalRepairs: totalRepairs,
        percentage: percentage * 100,
        currentStatus: status,
        expectedStatus: percentage >= 0.75 ? 'REPLACE NOW' : 
                       percentage >= 0.60 ? 'WARNING' :
                       percentage >= 0.40 ? 'MONITOR' : 'GOOD'
      };
    }
  }
  return 'Asset not found';
}
function getDashboardStats() {
  try {
    const assets = getAssets();
    const repairs = getRepairs();
    
    // Initialize stats
    const stats = {
      totalAssets: 0,
      needReplacement: 0,
      warnings: 0,
      good: 0,
      totalRepairCost: 0,
      repairCount: repairs.length,
      averageRepairCost: 0,
      topProblems: []
    };
    
    // Count real assets (exclude any error entries)
    const validAssets = assets.filter(a => 
      a.id && !['ERROR', 'NO_DATA', 'SHEET_ERROR'].includes(a.id)
    );
    
    stats.totalAssets = validAssets.length;
    
    // Count by status - check all variations of status text
    validAssets.forEach(asset => {
      const status = (asset.status || 'GOOD').toUpperCase();
      
      // Add to total repair cost
      stats.totalRepairCost += Number(asset.totalRepairs) || 0;
      
      // Categorize by status
      if (status.includes('REPLACE')) {
        stats.needReplacement++;
      } else if (status.includes('WARNING')) {
        stats.warnings++;
      } else if (status.includes('MONITOR')) {
        stats.warnings++; // Count MONITOR as warnings for dashboard
      } else {
        stats.good++;
      }
    });
    
    // Calculate average repair cost from repairs data
    if (repairs.length > 0) {
      const totalCost = repairs.reduce((sum, r) => sum + (Number(r.totalCost) || 0), 0);
      stats.averageRepairCost = totalCost / repairs.length;
    }
    
    // Get top problem assets (highest repair costs)
    stats.topProblems = validAssets
      .filter(a => (Number(a.totalRepairs) || 0) > 0)
      .sort((a, b) => (Number(b.totalRepairs) || 0) - (Number(a.totalRepairs) || 0))
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        name: a.name,
        totalRepairs: Number(a.totalRepairs) || 0,
        percentOfReplacement: Number(a.percentOfReplacement) || 0,
        status: a.status
      }));
    
    console.log('Dashboard stats:', JSON.stringify(stats));
    return stats;
    
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return {
      totalAssets: 0,
      needReplacement: 0,
      warnings: 0,
      good: 0,
      totalRepairCost: 0,
      repairCount: 0,
      averageRepairCost: 0,
      topProblems: []
    };
  }
}

function verifyAssetCounts() {
  const assets = getAssets();
  const counts = {
    total: 0,
    good: 0,
    monitor: 0,
    warning: 0,
    replace: 0,
    other: 0
  };
  
  assets.forEach(asset => {
    if (asset.id && !['ERROR', 'NO_DATA'].includes(asset.id)) {
      counts.total++;
      const status = (asset.status || '').toUpperCase();
      
      if (status.includes('REPLACE')) {
        counts.replace++;
      } else if (status.includes('WARNING')) {
        counts.warning++;
      } else if (status.includes('MONITOR')) {
        counts.monitor++;
      } else if (status.includes('GOOD')) {
        counts.good++;
      } else {
        counts.other++;
      }
    }
  });
  
  return counts;
}

function testEchoBlowerStatus() {
  // Replace with your actual Echo Blower asset ID
  return checkAssetStatus('Echo Blower PB-580T');
}

function checkRepairsData() {
  const result = debugRepairsSheet();
  console.log(result);
  return result;
}

// Replace displayRepairs function in index.html with this version
function displayRepairs(repairs) {
  console.log('displayRepairs called with', repairs ? repairs.length : 0, 'repairs');
  
  let tableHtml = '';
  
  if (!repairs || repairs.length === 0) {
    tableHtml = '<tr><td colspan="8">No repairs found. Add a repair to see history.</td></tr>';
  } else {
    repairs.forEach(function(repair, index) {
      try {
        console.log('Processing repair', index, ':', repair);
        
        // Handle date - could be string, Date object, or null
        let dateStr = 'N/A';
        if (repair.repairDate) {
          // Try to parse the date
          let date;
          if (typeof repair.repairDate === 'string') {
            date = new Date(repair.repairDate);
          } else if (repair.repairDate instanceof Date) {
            date = repair.repairDate;
          } else if (typeof repair.repairDate === 'object' && repair.repairDate.$date) {
            // Handle MongoDB-style date
            date = new Date(repair.repairDate.$date);
          } else {
            // Try to convert whatever it is
            date = new Date(repair.repairDate);
          }
          
          // Check if date is valid
          if (date && !isNaN(date.getTime())) {
            dateStr = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
          }
        }
        
        // Safely format all values
        const assetId = repair.assetId || 'Unknown';
        const partName = repair.partName || 'N/A';
        const partCost = '$' + (Number(repair.partCost) || 0).toFixed(2);
        const laborCost = '$' + (Number(repair.laborCost) || 0).toFixed(2);
        const totalCost = '$' + (Number(repair.totalCost) || 0).toFixed(2);
        const runningTotal = '$' + (Number(repair.runningTotal) || 0).toFixed(2);
        const percentage = (Number(repair.percentOfReplacement) || 0) * 100;
        const percentStr = percentage.toFixed(1) + '%';
        
        tableHtml += '<tr>' +
          '<td>' + assetId + '</td>' +
          '<td>' + dateStr + '</td>' +
          '<td>' + partName + '</td>' +
          '<td>' + partCost + '</td>' +
          '<td>' + laborCost + '</td>' +
          '<td>' + totalCost + '</td>' +
          '<td>' + runningTotal + '</td>' +
          '<td>' + percentStr + '</td>' +
          '</tr>';
          
      } catch (err) {
        console.error('Error processing repair at index', index, ':', err);
        console.error('Repair data:', repair);
      }
    });
  }
  
  document.getElementById('historyTableBody').innerHTML = tableHtml;
  console.log('Repair history table updated with', repairs.length, 'rows');
}

// Also update loadRepairs to add more logging
function loadRepairs() {
  console.log('loadRepairs starting...');
  google.script.run
    .withSuccessHandler(function(repairs) {
      console.log('Repairs data received from server:', repairs);
      
      if (repairs === null || repairs === undefined) {
        console.log('Repairs is null/undefined, using empty array');
        repairs = [];
      } else if (!Array.isArray(repairs)) {
        console.log('Repairs is not an array:', typeof repairs);
        repairs = [];
      }
      
      console.log('Processing', repairs.length, 'repairs');
      allRepairs = repairs;
      displayRepairs(allRepairs);
    })
    .withFailureHandler(function(error) {
      console.error('Failed to load repairs:', error);
      document.getElementById('historyTableBody').innerHTML = 
        '<tr><td colspan="8">Error loading repairs: ' + error.toString() + '</td></tr>';
    })
    .getRepairs();
}

function testRepairsDirectly() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Repairs');
  
  if (!sheet) {
    return 'No Repairs sheet exists!';
  }
  
  const data = sheet.getDataRange().getValues();
  return {
    totalRows: data.length,
    hasData: data.length > 1,
    firstDataRow: data[1] || 'No data rows'
  };
}

// Add these functions to your Code.gs

// Delete all repairs for a specific asset and reset its totals
function deleteAssetRepairs(assetId) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const repairsSheet = spreadsheet.getSheetByName('Repairs');
    const assetsSheet = spreadsheet.getSheetByName('Assets');
    
    if (!repairsSheet || !assetsSheet) {
      return { success: false, message: 'Required sheets not found' };
    }
    
    // Delete repairs from Repairs sheet
    const repairData = repairsSheet.getDataRange().getValues();
    let deletedCount = 0;
    
    // Go backwards through rows to avoid index issues when deleting
    for (let i = repairData.length - 1; i > 0; i--) {
      if (String(repairData[i][1]) === String(assetId)) {
        repairsSheet.deleteRow(i + 1); // +1 because sheet rows are 1-indexed
        deletedCount++;
      }
    }
    
    // Reset asset totals
    const assetData = assetsSheet.getDataRange().getValues();
    for (let i = 1; i < assetData.length; i++) {
      if (String(assetData[i][0]) === String(assetId)) {
        const row = i + 1;
        // Reset Total Repairs (Column H) to 0
        assetsSheet.getRange(row, 8).setValue(0);
        // Reset % of Replacement (Column I) to 0
        assetsSheet.getRange(row, 9).setValue(0);
        // Reset Status (Column J) to GOOD
        assetsSheet.getRange(row, 10).setValue('GOOD');
        break;
      }
    }
    
    return { 
      success: true, 
      message: `Deleted ${deletedCount} repairs for ${assetId} and reset totals` 
    };
    
  } catch (error) {
    console.error('Error deleting repairs:', error);
    return { success: false, message: error.toString() };
  }
}

// Delete ALL repairs (use with caution!)
function deleteAllRepairs() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const repairsSheet = spreadsheet.getSheetByName('Repairs');
    const assetsSheet = spreadsheet.getSheetByName('Assets');
    
    if (!repairsSheet) {
      return { success: false, message: 'Repairs sheet not found' };
    }
    
    // Clear all data except headers in Repairs sheet
    const lastRow = repairsSheet.getLastRow();
    if (lastRow > 1) {
      repairsSheet.deleteRows(2, lastRow - 1);
    }
    
    // Reset all assets
    if (assetsSheet) {
      const lastAssetRow = assetsSheet.getLastRow();
      for (let row = 2; row <= lastAssetRow; row++) {
        assetsSheet.getRange(row, 8).setValue(0);  // Total Repairs
        assetsSheet.getRange(row, 9).setValue(0);  // % of Replacement
        assetsSheet.getRange(row, 10).setValue('GOOD'); // Status
      }
    }
    
    return { success: true, message: 'All repairs deleted and all assets reset' };
    
  } catch (error) {
    console.error('Error deleting all repairs:', error);
    return { success: false, message: error.toString() };
  }
}

// Delete a single repair by ID
function deleteRepairById(repairId) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const repairsSheet = spreadsheet.getSheetByName('Repairs');
    
    if (!repairsSheet) {
      return { success: false, message: 'Repairs sheet not found' };
    }
    
    const data = repairsSheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(repairId)) {
        // Found the repair
        const assetId = data[i][1];
        const repairCost = Number(data[i][8]) || 0; // Total cost of this repair
        
        // Delete the row
        repairsSheet.deleteRow(i + 1);
        
        // Recalculate asset totals
        recalculateAssetTotals(assetId);
        
        return { 
          success: true, 
          message: `Deleted repair ${repairId} and updated asset totals` 
        };
      }
    }
    
    return { success: false, message: 'Repair not found' };
    
  } catch (error) {
    console.error('Error deleting repair:', error);
    return { success: false, message: error.toString() };
  }
}

// Recalculate totals for a specific asset based on remaining repairs
function recalculateAssetTotals(assetId) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const repairsSheet = spreadsheet.getSheetByName('Repairs');
    const assetsSheet = spreadsheet.getSheetByName('Assets');
    
    if (!repairsSheet || !assetsSheet) {
      return false;
    }
    
    // Calculate total from remaining repairs
    const repairData = repairsSheet.getDataRange().getValues();
    let totalRepairs = 0;
    
    for (let i = 1; i < repairData.length; i++) {
      if (String(repairData[i][1]) === String(assetId)) {
        totalRepairs += Number(repairData[i][8]) || 0; // Add total cost
      }
    }
    
    // Update asset sheet
    const assetData = assetsSheet.getDataRange().getValues();
    for (let i = 1; i < assetData.length; i++) {
      if (String(assetData[i][0]) === String(assetId)) {
        const row = i + 1;
        const replacementCost = Number(assetData[i][4]) || 0;
        const percentage = replacementCost > 0 ? totalRepairs / replacementCost : 0;
        
        // Update totals
        assetsSheet.getRange(row, 8).setValue(totalRepairs);
        assetsSheet.getRange(row, 9).setValue(percentage);
        
        // Update status
        let status = 'GOOD';
        if (percentage >= 0.75) {
          status = 'REPLACE NOW';
        } else if (percentage >= 0.60) {
          status = 'WARNING - Consider';
        } else if (percentage >= 0.40) {
          status = 'MONITOR';
        }
        assetsSheet.getRange(row, 10).setValue(status);
        
        return true;
      }
    }
    
    return false;
    
  } catch (error) {
    console.error('Error recalculating totals:', error);
    return false;
  }
}

// Test function to delete Echo Blower repairs
function deleteEchoBlowerTestRepairs() {
  return deleteAssetRepairs('Echo Blower PB-580T');
}

// Test function to verify script is working
function testConnection() {
  return "Connected successfully! Script is working.";
}