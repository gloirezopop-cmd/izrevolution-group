const fs = require('fs');
const path = require('path');

const replacements = {
  'Ã©': 'é',
  'Ã': 'à', // Wait, 'Ã ' is 'à' but sometimes it's 'Ã '
  'Ã ': 'à',
  'Ã¨': 'è',
  'Ãª': 'ê',
  'Ã¢': 'â',
  'Ã®': 'î',
  'Ã´': 'ô',
  'Ã»': 'û',
  'Ã§': 'ç',
  'Â': '', // sometimes Â appears before non-breaking spaces
  'mênã s': 'menés'
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Specific fixes
  content = content.replace(/Ã©/g, 'é');
  content = content.replace(/Ã /g, 'à');
  content = content.replace(/Ã¨/g, 'è');
  content = content.replace(/Ãª/g, 'ê');
  content = content.replace(/Ã¢/g, 'â');
  content = content.replace(/Ã®/g, 'î');
  content = content.replace(/Ã´/g, 'ô');
  content = content.replace(/Ã»/g, 'û');
  content = content.replace(/Ã§/g, 'ç');
  content = content.replace(/d'ingÃ©nierie/g, "d'ingénierie");
  content = content.replace(/mÃ©nÃ©s/g, 'menés');
  content = content.replace(/ingÃ©nierie@menÃ s/g, "ingénierie menés");
  content = content.replace(/d'ingÃ©nierie@menÃ  s/g, "d'ingénierie menés");
  content = content.replace(/rÃ©alisation/g, "réalisation");
  content = content.replace(/RÃ©alisations/g, "Réalisations");
  content = content.replace(/DÃ©couvrez/g, "Découvrez");
  content = content.replace(/ParamÃ¨tres/g, "Paramètres");
  content = content.replace(/CrÃ©er/g, "Créer");
  content = content.replace(/prÃ©sentiel/g, "présentiel");
  content = content.replace(/dÃ©jÃ /g, "déjà");
  content = content.replace(/dÃ©jÃ /g, "déjà");
  content = content.replace(/connectÃ©/g, "connecté");
  content = content.replace(/rÃ©ussie/g, "réussie");
  content = content.replace(/accÃ©der/g, "accéder");
  content = content.replace(/PrÃ©nom/g, "Prénom");
  content = content.replace(/DÃ©tails/g, "Détails");
  content = content.replace(/gÃ©nie/g, "génie");
  content = content.replace(/compÃ©tences/g, "compétences");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed encoding in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      fixFile(fullPath);
    }
  }
}

walkDir('./src');
