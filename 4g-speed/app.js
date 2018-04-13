/*
 * 	4G Speed Calculator
 *	Developed by AbsoluteDouble
 *	GitHub: https://github.com/jake-cryptic/4g-speed
 * 	Website: https://absolutedouble.co.uk/
*/

// Universal configurations
var base = .5;							// Base number for multipliers
var bw = [1.4,3,5,10,15,20];			// Band widths (MHz)
var gbp = [.23,.1,.1,.1,.1,.1];			// Guard band percent (Decimal %)
var mod = [1,1.5,1.95]; 				// Modulation Multiplier
var mimo = [1,2,4]; 					// MiMo Multiplier
var carriers = 0;						// Number of LTE Carriers (CA)

// TDD Specific Configurations
var tddbase = .0005;
// Extended CP rarely used in UK
var tcpl = {
	"normal":7,
	"extended":6
};
var tldir = {
	"D":0,
	"U":2
};
var tddmod = [4,6,8];
var tscprb = 12;						// Sub carriers per resource block
var tconf = {
	// tconf[CONFIG][D/S/U]
	0:[2,2,6],
	1:[4,2,4],
	2:[6,2,2],
	3:[6,1,3],
	4:[7,1,2],
	5:[8,1,1],
	6:[3,2,5]
};
var ssubconf = {
	"normal":{
		// ssubconf[CONFIG][DwPTS/GP/UpPTS]
		0:[3,10,1],
		1:[9,4,1],
		2:[10,3,1],
		3:[11,2,1],
		4:[12,1,1],
		5:[3,9,2],
		6:[9,3,2],
		7:[10,2,2],
		8:[11,1,2]
	},
	"extended":{
		// ssubconf[CONFIG][DwPTS/GP/UpPTS]
		0:[3,8,1],
		1:[8,3,1],
		2:[9,2,1],
		3:[10,1,1],
		4:[3,7,2],
		5:[8,2,2],
		6:[9,1,2],
		7:[0,0,0],
		8:[0,0,0]
	}
};

var lteBandData = {
	1:{"type":"FDD","frequency":"2100","range":["1920-1980","2110-2170"],"bandwidths":[5,10,15,20]},
	2:{"type":"FDD","frequency":"1900","range":["1850-1910","1930-1990"],"bandwidths":[1.4,3,5,10,15,20]},
	3:{"type":"FDD","frequency":"1800","range":["1710-1785","1805-1880"],"bandwidths":[1.4,3,5,10,15,20]},
	4:{"type":"FDD","frequency":"1700","range":["1710-1755","2110-2155"],"bandwidths":[1.4,3,5,10,15,20]},
	5:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	6:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	7:{"type":"FDD","frequency":"2600","range":["2500-2570","2620-2690"],"bandwidths":[5,10,15,20]},
	8:{"type":"FDD","frequency":"900","range":["1920-1980","2110-2170"],"bandwidths":[1.4,3,5,10]},
	10:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	11:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	12:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	13:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	14:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	17:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	18:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	19:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	20:{"type":"FDD","frequency":"800","range":["1920-1980","2110-2170"],"bandwidths":[5,10,15,20]},
	21:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	22:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	24:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	25:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	26:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	27:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	28:{"type":"FDD","frequency":"700","range":["1920-1980","2110-2170"],"bandwidths":[3,5,10,15,20]},
	29:{"type":"SDL","frequency":"","range":[""],"bandwidths":[]},
	30:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	31:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	32:{"type":"SDL","frequency":"1500","range":["1920-1980","2110-2170"],"bandwidths":[5,10,15,20]},
	33:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	34:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	35:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	36:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	37:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	38:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	39:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	40:{"type":"TDD","frequency":"2300","range":["1920-1980","2110-2170"],"bandwidths":[5,10,15,20]},
	41:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	42:{"type":"TDD","frequency":"3400","range":["1920-1980","2110-2170"],"bandwidths":[5,10,15,20]},
	43:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	44:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	45:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	46:{"type":"LAA","frequency":"","range":[""],"bandwidths":[]},
	47:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	48:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	49:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	50:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	51:{"type":"TDD","frequency":"","range":[""],"bandwidths":[]},
	65:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	66:{"type":"FDD","frequency":"1700","range":["1920-1980","2110-2170"],"bandwidths":[1.4,3,5,10,15,20]},
	67:{"type":"SDL","frequency":"","range":[""],"bandwidths":[]},
	68:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	69:{"type":"SDL","frequency":"","range":[""],"bandwidths":[]},
	70:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	71:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	72:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	73:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	74:{"type":"FDD","frequency":"","range":[""],"bandwidths":[]},
	75:{"type":"SDL","frequency":"","range":[""],"bandwidths":[]},
	76:{"type":"SDL","frequency":"","range":[""],"bandwidths":[]},
};

