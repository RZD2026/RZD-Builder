const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, '..', 'content', 'modules');
const mappingFile = path.join(__dirname, '..', 'content', 'mapping', 'pointMappings.js');

const mapping = require(mappingFile);

function loadModules() {
  const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.js'));
  const modules = files.map(f => {
    const mod = require(path.join(modulesDir, f));
    return mod;
  });
  return modules;
}

function analyze() {
  const modules = loadModules();
  const result = {
    modules: [],
    mappings: mapping,
    totals: {
      totalContentPoints: 0,
      totalMappedPoints: 0,
      totalNO_MATCH: 0,
      totalMissingAirtableRecordId: 0,
      totalDuplicateMappings: 0
    },
    noMatch: [],
    missingMappings: [],
    duplicateMappingNames: {},
  };

  // collect mapping name -> contentIds
  const nameToContent = {};

  for (const mod of modules) {
    const modEntry = {
      id: mod.id,
      labels: mod.labels,
      description: mod.description,
      points: []
    };

    for (const pt of (mod.points || [])) {
      result.totals.totalContentPoints++;
      const pm = mapping[pt.id] || null;
      const status = pm ? pm.status : 'MISSING_MAPPING';
      const airtableInfo = pm && pm.airtable ? pm.airtable : null;

      const writable = (pm && pm.status && pm.status !== 'NO_MATCH') ? true : false;

      const item = {
        contentId: pt.id,
        name: pt.labels?.website || pt.labels?.app || null,
        module: mod.id,
        mappingStatus: status,
        airtableModule: airtableInfo ? airtableInfo.module : null,
        airtableName: airtableInfo ? airtableInfo.name : null,
        airtableRecordId: null, // requires Airtable resolution
        writable: writable,
        missingMapping: pm ? false : true
      };

      if (status === 'NO_MATCH') {
        result.noMatch.push(item);
        result.totals.totalNO_MATCH++;
      }

      if (!pm) {
        result.missingMappings.push(item);
      } else {
        if (pm.airtable && pm.airtable.name) {
          const key = pm.airtable.name + '||' + (pm.airtable.module || '');
          nameToContent[key] = nameToContent[key] || [];
          nameToContent[key].push(pt.id);
        }

        if (pm.status && pm.status !== 'NO_MATCH') {
          result.totals.totalMappedPoints++;
        }

        // Since we haven't resolved against Airtable, no record IDs available
        result.totals.totalMissingAirtableRecordId++;
      }

      modEntry.points.push(item);
    }

    result.modules.push(modEntry);
  }

  // detect duplicate mapping names
  for (const [key, contentIds] of Object.entries(nameToContent)) {
    if (contentIds.length > 1) {
      result.duplicateMappingNames[key] = contentIds;
      result.totals.totalDuplicateMappings += contentIds.length;
    }
  }

  return result;
}

const out = analyze();
console.log(JSON.stringify(out, null, 2));
