export interface Resource {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  latitude: number;
  longitude: number;
}

export interface CityResources {
  city: string;
  state: string;
  center: [number, number];
  resources: Resource[];
}

export const mentalHealthResources: CityResources[] = [
  // California
  {
    state: 'California', city: 'Los Angeles', center: [34.0522, -118.2437], resources: [
      { name: 'LA County Mental Health', address: '550 S Vermont Ave, Los Angeles, CA 90020', phone: '800-854-7771', website: 'https://dmh.lacounty.gov/', latitude: 34.0614, longitude: -118.2915 },
    ],
  },
  { state: 'California', city: 'San Francisco', center: [37.7749, -122.4194], resources: [
      { name: 'SF Mental Health Services', address: '1380 Howard St, San Francisco, CA 94103', phone: '415-255-3737', website: 'https://www.sfdph.org/', latitude: 37.7718, longitude: -122.4156 },
    ],
  },
  { state: 'California', city: 'San Diego', center: [32.7157, -117.1611], resources: [
      { name: 'San Diego Access & Crisis Line', address: '7465 Mission Valley Rd, San Diego, CA 92108', phone: '888-724-7240', website: 'https://up2sd.org/', latitude: 32.7732, longitude: -117.1545 },
    ],
  },
  { state: 'California', city: 'San Jose', center: [37.3382, -121.8863], resources: [
      { name: 'Santa Clara County Behavioral Health', address: '828 S Bascom Ave, San Jose, CA 95128', phone: '800-704-0900', website: 'https://bhsd.sccgov.org/', latitude: 37.3125, longitude: -121.9316 },
    ],
  },
  { state: 'California', city: 'Sacramento', center: [38.5816, -121.4944], resources: [
      { name: 'Sacramento County Mental Health', address: '7001A East Pkwy, Sacramento, CA 95823', phone: '916-875-1055', website: 'https://dhs.saccounty.net/BHS/', latitude: 38.5087, longitude: -121.4262 },
    ],
  },
  // Texas
  { state: 'Texas', city: 'Houston', center: [29.7604, -95.3698], resources: [
      { name: 'The Harris Center', address: '9401 Southwest Fwy, Houston, TX 77074', phone: '713-970-7000', website: 'https://www.theharriscenter.org/', latitude: 29.6786, longitude: -95.5456 },
    ],
  },
  { state: 'Texas', city: 'Dallas', center: [32.7767, -96.7970], resources: [
      { name: 'Dallas Metrocare Services', address: '1345 River Bend Dr, Dallas, TX 75247', phone: '214-743-1200', website: 'https://www.metrocareservices.org/', latitude: 32.8121, longitude: -96.8726 },
    ],
  },
  { state: 'Texas', city: 'Austin', center: [30.2672, -97.7431], resources: [
      { name: 'Integral Care', address: '1430 Collier St, Austin, TX 78704', phone: '512-472-4357', website: 'https://integralcare.org/', latitude: 30.2505, longitude: -97.7696 },
    ],
  },
  { state: 'Texas', city: 'San Antonio', center: [29.4241, -98.4936], resources: [
      { name: 'The Center for Health Care Services', address: '3031 IH-10 West, San Antonio, TX 78201', phone: '210-223-7233', website: 'https://chcsbc.org/', latitude: 29.4571, longitude: -98.5266 },
    ],
  },
  { state: 'Texas', city: 'Fort Worth', center: [32.7555, -97.3308], resources: [
      { name: 'MHMR of Tarrant County', address: '3840 Hulen St, Fort Worth, TX 76107', phone: '817-335-3022', website: 'https://www.mhmrtarrant.org/', latitude: 32.7157, longitude: -97.4029 },
    ],
  },
  // New York
  { state: 'New York', city: 'New York', center: [40.7128, -74.0060], resources: [
      { name: 'NYC Well', address: '50 Water St, New York, NY 10004', phone: '888-692-9355', website: 'https://nycwell.cityofnewyork.us/', latitude: 40.7033, longitude: -74.0119 },
    ],
  },
  { state: 'New York', city: 'Buffalo', center: [42.8864, -78.8784], resources: [
      { name: 'Crisis Services of Buffalo', address: '100 River Rock Dr, Buffalo, NY 14207', phone: '716-834-3131', website: 'https://crisisservices.org/', latitude: 42.9437, longitude: -78.8966 },
    ],
  },
  { state: 'New York', city: 'Rochester', center: [43.1566, -77.6088], resources: [
      { name: 'Monroe County Mental Health', address: '111 Westfall Rd, Rochester, NY 14620', phone: '585-753-6040', website: 'https://www.monroecounty.gov/mh', latitude: 43.1256, longitude: -77.6176 },
    ],
  },
  { state: 'New York', city: 'Yonkers', center: [40.9312, -73.8988], resources: [
      { name: 'Westchester County Crisis Prevention', address: '112 E Post Rd, White Plains, NY 10601', phone: '914-925-5959', website: 'https://mentalhealth.westchestergov.com/', latitude: 41.0327, longitude: -73.7654 },
    ],
  },
  { state: 'New York', city: 'Syracuse', center: [43.0481, -76.1474], resources: [
      { name: 'Contact Community Services', address: '6311 Court St Rd, Syracuse, NY 13206', phone: '315-251-0600', website: 'https://www.contactsyracuse.org/', latitude: 43.0818, longitude: -76.1046 },
    ],
  },
  // Florida
  { state: 'Florida', city: 'Miami', center: [25.7617, -80.1918], resources: [
      { name: 'Thriving Mind South Florida', address: '7205 Corporate Center Dr, Miami, FL 33126', phone: '888-248-3111', website: 'https://www.thrivingmind.org/', latitude: 25.7781, longitude: -80.3131 },
    ],
  },
  { state: 'Florida', city: 'Orlando', center: [28.5383, -81.3792], resources: [
      { name: 'Aspire Health Partners', address: '5151 Adanson St, Orlando, FL 32804', phone: '407-875-3700', website: 'https://aspirehealthpartners.com/', latitude: 28.6062, longitude: -81.3936 },
    ],
  },
  { state: 'Florida', city: 'Tampa', center: [27.9506, -82.4572], resources: [
      { name: 'Gracepoint Wellness', address: '5707 N 22nd St, Tampa, FL 33610', phone: '813-272-2958', website: 'https://www.gracepointwellness.org/', latitude: 27.9991, longitude: -82.4336 },
    ],
  },
  { state: 'Florida', city: 'Jacksonville', center: [30.3322, -81.6557], resources: [
      { name: 'Mental Health Resource Center', address: '1636 W 25th St, Jacksonville, FL 32209', phone: '904-695-9145', website: 'https://www.mhrcflorida.com/', latitude: 30.3622, longitude: -81.7036 },
    ],
  },
  { state: 'Florida', city: 'St. Petersburg', center: [27.7676, -82.6403], resources: [
      { name: 'Suncoast Center', address: '4024 Central Ave, St. Petersburg, FL 33711', phone: '727-388-1220', website: 'https://www.suncoastcenter.org/', latitude: 27.7711, longitude: -82.6876 },
    ],
  },
  // Illinois
  { state: 'Illinois', city: 'Chicago', center: [41.8781, -87.6298], resources: [
      { name: 'NAMI Chicago', address: '1801 W Warner Ave, Chicago, IL 60613', phone: '833-626-4244', website: 'https://namichicago.org/', latitude: 41.9581, longitude: -87.6806 },
    ],
  },
  { state: 'Illinois', city: 'Aurora', center: [41.7606, -88.3201], resources: [
      { name: 'Family Counseling Service', address: '70 S River St, Aurora, IL 60506', phone: '630-844-2662', website: 'https://aurorafcs.org/', latitude: 41.7576, longitude: -88.3121 },
    ],
  },
  { state: 'Illinois', city: 'Naperville', center: [41.7508, -88.1535], resources: [
      { name: 'Linden Oaks Behavioral Health', address: '852 S West St, Naperville, IL 60540', phone: '630-305-5027', website: 'https://www.eehealth.org/services/behavioral-health/', latitude: 41.7498, longitude: -88.1535 },
    ],
  },
  { state: 'Illinois', city: 'Joliet', center: [41.5250, -88.0817], resources: [
      { name: 'Stepping Stones Treatment Center', address: '1621 Theodore St, Joliet, IL 60435', phone: '815-744-4555', website: 'https://steppingstonestreatment.com/', latitude: 41.5430, longitude: -88.1087 },
    ],
  },
  { state: 'Illinois', city: 'Rockford', center: [42.2711, -89.0937], resources: [
      { name: 'Rosecrance Health Network', address: '3815 Harrison Ave, Rockford, IL 61108', phone: '815-391-1000', website: 'https://rosecrance.org/', latitude: 42.2411, longitude: -89.0937 },
    ],
  },
  // Pennsylvania
  { state: 'Pennsylvania', city: 'Philadelphia', center: [39.9526, -75.1652], resources: [
      { name: 'DBHIDS', address: '1101 Market St, Philadelphia, PA 19107', phone: '888-545-2600', website: 'https://dbhids.org/', latitude: 39.9526, longitude: -75.1652 },
    ],
  },
  { state: 'Pennsylvania', city: 'Pittsburgh', center: [40.4406, -79.9959], resources: [
      { name: 'Resolve Crisis Services', address: '333 N Braddock Ave, Pittsburgh, PA 15208', phone: '888-796-8226', website: 'https://www.upmc.com/services/behavioral-health/resolve-crisis-services', latitude: 40.4536, longitude: -79.8959 },
    ],
  },
  { state: 'Pennsylvania', city: 'Allentown', center: [40.6084, -75.4902], resources: [
      { name: 'Lehigh County Crisis Intervention', address: '17 S 7th St, Allentown, PA 18101', phone: '610-782-3127', website: 'https://www.lehighcounty.org/', latitude: 40.6084, longitude: -75.4902 },
    ],
  },
  { state: 'Pennsylvania', city: 'Erie', center: [42.1292, -80.0851], resources: [
      { name: 'Safe Harbor Behavioral Health', address: '1330 W 26th St, Erie, PA 16508', phone: '814-459-9300', website: 'https://www.upmc.com/locations/hospitals/hamot/services/behavioral-health', latitude: 42.1292, longitude: -80.0851 },
    ],
  },
  { state: 'Pennsylvania', city: 'Reading', center: [40.3356, -75.9269], resources: [
      { name: 'Service Access & Management', address: '19 N 6th St, Reading, PA 19601', phone: '610-236-0530', website: 'https://www.sam-inc.org/', latitude: 40.3356, longitude: -75.9269 },
    ],
  },
  // Ohio
  { state: 'Ohio', city: 'Columbus', center: [39.9612, -82.9988], resources: [
      { name: 'Netcare Access', address: '199 S Central Ave, Columbus, OH 43223', phone: '614-276-2273', website: 'https://www.netcareaccess.org/', latitude: 39.9612, longitude: -82.9988 },
    ],
  },
  { state: 'Ohio', city: 'Cleveland', center: [41.4993, -81.6944], resources: [
      { name: 'FrontLine Service', address: '1744 Payne Ave, Cleveland, OH 44114', phone: '216-623-6888', website: 'https://www.frontlineservice.org/', latitude: 41.4993, longitude: -81.6944 },
    ],
  },
  { state: 'Ohio', city: 'Cincinnati', center: [39.1031, -84.5120], resources: [
      { name: 'Greater Cincinnati Behavioral Health', address: '1501 Madison Rd, Cincinnati, OH 45206', phone: '513-354-5200', website: 'https://www.gcbhs.com/', latitude: 39.1031, longitude: -84.5120 },
    ],
  },
  { state: 'Ohio', city: 'Toledo', center: [41.6528, -83.5379], resources: [
      { name: 'Zepf Center', address: '2005 Ashland Ave, Toledo, OH 43620', phone: '419-841-7701', website: 'https://www.zepfcenter.org/', latitude: 41.6528, longitude: -83.5379 },
    ],
  },
  { state: 'Ohio', city: 'Akron', center: [41.0814, -81.5190], resources: [
      { name: 'Portage Path Behavioral Health', address: '340 S Broadway St, Akron, OH 44308', phone: '330-253-3100', website: 'https://www.portagepath.org/', latitude: 41.0814, longitude: -81.5190 },
    ],
  },
  // Georgia
  { state: 'Georgia', city: 'Atlanta', center: [33.7490, -84.3880], resources: [
      { name: 'Georgia Crisis & Access Line', address: '2600 Century Pkwy NE, Atlanta, GA 30345', phone: '800-715-4225', website: 'https://www.georgiacollaborative.com/', latitude: 33.8490, longitude: -84.3880 },
    ],
  },
  { state: 'Georgia', city: 'Augusta', center: [33.4735, -82.0105], resources: [
      { name: 'Serenity Behavioral Health Systems', address: '3421 Mike Padgett Hwy, Augusta, GA 30906', phone: '706-432-4800', website: 'https://www.serenitybhs.com/', latitude: 33.4735, longitude: -82.0105 },
    ],
  },
  { state: 'Georgia', city: 'Columbus', center: [32.4609, -84.9877], resources: [
      { name: 'New Horizons Behavioral Health', address: '2100 Comer Ave, Columbus, GA 31904', phone: '706-596-5500', website: 'https://www.nhbh.org/', latitude: 32.4609, longitude: -84.9877 },
    ],
  },
  { state: 'Georgia', city: 'Macon', center: [32.8407, -83.6324], resources: [
      { name: 'River Edge Behavioral Health', address: '175 Emery Hwy, Macon, GA 31217', phone: '478-803-7600', website: 'https://www.river-edge.org/', latitude: 32.8407, longitude: -83.6324 },
    ],
  },
  { state: 'Georgia', city: 'Savannah', center: [32.0809, -81.0912], resources: [
      { name: 'Gateway Community Service Board', address: '4151 Old Louisville Rd, Savannah, GA 31408', phone: '912-790-3400', website: 'https://gatewaycsb.org/', latitude: 32.0809, longitude: -81.0912 },
    ],
  },
  // North Carolina
  { state: 'North Carolina', city: 'Charlotte', center: [35.2271, -80.8431], resources: [
      { name: 'Mental Health America of Central Carolinas', address: '3701 Latrobe Dr #140, Charlotte, NC 28211', phone: '704-365-3454', website: 'https://www.mhacentralcarolinas.org/', latitude: 35.1900, longitude: -80.8000 },
    ],
  },
  { state: 'North Carolina', city: 'Raleigh', center: [35.7796, -78.6382], resources: [
      { name: 'Alliance Health', address: '5200 Paramount Pkwy #200, Morrisville, NC 27560', phone: '800-510-9132', website: 'https://www.alliancehealthplan.org/', latitude: 35.8466, longitude: -78.8256 },
    ],
  },
  { state: 'North Carolina', city: 'Greensboro', center: [36.0726, -79.7920], resources: [
      { name: 'Sandhills Center', address: '201 N Eugene St, Greensboro, NC 27401', phone: '800-256-2452', website: 'https://www.sandhillscenter.org/', latitude: 36.0726, longitude: -79.7920 },
    ],
  },
  { state: 'North Carolina', city: 'Durham', center: [35.9940, -78.8986], resources: [
      { name: 'Durham County Department of Public Health', address: '414 E Main St, Durham, NC 27701', phone: '919-560-7600', website: 'https://www.dcopublichealth.org/', latitude: 35.9940, longitude: -78.8986 },
    ],
  },
  { state: 'North Carolina', city: 'Winston-Salem', center: [36.0999, -80.2442], resources: [
      { name: 'Novant Health Forsyth Medical Center', address: '3333 Silas Creek Pkwy, Winston-Salem, NC 27103', phone: '336-718-2001', website: 'https://www.novanthealth.org/', latitude: 36.0665, longitude: -80.2910 },
    ],
  },
]; 