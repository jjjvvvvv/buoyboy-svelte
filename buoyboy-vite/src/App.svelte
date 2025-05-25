<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</svelte:head>

<script>
  import { onMount, onDestroy, tick} from 'svelte';
  import Chart from 'chart.js/auto'; // This registers everything needed
  import 'chartjs-adapter-date-fns'; // This makes time scale work!

  // --- Buoy station metadata: Copy-paste your station objects array below ---
  const stations = [
  { id: "41008", name: "GRAYS REEF - 40 NM Southeast of Savannah, GA", lat: 31.4, lon: -80.866 },
  { id: "41009", name: "CANAVERAL 20 NM East of Cape Canaveral, FL", lat: 28.508, lon: -80.185 },
  { id: "41010", name: "CANAVERAL EAST - 120NM East of Cape Canaveral", lat: 28.878, lon: -78.467 },
  { id: "41013", name: "Frying Pan Shoals, NC", lat: 33.441, lon: -77.764 },
  { id: "41040", name: "NORTH EQUATORIAL ONE- 470 NM East of Martinique", lat: 14.536, lon: -53.136 },
  { id: "41044", name: "NE ST MARTIN - 330 NM NE St Martin Is", lat: 21.582, lon: -58.63 },
  { id: "41052", name: "South of St. John, VI", lat: 18.249, lon: -64.763 },
  { id: "41053", name: "San Juan, PR", lat: 18.474, lon: -66.099 },
  { id: "41056", name: "Vieques Island, PR", lat: 18.261, lon: -65.464 },
  { id: "41067", name: "FRP2WAVE", lat: 32.276, lon: -80.406 },
  { id: "41070", name: "Ponce de Leon Inlet Waves (PNCWAVE)", lat: 29.289, lon: -80.803 },
  { id: "41076", name: "CHR60WAVE", lat: 32.536, lon: -79.659 },
  { id: "41082", name: "OOI Pioneer - Mid-Atlantic Bight Central Surface Mooring", lat: 35.95, lon: -75.125 },
  { id: "41083", name: "OOI Pioneer - Mid-Atlantic Bight Southern Surface Mooring", lat: 35.725, lon: -74.853 },
  { id: "41108", name: "Wilmington Harbor, NC - (200)", lat: 33.721, lon: -78.016 },
  { id: "41110", name: "Masonboro Inlet, ILM2, NC (150)", lat: 34.142, lon: -77.715 },
  { id: "41112", name: "Offshore Fernandina Beach, FL (132)", lat: 30.709, lon: -81.292 },
  { id: "41113", name: "Cape Canaveral Nearshore, FL (143)", lat: 28.4, lon: -80.533 },
  { id: "41114", name: "Fort Pierce, FL (134)", lat: 27.552, lon: -80.216 },
  { id: "41115", name: "Rincon, Puerto Rico (181)", lat: 18.376, lon: -67.28 },
  { id: "41117", name: "St. Augustine, FL (194)", lat: 29.999, lon: -81.079 },
  { id: "41120", name: "Cape Hatteras East, NC (250)", lat: 35.258, lon: -75.285 },
  { id: "41122", name: "Hollywood Beach, FL (265)", lat: 26.001, lon: -80.096 },
  { id: "41159", name: "Onslow Bay Outer, NC (217)", lat: 34.211, lon: -76.944 },
  { id: "42012", name: "ORANGE BEACH - 44 NM SE of Mobile, AL", lat: 30.06, lon: -87.548 },
  { id: "42019", name: "FREEPORT, TX - 60 NM South of Freeport, TX", lat: 27.908, lon: -95.343 },
  { id: "42020", name: "CORPUS CHRISTI, TX - 60NM SSE of Corpus Christi, TX", lat: 26.97, lon: -96.679 },
  { id: "42036", name: "WEST TAMPA  - 112 NM WNW of Tampa, FL", lat: 28.5, lon: -84.505 },
  { id: "42057", name: "Western Caribbean - 195 NM WSW of Negril, Jamaica", lat: 16.975, lon: -81.578 },
  { id: "42084", name: "Southwest Pass Entrance W, LA (256)", lat: 28.988, lon: -89.649 },
  { id: "42085", name: "Southeast of Ponce, PR", lat: 17.87, lon: -66.537 },
  { id: "42091", name: "Trinity Shoal, LA (255)", lat: 29.088, lon: -92.505 },
  { id: "42095", name: "Satan Shoal, FL (244)", lat: 24.409, lon: -81.968 },
  { id: "42097", name: "Pulley Ridge, FL (226)", lat: 25.7, lon: -83.641 },
  { id: "42098", name: "Egmont Channel Entrance, FL (214)", lat: 27.59, lon: -82.931 },
  { id: "42099", name: "Offshore St. Petersburg, FL (144)", lat: 27.352, lon: -84.275 },
  { id: "42354", name: "Chandeleur Island SE, LA (279)", lat: 29.579, lon: -88.643 },
  { id: "44007", name: "PORTLAND - 12 NM Southeast of Portland,ME", lat: 43.525, lon: -70.14 },
  { id: "44008", name: "NANTUCKET 54 NM Southeast of Nantucket", lat: 40.5, lon: -69.254 },
  { id: "44009", name: "DELAWARE BAY 26 NM Southeast of Cape May, NJ", lat: 38.46, lon: -74.692 },
  { id: "44013", name: "BOSTON 16 NM East of Boston, MA", lat: 42.346, lon: -70.651 },
  { id: "44014", name: "VIRGINIA BEACH 64 NM East of Virginia Beach, VA", lat: 36.603, lon: -74.837 },
  { id: "44017", name: "MONTAUK POINT - 23 NM SSW of Montauk Point, NY", lat: 40.693, lon: -72.049 },
  { id: "44025", name: "LONG ISLAND - 30 NM South of Islip, NY", lat: 40.258, lon: -73.175 },
  { id: "44056", name: "Duck FRF, NC", lat: 36.2, lon: -75.714 },
  { id: "44065", name: "New York Harbor Entrance - 15 NM SE of Breezy Point , NY", lat: 40.368, lon: -73.701 },
  { id: "44078", name: "OOI Irminger Sea Surface Mooring", lat: 59.94, lon: -39.52 },
  { id: "44079", name: "OOI Pioneer - Mid-Atlantic Bight Northern Surface Mooring", lat: 36.175, lon: -74.827 },
  { id: "44084", name: "Bethany Beach, DE (263)", lat: 38.537, lon: -75.044 },
  { id: "44085", name: "Buzzards Bay, MA (260)", lat: 41.387, lon: -71.032 },
  { id: "44086", name: "Nags Head, NC (243)", lat: 36.001, lon: -75.421 },
  { id: "44088", name: "Virginia Beach Offshore, VA (171)", lat: 36.612, lon: -74.839 },
  { id: "44090", name: "Cape Cod Bay, MA (221)", lat: 41.84, lon: -70.329 },
  { id: "44091", name: "Barnegat, NJ (209)", lat: 39.768, lon: -73.77 },
  { id: "44095", name: "Oregon Inlet, NC (192)", lat: 35.75, lon: -75.33 },
  { id: "44097", name: "Block Island, RI  (154)", lat: 40.969, lon: -71.124 },
  { id: "44098", name: "Jeffrey's Ledge, NH (160)", lat: 42.8, lon: -70.171 },
  { id: "44099", name: "Cape Henry, VA (147)", lat: 36.915, lon: -75.722 },
  { id: "44100", name: "Duck FRF 26m, NC (430)", lat: 36.258, lon: -75.593 },
  { id: "45013", name: "ATW20 - Atwater Park, WI", lat: 43.1, lon: -87.85 },
  { id: "45014", name: "GB17 - South Green Bay, WI", lat: 44.794, lon: -87.758 },
  { id: "45026", name: "Cook Nuclear Plant Buoy, Stevensville, MI", lat: 41.982, lon: -86.619 },
  { id: "45029", name: "Holland Buoy, MI", lat: 42.9, lon: -86.272 },
  { id: "45168", name: "South Haven Buoy, MI", lat: 42.397, lon: -86.331 },
  { id: "45199", name: "Salmon Unlimited Wisconsin", lat: 42.702, lon: -87.647 },
  { id: "45204", name: "Sheffield Buoy", lat: 41.508, lon: -82.115 },
  { id: "45205", name: "Edgewater Beach Buoy", lat: 41.501, lon: -81.748 },
  { id: "45207", name: "Fairport Harbor Buoy", lat: 41.725, lon: -81.37 },
  { id: "45208", name: "Ashtabula Buoy", lat: 41.908, lon: -80.813 },
  { id: "45209", name: "Lakeport Buoy, MI", lat: 43.129, lon: -82.391 },
  { id: "45210", name: "Rawley Point East, WI (269)", lat: 44.055, lon: -87.05 },
  { id: "45211", name: "Grand Island North, MI (268)", lat: 46.973, lon: -86.568 },
  { id: "45212", name: "North Huron Spotter", lat: 45.351, lon: -82.84 },
  { id: "45213", name: "East Superior Spotter", lat: 47.585, lon: -86.585 },
  { id: "45214", name: "South Michigan Spotter", lat: 42.674, lon: -87.026 },
  { id: "46001", name: "WESTERN GULF OF ALASKA  - 175NM SE of Kodiak, AK", lat: 56.296, lon: -148.027 },
  { id: "46072", name: "CENTRAL ALEUTIANS 230 NM SW Dutch Harbor", lat: 51.645, lon: -172.145 },
  { id: "46073", name: "SOUTHEAST BERING SEA - 205 NM WNW of Dutch Harbor, AK", lat: 55.008, lon: -172.012 },
  { id: "46087", name: "Neah Bay - 6 NM North of Cape Flattery, WA (Traffic Separation Lighted Buoy)", lat: 48.493, lon: -124.727 },
  { id: "46088", name: "NEW DUNGENESS - 17 NM NE of Port Angeles, WA", lat: 48.332, lon: -123.179 },
  { id: "46097", name: "OOI Newport Shelf", lat: 44.639, lon: -124.304 },
  { id: "46099", name: "OOI Westport Shelf", lat: 46.988, lon: -124.567 },
  { id: "46100", name: "OOI Westport Offshore", lat: 46.851, lon: -124.964 },
  { id: "46108", name: "Lower Cook Inlet (204)", lat: 59.598, lon: -151.828 },
  { id: "46211", name: "Grays Harbor, WA (036)", lat: 46.857, lon: -124.243 },
  { id: "46213", name: "Cape Mendocino, CA (094)", lat: 40.292, lon: -124.748 },
  { id: "46214", name: "Point Reyes, CA (029)", lat: 37.937, lon: -123.463 },
  { id: "46215", name: "Diablo Canyon, CA (076)", lat: 35.204, lon: -120.859 },
  { id: "46218", name: "Harvest, CA (071)", lat: 34.452, lon: -120.78 },
  { id: "46219", name: "San Nicolas Island, CA (067)", lat: 33.226, lon: -119.891 },
  { id: "46221", name: "Santa Monica Bay, CA (028)", lat: 33.86, lon: -118.641 },
  { id: "46222", name: "San Pedro, CA (092)", lat: 33.618, lon: -118.317 },
  { id: "46224", name: "Oceanside Offshore, CA (045)", lat: 33.178, lon: -117.472 },
  { id: "46225", name: "Torrey Pines Outer, CA (100)", lat: 32.933, lon: -117.391 },
  { id: "46229", name: "UMPQUA OFFSHORE, OR (139)", lat: 43.772, lon: -124.549 },
  { id: "46232", name: "Point Loma South, CA  (191)", lat: 32.517, lon: -117.425 },
  { id: "46235", name: "Imperial Beach Nearshore, CA (155)", lat: 32.57, lon: -117.169 },
  { id: "46236", name: "Monterey Canyon Outer, CA  (156)", lat: 36.759, lon: -121.95 },
  { id: "46237", name: "San Francisco Bar, CA  (142)", lat: 37.788, lon: -122.634 },
  { id: "46239", name: "Point Sur, CA (157)", lat: 36.335, lon: -122.104 },
  { id: "46240", name: "Cabrillo Point, Monterey Bay, CA  (158)", lat: 36.626, lon: -121.907 },
  { id: "46243", name: "Clatsop Spit, OR (162)", lat: 46.214, lon: -124.126 },
  { id: "46244", name: "Humboldt Bay, North Spit, CA (168)", lat: 40.896, lon: -124.358 },
  { id: "46248", name: "Astoria Canyon, OR  (179)", lat: 46.133, lon: -124.64 },
  { id: "46251", name: "Santa Cruz Basin, CA (203)", lat: 33.769, lon: -119.565 },
  { id: "46253", name: "San Pedro South, CA (213)", lat: 33.576, lon: -118.181 },
  { id: "46254", name: "SCRIPPS Nearshore, CA (201)", lat: 32.868, lon: -117.267 },
  { id: "46256", name: "Long Beach Channel, CA (215)", lat: 33.7, lon: -118.201 },
  { id: "46258", name: "Mission Bay West, CA (220)", lat: 32.749, lon: -117.502 },
  { id: "46259", name: "Santa Lucia Escarpment, CA (222)", lat: 34.774, lon: -121.491 },
  { id: "46280", name: "Newport PWS North (277)", lat: 44.575, lon: -124.234 },
  { id: "46281", name: "Newport PWS South, OR (278)", lat: 44.559, lon: -124.233 },
  { id: "46283", name: "Yaquina Channel SW, OR (280)", lat: 44.567, lon: -124.237 },
  { id: "46284", name: "Soquel Cove South, CA (281)", lat: 36.93, lon: -121.934 },
  { id: "51001", name: "NORTHWESTERN HAWAII ONE - 188 NM NW of Kauai Island, HI", lat: 24.475, lon: -162.03 },
  { id: "51201", name: "Waimea Bay, HI (106)", lat: 21.671, lon: -158.118 },
  { id: "51202", name: "Mokapu Point, HI (098)", lat: 21.414, lon: -157.681 },
  { id: "51205", name: "Pauwela, Maui, HI (187)", lat: 21.018, lon: -156.421 },
  { id: "51207", name: "Kaneohe Bay, HI (198)", lat: 21.477, lon: -157.752 },
  { id: "51208", name: "Hanalei, Kauai, HI (202)", lat: 22.285, lon: -159.574 },
  { id: "51210", name: "Kaneohe Bay, WETS, HI (225)", lat: 21.477, lon: -157.757 },
  { id: "51211", name: "Pearl Harbor Entrance, HI (233)", lat: 21.297, lon: -157.959 },
  { id: "51212", name: "Barbers Point, Kalaeloa, HI (238)", lat: 21.323, lon: -158.149 },
  { id: "51213", name: "Kaumalapau Southwest, Lanai, HI (239)", lat: 20.75, lon: -157.002 },
  { id: "51214", name: "King-Poloa, American Samoa (273)", lat: -14.296, lon: -170.875 },
  { id: "52200", name: "Ipan, Guam (121)", lat: 13.354, lon: 144.788 },
  { id: "52202", name: "Ritidian Point, Guam (196)", lat: 13.683, lon: 144.816 },
  { id: "52212", name: "Ngaraard, Babeldaob, Palau (219)", lat: 7.63, lon: 134.671 },
  { id: "52213", name: "North Point, Pohnpei, Micronesia (178)", lat: 7.081, lon: 158.244 },
  { id: "52215", name: "UTWE, KOSRAE, MICRONESIA (276)", lat: 5.241, lon: 163.001 },
  ];

  // --- Constants ---
  const MAX_SELECTED_BUOYS = 3;
  const BUOY_COLORS = ['#FF4136', '#FFDC00', '#0074D9'];
  const DEFAULT_BUOY_COLOR = '#888888';
  const METER_TO_FEET = 3.28084;

  const METRICS = {
    WVHT: { key: 'waveHeight', label: 'Wave Height', unit: 'ft', specIndex: 5, isDirection: false },
    SwH:  { key: 'swellHeight', label: 'Swell Height', unit: 'ft', specIndex: 6, isDirection: false },
    SwP:  { key: 'swellPeriod', label: 'Swell Period', unit: 's', specIndex: 7, isDirection: false },
    SwD:  { key: 'swellDirection', label: 'Swell Direction', unit: '°', specIndex: 14, isDirection: true }
  };

  // --- App State ---
  let selectedBuoys = [];
  let buoyDataCache = {};
  let selectedMetricKey = 'SwH';

  let mapInstance;
  let mapMarkers = [];
  let chartInstance;
  let chartCanvas;
  let globalError = null;
  let dataFetchError = null;
  let isMounted = false;
  let mapDiv; // <--- New variable for bind:this

  // --- Map Logic ---
  function initMap() {
    if (typeof L === 'undefined' || !mapDiv) {
      globalError = "Map library or map container not ready.";
      console.error(globalError);
      return;
    }
    try {
      mapInstance = L.map(mapDiv).setView([34, -70], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);
      mapMarkers = stations.map(station => {
        const marker = L.marker([station.lat, station.lon], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color:${DEFAULT_BUOY_COLOR};width:14px;height:14px;border-radius:50%;border:1px solid #fff;"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          })
        })
          .addTo(mapInstance)
          .on('click', () => toggleBuoySelection(station.id));
        return { id: station.id, marker };
      });
    } catch (e) {
      globalError = "Error initializing map: " + e.message;
      console.error(globalError, e);
    }
  }

  function updateMapMarkers() {
    if (!mapInstance) return;
    mapMarkers.forEach(({ id, marker }) => {
      const selectedBuoy = selectedBuoys.find(b => b.id === id);
      const color = selectedBuoy ? selectedBuoy.color : DEFAULT_BUOY_COLOR;
      marker.setIcon(L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color:${color};width:14px;height:14px;border-radius:50%;border:1px solid #fff;"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      }));
    });
  }

  async function toggleBuoySelection(buoyId) {
    dataFetchError = null;
    const existingIndex = selectedBuoys.findIndex(b => b.id === buoyId);
    if (existingIndex > -1) {
      selectedBuoys = selectedBuoys.filter(b => b.id !== buoyId);
    } else if (selectedBuoys.length < MAX_SELECTED_BUOYS) {
      const stationInfo = stations.find(s => s.id === buoyId);
      if (stationInfo) {
        const usedColors = selectedBuoys.map(b => b.color);
        const availableColor = BUOY_COLORS.find(c => !usedColors.includes(c)) || BUOY_COLORS[selectedBuoys.length % BUOY_COLORS.length];
        const newBuoy = { ...stationInfo, color: availableColor, isLoading: true };
        selectedBuoys = [...selectedBuoys, newBuoy];
        await fetchBuoyData(newBuoy);
      }
    } else {
      dataFetchError = `Max ${MAX_SELECTED_BUOYS} buoys can be selected.`;
      setTimeout(() => { if (isMounted) dataFetchError = null; }, 3000);
    }
    updateMapMarkers();
    updateChart();
  }

  function clearAllSelections() {
    selectedBuoys = [];
    dataFetchError = null;
    updateMapMarkers();
    updateChart();
  }

  // --- Data Fetching Logic ---
  async function fetchBuoyData(buoy) {
    const buoyInSelection = selectedBuoys.find(b => b.id === buoy.id);
    if (buoyInSelection) buoyInSelection.isLoading = true;
    selectedBuoys = [...selectedBuoys];
    if (buoyDataCache[buoy.id]) {
      if (buoyInSelection) buoyInSelection.isLoading = false;
      selectedBuoys = [...selectedBuoys];
      updateChart();
      return;
    }
    try {
      const response = await fetch(`/api/buoy?buoyId=${buoy.id}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status} for buoy ${buoy.id}`);
      const specText = await response.text();
      const parsedData = parseBuoyData(specText);
      if (!isMounted) return;
      buoyDataCache = { ...buoyDataCache, [buoy.id]: parsedData };
      if (buoyInSelection) buoyInSelection.isLoading = false;
      selectedBuoys = [...selectedBuoys];
      updateChart();
    } catch (error) {
      if (!isMounted) return;
      console.error(`Error fetching data for buoy ${buoy.id}:`, error);
      dataFetchError = `Could not load data for ${buoy.name || buoy.id}.`;
      if (buoyInSelection) buoyInSelection.isLoading = false;
      buoyDataCache = { ...buoyDataCache, [buoy.id]: { readings: [], lastUpdate: null, hasMissingData: true, error: true } };
      selectedBuoys = [...selectedBuoys];
      updateChart();
    }
  }

  function parseBuoyData(specText) {
    const lines = specText.split('\n').filter(line => line.trim().length > 0 && !line.trim().startsWith("#"));
    const readings = [];
    let latestTimestamp = null;
    let hasMissingData = false;
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 15) {
        console.log('Line skipped (not enough columns):', line);
        continue;
      }
      const yy = parseInt(parts[0]);
      const mm = parseInt(parts[1]);
      const dd = parseInt(parts[2]);
      const hr = parseInt(parts[3]);
      const mn = parseInt(parts[4]);
      if ([yy, mm, dd, hr, mn].some(isNaN)) continue;
      const year = 2000 + yy;
      const timestamp = new Date(Date.UTC(year, mm - 1, dd, hr, mn));
      if (isNaN(timestamp.getTime())) continue;
      if (!latestTimestamp || timestamp > latestTimestamp) latestTimestamp = timestamp;
      const reading = { timestamp };
      let lineMissing = false;
      Object.entries(METRICS).forEach(([metricCode, metricInfo]) => {
        const rawValue = parts[metricInfo.specIndex];
        if (rawValue === "MM" || rawValue === undefined) {
          reading[metricInfo.key] = null;
          lineMissing = true;
        } else {
          const value = parseFloat(rawValue);
          if (isNaN(value)) {
            reading[metricInfo.key] = null;
            lineMissing = true;
          } else {
            reading[metricInfo.key] = metricInfo.unit === 'ft' ? value * METER_TO_FEET : value;
          }
        }
      });
      if (lineMissing) hasMissingData = true;
      readings.push(reading);
    }
    readings.sort((a, b) => a.timestamp - b.timestamp);
    return { readings, lastUpdate: latestTimestamp, hasMissingData };
  }

  // --- Chart Logic ---
  function initChart() {
    if (!chartCanvas || typeof Chart === 'undefined') {
      globalError = "Chart library or chart canvas not ready.";
      console.error(globalError);
      return;
    }
    try {
      const ctx = chartCanvas.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: { datasets: [] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
                tooltipFormat: 'MMM d, HH:mm',
                displayFormats: { hour: 'HH:mm', day: 'MMM d' }
              },
              title: { display: true, text: 'Time (UTC)', color: '#ccc' },
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#ccc' }
            },
            y: {
              title: { display: true, text: METRICS[selectedMetricKey].label, color: '#ccc' },
              beginAtZero: !METRICS[selectedMetricKey].isDirection,
              grid: { color: 'rgba(255, 255, 255, 0.1)' },
              ticks: { color: '#ccc' }
            }
          },
          plugins: {
            legend: { display: true, position: 'top', labels: { color: '#eee' } },
            tooltip: { mode: 'index', intersect: false }
          },
          interaction: { mode: 'nearest', axis: 'x', intersect: false }
        }
      });
    } catch (e) {
      globalError = "Error initializing chart: " + e.message;
      console.error(globalError, e);
    }
  }

  function updateChart() {
    if (!chartInstance) return;
    const currentMetricInfo = METRICS[selectedMetricKey];
    chartInstance.options.scales.y.title.text = currentMetricInfo.label + (currentMetricInfo.unit ? ` (${currentMetricInfo.unit})` : '');
    chartInstance.options.scales.y.beginAtZero = !currentMetricInfo.isDirection;
    const datasets = selectedBuoys
      .filter(b => !b.isLoading && buoyDataCache[b.id] && buoyDataCache[b.id].readings.length)
      .map(buoy => {
        const buoySpecificData = buoyDataCache[buoy.id];
        const readings = buoySpecificData?.readings || [];
        const dataPoints = readings
          .map(reading => ({
            x: reading.timestamp,
            y: reading[currentMetricInfo.key]
          }))
          .filter(point => point.y !== null && point.y !== undefined && !isNaN(point.y));
        return {
          label: `${buoy.name || buoy.id}`,
          data: dataPoints,
          borderColor: buoy.color,
          backgroundColor: buoy.color + '33',
          tension: 0.1,
          fill: false,
          pointRadius: dataPoints.length < 100 ? 2 : 1,
          pointHoverRadius: 4
        };
      });
    chartInstance.data.datasets = datasets;
    chartInstance.update();
  }

  // Utility to format date for display
  function formatDisplayDate(date) {
    if (!date || isNaN(new Date(date).getTime())) return "N/A";
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false
    }) + " UTC";
  }

  // --- Lifecycle ---
  onMount(async () => {
    isMounted = true;
    await tick();
    if (typeof L !== 'undefined' && mapDiv) {
      initMap();
    } else {
      globalError = "Map library or element failed to load. Try refreshing.";
    }
    if (typeof Chart !== 'undefined' && chartCanvas) {
      initChart();
    } else {
      globalError = "Chart library or element failed to load. Try refreshing.";
    }
  });

  onDestroy(() => {
    isMounted = false;
    if (mapInstance) { try { mapInstance.remove(); } catch (e) {} }
    if (chartInstance) { try { chartInstance.destroy(); } catch (e) {} }
  });

  $: if (selectedMetricKey && chartInstance) {
    updateChart();
  }
