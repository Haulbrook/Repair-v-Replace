# 🚀 Google Apps Script Deployment Instructions

## Complete Setup Guide for Asset Management System

Follow these steps carefully to deploy your beautiful new frontend to Google Apps Script and connect it to your spreadsheet.

---

## 📋 Prerequisites

- Google account with access to Google Sheets
- Your existing Asset Management spreadsheet with:
  - **Assets** sheet (with columns: Asset ID, Name, Category, Purchase Date, Replacement Cost, Threshold %, Threshold Amount, Total Repairs, % of Replacement, Status, Days Since Purchase)
  - **Repairs** sheet (with repair history data)
- The Code.gs file with all backend functions (you already have this!)

---

## 🔧 Step-by-Step Deployment

### **Step 1: Open Your Spreadsheet**

1. Open your existing Asset Management Google Spreadsheet
2. Click on **Extensions** → **Apps Script**
3. This will open the Apps Script editor

### **Step 2: Verify Your Code.gs**

1. You should see your existing `Code.gs` file with all the backend functions
2. Make sure it contains these key functions:
   - `doGet()`
   - `getAssets()`
   - `getRepairs()`
   - `addRepair(repairData)`
   - `getDashboardStats()`
   - `deleteAssetRepairs(assetId)`
   - `deleteRepairById(repairId)`

3. **IMPORTANT**: Update the `doGet()` function to match this:

```javascript
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
```

### **Step 3: Add the HTML Files**

1. In the Apps Script editor, click the **+** (plus) button next to "Files"
2. Select **HTML** file
3. Name it **`index`** (without .html extension)
4. Copy and paste the entire contents of `index.html` from this folder
5. Click **Save** (disk icon or Ctrl+S)

6. Repeat for the styles:
   - Click **+** → **HTML**
   - Name it **`styles`**
   - Copy and paste the entire contents of `styles.html`
   - Click **Save**

7. Repeat for the JavaScript:
   - Click **+** → **HTML**
   - Name it **`javascript`**
   - Copy and paste the entire contents of `javascript.html`
   - Click **Save**

### **Step 4: Deploy as Web App**

1. In the Apps Script editor, click **Deploy** → **New deployment**

2. Click the gear icon ⚙️ next to "Select type"

3. Choose **Web app**

4. Fill in the details:
   - **Description**: "Asset Management System v1" (or your version)
   - **Execute as**: **Me** (your email)
   - **Who has access**: Choose one:
     - **Only myself** (most secure, only you can access)
     - **Anyone within [your organization]** (if using Google Workspace)
     - **Anyone** (public access - use with caution!)

5. Click **Deploy**

6. **Authorization Required**:
   - Click **Authorize access**
   - Select your Google account
   - Click **Advanced** if you see a warning
   - Click **Go to [Your Project Name] (unsafe)** - this is safe, it's your own script!
   - Click **Allow** to grant permissions

7. **Copy Your Web App URL**:
   - You'll see a URL like: `https://script.google.com/macros/s/[LONG_ID]/exec`
   - **Copy this URL** - this is your application!
   - Click **Done**

### **Step 5: Test Your Application**

1. Open the Web App URL you just copied in a new browser tab

2. **You should see**:
   - Beautiful gradient design with your branding
   - Dashboard with real statistics from your spreadsheet
   - Your actual assets displayed in the table
   - Repair history showing all repairs

3. **Test the functionality**:
   - Click through different sections (Dashboard, Assets, Add Repair, History)
   - Try adding a test repair
   - Verify the numbers update
   - Test the theme toggle (light/dark mode)

### **Step 6: Troubleshooting**

If something doesn't work:

#### **Problem: "Script function not found: doGet"**
**Solution**: Make sure your Code.gs has the `doGet()` function at the top

#### **Problem: "Cannot read property 'length' of null"**
**Solution**: Check that your spreadsheet has sheets named exactly "Assets" and "Repairs"

#### **Problem: Data not showing**
**Solution**:
1. Open Apps Script editor
2. Click **Execution log** (clock icon)
3. Check for errors
4. Try running `getAssets()` function manually to test

#### **Problem: Authorization errors**
**Solution**: Redeploy the web app and go through authorization again

---

## 📱 Using Your Application

### **Dashboard**
- View all key metrics at a glance
- See assets requiring attention
- Monitor total repair costs

