#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, 'skills');
const docsDir = path.join(__dirname, 'docs');
const manifestPath = path.join(__dirname, 'skills.json');

function readMd(filePath){
  return fs.readFileSync(filePath, 'utf8');
}

function extractTitleAndDescription(md){
  const lines = md.split(/\r?\n/);
  let title = null;
  for(let i=0;i<lines.length;i++){
    const m = lines[i].match(/^#\s+(.*)/);
    if(m){
      title = m[1].trim();
      // find first non-empty paragraph after title
      let j = i+1;
      while(j < lines.length && lines[j].trim() === '') j++;
      const para = [];
      while(j < lines.length && lines[j].trim() !== '' && !lines[j].startsWith('```') && !lines[j].match(/^#+/)){
        para.push(lines[j]);
        j++;
      }
      let desc = para.join(' ').trim();
      if(!desc){
        // fallback: first non-empty line after title
        for(let k=i+1;k<lines.length;k++){
          if(lines[k].trim()){ desc = lines[k].trim(); break; }
        }
      }
      // basic cleanup of markdown artifacts
      desc = desc.replace(/`+/g, '')
                 .replace(/\[(.*?)\]\(.*?\)/g, '$1')
                 .replace(/^[-*\s]+/,'')
                 .replace(/\s+/g,' ')
                 .trim();
      return {title, desc};
    }
  }
  return {title: null, desc: ''};
}

function makeYamlDescriptionBlock(text){
  if(!text) return 'description: |\n  ';
  const lines = text.split(/\r?\n/).map(l => l.trim()).join(' ').split(/\s{2,}|\./).filter(Boolean);
  const joined = text.replace(/\r?\n/g,' ').trim();
  const wrapped = joined.split(/(?<=\.|\?|!)\s+/).filter(Boolean);
  const blockLines = wrapped.length ? wrapped : [joined];
  return 'description: |\n' + blockLines.map(l => '  ' + l.trim()).join('\n');
}

function updateYaml(yamlPath, desc, name){
  let yaml = fs.existsSync(yamlPath) ? fs.readFileSync(yamlPath,'utf8') : null;
  const descBlock = makeYamlDescriptionBlock(desc);
  if(yaml){
    const regex = /^description:\s*\|[\s\S]*?(?=\n^[^\s].+?:|\n*$)/m;
    if(regex.test(yaml)){
      yaml = yaml.replace(regex, descBlock + '\n');
    } else {
      // insert after name if possible
      const nameRegex = /^(name:\s*.*(?:\r?\n|$))/m;
      if(nameRegex.test(yaml)) yaml = yaml.replace(nameRegex, `$1${descBlock}\n`);
      else yaml = yaml + '\n' + descBlock + '\n';
    }
    // optionally update name field
    const nameRegex2 = /^name:\s*(.*)$/m;
    if(name && nameRegex2.test(yaml)){
      yaml = yaml.replace(nameRegex2, `name: ${name}`);
    }
    fs.writeFileSync(yamlPath, yaml, 'utf8');
    console.log('Updated', yamlPath);
  } else {
    const newYaml = `id: ${path.basename(yamlPath,'.yml')}\nname: ${name || ''}\n${descBlock}\n`;
    fs.writeFileSync(yamlPath, newYaml, 'utf8');
    console.log('Created', yamlPath);
  }
}

function updateManifest(manifestPath, id, name, mdRelPath){
  let manifest = [];
  if(fs.existsSync(manifestPath)){
    try{ manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8')); } catch(e){ console.error('Failed to parse manifest', e); return; }
  }
  const entry = manifest.find(e => e.id === id);
  if(entry){
    entry.name = name || entry.name;
    entry.doc = mdRelPath;
  } else {
    manifest.push({id, name, file: `skills/${id}.yml`, doc: mdRelPath});
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log('Updated manifest', manifestPath);
}

function main(){
  if(!fs.existsSync(docsDir)){
    console.error('docs directory not found:', docsDir);
    process.exit(1);
  }
  const mdFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));
  for(const md of mdFiles){
    const mdPath = path.join(docsDir, md);
    const content = readMd(mdPath);
    const {title, desc} = extractTitleAndDescription(content);
    const id = path.basename(md, '.md');
    const yamlPath = path.join(skillsDir, `${id}.yml`);
    updateYaml(yamlPath, desc, title);
    updateManifest(manifestPath, id, title, `docs/${md}`);
  }
}

main();
