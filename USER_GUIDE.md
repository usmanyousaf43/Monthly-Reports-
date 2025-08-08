# CDR Comparison Tool - User Guide

## Overview

The CDR (Call Detail Record) Comparison Tool is a web-based application designed to compare two months of telecommunications data. It provides comprehensive analysis, visualization, and reporting capabilities to help identify trends and changes in customer usage patterns.

## Features

### Data Upload and Processing
- **Excel File Upload**: Upload Excel files (.xlsx, .xls) containing CDR data
- **Automatic Data Processing**: Calculates minutes and margin changes between two months
- **Data Validation**: Handles missing data gracefully and validates numerical fields

### Data Structure Requirements

Your Excel file should contain the following columns:
- `Account Manager Name`: Name of the account manager
- `Customer`: Customer name
- `Carrier`: Telecommunications carrier
- `Routing Zone`: Geographic or logical routing zone
- `Minutes_Month1`: Minutes for the first month
- `Margin_Month1`: Margin for the first month
- `Revenue_Month1`: Revenue for the first month
- `Minutes_Month2`: Minutes for the second month
- `Margin_Month2`: Margin for the second month
- `Revenue_Month2`: Revenue for the second month

### Search and Filtering
- **Customer Search**: Search for specific customers using the search bar
- **Carrier Filter**: Filter data by telecommunications carrier
- **Zone Filter**: Filter data by routing zone
- **Manager Filter**: Filter data by account manager

### Data Analysis
- **Summary Cards**: View total records, total minutes change, total margin change, and average minutes change percentage
- **Comparison Calculations**: Automatic calculation of:
  - Minutes change (Month 2 - Month 1)
  - Margin change (Month 2 - Month 1)
  - Percentage changes for both metrics

### Visualizations
- **Top Clients by Minutes Change**: Bar chart showing customers with the highest absolute minutes changes
- **Top Clients by Margin Change**: Bar chart showing customers with the highest absolute margin changes
- **Color Coding**: Green bars for positive changes, red bars for negative changes

### Table Features
- **Sortable Columns**: Click on any column header to sort data in ascending/descending order
- **Color-Coded Changes**: 
  - Green text for positive changes
  - Red text for negative changes
  - Gray text for no change
- **Formatted Numbers**: Automatic number formatting with thousands separators

### Export and Download
- **Export Results**: Export filtered and processed data to Excel format
- **Sample File Download**: Download a sample Excel file to understand the required data structure
- **Timestamped Exports**: Exported files include timestamp in filename

## How to Use

### Step 1: Upload Data
1. Click the "📁 Upload Excel File" button
2. Select your CDR data file from your computer
3. Wait for the data to be processed (loading indicator will appear)

### Step 2: Explore Data
1. Review the summary cards for overall insights
2. Examine the charts to identify top affected clients
3. Browse the comparison table for detailed record-by-record analysis

### Step 3: Filter and Search
1. Use the search bar to find specific customers
2. Apply filters using the dropdown menus for carrier, zone, or manager
3. Click column headers to sort data by different criteria

### Step 4: Export Results
1. Apply any desired filters or search criteria
2. Click "📊 Export Results" to download the filtered data
3. The exported file will include all calculated changes and percentages

## Sample Data

If you don't have data ready, click "📥 Download Sample" to get a sample Excel file that demonstrates the correct data structure and format.

## Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No internet connection required after initial page load
- All processing happens locally in your browser

## Data Privacy

- All data processing occurs locally in your browser
- No data is sent to external servers
- Your CDR data remains completely private and secure

## Troubleshooting

### File Upload Issues
- Ensure your file is in Excel format (.xlsx or .xls)
- Check that all required columns are present
- Verify that numerical fields contain valid numbers

### Performance Issues
- Large files (>1000 records) may take longer to process
- Close other browser tabs if experiencing slowdowns
- Refresh the page if the application becomes unresponsive

### Chart Display Issues
- Ensure your browser supports modern JavaScript features
- Try refreshing the page if charts don't appear
- Check that you have data loaded before expecting charts to display

## Support

For technical support or questions about the CDR Comparison Tool, please contact your system administrator or IT support team.

