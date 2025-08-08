# CDR Comparison Tool

## Project Plan

### Phase 1: Plan and design the CDR comparison tool architecture

#### 1.1 Overall Architecture

The tool will be a single-page web application built using HTML, CSS, and JavaScript. It will run entirely client-side, meaning no backend server is required for its core functionality. Data will be uploaded via Excel files directly in the browser.

#### 1.2 Data Structure

The CDR data will be structured to include the following fields for each record:
- Account Manager Name
- Customer
- Carrier
- Routing Zone
- Minutes (Month 1)
- Total Margin (Month 1)
- Revenue (Month 1)
- Minutes (Month 2)
- Total Margin (Month 2)
- Revenue (Month 2)

For comparison, the tool will calculate:
- Minutes Change (Month 2 - Month 1)
- Total Margin Change (Month 2 - Month 1)

#### 1.3 Key Libraries/Frameworks

- **HTML5**: For the basic structure of the web page.
- **CSS3**: For styling and layout, potentially using a lightweight framework like [Tailwind CSS](https://tailwindcss.com/) or [Bootstrap](https://getbootstrap.com/) for rapid development and responsiveness.
- **JavaScript (ES6+)**: For all interactive functionality, data processing, and dynamic content generation.
- **[SheetJS (js-xlsx)](https://sheetjs.com/)**: For parsing Excel files (`.xlsx`, `.xls`).
- **[Chart.js](https://www.chartjs.org/) or [D3.js](https://d3js.org/)**: For creating interactive charts and visualizations. Chart.js is simpler for common chart types, while D3.js offers more flexibility for custom visualizations. Given the requirement for 


charts highlighting affected clients, Chart.js might be sufficient and easier to integrate.

#### 1.4 Design Principles

- **Clean and Modern UI**: Focus on a minimalist design with clear typography and intuitive navigation.
- **User-Friendly**: Easy-to-understand interface with clear labels and actionable elements.
- **Responsive Design**: The tool should be usable across different devices (desktop, tablet, mobile).
- **Interactive**: Search, filter, and sort functionalities should be highly responsive.
- **Visualizations**: Charts should clearly highlight changes and trends, making complex data easily digestible.

### Phase 2: Create sample Excel file and data structure

#### 2.1 Sample Data Fields

- Account Manager Name
- Customer
- Carrier
- Routing Zone
- Minutes_Month1
- Margin_Month1
- Revenue_Month1
- Minutes_Month2
- Margin_Month2
- Revenue_Month2

#### 2.2 Data Validation

- Ensure numerical fields contain valid numbers.
- Handle missing data gracefully.

### Phase 3: Build the HTML structure and CSS styling

#### 3.1 HTML Structure

- Main layout for dashboard, tables, and charts.
- Input elements for file upload, search, and filters.
- Buttons for download and export.

#### 3.2 CSS Styling

- Implement a clean, modern aesthetic.
- Ensure responsiveness for various screen sizes.
- Define styles for tables, charts, and interactive elements.

### Phase 4: Implement JavaScript functionality for data processing and comparison

#### 4.1 Excel File Upload and Parsing

- Use SheetJS to read and parse uploaded Excel files.
- Convert parsed data into a structured JavaScript object/array.

#### 4.2 Data Comparison Logic

- Calculate `Minutes Change` and `Margin Change`.
- Group data by customer and destination for comparison.

#### 4.3 Search, Filter, and Sort

- Implement search functionality by customer name.
- Add filters for various data points (e.g., carrier, routing zone).
- Enable sorting for all table columns.

### Phase 5: Add charts and visualization components

#### 5.1 Chart Integration

- Use Chart.js to create bar charts for top clients and destinations.
- Visualize minutes and margin changes.

#### 5.2 Dynamic Updates

- Charts and tables should update dynamically based on search, filter, and sort actions.

### Phase 6: Test the application and create deployment package

#### 6.1 Unit and Integration Testing

- Test data parsing, comparison logic, and UI interactions.
- Ensure all features work as expected.

#### 6.2 Deployment Package

- Bundle HTML, CSS, and JavaScript files for easy deployment.

### Phase 7: Deploy and deliver the final web tool to user

#### 7.1 Deployment

- Provide instructions for deploying the static web application.

#### 7.2 User Handover

- Deliver the final tool and any necessary documentation to the user.

