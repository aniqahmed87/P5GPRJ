/* Counts and allocation from the supplied Network Assets inventory, 27 Feb 2026. */
window.PulseInventory={totalSites:762,totalDevices:10000,
 sites:[{key:'outdoor',name:'Shared outdoor',value:365,icon:'radio',tone:'info'},{key:'ibs',name:'Shared IBS',value:257,icon:'building-2',tone:'violet'},{key:'vvip',name:'Dedicated VVIP',value:140,icon:'shield',tone:'success'}],
 aggregation:[{key:'shared-aggregation',name:'Shared aggregation',value:71,icon:'router',tone:'info',note:'Shared mobile aggregation sites.'},{key:'dedicated-aggregation',name:'Dedicated aggregation',value:31,icon:'router',tone:'violet',note:'Dedicated mobile aggregation sites.'}],
 core:[{key:'pulse-dc',name:'Pulse aggregation DC',value:4,icon:'server',tone:'info',note:'Four Pulse aggregation data centres.'},{key:'ip-core',name:'IP core sites',value:2,icon:'network',tone:'violet',note:'Two IP core sites.'},{key:'central-dc',name:'Central data centres',value:2,icon:'building-2',tone:'success',note:'Two central data centres.'}],
 devices:[{key:'iot',name:'Critical IoT',percent:10,icon:'cpu',tone:'danger'},{key:'terminals',name:'Communication terminals',percent:60,icon:'radio-receiver',tone:'info'},{key:'streaming',name:'Streaming',percent:10,icon:'video',tone:'warning'},{key:'voice',name:'Voice',percent:20,icon:'phone',tone:'success'}]
};