// A nice function for rounding to 2 dp
var sensibleRound = function(n){
	return Math.round(n*100)/100;
};

var rb = function(sw){
	// ( Bandwidth (Hz) - Guard % of Bandwidth (Hz) ) / Resource block size in frequency domain (Hz)
	var rbs = Math.round(
		(
			bw[sw]*1000-(
				bw[sw]*1000*gbp[sw]
			)
		)/180					
	);
	return rbs;
};

var tdd = function(sw,sm,si,tc,tf,tl){
	var dir = ["D",0];
	var consider = dir[1];
	
	// TDD Sect 1
	var symps = tcpl[tl];							// # of OFDM symbols per slot of 0.5ms [symbols]
	var sympsfo = symps/tddbase/1000				// # of OFDM symbols per subframe of 1ms [symbols]
	var sympsft = sympsfo*10						// # of OFDM symbols per frame of 10ms [symbols]
	
	// TDD Sect 2
	var linkoff = tldir[dir[0]];					// TDD Link Direction offset Download|Upload
	
	// TDD Configuration Section
	var tddsconf = tconf[tc];						// TDD Selected Config
	var frames = tddsconf[consider];
	var sect1t = frames*sympsfo;
	
	// TDD Special Configuration Section
	var ssubsconf = ssubconf[tl][tf];				// TDD Special Selected Config
	var sframes = ssubsconf[consider];
	var sect2t = sframes*tddsconf[1];				// Consider special frames
	
	// TDD Total config
	var totalc = sect1t + sect2t;
	
	// Throughput per sub carrier
	var dltpsc = (totalc*100*tddmod[sm]/1000);
	
	// Sub carriers per RB
	var scprb = dltpsc*(tscprb/1000);
	
	// Rbs * Throughput per RBs
	var tpea = rb(sw)*scprb;
	
	// MiMo multipliers
	var atm = tpea * mimo[si];
	
	// Take off 25% to account for RBs used in control channel
	var ctrl = atm * .25;
	var fin = atm-ctrl;
	
	return fin;
};

var fdd = function(sw,sm,si){
	return base * rb(sw) * mod[sm] * mimo[si];
};

var doCalc = function(carrier){
	// Get information from elements
	var sb = $("#ca_id" + carrier + " .sel_freq").val();
	var sw = $("#ca_id" + carrier + " .sel_width").val();
	var sm = $("#ca_id" + carrier + " .sel_modulation").val();
	var si = $("#ca_id" + carrier + " .sel_inout").val();
	var tl = $("#ca_id" + carrier + " .sel_tddcpl").val();
	var tc = $("#ca_id" + carrier + " .sel_tddconfig").val();
	var tf = $("#ca_id" + carrier + " .sel_tddsframe").val();
	
	// Determine calculation type
	var ty = checkType(sb);
	
	// Calculate result
	if (ty === "TDD"){
		var ans = tdd(sw,sm,si,tc,tf,tl);
	} else if (ty === "LAA") {
		return false;
	} else if (ty === "FDD" || ty === "SDL"){
		var ans = fdd(sw,sm,si);
	} else {
		console.error("Unknown type:",ty);
	}
	
	var rounded = sensibleRound(ans);
	
	return rounded;
};