### **Assets Tab**
- View all your assets
- See current repair totals and percentages
- Clear repairs for individual assets (resets to $0)

### **Add Repair Tab**
1. Select an asset from dropdown
2. View current asset information
3. Enter repair date (defaults to today)
4. Enter part name/description
5. Enter part cost
6. Enter labor hours and rate
7. See live cost preview
8. Add optional notes
9. Click "Add Repair Record"

### **History Tab**
- View all repairs across all assets
- Search by asset ID or part name
- Filter by specific asset
- Delete individual repairs if needed

---

## 🔄 Making Updates

When you want to make changes:

1. **For HTML/CSS/JavaScript changes**:
   - Edit the respective file in Apps Script editor
   - Click **Save**
   - **Refresh your browser** - changes appear immediately!

2. **For Code.gs (backend) changes**:
   - Edit Code.gs
   - Click **Save**
   - **Create new deployment** or **manage deployments** → **Edit** existing one → **Version**: New version
   - Changes will be live

3. **Quick tip**: During development, keep the Apps Script editor open in one tab and your Web App in another. Save in editor, refresh in browser to see changes instantly!

---

## 🎨 Customization

### **Change Colors**
Edit `styles.html` and modify the CSS variables:
```css
:root {
  --color-primary: #667eea;  /* Change primary color */
  --color-secondary: #764ba2; /* Change secondary color */
  /* ... more colors ... */
}
```

### **Change Branding**
In `index.html`, find the logo section and update text:
```html
<span class="logo-text">Your<span class="logo-separator">Company</span></span>
```

### **Add Features**
- Edit `javascript.html` for frontend logic
- Edit `Code.gs` for backend functions
- Coordinate data flow between them

---

## 🔒 Security Best Practices

1. **Keep deployment set to "Only myself"** unless you need to share
2. **Never share your Web App URL publicly** if it contains sensitive data
3. **Review who has edit access** to your spreadsheet
4. **Use "Anyone within [organization]"** for company-wide deployment

---

## 📊 Your Spreadsheet Structure

Make sure your spreadsheet matches this structure:

### **Assets Sheet Columns** (A-K):
- A: Asset ID
- B: Name
- C: Category
- D: Purchase Date
- E: Replacement Cost
- F: Threshold %
- G: Threshold Amount (calculated)
- H: Total Repairs
- I: % of Replacement
- J: Status
- K: Days Since Purchase

### **Repairs Sheet Columns** (A-M):
- A: Repair ID
- B: Asset ID
- C: Repair Date
- D: Part Name
- E: Part Cost
- F: Labor Hours
- G: Labor Rate
- H: Labor Cost
- I: Total Cost
- J: Running Total
- K: % of Replacement
- L: Notes
- M: Timestamp

---

## 🎯 What You've Gained

✅ **Beautiful, modern interface** with gradient design
✅ **Real-time data** from your spreadsheet
✅ **Dark/light theme** toggle
✅ **Mobile-responsive** design
✅ **Dashboard statistics** with visual charts
✅ **Easy repair tracking** with live cost preview
✅ **Complete repair history** with search and filter
✅ **Smart status tracking** (GOOD, MONITOR, WARNING, REPLACE)
✅ **One-click asset management**

---

## 💡 Pro Tips

1. **Bookmark your Web App URL** for quick access
2. **Add to home screen** on mobile devices for app-like experience
3. **Use Ctrl+F** in spreadsheet to quickly find asset IDs
4. **Export to PDF**: Use browser's print function with "Save as PDF"
5. **Share with team**: Give them view/edit access to spreadsheet AND share Web App URL

---

## 📞 Need Help?

Common issues and solutions:

**Q: Can I use this offline?**
A: No, it requires internet connection to access Google Sheets

**Q: Can multiple people use it at once?**
A: Yes! Each person gets their own session, data updates in real-time

**Q: Will this affect my existing data?**
A: No, it only reads and adds to your sheets, never deletes data unless you click "Clear Repairs" or "Delete"

**Q: Can I export the data?**
A: Yes, use Google Sheets' export functions (File → Download)

---

## 🎉 You're All Set!

Your asset management system is now live with a beautiful, professional interface!

**Your Web App URL is your new application**. Share it with your team, bookmark it, and enjoy managing your assets with style! 🚀

---

**Last updated**: 2024
**Version**: 1.0
**Built with**: Google Apps Script, HTML, CSS, JavaScript
