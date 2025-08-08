let originalData = [];
let filteredData = [];
let currentSort = { column: null, direction: 'asc' };
let monthNames = { month1: null, month2: null };

const fileUpload = document.getElementById('file-upload');
const downloadSample = document.getElementById('download-sample');
const searchInput = document.getElementById('search-input');
const carrierFilter = document.getElementById('carrier-filter');
const zoneFilter = document.getElementById('zone-filter');
const managerFilter = document.getElementById('manager-filter');
const exportBtn = document.getElementById('export-btn');
const tableBody = document.getElementById('table-body');
const loadingOverlay = document.getElementById('loading-overlay');
const month1Label = document.getElementById('month1');
const month2Label = document.getElementById('month2');
const month1Header = document.getElementById('month1-header');
const month2Header = document.getElementById('month2-header');

const totalRecords = document.getElementById('total-records');
const totalMinutesChange = document.getElementById('total-minutes-change');
const totalMarginChange = document.getElementById('total-margin-change');
const avgMinutesChange = document.getElementById('avg-minutes-change');
const showingResults = document.getElementById('showing-results');

document.addEventListener('DOMContentLoaded', function() {
    fileUpload.addEventListener('change', handleFileUpload);
    downloadSample.addEventListener('click', downloadSampleFile);
    searchInput.addEventListener('input', applyFilters);
    carrierFilter.addEventListener('change', applyFilters);
    zoneFilter.addEventListener('change', applyFilters);
    managerFilter.addEventListener('change', applyFilters);
    exportBtn.addEventListener('click', exportResults);
    
    document.querySelectorAll('th[data-sort]').forEach(header => {
        header.addEventListener('click', () => {
            currentSort.column = header.dataset.sort;
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            sortTable(currentSort.column);
        });
    });
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    showLoading(true);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            // Auto-detect month names from column headers
            const headers = Object.keys(jsonData[0] || {});
            monthNames.month1 = headers.find(h => h.includes('Month1'))?.replace('_Month1', '') || headers.find(h => h.match(/Minutes_(\w+)/))?.replace('Minutes_', '') || 'Jun';
            monthNames.month2 = headers.find(h => h.includes('Month2'))?.replace('_Month2', '') || headers.find(h => h.match(/Minutes_(\w+)/) && h !== `Minutes_${monthNames.month1}`)?.replace('Minutes_', '') || 'Jul';
            month1Label.textContent = monthNames.month1;
            month2Label.textContent = monthNames.month2;
            month1Header.textContent = monthNames.month1;
            month2Header.textContent = monthNames.month2;
            
            // Map uploaded data to expected structure with proper decimal handling
            originalData = jsonData.map((row, index) => {
                const minutesMonth1 = parseFloat(row[`Minutes_${monthNames.month1}`]) || parseFloat(row['Minutes_Month1']) || 0;
                const minutesMonth2 = parseFloat(row[`Minutes_${monthNames.month2}`]) || parseFloat(row['Minutes_Month2']) || 0;
                const marginMonth1 = parseFloat(row[`Margin_${monthNames.month1}`]) || parseFloat(row['Margin_Month1']) || 0;
                const marginMonth2 = parseFloat(row[`Margin_${monthNames.month2}`]) || parseFloat(row['Margin_Month2']) || 0;
                const revenueMonth1 = parseFloat(row[`Revenue_${monthNames.month1}`]) || parseFloat(row['Revenue_Month1']) || 0;
                const revenueMonth2 = parseFloat(row[`Revenue_${monthNames.month2}`]) || parseFloat(row['Revenue_Month2']) || 0;
                
                return {
                    id: index,
                    accountManager: row['Account Manager Name'] || '',
                    carrier: row['Carrier'] || '',
                    routingZone: row['Routing Zone'] || '',
                    minutesMonth1: minutesMonth1,
                    minutesMonth2: minutesMonth2,
                    minutesChange: minutesMonth2 - minutesMonth1,
                    minutesChangePercent: minutesMonth1 > 0 ? ((minutesMonth2 - minutesMonth1) / minutesMonth1) * 100 : 0,
                    marginMonth1: marginMonth1,
                    marginMonth2: marginMonth2,
                    marginChange: marginMonth2 - marginMonth1,
                    marginChangePercent: marginMonth1 > 0 ? ((marginMonth2 - marginMonth1) / marginMonth1) * 100 : 0,
                    revenueMonth1: revenueMonth1,
                    revenueMonth2: revenueMonth2
                };
            });
            
            populateFilters();
            applyFilters();
            updateSummary();
            updateCharts();
        } catch (error) {
            alert('Error reading file: ' + error.message);
        } finally {
            showLoading(false);
        }
    };
    
    reader.readAsArrayBuffer(file);
}