var overallCalc = function(){
	var total = 0;
	for (var i = 0; i < carriers; i++){
		if ($("#ca_id" + i).length !== 0){
			var x = doCalc(i);
			if (x === false){
				$("#speeds").html("LAA Band not supported yet.");
				break;
			}
			if (isNaN(x)){
				$("#speeds").html("There was an error");
				return;
			}
			total = total + x;
		}
	}
	$("#speeds").html(sensibleRound(total) + "Mbps");
};

var generateBandSelector = function(caid){
	var sel = $("<select/>",{
		"class":"rowopt_band",
		"data-carrier":caid
	});
	
	var dKeys = Object.keys(lteBandData);
	
	for (var i = 0, l = dKeys.length;i<l;i++){
		if (lteBandData[dKeys[i]].frequency !== ""){
			txt = "Band " + dKeys[i];
			txt += " | " + lteBandData[dKeys[i]].type;
			txt += " (" + lteBandData[dKeys[i]].frequency + "MHz)";
			
			sel.append(
				$("<option/>",{
					"value":dKeys[i]
				}).text(txt)
			);
		}
	}
	
	return sel;
};

var generateTddOptSelector = function(caid){
	var opts = $("<div/>",{
		"class":"rowsect",
		"data-carrier":caid,
		"style":"display:none;"
	});
	
	// Cyclic Prefix Selector
	opts.append(
		$("<label/>",{"for":"tddconf_cpl" + caid}).text("Cyclic Prefix Length"),
		$("<select/>",{"class":"rowopt_tddcpl","id":"tddconf_cpl" + caid}).append(
			$("<option/>",{"value":"normal"}).text("Normal CP [6]"),
			$("<option/>",{"value":"extended"}).text("Extended CP [7]")
		)
	);
	
	// TDD Config Selector
	opts.append(
		$("<label/>",{"for":"tddconf_cnf" + caid}).text("TDD Configuration"),
		$("<select/>",{"class":"rowopt_tddcnf","id":"tddconf_cnf" + caid}).append(
			$("<option/>",{"value":"0"}).text("TDD Config 0"),
			$("<option/>",{"value":"1"}).text("TDD Config 1"),
			$("<option/>",{"value":"2"}).text("TDD Config 2"),
			$("<option/>",{"value":"3"}).text("TDD Config 3"),
			$("<option/>",{"value":"4"}).text("TDD Config 4"),
			$("<option/>",{"value":"5"}).text("TDD Config 5"),
			$("<option/>",{"value":"6"}).text("TDD Config 6")
		)
	);
	
	// Special Subframe Config Selector
	opts.append(
		$("<label/>",{"for":"tddconf_ssf" + caid}).text("Special Subframe Configuration"),
		$("<select/>",{"class":"rowopt_tddssf","id":"tddconf_ssf" + caid}).append(
			$("<option/>",{"value":"0"}).text("Special Config 0"),
			$("<option/>",{"value":"1"}).text("Special Config 1"),
			$("<option/>",{"value":"2"}).text("Special Config 2"),
			$("<option/>",{"value":"3"}).text("Special Config 3"),
			$("<option/>",{"value":"4"}).text("Special Config 4"),
			$("<option/>",{"value":"5"}).text("Special Config 5"),
			$("<option/>",{"value":"6"}).text("Special Config 6"),
			$("<option/>",{"value":"7"}).text("Special Config 7"),
			$("<option/>",{"value":"8"}).text("Special Config 8")
		)
	);
	
	return opts;
};