</script>

<!-- ... TEMPLATE START ... -->
<div class="buoyboy-app">
  <header class="app-header">
    <h1>🌊 BuoyBoy</h1>
    {#if selectedBuoys.length > 0}
      <button class="clear-all-btn" on:click={clearAllSelections} title="Clear All Selections">
        Clear All (X)
      </button>
    {/if}
  </header>

  <div class="main-content">
    <div class="map-panel">
      <div bind:this={mapDiv} id="map" class="map-container"></div>
      {#if globalError}
        <p class="error-message global-error-msg">{globalError}</p>
      {/if}
    </div>

    <div class="chart-panel">
      <div class="controls">
        <label for="metric-picker">Metric:</label>
        <select id="metric-picker" bind:value={selectedMetricKey}>
          {#each Object.entries(METRICS) as [key, { label, unit }]}
            <option value={key}>{label} {unit ? `(${unit})` : ''}</option>
          {/each}
        </select>
      </div>

      <div class="chart-area-wrapper">
        {#if selectedBuoys.length === 0}
          <p class="placeholder-text">Select up to {MAX_SELECTED_BUOYS} buoys on the map to view data.</p>
        {:else}
          <canvas bind:this={chartCanvas} id="buoyChart"></canvas>
        {/if}
      </div>
      {#if dataFetchError}
        <p class="error-message data-error-msg">{dataFetchError}</p>
      {/if}
    </div>
  </div>

  <div class="selected-buoys-metadata">
    {#if selectedBuoys.length > 0}
      <h3>Selected Buoys Details:</h3>
      {#each selectedBuoys as buoy (buoy.id)}
        <div class="buoy-info-item" style="border-left-color:{buoy.color};">
          <div class="buoy-info-header">
            <span class="buoy-color-dot" style="background-color:{buoy.color};"></span>
            <strong>{buoy.name || `Buoy ${buoy.id}`}</strong>
            {#if buoy.isLoading}
              <span class="loading-text">(Loading data...)</span>
            {/if}
          </div>
          {#if !buoy.isLoading && buoyDataCache[buoy.id]}
            <p>Last Update: {formatDisplayDate(buoyDataCache[buoy.id].lastUpdate)}</p>
            {#if buoyDataCache[buoy.id].hasMissingData}
              <p class="warning-message">⚠️ Some data points may be missing for this period.</p>
            {/if}
             {#if buoyDataCache[buoy.id].error}
              <p class="error-message">⚠️ Could not load data for this buoy.</p>
            {/if}
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #282c34;
    color: #f0f0f0;
    line-height: 1.6;
  }

  .buoyboy-app {
    padding: 1em;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 2em);
  }

  .app-header {
    text-align: center;
    margin-bottom: 1em;
    padding-bottom: 0.5em;
    border-bottom: 1px solid #444;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .app-header h1 {
    margin: 0;
    color: #FFDC00;
    font-size: 2em;
  }

  .clear-all-btn {
    background-color: #555;
    color: #fff;
    border: none;
    padding: 0.5em 1em;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
  }
  .clear-all-btn:hover {
    background-color: #FF4136;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  .map-panel, .chart-panel {
    border: 1px solid #444;
    border-radius: 8px;
    padding: 1em;
    background-color: #333740;
  }

  .map-container {
    height: 350px;
    width: 100%;
    border-radius: 6px;
  }

  .controls {
    margin-bottom: 1em;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
  .controls label {
    font-weight: bold;
  }
  .controls select {
    padding: 0.5em;
    background-color: #444;
    color: #fff;
    border: 1px solid #555;
    border-radius: 4px;
  }

  .chart-area-wrapper {
    height: 300px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #buoyChart {
    display: block;
    width: 100%;
    height: 100%;
  }
  .placeholder-text {
    text-align: center;
    color: #aaa;
  }

  .selected-buoys-metadata {
    margin-top: 1em;
    padding: 1em;
    background-color: #333740;
    border: 1px solid #444;
    border-radius: 8px;
  }
  .selected-buoys-metadata h3 {
    margin-top: 0;
    color: #FFDC00;
  }
  .buoy-info-item {
    margin-bottom: 0.75em;
    padding: 0.5em 0.75em;
    border-left-width: 5px;
    border-left-style: solid;
    background-color: #282c34;
    border-radius: 0 4px 4px 0;
  }
  .buoy-info-header {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 0.25em;
  }
  .buoy-color-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }
  .buoy-info-item p {
    margin: 0.2em 0;
    font-size: 0.9em;
    color: #ccc;
  }
  .loading-text {
    font-style: italic;
    color: #FFDC00;
    font-size: 0.85em;
  }
  .warning-message {
    color: #FF851B !important;
    font-size: 0.85em !important;
  }
  .error-message {
    color: #FF4136 !important;
    font-weight: bold;
    padding: 0.5em;
    border-radius: 4px;
    background-color: rgba(255, 65, 54, 0.1);
    text-align: center;
    font-size: 0.9em;
  }
  .global-error-msg { margin-top: 0.5em; }
  .data-error-msg { margin-top: 0.5em; }

  @media (min-width: 768px) {
    .main-content {
      /* flex-direction: row; */
    }
    .map-panel, .chart-panel {
      /* flex: 1; */
    }
    .map-container {
      height: 400px;
    }
    .chart-area-wrapper {
      height: 350px;
    }
  }
  @media (min-width: 1024px) {
    .main-content {
      flex-direction: row;
    }
    .map-panel, .chart-panel {
      flex: 1;
    }
  }
</style>