function processData(data) {
    originalData = data.map((row, index) => {
        const minutesMonth1 = parseFloat(row['Minutes_Month1']) || 0;
        const minutesMonth2 = parseFloat(row['Minutes_Month2']) || 0;
        const marginMonth1 = parseFloat(row['Margin_Month1']) || 0;
        const marginMonth2 = parseFloat(row['Margin_Month2']) || 0;
        const revenueMonth1 = parseFloat(row['Revenue_Month1']) || 0;
        const revenueMonth2 = parseFloat(row['Revenue_Month2']) || 0;
        
        return {
            id: index,
            accountManager: row['Account Manager Name'] || '',
            carrier: row['Carrier'] || '',
            routingZone: row['Routing Zone'] || '',
            minutesMonth1: minutesMonth1,
            minutesMonth2: minutesMonth2,
            minutesChange: minutesMonth2 - minutesMonth1,
            minutesChangePercent: minutesMonth1 > 0 ? ((minutesMonth2 - minutesMonth1) / minutesMonth1) * 100 : 0,
            marginMonth1: marginMonth1,
            marginMonth2: marginMonth2,
            marginChange: marginMonth2 - marginMonth1,
            marginChangePercent: marginMonth1 > 0 ? ((marginMonth2 - marginMonth1) / marginMonth1) * 100 : 0,
            revenueMonth1: revenueMonth1,
            revenueMonth2: revenueMonth2
        };
    });
    
    populateFilters();
    applyFilters();
    updateSummary();
    updateCharts();
}

function populateFilters() {
    const carriers = [...new Set(originalData.map(row => row.carrier))].filter(Boolean).sort();
    const zones = [...new Set(originalData.map(row => row.routingZone))].filter(Boolean).sort();
    const managers = [...new Set(originalData.map(row => row.accountManager))].filter(Boolean).sort();
    
    populateSelect(carrierFilter, carriers, 'All Carriers');
    populateSelect(zoneFilter, zones, 'All Zones');
    populateSelect(managerFilter, managers, 'All Managers');
}

function populateSelect(selectElement, options, defaultText) {
    selectElement.innerHTML = `<option value="">${defaultText}</option>`;
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        selectElement.appendChild(optionElement);
    });
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const carrierValue = carrierFilter.value;
    const zoneValue = zoneFilter.value;
    const managerValue = managerFilter.value;
    
    filteredData = originalData.filter(row => {
        const matchesSearch = !searchTerm || row.carrier.toLowerCase().includes(searchTerm) || row.accountManager.toLowerCase().includes(searchTerm);
        const matchesCarrier = !carrierValue || row.carrier === carrierValue;
        const matchesZone = !zoneValue || row.routingZone === zoneValue;
        const matchesManager = !managerValue || row.accountManager === managerValue;
        
        return matchesSearch && matchesCarrier && matchesZone && matchesManager;
    });
    
    renderTable();
    updateSummary();
    updateCharts();
}

function sortTable(column) {
    filteredData.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return currentSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
        
        return currentSort.direction === 'asc' ? 
            aVal < bVal ? -1 : aVal > bVal ? 1 : 0 : 
            aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });
    
    renderTable();
    updateSortIcons();
}

function updateSortIcons() {
    document.querySelectorAll('th[data-sort] .sort-icon').forEach(icon => {
        icon.textContent = '↕️';
    });
    
    if (currentSort.column) {
        const activeHeader = document.querySelector(`th[data-sort="${currentSort.column}"]`);
        if (activeHeader) {
            const icon = activeHeader.querySelector('.sort-icon') || document.createElement('span');
            icon.className = 'sort-icon';
            icon.textContent = currentSort.direction === 'asc' ? '↑' : '↓';
            activeHeader.appendChild(icon);
        }
    }
}