var generateBandWidthSelector = function(caid){
	var opts = $("<div/>",{
		"class":"rowsect",
		"data-carrier":caid
	});
	
	opts.append(
		$("<select/>",{
			"class":"rowopt_width",
			"data-carrier":caid
		}).append(
			$("<option/>",{"value":"0"}).text("Select a band first")
		)
	);
	
	return opts;
};

var generateModulationSelector = function(caid){
	var opts = $("<div/>",{
		"class":"rowsect",
		"data-carrier":caid
	});
	
	opts.append(
		$("<select/>",{
			"class":"rowopt_dlmod",
			"id":"dlmod_" + caid,
			"data-carrier":caid
		}).append(
			$("<option/>",{"value":"0"}).text("Select a band first")
		),
		$("<select/>",{
			"class":"rowopt_ulmod",
			"id":"uplmod_" + caid,
			"data-carrier":caid
		}).append(
			$("<option/>",{"value":"0"}).text("Select a band first")
		)
	);
	
	return opts;
};

var generateMiMoSelector = function(caid){
	var opts = $("<div/>",{
		"class":"rowsect",
		"data-carrier":caid
	});
	
	opts.append(
		$("<select/>",{
			"class":"rowopt_mimo",
			"data-carrier":caid
		}).append(
			$("<option/>",{"value":"0"}).text("1x1 SiSo"),
			$("<option/>",{"value":"1"}).text("2x2 MiMo"),
			$("<option/>",{"value":"2"}).text("4X4 MiMo")
		)
	);
	
	return opts;
};

var generateRowOptions = function(caid){
	var opts = $("<div/>",{
		"class":"rowsect",
		"data-carrier":caid
	});
	
	opts.append(
		$("<button/>",{
			"class":"b_aggupl"
		}).text("Aggregate Uplink"),
		$("<br />"),$("<br />"),
		$("<button/>",{
			"class":"b_primaryc"
		}).text("Primary Carrier"),
		$("<br />"),$("<br />"),
		$("<button/>",{
			"class":"b_rmrow"
		}).text("Remove Carrier")
	);
	
	return opts;
};

var addRow = function(){
	var row = $("<div/>",{
		"id":"carrier_id_n" + carriers,
		"class":"carrier_row"
	});
	
	row.append(
		$("<h2/>").text("Carrier #" + (carriers+1)),
		$("<div/>",{"class":"rowsect"}).append(generateBandSelector(carriers)),
		generateTddOptSelector(carriers),
		generateBandWidthSelector(carriers),
		generateModulationSelector(carriers),
		generateMiMoSelector(carriers),
		generateRowOptions(carriers)
	);
	
	//if (carriers !== 0){
	//	var last = $(".carrier_block")[$(".carrier_block").length-1];
	//	row.insertAfter(last);
	//} else {
		$("#ca_body").append(row);
	//}
	
	// Assign selector events
	//$("#ca_id" + carriers + " select").on("change",overallCalc);
	//$("#ca_id" + carriers + " .sel_freq").on("change",showTddOpts);
	//$("#ca_id" + carriers + " .delete_row").on("click enter",removeRow);
	
	carriers++;
};

var addOldRow = function(){
	$("#ca_id" + carriers + " select").on("change",overallCalc);
	$("#ca_id" + carriers + " .sel_freq").on("change",showTddOpts);
	$("#ca_id" + carriers + " .delete_row").on("click enter",removeRow);
	
	carriers++;
	overallCalc();
};

var removeRow = function(){
	if ($(this).data("carrierid") === 0){
		alert("Can't remove the first carrier");
		return;
	}
	$("#ca_id" + $(this).data("carrierid")).remove();
	overallCalc();
};

$(document).ready(function(){
	$("#ca_body").empty();
	$("#add_carrier").on("click enter",addRow);
	addRow();
	
	/*if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/sw.js').then(function(registration){
			console.log('ServiceWorker registration successful with scope: ',registration.scope);
		},function(err){
			console.log('ServiceWorker registration failed: ',err);
		});
	}*/
});