// maps-data.js
// Hardcoded "seed" maps. These are read-only in the UI.
// Organized as one map per state, all nested under "USA BMX Tracks" in the sidebar.
//
// Tracks use { lat, lng } instead of x/y — the map converts them to screen
// positions automatically. Alaska and Hawaii pins are placed on the inset panels.

const BMX_SEED_MAPS = [
  /* ─────────────── ARIZONA ─────────────── */
  {
    id: 'usabmx-az',
    name: 'Arizona',
    description: 'USA BMX tracks in Arizona.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Chandler BMX', city: 'Chandler', state: 'AZ', address: '298 S McQueen Rd', postal: '85225', lat: 33.29944, lng: -111.825837 },
      { kind: 'track', title: 'Yuma BMX', city: 'Yuma', state: 'AZ', address: '3067 S Pacific Ave', postal: '85364', lat: 32.671902, lng: -114.598131, phone: '951-529-9390' },
      { kind: 'track', title: 'Black Mountain BMX', city: 'Phoenix', state: 'AZ', address: '24024 N 11th St', postal: '85024', lat: 33.705331, lng: -112.056808, website: 'https://www.blackmountainbmx.com' },
      { kind: 'track', title: 'Lake Havasu City BMX', city: 'Lake Havasu City', state: 'AZ', address: '7260 McCulloch Blvd S. #B', postal: '86406', lat: 34.446647, lng: -114.258457, phone: '928-208-5388' },
      { kind: 'track', title: 'Colorado River BMX', city: 'Bullhead City', state: 'AZ', address: '2230 Highland Rd.', postal: '86442', lat: 35.106568, lng: -114.60775, phone: '(702) 219-5660' },
      { kind: 'track', title: 'Tucson BMX', city: 'Tucson', state: 'AZ', address: '9245 E Irvington', postal: '85730', lat: 32.163616, lng: -110.795365, phone: '520-808-0641', contact: 'Andy Erickson · 520-808-0641' },
      { kind: 'track', title: 'Goodyear BMX Raceway', city: 'Goodyear', state: 'AZ', address: '15660 W Roeser Rd', postal: '85338', lat: 33.399524, lng: -112.395566, phone: '623-687-5225' },
      { kind: 'track', title: 'Show Low BMX', city: 'Show Low', state: 'AZ', address: '1001 E Mills', postal: '85901', lat: 34.24755, lng: -110.031381, phone: '9283698443' },
      { kind: 'track', title: 'Interstate BMX', city: 'Kingman', state: 'AZ', address: '2600 Fairgrounds Blvd', postal: '86401', lat: 35.216353, lng: -114.02874, phone: '9705820209' },
      { kind: 'track', title: 'Sports Park BMX', city: 'Tucson', state: 'AZ', address: '6901 N Casa Grande Highway', postal: '85743', lat: 32.332297, lng: -111.062224, phone: '520-631-4256' }
    ]
  },

  /* ─────────────── CALIFORNIA ─────────────── */
  {
    id: 'usabmx-ca',
    name: 'California',
    description: 'USA BMX tracks in California.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'San Diego BMX', city: 'San Diego', state: 'CA', address: '3170 Armstrong Street', postal: '92111', lat: 32.801213, lng: -117.170085, phone: '949-973-0949' },
      { kind: 'track', title: 'Rusty Bowl BMX', city: 'Ukiah', state: 'CA', address: '1281 E Gobbi St', postal: '95482', lat: 39.145967, lng: -123.182981, phone: '7074620249' },
      { kind: 'track', title: 'Oak Creek BMX', city: 'Roseville', state: 'CA', address: '648 Riverside Ave', postal: '95678', lat: 38.734528, lng: -121.291063, phone: '916-784-8BMX', website: 'http://www.oakcreekbmx.org' },
      { kind: 'track', title: 'Boomtown BMX', city: 'Shasta Lake', state: 'CA', address: '17760 Shasta Dam Blvd', postal: '96019', lat: 40.689946, lng: -122.400533 },
      { kind: 'track', title: 'Redwood Empire BMX', city: 'Samoa', state: 'CA', address: '201 Vance ave', postal: '95564', lat: 40.81986, lng: -124.18695, phone: '707-845-0094' },
      { kind: 'track', title: 'Lemoore BMX Raceway', city: 'Lemoore', state: 'CA', address: '1750 CA-41', postal: '93245', lat: 36.267475, lng: -119.803658, phone: '559-816-7954' },
      { kind: 'track', title: 'Metro BMX', city: 'Bakersfield', state: 'CA', address: '3805 Chester Ave', postal: '93301', lat: 35.393467, lng: -119.023497, phone: '661-817-5577' },
      { kind: 'track', title: 'Whittier Narrows BMX', city: 'South El Monte', state: 'CA', address: '1601 N Rosemead Blvd', postal: '91733', lat: 34.047188, lng: -118.069146, phone: '626-738-5287' },
      { kind: 'track', title: 'Imperial Valley BMX', city: 'El Centro', state: 'CA', address: '1750 Drew Rd', postal: '92243', lat: 32.782201, lng: -115.689383, phone: '760-370-0565' },
      { kind: 'track', title: 'Apple Valley BMX Moto Park', city: 'Apple Valley', state: 'CA', address: '24320 Highway 18', postal: '92307', lat: 34.484796, lng: -117.130651, phone: '760-953-6361' },
      { kind: 'track', title: 'Elkhorn BMX', city: 'Rio Linda', state: 'CA', address: '848 Elkhorn Blvd', postal: '95673', lat: 38.682616, lng: -121.446927, phone: '916-991-2931' },
      { kind: 'track', title: 'HD BMX', city: 'Hesperia', state: 'CA', address: '17427 Live Oak St', postal: '92345', lat: 34.425295, lng: -117.283209, phone: '760-678-5792' },
      { kind: 'track', title: 'Hanford BMX', city: 'Hanford', state: 'CA', address: '501 S Brown St', postal: '93230', lat: 36.320796, lng: -119.641263, phone: '559-816-7954' },
      { kind: 'track', title: 'Bellflower BMX', city: 'Bellflower', state: 'CA', address: '9030 Somerset Blvd', postal: '90706', lat: 33.893284, lng: -118.138658, phone: '562-867-9600', website: 'http://www.bellflowerbmx.com' },
      { kind: 'track', title: 'Lancaster BMX', city: 'Lancaster', state: 'CA', address: '2551 W Avenue H', postal: '93536', lat: 34.725563, lng: -118.172556, phone: '661-972-7420' },
      { kind: 'track', title: 'North Bay BMX', city: 'Napa', state: 'CA', address: '3291 Streblow Dr', postal: '94558', lat: 38.262163, lng: -122.281512, phone: '707-690-0187' },
      { kind: 'track', title: 'Spreckels Park BMX', city: 'Manteca', state: 'CA', address: '941 Spreckels Ave', postal: '95336', lat: 37.786784, lng: -121.200646, phone: '209-815-8376' },
      { kind: 'track', title: 'Freedom Park BMX Raceway', city: 'Camarillo', state: 'CA', address: '530 Convair St', postal: '93010', lat: 34.209065, lng: -119.087114, phone: '805-419-0245', website: 'http://www.freedomparkbmx.com' },
      { kind: 'track', title: 'Elings Park BMX Raceway', city: 'Santa Barbara', state: 'CA', address: '1298 Las Positas Rd', postal: '93105', lat: 34.414221, lng: -119.738123, phone: '805-325-5590' },
      { kind: 'track', title: 'Manzanita Park BMX', city: 'Prunedale', state: 'CA', address: '17100 Castroville Blvd', postal: '93907', lat: 36.799011, lng: -121.681631, phone: '831-663-1269 (1BMX)' },
      { kind: 'track', title: 'Woodward Park BMX', city: 'Fresno', state: 'CA', address: '7775 N Friant Rd', postal: '93720', lat: 36.867468, lng: -119.790074, phone: '559-621-6606' },
      { kind: 'track', title: 'Air Time BMX', city: 'Reedley', state: 'CA', address: '5051 S Frankwood Ave', postal: '93654', lat: 36.66298, lng: -119.450634, phone: '559-426-9367', website: 'https://airtimebmx.godaddysites.com/' },
      { kind: 'track', title: 'Grand Prix BMX at SoCal Fair', city: 'Perris', state: 'CA', address: '18700 Lake Perris Dr', postal: '92571', lat: 33.852865, lng: -117.201397, phone: '(951) 796-8377' }
    ]
  },

  /* ─────────────── COLORADO ─────────────── */
  {
    id: 'usabmx-co',
    name: 'Colorado',
    description: 'USA BMX tracks in Colorado.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Twin Silo BMX', city: 'Ft Collins', state: 'CO', address: '5400 Ziegler Rd.', postal: '80528', lat: 40.511833, lng: -105.015689, phone: '970-460-8030' },
      { kind: 'track', title: 'Grand Valley BMX', city: 'Grand Junction', state: 'CO', address: '2785 U.S. Highway 50', postal: '81503', lat: 39.038153, lng: -108.538485, phone: '(970) 812-3394', website: 'http://www.grandvalleybmx.com' },
      { kind: 'track', title: 'Durango BMX', city: 'Durango', state: 'CO', address: '360 S Camino Del Rio,', postal: '81301', lat: 37.248325, lng: -107.873152, phone: '970-749-7969', website: 'http://dgobmx.com/' },
      { kind: 'track', title: 'Cortez BMX', city: 'Cortez', state: 'CO', address: '1425 E Empire St.', postal: '81321', lat: 37.355946, lng: -108.566095, phone: '970-739-0771', website: 'http://www.cortezbmx.org' },
      { kind: 'track', title: 'Dacono BMX', city: 'Dacono', state: 'CO', address: '113 Forest Ave', postal: '80514', lat: 40.080637, lng: -104.934701, phone: '303-944-8392' },
      { kind: 'track', title: 'County Line BMX', city: 'Centennial', state: 'CO', address: '8560 South Colorado Blvd', postal: '80126', lat: 39.564577, lng: -104.937458, phone: '3034837030', website: 'http://www.sspr.org/county-line-bmx' },
      { kind: 'track', title: 'Eagle County BMX (CO)', city: 'Eagle', state: 'CO', address: '1700 Bull Pasture Rd', postal: '81631', lat: 39.642282, lng: -106.815606, phone: '970-390-6601' },
      { kind: 'track', title: 'Cross Creek BMX', city: 'Fountain', state: 'CO', address: '8115 Parkglen Dr.', postal: '80817', lat: 38.71276, lng: -104.684705, phone: '719-888-9652' },
      { kind: 'track', title: 'Mile High BMX', city: 'Denver', state: 'CO', address: '3606 S Independence St', postal: '80235', lat: 39.652265, lng: -105.1005, phone: '7203661440', website: 'www.milehighbmx.com' },
      { kind: 'track', title: 'Crown Mountain BMX Park', city: 'El Jebel', state: 'CO', address: '501 Eagle County Drive', postal: '81623', lat: 39.391966, lng: -107.099886, phone: '(802) 342-2396' }
    ]
  },

  /* ─────────────── FLORIDA ─────────────── */
  {
    id: 'usabmx-fl',
    name: 'Florida',
    description: 'USA BMX tracks in Florida.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Oldsmar BMX Supercross', city: 'Oldsmar', state: 'FL', address: 'Oldsmar Sports Complex', postal: '34677', lat: 28.05501, lng: -82.703619, phone: '(813) 749-1260', website: 'https://oldsmarbmxsupercross.com/' },
      { kind: 'track', title: 'ORL BMX', city: 'Orlando', state: 'FL', address: '4801 W Colonial Dr', postal: '32808', lat: 28.55854, lng: -81.443254, phone: '407-297-3589', website: 'https://www.orlbmx.org' },
      { kind: 'track', title: 'Ancient City BMX', city: 'St Augustine', state: 'FL', address: '3005 Alan Nease Rd', postal: '32033', lat: 29.843547, lng: -81.408005, phone: '904-888-5523' },
      { kind: 'track', title: 'Daytona BMX', city: 'Holly Hill', state: 'FL', address: '1670 Strickland Range Rd', postal: '32117', lat: 29.237636, lng: -81.084223, phone: '386-405-8031' },
      { kind: 'track', title: 'Sarasota BMX', city: 'Sarasota', state: 'FL', address: '1590 North Tuttle Avenue', postal: '34237', lat: 27.350576, lng: -82.512528, phone: '941-960-1578', website: 'http://www.srqbmx.com' },
      { kind: 'track', title: 'Tampa BMX Raceway, Inc.', city: 'Lutz', state: 'FL', address: '17302 Dale Mabry Hwy North', postal: '33548', lat: 28.119909, lng: -82.511101, phone: '813-265-1269', website: 'http://www.tampabmx.com' },
      { kind: 'track', title: 'Cape Coral BMX', city: 'Cape Coral', state: 'FL', address: '1410 SW 6th Place', postal: '33991', lat: 26.626221, lng: -81.988134, phone: '239-458-1943' },
      { kind: 'track', title: 'St. Cloud BMX', city: 'St. Cloud', state: 'FL', address: '2401 Peghorn Way', postal: '34769', lat: 28.237859, lng: -81.305786, phone: '407-348-0774' },
      { kind: 'track', title: 'Miami South BMX', city: 'Miami', state: 'FL', address: '13050 SW 216th Street', postal: '33170', lat: 25.565937, lng: -80.403026 },
      { kind: 'track', title: 'Charlotte BMX', city: 'Punta Gorda', state: 'FL', address: '2505 Carmalita St', postal: '33950', lat: 26.929426, lng: -82.022354, phone: '(941) 205-8752', website: 'http://www.charlottebmx.net' },
      { kind: 'track', title: 'Triple Creek BMX', city: 'Riverview', state: 'FL', address: '12705 Balm Boyette Rd', postal: '33579', lat: 27.808514, lng: -82.240863, website: 'https://www.facebook.com/triplecreekbmx' },
      { kind: 'track', title: 'Okeeheelee BMX', city: 'West Palm Beach', state: 'FL', address: '8145 Forest Hill Blvd', postal: '33413', lat: 26.651486, lng: -80.172032, website: 'http://www.okeeheeleebmx.com' },
      { kind: 'track', title: 'Jacksonville BMX', city: 'Jacksonville', state: 'FL', address: '1946 Ray Greene Drive', postal: '32218', lat: 30.433717, lng: -81.676987, phone: '904-386-1750', website: 'http://www.jacksonvillebmx.com' },
      { kind: 'track', title: 'High Springs BMX', city: 'High Springs', state: 'FL', address: '', postal: '32028', lat: 29.836442, lng: -82.594084, phone: '352-474-8105', website: 'http://www.hsbmx.com' },
      { kind: 'track', title: 'Naples BMX', city: 'Naples', state: 'FL', address: '4701 Golden Gate Parkway', postal: '34116', lat: 26.184816, lng: -81.703632 }
    ]
  },

  /* ─────────────── GEORGIA ─────────────── */
  {
    id: 'usabmx-ga',
    name: 'Georgia',
    description: 'USA BMX tracks in Georgia.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Cobb County BMX', city: 'Powder Springs', state: 'GA', address: '3820 Macedonia Rd', postal: '30127', lat: 33.877658, lng: -84.667286, phone: '678-614-9702' },
      { kind: 'track', title: 'Noonday BMX', city: 'Marietta', state: 'GA', address: '547 Shallowford Rd NE', postal: '30144', lat: 34.063863, lng: -84.533889, phone: '678-614-9702', website: 'http://www.cobbcountybmx.com' },
      { kind: 'track', title: 'Peachtree BMX', city: 'Peachtree City', state: 'GA', address: '195 McIntosh Trail', postal: '30269', lat: 33.383589, lng: -84.567851, phone: '951-445-3357' },
      { kind: 'track', title: 'Sandy Ridge BMX', city: 'McDonough', state: 'GA', address: '1200 Keys Ferry Rd', postal: '30253', lat: 33.414387, lng: -84.005131, phone: '(678) 350-8076', website: 'http://www.sandyridgebmx.org' },
      { kind: 'track', title: 'Blanchard Woods BMX', city: 'Evans', state: 'GA', address: '4600 Blanchard Woods Drive', postal: '30809', lat: 33.55465, lng: -82.175704, phone: '762-233-9609' }
    ]
  },

  /* ─────────────── IDAHO ─────────────── */
  {
    id: 'usabmx-id',
    name: 'Idaho',
    description: 'USA BMX tracks in Idaho.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Snake River BMX', city: 'Idaho Falls', state: 'ID', address: '1860 East 65th South', postal: '83404', lat: 43.438144, lng: -111.996718, website: 'snakeriverbmx.com' },
      { kind: 'track', title: 'Caldwell BMX', city: 'Caldwell', state: 'ID', address: '4700 Skyway St', postal: '83605', lat: 43.656968, lng: -116.638719 },
      { kind: 'track', title: 'Cherry Hill Park BMX', city: 'Coeur D`Alene', state: 'ID', address: '1727 N 15th St', postal: '83814', lat: 47.691566, lng: -116.760871, phone: '208-660-7547' },
      { kind: 'track', title: 'Eagle Park BMX (ID)', city: 'Eagle', state: 'ID', address: '11800 N Horseshoe Bend Rd', postal: '83616', lat: 43.712607, lng: -116.315271, phone: '208-918-1556' }
    ]
  },

  /* ─────────────── ILLINOIS ─────────────── */
  {
    id: 'usabmx-il',
    name: 'Illinois',
    description: 'USA BMX tracks in Illinois.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Rockford BMX', city: 'Rockford', state: 'IL', address: '4950 Safford Rd', postal: '61101', lat: 42.30325, lng: -89.134644, phone: '815-964-8657', website: 'http://www.rockfordbmx.com' },
      { kind: 'track', title: 'The Hill BMX', city: 'Elgin', state: 'IL', address: '709 Sports Way', postal: '60123', lat: 42.019489, lng: -88.299329 },
      { kind: 'track', title: 'Brighton BMX', city: 'Brighton', state: 'IL', address: '414 N Maple St', postal: '62012', lat: 39.043319, lng: -90.147543, phone: '618-836-4801' },
      { kind: 'track', title: 'Farmer City BMX', city: 'Farmer City', state: 'IL', address: '12853 Royal Road', postal: '61842', lat: 40.235251, lng: -88.64571, phone: '(309) 533-0021', website: 'http://www.farmercitybmx.com' },
      { kind: 'track', title: 'East Moline BMX', city: 'East Moline', state: 'IL', address: '1930 Avenue of the Cities', postal: '61241', lat: 41.48764, lng: -90.425726, phone: '309-791-1670' },
      { kind: 'track', title: 'Rock Island Indoor BMX', city: 'Rock Island', state: 'IL', address: '2621 4th Ave', postal: '61201', lat: 41.509341, lng: -90.562856, phone: '309-791-1670' },
      { kind: 'track', title: 'Waukegan BMX', city: 'Waukegan', state: 'IL', address: '2785 W Yorkhouse Rd', postal: '60085', lat: 42.407864, lng: -87.868282, phone: '847-255-7989', website: 'http://www.waukeganbmx.com' },
      { kind: 'track', title: 'Springfield BMX Raceway', city: 'Springfield', state: 'IL', address: '4115 Sandhill Road', postal: '62702', lat: 39.859332, lng: -89.61786 }
    ]
  },

  /* ─────────────── INDIANA ─────────────── */
  {
    id: 'usabmx-in',
    name: 'Indiana',
    description: 'USA BMX tracks in Indiana.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Imagination Glen BMX', city: 'Portage', state: 'IN', address: '2190 N State Rd 149', postal: '46304', lat: 41.589818, lng: -87.126056, website: 'http://www.steelwheelsbmx.com' },
      { kind: 'track', title: 'Steel Wheels Indoor BMX', city: 'Hobart', state: 'IN', address: '709 N Hobart Rd', postal: '46350', lat: 41.54962, lng: -87.238918, website: 'http://www.steelwheelsbmx.com' },
      { kind: 'track', title: 'Fort Wayne BMX', city: 'Fort Wayne', state: 'IN', address: '1750 Goshen Rd', postal: '46808', lat: 41.109352, lng: -85.15902, phone: '260-267-5269' },
      { kind: 'track', title: 'Hire Park BMX', city: 'Warsaw', state: 'IN', address: '750 E Arthur St', postal: '46580', lat: 41.243671, lng: -85.847302, phone: '574-527-6467' },
      { kind: 'track', title: 'Columbus BMX', city: 'Columbus', state: 'IN', address: '876 Spears St.', postal: '47201', lat: 39.177158, lng: -85.934672, phone: '812-371-5897', website: 'http://www.columbusbmx.com' },
      { kind: 'track', title: 'Indy Cycloplex BMX', city: 'Indianapolis', state: 'IN', address: '3649 Cold Spring Road', postal: '46222', lat: 39.820519, lng: -86.199036, website: 'http://indycycloplex.com/bmx' }
    ]
  },

  /* ─────────────── IOWA ─────────────── */
  {
    id: 'usabmx-ia',
    name: 'Iowa',
    description: 'USA BMX tracks in Iowa.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'CR BMX', city: 'Ely', state: 'IA', address: '1600 Cedar Bend Lane SW', postal: '52227', lat: 41.957156, lng: -91.581103, phone: '619-985-7376' },
      { kind: 'track', title: '80 35 BMX', city: 'Des Moines', state: 'IA', address: '1701 E McKinley Ave', postal: '50320', lat: 41.53939, lng: -93.588828 }
    ]
  },

  /* ─────────────── KANSAS ─────────────── */
  {
    id: 'usabmx-ks',
    name: 'Kansas',
    description: 'USA BMX tracks in Kansas.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Emery Park BMX', city: 'Wichita', state: 'KS', address: '2339 E MacArthur Rd', postal: '67216', lat: 37.618183, lng: -97.31035, website: 'https://www.emeryparkbmx.com' },
      { kind: 'track', title: 'Heartland BMX', city: 'Topeka', state: 'KS', address: '4801 SW Shunga Dr', postal: '66614', lat: 39.017283, lng: -95.73496, website: 'https://www.hbmx.org' },
      { kind: 'track', title: 'Park City BMX', city: 'Park City', state: 'KS', address: '6801 N Hydraulic', postal: '67219', lat: 37.805988, lng: -97.325955 }
    ]
  },

  /* ─────────────── LOUISIANA ─────────────── */
  {
    id: 'usabmx-la',
    name: 'Louisiana',
    description: 'USA BMX tracks in Louisiana.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Cargill Park BMX', city: 'Shreveport', state: 'LA', address: '2800 Cargill Drive', postal: '71108', lat: 32.430035, lng: -93.810089, phone: '318-347-4098' },
      { kind: 'track', title: 'Gretna BMX Raceway', city: 'Gretna', state: 'LA', address: '800 Gretna Blvd', postal: '70053', lat: 29.896562, lng: -90.047875, phone: '504-371-5197' },
      { kind: 'track', title: 'Twin City BMX', city: 'Monroe', state: 'LA', address: '401 Lea Joyner Memorial Expy', postal: '71201', lat: 32.502871, lng: -92.106172, phone: '318-557-8665' }
    ]
  },

  /* ─────────────── MARYLAND ─────────────── */
  {
    id: 'usabmx-md',
    name: 'Maryland',
    description: 'USA BMX tracks in Maryland.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Chesapeake BMX', city: 'Severn', state: 'MD', address: '726 Donaldson Avenue', postal: '21144', lat: 39.138649, lng: -76.681566, phone: '(410) 969-5177' },
      { kind: 'track', title: 'Hagerstown BMX', city: 'Hagerstown', state: 'MD', address: 'Fairground Ave & Cross St', postal: '21740', lat: 39.647549, lng: -77.709078, phone: '(301) 748-8276' },
      { kind: 'track', title: 'Southern Maryland BMX', city: 'Mechanicsville', state: 'MD', address: '26600 Budds Creek Rd', postal: '20659', lat: 38.381338, lng: -76.806031, website: 'http://www.somdbmx.com' },
      { kind: 'track', title: 'Riverside BMX', city: 'Cumberland', state: 'MD', address: 'Mason Sports Complex', postal: '21502', lat: 39.620929, lng: -78.763593, phone: '2408037332', website: 'http://www.riversidebmx.org' }
    ]
  },

  /* ─────────────── MASSACHUSETTS ─────────────── */
  {
    id: 'usabmx-ma',
    name: 'Massachusetts',
    description: 'USA BMX tracks in Massachusetts.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Billerica BMX', city: 'Billerica', state: 'MA', address: '270 Treble Cove Rd', postal: '01821', lat: 42.550851, lng: -71.295605, phone: '617-319-0396', website: 'https://www.billericabmxtrack1625.org' },
      { kind: 'track', title: 'Whip City BMX', city: 'Westfield', state: 'MA', address: '137 Russellville Road', postal: '01085', lat: 42.171276, lng: -72.757602, website: 'http://www.whipcitybmx.com' },
      { kind: 'track', title: 'Cape Cod BMX', city: 'Sandwich', state: 'MA', address: '65 Quaker Meetinghouse Rd', postal: '02563', lat: 41.82464, lng: -70.51585, phone: '5082211839', website: 'http://www.capecodbmx.com' }
    ]
  },

  /* ─────────────── MICHIGAN ─────────────── */
  {
    id: 'usabmx-mi',
    name: 'Michigan',
    description: 'USA BMX tracks in Michigan.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Midland BMX', city: 'Midland', state: 'MI', address: '3950 E Ashman St', postal: '48642', lat: 43.619615, lng: -84.175422, phone: '757-344-6196' },
      { kind: 'track', title: 'Rock City BMX', city: 'Rockford', state: 'MI', address: '3300 10 Mile Road', postal: '49341', lat: 43.114526, lng: -85.586309, website: 'http://www.rockcitybmx.com' },
      { kind: 'track', title: 'Waterford Oaks BMX', city: 'Waterford', state: 'MI', address: '1702 Scott Lake Rd', postal: '48328', lat: 42.665353, lng: -83.342761, phone: '248-858-0915', website: 'http://www.waterfordoaksbmx.com' },
      { kind: 'track', title: 'Grand Traverse County BMX', city: 'Traverse City', state: 'MI', address: '3625 Nimrod Rd', postal: '49685', lat: 44.650048, lng: -85.647451, phone: '231-357-0489' },
      { kind: 'track', title: 'Can Am BMX', city: 'Goodells', state: 'MI', address: '8345 County Park Rd', postal: '48027', lat: 42.983585, lng: -82.652856, phone: '810-357-5074' },
      { kind: 'track', title: 'Capital City Family (MI) BMX', city: 'Lansing', state: 'MI', address: '2809 N East St', postal: '48906', lat: 42.76157, lng: -84.544044, phone: '(517) 610-6607' },
      { kind: 'track', title: 'Richfield Park BMX', city: 'Davison', state: 'MI', address: '6550 N Irish Road', postal: '48423', lat: 43.100905, lng: -83.557076, phone: '817-944-9822' }
    ]
  },

  /* ─────────────── MINNESOTA ─────────────── */
  {
    id: 'usabmx-mn',
    name: 'Minnesota',
    description: 'USA BMX tracks in Minnesota.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Mankato Area BMX', city: 'Mankato', state: 'MN', address: '100 Industrial Rd', postal: '56001', lat: 44.203559, lng: -93.980698, phone: '507-720-7006' },
      { kind: 'track', title: 'Lakes Area BMX', city: 'Brainerd', state: 'MN', address: '10415 Town Hall Street', postal: '56401', lat: 46.296595, lng: -94.265742, phone: '(218) 820-4889', website: 'http://www.lakesareabmx.com' },
      { kind: 'track', title: 'I94 BMX', city: 'Fergus Falls', state: 'MN', address: 'Delagoon Park', postal: '56537', lat: 46.306319, lng: -96.093607, phone: '218-770-0492' },
      { kind: 'track', title: 'River Valley (MN) BMX', city: 'New Ulm', state: 'MN', address: '229 S German St', postal: '56073', lat: 44.311866, lng: -94.454634, phone: '(507) 276-3362' },
      { kind: 'track', title: 'Crow River BMX', city: 'St. Michael', state: 'MN', address: '3150 Lander Avenue North', postal: '55376', lat: 45.199493, lng: -93.654537, phone: '507-421-6489', website: 'http://www.crowriverbmx.com' },
      { kind: 'track', title: 'Faribault BMX', city: 'Faribault', state: 'MN', address: 'South Alexander Park', postal: '55021', lat: 44.301401, lng: -93.282638, phone: '507-330-2202' },
      { kind: 'track', title: 'Pineview Park BMX', city: 'St. Cloud', state: 'MN', address: '6540 Saukview Dr', postal: '56303', lat: 45.556958, lng: -94.243437, phone: '320-333-8201', website: 'http://www.pineviewparkbmx.com' },
      { kind: 'track', title: 'Rum River BMX', city: 'Isanti', state: 'MN', address: 'Isanti Parkway Northwest', postal: '55040', lat: 45.499955, lng: -93.246481, phone: '763-444-5429' },
      { kind: 'track', title: 'Green Lake BMX', city: 'Spicer', state: 'MN', address: '221 W South Street', postal: '56288', lat: 45.224582, lng: -94.94535, phone: '320-403-2473' },
      { kind: 'track', title: 'Buffalo Creek BMX', city: 'Glencoe', state: 'MN', address: '1017 9th Street', postal: '55336', lat: 44.768332, lng: -94.149785, phone: '(320) 224-6655', website: 'http://www.buffalocreekbmx.com' }
    ]
  },

  /* ─────────────── MISSOURI ─────────────── */
  {
    id: 'usabmx-mo',
    name: 'Missouri',
    description: 'USA BMX tracks in Missouri.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'St. Peters BMX', city: 'St. Peters', state: 'MO', address: '100 Brown Rd', postal: '63376', lat: 38.802619, lng: -90.632712, phone: '636-486-6787' },
      { kind: 'track', title: 'Raytown BMX', city: 'Kansas City', state: 'MO', address: '12605 Frost Rd', postal: '64138', lat: 38.974624, lng: -94.433155, phone: '913-749-8071', website: 'www.raytownbmx1498.org' },
      { kind: 'track', title: 'Spokes BMX', city: 'Springfield', state: 'MO', address: '2550 W Bennett', postal: '65807', lat: 37.18916, lng: -93.327742, phone: '417-831-6060 Hotline' },
      { kind: 'track', title: 'Blue Springs BMX', city: 'Blue Springs', state: 'MO', address: '2715 NW Park Drive', postal: '64015', lat: 39.050469, lng: -94.275677, phone: '816-598-4303', website: 'https://www.bluespringsbmx.com' }
    ]
  },

  /* ─────────────── MISSISSIPPI ─────────────── */
  {
    id: 'usabmx-ms',
    name: 'Mississippi',
    description: 'USA BMX tracks in Mississippi.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Mag Ridge BMX Park', city: 'Ridgeland', state: 'MS', address: '344 Oldtown Crossing', postal: '39157', lat: 32.438058, lng: -90.126643, phone: '601-750-2456' }
    ]
  },

  /* ─────────────── MONTANA ─────────────── */
  {
    id: 'usabmx-mt',
    name: 'Montana',
    description: 'USA BMX tracks in Montana.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Gallatin Valley BMX', city: 'Bozeman', state: 'MT', address: '620 N 5th Ave', postal: '59715', lat: 45.68748, lng: -111.042755, phone: '406-209-9917' },
      { kind: 'track', title: 'Electric City BMX', city: 'Great Falls', state: 'MT', address: '1200 21st Ave So', postal: '59405', lat: 47.482612, lng: -111.287234, phone: '580-954-2297' }
    ]
  },

  /* ─────────────── NEBRASKA ─────────────── */
  {
    id: 'usabmx-ne',
    name: 'Nebraska',
    description: 'USA BMX tracks in Nebraska.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Star City BMX', city: 'Lincoln', state: 'NE', address: '101 Charleston St', postal: '68508', lat: 40.827912, lng: -96.719524, phone: '4025705734', website: 'http://www.starcitybmx.com' },
      { kind: 'track', title: 'TRI CITY (NE) BMX', city: 'Kearney', state: 'NE', address: '3710 30th Ave', postal: '68845', lat: 40.711638, lng: -99.129531, phone: '308-870-5179', website: 'http://www.tricitybmx.net' },
      { kind: 'track', title: 'Omaha BMX', city: 'Omaha', state: 'NE', address: '11111 W Maple Rd', postal: '68164', lat: 41.288811, lng: -96.092268, phone: '402-885-9259', website: 'http://www.omahabmx.com' }
    ]
  },

  /* ─────────────── NEVADA ─────────────── */
  {
    id: 'usabmx-nv',
    name: 'Nevada',
    description: 'USA BMX tracks in Nevada.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Carson City BMX', city: 'Carson City', state: 'NV', address: '1555 Livermore Ln', postal: '89721', lat: 39.11909, lng: -119.748616, phone: '775-220-7111 on race days/presign' },
      { kind: 'track', title: 'Reno Battleborn BMX', city: 'Sun Valley', state: 'NV', address: 'Sun Valley GID Community Park', postal: '89433', lat: 39.599075, lng: -119.782326, phone: '775-229-0639' },
      { kind: 'track', title: 'Ed Fountain Park BMX Raceway', city: 'Las Vegas', state: 'NV', address: '1400 N Decatur Blvd', postal: '89108', lat: 36.186516, lng: -115.203393, website: 'http://www.efpbmx.org' },
      { kind: 'track', title: 'Boulder BMX Inc', city: 'Boulder City', state: 'NV', address: '1799 Commons Way', postal: '89005', lat: 35.951573, lng: -114.847319, phone: '702-420-3411', website: 'boulderbmx.com' },
      { kind: 'track', title: 'White Pine BMX', city: 'Ely', state: 'NV', address: '913 E 16th St', postal: '89301', lat: 39.25713, lng: -114.857098, phone: '(775)653-3138', website: 'http://whitepinebmx.com/' },
      { kind: 'track', title: 'Nellis BMX', city: 'Las Vegas', state: 'NV', address: '4949 E Cheyenne Ave', postal: '89115', lat: 36.214806, lng: -115.066037, phone: '702-632-4439' },
      { kind: 'track', title: 'Fernley BMX', city: 'Fernley', state: 'NV', address: '212 Mull Ln', postal: '89408', lat: 39.59001, lng: -119.245782 }
    ]
  },

  /* ─────────────── NEW JERSEY ─────────────── */
  {
    id: 'usabmx-nj',
    name: 'New Jersey',
    description: 'USA BMX tracks in New Jersey.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Hunterdon County BMX', city: 'Flemington', state: 'NJ', address: '314 Rt 12 North', postal: '08822', lat: 40.50078, lng: -74.900236 },
      { kind: 'track', title: 'EHT BMX', city: 'Egg Harbor Township', state: 'NJ', address: 'Veterans Memorial Park', postal: '08234', lat: 39.368304, lng: -74.625138, phone: '609-781-9895' },
      { kind: 'track', title: 'Central Jersey BMX', city: 'Howell', state: 'NJ', address: '2449 U.S. 9', postal: '07731', lat: 40.180185, lng: -74.24369, phone: '732-863-1010' }
    ]
  },

  /* ─────────────── NEW MEXICO ─────────────── */
  {
    id: 'usabmx-nm',
    name: 'New Mexico',
    description: 'USA BMX tracks in New Mexico.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Duke City BMX', city: 'Albuquerque', state: 'NM', address: '1011 Buena Vista Dr SE', postal: '87106', lat: 35.07003, lng: -106.624761, phone: '505-890-1BMX (1269)', website: 'http://www.dukecitybmx.org' },
      { kind: 'track', title: 'Wild Chile BMX', city: 'Las Cruces', state: 'NM', address: '1600 East Hadley Ave', postal: '88001', lat: 32.317992, lng: -106.757787, phone: '575-644-3991' }
    ]
  },

  /* ─────────────── NEW YORK ─────────────── */
  {
    id: 'usabmx-ny',
    name: 'New York',
    description: 'USA BMX tracks in New York.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Kingston Point BMX', city: 'Kingston', state: 'NY', address: '4 Delaware Ave', postal: '12401', lat: 41.92749, lng: -73.967078, phone: '845-339-0618' },
      { kind: 'track', title: 'Horseheads BMX', city: 'Horseheads', state: 'NY', address: '190 Wygant Rd', postal: '14845', lat: 42.188322, lng: -76.822157, phone: '607-542-8141' },
      { kind: 'track', title: 'New Paltz BMX', city: 'New Paltz', state: 'NY', address: '1 Clearwater Rd', postal: '12561', lat: 41.791037, lng: -74.061434, phone: '845-240-2680', website: 'http://www.newpaltzbmx.org' },
      { kind: 'track', title: 'Charlie`s BMX Track, Inc.', city: 'Ellery Center', state: 'NY', address: '4400 1/2 Dutch Hollow Rd', postal: '14767', lat: 42.178885, lng: -79.341454, phone: '716-203-1895', website: 'http://www.charliesbmx.org' },
      { kind: 'track', title: 'Tri City (NY) BMX', city: 'Schenectady', state: 'NY', address: '520 Burdeck St', postal: '12306', lat: 42.804387, lng: -73.992539, phone: '518-382-2691', website: 'http://www.tri-citybmx.org' },
      { kind: 'track', title: 'CNY BMX', city: 'Bridgewater', state: 'NY', address: '408 Pritchard Ave', postal: '13313', lat: 42.882623, lng: -75.247926, website: 'http://www.cnybmx.com' },
      { kind: 'track', title: 'South Towns BMX', city: 'Hamburg', state: 'NY', address: '2982 Lakeview Rd', postal: '14075', lat: 42.715221, lng: -78.888443, phone: '716-393-0286' },
      { kind: 'track', title: 'BMX@Shoreham', city: 'Shoreham', state: 'NY', address: 'Rt25A & Defense Hill Rd', postal: '11786', lat: 40.944939, lng: -72.869182, website: 'http://www.shorehambmx.org' },
      { kind: 'track', title: 'Upstate BMX', city: 'Newark', state: 'NY', address: '6416 Silver Hill Rd', postal: '14513', lat: 43.018455, lng: -77.073212, phone: '585-233-2026', website: 'http://www.upstatebmx.com' }
    ]
  },

  /* ─────────────── NORTH CAROLINA ─────────────── */
  {
    id: 'usabmx-nc',
    name: 'North Carolina',
    description: 'USA BMX tracks in North Carolina.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Capital City (NC) BMX', city: 'Raleigh', state: 'NC', address: '516 Dennis Ave', postal: '27604', lat: 35.796296, lng: -78.613368, phone: '520-425-6621', website: 'http://www.ccbmx.org' },
      { kind: 'track', title: 'Hornet`s Nest BMX', city: 'Charlotte', state: 'NC', address: '6301 Beatties Ford Rd', postal: '28216', lat: 35.320255, lng: -80.872293, phone: '704-226-8420', website: 'http://www.ncbmx.com' },
      { kind: 'track', title: 'Burlington BMX', city: 'Burlington', state: 'NC', address: '1450 Graham Street', postal: '27217', lat: 36.088844, lng: -79.409641, phone: '336-223-6485', website: 'https://www.burlingtonbmx.com' },
      { kind: 'track', title: 'Tanglewood BMX', city: 'Clemmons', state: 'NC', address: '4061 Clemmons Rd', postal: '27012', lat: 35.990255, lng: -80.418645, phone: '336-766-5269' }
    ]
  },

  /* ─────────────── NORTH DAKOTA ─────────────── */
  {
    id: 'usabmx-nd',
    name: 'North Dakota',
    description: 'USA BMX tracks in North Dakota.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Red River BMX', city: 'Grand Forks', state: 'ND', address: '1490 S. 42nd Street', postal: '58201', lat: 47.90613, lng: -97.0882, phone: '701-330-0317' },
      { kind: 'track', title: 'Fastrax BMX', city: 'Bismarck', state: 'ND', address: '2800 S 12th St', postal: '58504', lat: 46.776238, lng: -100.774416, phone: '7014005909', website: 'http://www.bismarckfastrax.com' }
    ]
  },

  /* ─────────────── OHIO ─────────────── */
  {
    id: 'usabmx-oh',
    name: 'Ohio',
    description: 'USA BMX tracks in Ohio.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Kettering BMX', city: 'Kettering', state: 'OH', address: '1700 Delco Park Dr', postal: '45429', lat: 39.70741, lng: -84.127153, phone: '9372195756' },
      { kind: 'track', title: 'Dayton Indoor BMX', city: 'Dayton', state: 'OH', address: '16 Edmund St', postal: '45404-1668', lat: 39.778637, lng: -84.177665, phone: '9372195756' },
      { kind: 'track', title: 'Hamilton BMX', city: 'Hamilton', state: 'OH', address: '7 Joe Nuxhall Way', postal: '45015', lat: 39.350884, lng: -84.584931, phone: '513-310-3793', website: 'http://www.hamiltonbmx.com' },
      { kind: 'track', title: 'Speedway BMX', city: 'Toledo', state: 'OH', address: '5639 Benore', postal: '43612', lat: 41.716589, lng: -83.514998, phone: '517-403-3241', website: 'http://www.toledospeedwaybmx.com' },
      { kind: 'track', title: 'Akron BMX', city: 'Akron', state: 'OH', address: '800 Derby Downs Drive', postal: '44306', lat: 41.037202, lng: -81.462164, phone: '330-784-3777', website: 'http://www.akronbmx.org' },
      { kind: 'track', title: 'Westerville BMX', city: 'Westerville', state: 'OH', address: '535 Park Meadow Road', postal: '43081', lat: 40.113133, lng: -82.936166, phone: '614-257-8044', website: 'http://www.westervillebmx.org' },
      { kind: 'track', title: 'Cleves BMX', city: 'Cleves', state: 'OH', address: 'Henderson Kupfer Rd', postal: '45002', lat: 39.16266, lng: -84.760251 }
    ]
  },

  /* ─────────────── OKLAHOMA ─────────────── */
  {
    id: 'usabmx-ok',
    name: 'Oklahoma',
    description: 'USA BMX tracks in Oklahoma.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Sand Springs BMX', city: 'Sand Springs', state: 'OK', address: '2600 S River City Park Rd', postal: '74063', lat: 36.127762, lng: -96.117952, phone: '918-855-0344', website: 'http://www.sandspringsbmx.com' },
      { kind: 'track', title: 'Yukon BMX', city: 'Yukon', state: 'OK', address: 'Taylor Park Sports Complex', postal: '73064', lat: 35.511479, lng: -97.767313 }
    ]
  },

  /* ─────────────── OREGON ─────────────── */
  {
    id: 'usabmx-or',
    name: 'Oregon',
    description: 'USA BMX tracks in Oregon.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Emerald Valley BMX', city: 'Eugene', state: 'OR', address: '2715 Leo Harris Pkwy', postal: '97402', lat: 44.054736, lng: -123.065178, phone: '5412146152' },
      { kind: 'track', title: 'Umpqua Valley BMX', city: 'Dillard', state: 'OR', address: '140 Hult Ave', postal: '97432', lat: 43.101212, lng: -123.430672, phone: '541-430-7853' },
      { kind: 'track', title: 'Bend BMX', city: 'Bend', state: 'OR', address: '21690 Neff Road', postal: '97701', lat: 44.06847, lng: -121.241877, phone: '541-410-0808' },
      { kind: 'track', title: 'River City BMX', city: 'Grants Pass', state: 'OR', address: '251 NE Agness', postal: '97526', lat: 42.423488, lng: -123.350995 },
      { kind: 'track', title: 'Molalla River BMX', city: 'Molalla', state: 'OR', address: '920 Toliver Rd', postal: '97038', lat: 45.154034, lng: -122.596017 },
      { kind: 'track', title: 'Klamath Falls BMX', city: 'Klamath Falls', state: 'OR', address: '3868 Anderson Ave', postal: '97603', lat: 42.180149, lng: -121.740661, phone: '5412812173' },
      { kind: 'track', title: 'Rogue Valley BMX', city: 'Medford', state: 'OR', address: 'Highland Drive', postal: '97504', lat: 42.317511, lng: -122.850688, phone: '5416216877', website: 'http://www.roguevalleybmx.com' },
      { kind: 'track', title: 'Chehalem Valley BMX', city: 'Newberg', state: 'OR', address: '1201 South Blaine St.', postal: '97132', lat: 45.289596, lng: -122.976564 },
      { kind: 'track', title: 'Smith Rock BMX', city: 'Redmond', state: 'OR', address: '1935 NE Maple', postal: '97756', lat: 44.291587, lng: -121.145275, phone: '541-316-0005', website: 'https://www.smithrockbmx.org' }
    ]
  },

  /* ─────────────── PENNSYLVANIA ─────────────── */
  {
    id: 'usabmx-pa',
    name: 'Pennsylvania',
    description: 'USA BMX tracks in Pennsylvania.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Valley BMX', city: 'Athens', state: 'PA', address: 'Myron Ln.', postal: '18840', lat: 41.998507, lng: -76.56916, phone: '570-888-1850' },
      { kind: 'track', title: 'Cedar BMX', city: 'Clarks Summit', state: 'PA', address: 'Red Barn Village Rd', postal: '18644', lat: 41.453921, lng: -75.778027, phone: '272-398-8352' },
      { kind: 'track', title: 'Revolution Bike Park', city: 'York', state: 'PA', address: '400 Mundis Race Rd', postal: '17406', lat: 40.029126, lng: -76.704419, phone: '717-629-0457', website: 'http://www.revolution-bike-park.square.site/' },
      { kind: 'track', title: 'Trilogy Park BMX', city: 'Pottstown', state: 'PA', address: '75 W King St', postal: '19464', lat: 40.248813, lng: -75.656844 },
      { kind: 'track', title: 'South Park BMX', city: 'Bethel Park', state: 'PA', address: '800 East Park Drive', postal: '15102', lat: 40.332303, lng: -80.007355, phone: '908-239-3818', website: 'www.spbmx.net' },
      { kind: 'track', title: 'Lake Shore BMX', city: 'Erie', state: 'PA', address: 'Scott Park', postal: '16505', lat: 42.110513, lng: -80.148075, phone: '814-572-1750', website: 'http://lakeshorebmx.org' },
      { kind: 'track', title: 'Johnstown BMX', city: 'Johnstown', state: 'PA', address: '260 Playground Drive', postal: '15904', lat: 40.308797, lng: -78.86136, phone: '814-270-9408' },
      { kind: 'track', title: 'Drake Well BMX', city: 'Titusville', state: 'PA', address: '516 Allen St', postal: '16354', lat: 41.618875, lng: -79.657263, phone: '814-758-6029', website: 'http://www.drakewellbmx.com' },
      { kind: 'track', title: 'Westmoreland BMX', city: 'Apollo', state: 'PA', address: '200 Park Road', postal: '15613', lat: 40.57846, lng: -79.606555, phone: '412-423-5616' }
    ]
  },

  /* ─────────────── SOUTH CAROLINA ─────────────── */
  {
    id: 'usabmx-sc',
    name: 'South Carolina',
    description: 'USA BMX tracks in South Carolina.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Lexington BMX', city: 'Lexington', state: 'SC', address: '1159 Nazareth Road', postal: '29073', lat: 33.922974, lng: -81.246423, phone: '803-609-4244' }
    ]
  },

  /* ─────────────── SOUTH DAKOTA ─────────────── */
  {
    id: 'usabmx-sd',
    name: 'South Dakota',
    description: 'USA BMX tracks in South Dakota.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Rapid City BMX', city: 'Rapid City', state: 'SD', address: '626 E Fairmont Blvd', postal: '57701', lat: 44.057569, lng: -103.204129, phone: '605-431-0688', website: 'https://www.rapidcitybmx.com/' },
      { kind: 'track', title: 'Aberdeen Hub Area BMX', city: 'Aberdeen', state: 'SD', address: '1111 1st Ave SE', postal: '57401', lat: 45.465293, lng: -98.471113, phone: '605-229-0859', website: 'http://www.aberdeenbmx.com' }
    ]
  },

  /* ─────────────── TENNESSEE ─────────────── */
  {
    id: 'usabmx-tn',
    name: 'Tennessee',
    description: 'USA BMX tracks in Tennessee.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Bradley BMX', city: 'Cleveland', state: 'TN', address: '234 Urbane Rd', postal: '37312', lat: 35.192714, lng: -84.819732, phone: '843-270-3824 JOSH NEW RIDER DEVELOPMENT' },
      { kind: 'track', title: 'Music City BMX Association', city: 'Nashville', state: 'TN', address: '2901 Bell Road', postal: '37217', lat: 36.106302, lng: -86.626153, phone: '615-925-6173', website: 'http://www.musiccitybmx.com' },
      { kind: 'track', title: 'Smoky Mountain BMX', city: 'Morristown', state: 'TN', address: '3100 Lorino Park Road', postal: '37813', lat: 36.223279, lng: -83.246471, phone: '423-470-2786' },
      { kind: 'track', title: 'Shelby Farms BMX', city: 'Memphis', state: 'TN', address: '6435 Walnut Grove Rd', postal: '38119', lat: 35.134004, lng: -89.848423 }
    ]
  },

  /* ─────────────── TEXAS ─────────────── */
  {
    id: 'usabmx-tx',
    name: 'Texas',
    description: 'USA BMX tracks in Texas.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Desert Downs BMX', city: 'El Paso', state: 'TX', address: '8801 Railroad', postal: '79924', lat: 31.86349, lng: -106.413842, phone: '9154334869' },
      { kind: 'track', title: 'Desoto BMX', city: 'Desoto', state: 'TX', address: 'Grimes Park', postal: '75115', lat: 32.622705, lng: -96.847605 },
      { kind: 'track', title: 'Cowtown BMX', city: 'Ft. Worth', state: 'TX', address: '447 Haltom Rd', postal: '76117', lat: 32.772301, lng: -97.280502, phone: '817-834-0279' },
      { kind: 'track', title: 'Lone Star BMX', city: 'San Antonio', state: 'TX', address: '3950 Eisenhauer Rd', postal: '78218', lat: 29.625213, lng: -98.520048 },
      { kind: 'track', title: 'Pearland BMX', city: 'Alvin', state: 'TX', address: '5657 Morning Dove Ln', postal: '77511', lat: 29.479519, lng: -95.295689, phone: '281-485-0337', website: 'http://www.pearlandbmx.com' },
      { kind: 'track', title: 'Sun City BMX', city: 'El Paso', state: 'TX', address: '650 Wallenburg', postal: '79912', lat: 31.815153, lng: -106.530808, phone: '915-373-1919' },
      { kind: 'track', title: 'West Texas BMX', city: 'Midland', state: 'TX', address: '2101 E Cuthbert', postal: '79706', lat: 32.0154, lng: -102.045948 },
      { kind: 'track', title: 'Capitol City (TX) BMX', city: 'Pflugerville', state: 'TX', address: '5001 Killingsworth Lane', postal: '78660', lat: 30.40864, lng: -97.6031, phone: '(512) 387-6675' },
      { kind: 'track', title: 'Wee Chi Tah BMX', city: 'Wichita Falls', state: 'TX', address: '404 Burkburnett Rd', postal: '76306', lat: 33.922716, lng: -98.497073, phone: '940-636-9649' }
    ]
  },

  /* ─────────────── UTAH ─────────────── */
  {
    id: 'usabmx-ut',
    name: 'Utah',
    description: 'USA BMX tracks in Utah.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Rad Canyon BMX', city: 'South Jordan', state: 'UT', address: '5200 W 9800 S', postal: '84088', lat: 40.572452, lng: -112.013791, phone: '801-803-1900', website: 'http://www.radcanyonbmx.com' },
      { kind: 'track', title: 'Deseret Peak BMX', city: 'Tooele', state: 'UT', address: '2930 Ut-112', postal: '84074', lat: 40.572908, lng: -112.379726 },
      { kind: 'track', title: 'Deseret Peak Indoor BMX', city: 'TOOELE', state: 'UT', address: '2930 Ut-112', postal: '84074', lat: 40.573544, lng: -112.379358, phone: '8018423012' },
      { kind: 'track', title: 'Rad Canyon BMX Indoor', city: 'South Jordan', state: 'UT', address: '2100 W 11400 S', postal: '84095', lat: 40.54707, lng: -111.94592 },
      { kind: 'track', title: 'Red Hills BMX', city: 'Richfield', state: 'UT', address: '1361 N Main', postal: '84701', lat: 38.762856, lng: -112.078402, phone: '435-979-8272' },
      { kind: 'track', title: 'Red Hills Indoor BMX', city: 'Salina', state: 'UT', address: 'Blackhawk Arena Grounds', postal: '84654', lat: 38.948566, lng: -111.860212, phone: '435-893-1582' },
      { kind: 'track', title: 'Virgin BMX', city: 'Virgin', state: 'UT', address: '425 N. Kolob Rd', postal: '84779', lat: 37.213549, lng: -113.177993, phone: 'Michael Linares' }
    ]
  },

  /* ─────────────── VERMONT ─────────────── */
  {
    id: 'usabmx-vt',
    name: 'Vermont',
    description: 'USA BMX tracks in Vermont.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Catamount BMX', city: 'Bennington', state: 'VT', address: 'Willow Park', postal: '05201', lat: 42.900922, lng: -73.194566, phone: '802-779-6097', website: 'http://www.catamountbmx.org' }
    ]
  },

  /* ─────────────── VIRGINIA ─────────────── */
  {
    id: 'usabmx-va',
    name: 'Virginia',
    description: 'USA BMX tracks in Virginia.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Hampton BMX', city: 'Hampton', state: 'VA', address: '901 E Littleback River Rd', postal: '23669', lat: 37.073922, lng: -76.331735, phone: '757-513-6443', website: 'http://www.hamptonbmx.com/' },
      { kind: 'track', title: 'Northern Virginia (NOVA) BMX', city: 'Woodbridge', state: 'VA', address: '7 County Complex Court', postal: '22192', lat: 38.685192, lng: -77.35126, phone: '703-951-7269', website: 'http://www.novabmx.org' },
      { kind: 'track', title: 'Richmond BMX', city: 'Richmond', state: 'VA', address: '4401 Hobbs Lane', postal: '23231', lat: 37.521613, lng: -77.404196, phone: '804-245-1066' },
      { kind: 'track', title: 'VMP BMX', city: 'N Dinwiddie', state: 'VA', address: '8018 Boydton Plank Road', postal: '23803', lat: 37.163809, lng: -77.522854, phone: '804-301-5059' },
      { kind: 'track', title: 'Winchester BMX', city: 'Winchester', state: 'VA', address: '1001 E. Cork Street', postal: '22601', lat: 39.17541, lng: -78.14992, phone: '540-324-3478' }
    ]
  },

  /* ─────────────── WASHINGTON ─────────────── */
  {
    id: 'usabmx-wa',
    name: 'Washington',
    description: 'USA BMX tracks in Washington.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'River Valley (WA) BMX', city: 'Sumner', state: 'WA', address: '7800 Riverside Rd E', postal: '98360', lat: 47.183588, lng: -122.214532, phone: '253-350-5129', website: 'http://www.rivervalleybmxracing.com' },
      { kind: 'track', title: 'Seatac BMX', city: 'Sea Tac', state: 'WA', address: '1855 S 136th St', postal: '98168', lat: 47.480741, lng: -122.309139, phone: '360-508-8144 - Text Only', website: 'http://seatacbmx.com/' },
      { kind: 'track', title: 'Lincoln Park BMX', city: 'Port Angeles', state: 'WA', address: 'South L St & W. Lauridsen Blvd', postal: '98362', lat: 48.114616, lng: -123.482734, phone: '360-460-1435', website: 'www.lpbmx.com' },
      { kind: 'track', title: 'Bigfoot BMX', city: 'Everett', state: 'WA', address: '600 128th St SE', postal: '98201', lat: 47.879124, lng: -122.221935 },
      { kind: 'track', title: 'WALLA WALLA BMX', city: 'Walla Walla', state: 'WA', address: 'Fort Walla Walla Park', postal: '99362', lat: 46.044828, lng: -118.362976, phone: '509-301-1166' },
      { kind: 'track', title: 'Columbia Basin BMX', city: 'Richland', state: 'WA', address: '2002 Snyder St', postal: '99354', lat: 46.31525, lng: -119.289937, phone: '509-460-0061', website: 'http://columbiabasinbmx.com' },
      { kind: 'track', title: 'Bakerview BMX', city: 'Mt. Vernon', state: 'WA', address: '3101 E Fir Street', postal: '98273', lat: 48.430553, lng: -122.29811, phone: '360-391-3342', website: 'http://www.bakerviewbmx.com' },
      { kind: 'track', title: 'Moses Lake BMX', city: 'Moses Lake', state: 'WA', address: '610 Yakima Ave', postal: '98837', lat: 47.104631, lng: -119.305387, website: 'http://www.moseslakebmx.com' },
      { kind: 'track', title: 'Spokane BMX', city: 'Spokane', state: 'WA', address: '5701 N Assembly St', postal: '99205', lat: 47.707592, lng: -117.482536, phone: '5099990839' }
    ]
  },

  /* ─────────────── WISCONSIN ─────────────── */
  {
    id: 'usabmx-wi',
    name: 'Wisconsin',
    description: 'USA BMX tracks in Wisconsin.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Central Wisconsin BMX', city: 'Wisconsin Rapids', state: 'WI', address: '2220 E Riverview Expy,', postal: '54494', lat: 44.374791, lng: -89.798416, phone: '715-459-2809 (RACE DAYS)', website: 'http://www.cwbmx.org' },
      { kind: 'track', title: 'Winnebagoland BMX', city: 'Oshkosh', state: 'WI', address: '4650 Jackson Street', postal: '54901', lat: 44.087942, lng: -88.542263, phone: '920-427-9368', website: 'http://www.winnebagolandbmx.org' },
      { kind: 'track', title: 'Hodag BMX', city: 'Rhinelander', state: 'WI', address: '995 Lynne St', postal: '54501', lat: 45.642503, lng: -89.428686, phone: '715-362-2691', website: 'http://www.hodagbmx.com' },
      { kind: 'track', title: 'MadTown BMX', city: 'Sun Prairie', state: 'WI', address: '315 Park St.', postal: '53590', lat: 43.178158, lng: -89.209984, phone: '608-566-0403 (only during open hours)' }
    ]
  },

  /* ─────────────── WYOMING ─────────────── */
  {
    id: 'usabmx-wy',
    name: 'Wyoming',
    description: 'USA BMX tracks in Wyoming.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Mike Sedar BMX', city: 'Casper', state: 'WY', address: '789 College Dr', postal: '82601', lat: 42.821416, lng: -106.335768, phone: '307-235-4168' },
      { kind: 'track', title: 'Southwest Wyoming Indoor BMX', city: 'Rock Springs', state: 'WY', address: '3320 Yellowstone Road', postal: '82901', lat: 41.63902, lng: -109.245601 },
      { kind: 'track', title: 'Southwest Wyoming Outdoor BMX', city: 'Green River', state: 'WY', address: '1795 Bridger Rd', postal: '82935', lat: 41.635636, lng: -109.234062 },
      { kind: 'track', title: 'Razor City BMX', city: 'Gillette', state: 'WY', address: '200 Pumphouse Ln', postal: '82716', lat: 44.297692, lng: -105.512105, phone: '307-660-4187' }
    ]
  },

  /* ─────────────── ALASKA ─────────────── */
  {
    id: 'usabmx-ak',
    name: 'Alaska',
    description: 'USA BMX tracks in Alaska.',
    group: 'usabmx',
    pins: [
      { kind: 'track', title: 'Far North BMX', city: 'Fairbanks', state: 'AK', address: 'Kiana St & 19th Ave', postal: '99709', lat: 64.831285, lng: -147.787685 }
    ]
  }
];
