const Handlebars = require('handlebars');
const Dicemath = require('./dicemath');

const Manufacturers = require("../../resources/data/manufacturers.json");

function init() {
  Handlebars.registerHelper('allCaps', function (str) {
    return str.toUpperCase();
  });

  Handlebars.registerHelper('statusStripes', function (status) {
    return status.toUpperCase() === "DECEASED" ? "warning-stripes" : "";
  });

  Handlebars.registerHelper('statusStyle', function (status) {
    if (status.toUpperCase() === "AVAILABLE") return "";
    else if (status.toUpperCase() === "INACTIVE") return "";
    else if (status.toUpperCase() === "ACTIVE") return "active";
    else if (status.toUpperCase() === "DECEASED") return "destroyed";
    else if (status.toUpperCase() === "DESTROYED") return "destroyed";
    return "unavailable";
  });

  Handlebars.registerHelper('activeStatus', function (status) {
    return status.toUpperCase() === "ACTIVE" ? "active" : "";
  });

  Handlebars.registerHelper('checkStripes', function (status) {
    var ok = status.toUpperCase() === "AVAILABLE" || status.toUpperCase() === "ACTIVE";
    return ok ? "" : "warning-stripes";
  });

  Handlebars.registerHelper('checkAvail', function (status) {
    if (status.toUpperCase() === "AVAILABLE") return ""
    else if (status.toUpperCase() === "ACTIVE") return "active"
    else if (status.toUpperCase() === "DESTROYED") return "destroyed"
    else return "unavailable"
  });

  Handlebars.registerHelper('repeat', function (n, block) {
    var str = '';
    for (var i = 0; i < n; ++i)
      str += block.fn(i);
    return str;
  });

  Handlebars.registerHelper('titleCase', function (str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  });

  Handlebars.registerHelper('talentLock', function (level, itemRank, retTrue, retFalse) {
    if (level >= itemRank) return retTrue;
    return retFalse
  });

  Handlebars.registerHelper('trSplit', function (v1, v2, options) {
    if (v1 % v2 === 0) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('longSource', function (source) {
    var m = Manufacturers.find(m => m.id == source.toUpperCase());
    return m ? m.name : "UNKNOWN MANUFACTURER";
  });

  Handlebars.registerHelper('ifElse', function (a, b) {
    return a ? a : b;
  });

  Handlebars.registerHelper('plusMinus', function (val) {
    return val >= 0 ? "+" + val : val;
  });

  Handlebars.registerHelper('balloonSize', function (str) {
    str.split(' ');
    if (str.length < 10) return 'small';
    if (str.length < 30) return 'medium';
    if (str.length < 100) return 'large';
    return 'xlarge';
  });

  Handlebars.registerHelper('dmgFormat', function (dmg) {
    if (dmg.override) return dmg.override;

    var outArr = [];
    for (var key in dmg) {
      if (dmg[key].toString() === "0") continue;
      outArr.push(`<span class="${key}">${dmg[key]} ${key.charAt(0).toUpperCase() + key.slice(1)} Damage</span>`)
    }

    return outArr.join(', ');
  });

  Handlebars.registerHelper('dmgRange', function (dmg) {
    if (!dmg) return "";
    var d = Dicemath.parse(dmg);

    var h = d.min.heat > 0 ? `, + ${d.min.heat} - ${d.max.heat} Heat` : "";
    var ha = d.min.heat > 0 ? ` (${d.avg.heat} Heat)` : ''

    return `${d.min.total} - ${d.max.total}${h}   (${d.avg.total}) ${ha}`;
  });
}

module.exports.init = init;