function renderTable() {
    tableBody.innerHTML = '';
    
    filteredData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.accountManager}</td>
            <td>${row.carrier}</td>
            <td>${row.routingZone}</td>
            <td>${formatNumber(row.minutesMonth1)}</td>
            <td>$${formatNumber(row.marginMonth1)}</td>
            <td>$${row.revenueMonth1.toFixed(4)}</td> <!-- Rated Min Revenue with 4 decimals -->
            <td class="comparison bold">${formatChange(row.minutesChange)}</td>
            <td class="comparison bold">${formatPercentage(row.minutesChangePercent)}</td>
            <td class="comparison bold">$${formatChange(row.marginChange)}</td>
            <td>${formatNumber(row.minutesMonth2)}</td>
            <td>$${formatNumber(row.marginMonth2)}</td>
            <td>$${row.revenueMonth2.toFixed(4)}</td> <!-- Rated Min Revenue with 4 decimals -->
        `;
        tableBody.appendChild(tr);
    });
    
    showingResults.textContent = `Showing ${filteredData.length} of ${originalData.length} results`;
}

function updateSummary() {
    const totalMinutes = filteredData.reduce((sum, row) => sum + row.minutesChange, 0);
    const totalMargin = filteredData.reduce((sum, row) => sum + row.marginChange, 0);
    const avgMinutesChangeValue = filteredData.length > 0 ? 
        filteredData.reduce((sum, row) => sum + row.minutesChangePercent, 0) / filteredData.length : 0;
    
    totalRecords.textContent = filteredData.length;
    totalMinutesChange.textContent = formatChange(totalMinutes);
    totalMinutesChange.className = getChangeClass(totalMinutes);
    totalMarginChange.textContent = '$' + formatChange(totalMargin);
    totalMarginChange.className = getChangeClass(totalMargin);
    avgMinutesChange.textContent = formatPercentage(avgMinutesChangeValue);
    avgMinutesChange.className = getChangeClass(avgMinutesChangeValue);
}

let minutesCarrierChart = null;
let marginCarrierChart = null;
let minutesZoneChart = null;
let marginZoneChart = null;

function updateCharts() {
    updateMinutesCarrierChart();
    updateMarginCarrierChart();
    updateMinutesZoneChart();
    updateMarginZoneChart();
}

function updateMinutesCarrierChart() {
    const ctx = document.getElementById('minutes-carrier-chart').getContext('2d');
    const carrierData = aggregateByCarrier(filteredData, 'minutesChange');
    const topCarriers = carrierData.slice(0, 10);
    
    const labels = topCarriers.map(item => item.carrier);
    const data = topCarriers.map(item => item.value);
    const colors = data.map(value => value > 0 ? '#F44336' : value < 0 ? '#2196F3' : '#d3d3d3');
    
    if (minutesCarrierChart) minutesCarrierChart.destroy();
    minutesCarrierChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: `Mins Change (${monthNames.month1} to ${monthNames.month2})`, data, backgroundColor: colors, borderColor: colors, borderWidth: 1, borderRadius: 5 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top', labels: { font: { size: 14 } } }, tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { size: 14 }, bodyFont: { size: 12 }, callbacks: { label: ctx => `Mins Change: ${ctx.parsed.y >= 0 ? '+' : ''}${formatNumber(ctx.parsed.y)}` } } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' }, ticks: { font: { size: 12 }, callback: value => formatNumber(value) } }, x: { grid: { display: false }, ticks: { font: { size: 12 }, maxRotation: 45, minRotation: 45 } } }
        }
    });
}

function updateMarginCarrierChart() {
    const ctx = document.getElementById('margin-carrier-chart').getContext('2d');
    const carrierData = aggregateByCarrier(filteredData, 'marginChange');
    const topCarriers = carrierData.slice(0, 10);
    
    const labels = topCarriers.map(item => item.carrier);
    const data = topCarriers.map(item => item.value);
    const colors = data.map(value => value > 0 ? '#F44336' : value < 0 ? '#2196F3' : '#d3d3d3');
    
    if (marginCarrierChart) marginCarrierChart.destroy();
    marginCarrierChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: `Margin Change (${monthNames.month1} to ${monthNames.month2})`, data, backgroundColor: colors, borderColor: colors, borderWidth: 1, borderRadius: 5 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top', labels: { font: { size: 14 } } }, tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { size: 14 }, bodyFont: { size: 12 }, callbacks: { label: ctx => `Margin Change: $${ctx.parsed.y >= 0 ? '+' : ''}${formatNumber(Math.abs(ctx.parsed.y))}` } } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' }, ticks: { font: { size: 12 }, callback: value => '$' + formatNumber(value) } }, x: { grid: { display: false }, ticks: { font: { size: 12 }, maxRotation: 45, minRotation: 45 } } }
        }
    });
}

function updateMinutesZoneChart() {
    const ctx = document.getElementById('minutes-zone-chart').getContext('2d');
    const zoneData = aggregateByZone(filteredData, 'minutesChange');
    const topZones = zoneData.slice(0, 10);
    
    const labels = topZones.map(item => item.zone);
    const data = topZones.map(item => item.value);
    const colors = data.map(value => value > 0 ? '#F44336' : value < 0 ? '#2196F3' : '#d3d3d3');
    
    if (minutesZoneChart) minutesZoneChart.destroy();
    minutesZoneChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: `Mins Change (${monthNames.month1} to ${monthNames.month2})`, data, backgroundColor: colors, borderColor: colors, borderWidth: 1, borderRadius: 5 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top', labels: { font: { size: 14 } } }, tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { size: 14 }, bodyFont: { size: 12 }, callbacks: { label: ctx => `Mins Change: ${ctx.parsed.y >= 0 ? '+' : ''}${formatNumber(ctx.parsed.y)}` } } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' }, ticks: { font: { size: 12 }, callback: value => formatNumber(value) } }, x: { grid: { display: false }, ticks: { font: { size: 12 }, maxRotation: 45, minRotation: 45 } } }
        }
    });
}

function updateMarginZoneChart() {
    const ctx = document.getElementById('margin-zone-chart').getContext('2d');
    const zoneData = aggregateByZone(filteredData, 'marginChange');
    const topZones = zoneData.slice(0, 10);
    
    const labels = topZones.map(item => item.zone);
    const data = topZones.map(item => item.value);
    const colors = data.map(value => value > 0 ? '#F44336' : value < 0 ? '#2196F3' : '#d3d3d3');
    
    if (marginZoneChart) marginZoneChart.destroy();
    marginZoneChart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: `Margin Change (${monthNames.month1} to ${monthNames.month2})`, data, backgroundColor: colors, borderColor: colors, borderWidth: 1, borderRadius: 5 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'top', labels: { font: { size: 14 } } }, tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', titleFont: { size: 14 }, bodyFont: { size: 12 }, callbacks: { label: ctx => `Margin Change: $${ctx.parsed.y >= 0 ? '+' : ''}${formatNumber(Math.abs(ctx.parsed.y))}` } } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' }, ticks: { font: { size: 12 }, callback: value => '$' + formatNumber(value) } }, x: { grid: { display: false }, ticks: { font: { size: 12 }, maxRotation: 45, minRotation: 45 } } }
        }
    });
}

function aggregateByCarrier(data, field) {
    const carrierMap = new Map();
    data.forEach(row => {
        const carrier = row.carrier;
        if (carrierMap.has(carrier)) {
            carrierMap.set(carrier, carrierMap.get(carrier) + row[field]);
        } else {
            carrierMap.set(carrier, row[field]);
        }
    });
    return Array.from(carrierMap.entries())
        .map(([carrier, value]) => ({ carrier, value }))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}

function aggregateByZone(data, field) {
    const zoneMap = new Map();
    data.forEach(row => {
        const zone = row.routingZone;
        if (zoneMap.has(zone)) {
            zoneMap.set(zone, zoneMap.get(zone) + row[field]);
        } else {
            zoneMap.set(zone, row[field]);
        }
    });
    return Array.from(zoneMap.entries())
        .map(([zone, value]) => ({ zone, value }))
        .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
}

function formatNumber(num) { return num % 1 === 0 ? new Intl.NumberFormat().format(Math.round(num)) : num.toFixed(2); }
function formatChange(num) { const formatted = num % 1 === 0 ? formatNumber(Math.abs(num)) : Math.abs(num).toFixed(2); return num >= 0 ? `+${formatted}` : `-${formatted}`; }
function formatPercentage(num) { return `${num >= 0 ? '+' : ''}${num.toFixed(1)}%`; }
function getChangeClass(value) { return value > 0 ? 'positive-change' : value < 0 ? 'negative-change' : 'neutral-change'; }
function showLoading(show) { loadingOverlay.classList.toggle('hidden', !show); }

function downloadSampleFile() {
    const sampleData = [
        { 'Account Manager Name': 'John Doe', 'Carrier': 'TELIA', 'Routing Zone': 'Tajikistan_All', 'Minutes_Jun': 11796, 'Margin_Jun': 590, 'Revenue_Jun': 0.1400 },
        { 'Account Manager Name': 'Jane Smith', 'Carrier': 'VENTATEL', 'Routing Zone': 'Tajikistan_All', 'Minutes_Jun': 1679, 'Margin_Jun': 7, 'Revenue_Jun': 0.0840 },
        { 'Account Manager Name': 'John Doe', 'Carrier': 'WANANACHI TELECOM', 'Routing Zone': 'Nigeria_All', 'Minutes_Jun': 13032, 'Margin_Jun': 115, 'Revenue_Jun': 0.0562 },
        { 'Account Manager Name': 'Alice Brown', 'Carrier': 'CHAT LINK', 'Routing Zone': 'Afg_Roshan_All', 'Minutes_Jun': 109879, 'Margin_Jun': 1648, 'Revenue_Jun': 0.1300 },
        { 'Account Manager Name': 'John Doe', 'Carrier': 'TELIA', 'Routing Zone': 'Tajikistan_All', 'Minutes_Jul': 57297, 'Margin_Jul': 1719, 'Revenue_Jul': 0.1200 },
        { 'Account Manager Name': 'Jane Smith', 'Carrier': 'VENTATEL', 'Routing Zone': 'Tajikistan_All', 'Minutes_Jul': 41963, 'Margin_Jul': 2098, 'Revenue_Jul': 0.1400 },
        { 'Account Manager Name': 'John Doe', 'Carrier': 'WANANACHI TELECOM', 'Routing Zone': 'Nigeria_All', 'Minutes_Jul': 128366, 'Margin_Jul': 834, 'Revenue_Jul': 0.0869 },
        { 'Account Manager Name': 'Alice Brown', 'Carrier': 'CHAT LINK', 'Routing Zone': 'Spain_All', 'Minutes_Jul': 133015, 'Margin_Jul': 511, 'Revenue_Jul': 0.0136 }
    ];
    
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CDR Data');
    XLSX.writeFile(wb, 'cdr_sample_data.xlsx');
}

function exportResults() {
    if (filteredData.length === 0) {
        alert('No data to export');
        return;
    }
    
    const exportData = filteredData.map(row => ({
        'Account Manager': row.accountManager,
        'Carrier': row.carrier,
        'Routing Zone': row.routingZone,
        [`Rated Minutes ${monthNames.month1}`]: row.minutesMonth1,
        [`Total Margin ${monthNames.month1}`]: row.marginMonth1,
        [`Rated Min Revenue ${monthNames.month1}`]: row.revenueMonth1,
        [`Mins Inc/Dec ${monthNames.month2} - ${monthNames.month1}`]: row.minutesChange,
        [`Mins Inc/Dec % ${monthNames.month2} - ${monthNames.month1}`]: row.minutesChangePercent.toFixed(2) + '%',
        [`Margin Inc/Dec ${monthNames.month2} - ${monthNames.month1}`]: row.marginChange,
        [`Rated Minutes ${monthNames.month2}`]: row.minutesMonth2,
        [`Total Margin ${monthNames.month2}`]: row.marginMonth2,
        [`Rated Min Revenue ${monthNames.month2}`]: row.revenueMonth2
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CDR Comparison Results');
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    XLSX.writeFile(wb, `cdr_comparison_results_${timestamp}.xlsx`);
}