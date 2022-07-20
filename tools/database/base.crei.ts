import * as fg from 'fast-glob';
import * as fs from 'fs';
import * as path from 'path';
const createEntitiesIndex = (service) => {
  console.log(`Creating entity-index.ts for lib ${service}`);

  const src = `${path.dirname(__dirname)}/../libs/server/${service}`;
  if (!fs.existsSync(src)) {
    console.log(`Lib cannot be found. Path not exist: ${src}`);
    process.exit(1);
  }

  const outDir = `${src}/common/src/lib/configs`;
  const tmpFile = `${outDir}/tmp-entities-index.ts`;
  const outFile = `${outDir}/entities-index.ts`;

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  for (const item of fg.sync(`${src}/**/data-access/entities/src/lib/*.entity.ts`)) {
    const filePath = path.relative(outDir, item).replace(/\.ts$/, '');
    const data = `export * from '${filePath}'\n`;
    fs.writeFileSync(tmpFile, data, { flag: 'a+' });
  }

  if (fs.existsSync(outFile) && fs.existsSync(tmpFile)) {
    fs.unlinkSync(outFile);
    console.log(`Old file '${outFile}' removed`);
  }

  if (fs.existsSync(tmpFile)) {
    fs.renameSync(tmpFile, outFile);
    console.log(`New file ${outFile} saved`);
  }
}

export { createEntitiesIndex };
