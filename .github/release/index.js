const http = require('http');
const fs = require('fs');
const exec = require('child_process').exec;
const del = require('del');
const path = require('path');

var argv = require('yargs')
    .usage('Usage: $0 --version [num]')
    .demandOption(['version'])
    .describe('version', 'Version of the release')
    .example('$0 --version 1.7.1.0', 'Transform a git repo into a release')
    .argv;

const rootPath = path.normalize(`${__dirname}/../..`);


// Update constants
fs.readFile(`${rootPath}/config/defines.inc.php`, 'utf8', (err, content) => {
  if (err) throw err;
  fs.writeFileSync(
    `${rootPath}/config/defines.inc.php`,
    content
      .replace(/define(.*)_PS_MODE_DEV_(.*);/i, 'define(\'_PS_MODE_DEV_\', false);')
      .replace(/define(.*)_PS_DISPLAY_COMPATIBILITY_WARNING_(.*);/i, 'define(\'_PS_DISPLAY_COMPATIBILITY_WARNING_\', false);')
  );
});


// Update smarty compile config
fs.readFile(`${rootPath}/install-dev/data/xml/configuration.xml`, 'utf8', (err, content) => {
  if (err) throw err;
  fs.writeFileSync(
    `${rootPath}/install-dev/data/xml/configuration.xml`,
    content
      .replace(/name="PS_SMARTY_FORCE_COMPILE"(.*\n*[^/]*)?value>[\d]+/, 'name="PS_SMARTY_FORCE_COMPILE"$1value>0')
      .replace(/name="PS_SMARTY_CONSOLE"(.*\n*[^/]*)?value>[\d]+/, 'name="PS_SMARTY_CONSOLE"$1value>0')
  );
});


// Update readme.txt
[
  '/docs/readme_de.txt',
  '/docs/readme_en.txt',
  '/docs/readme_es.txt',
  '/docs/readme_fr.txt',
  '/docs/readme_it.txt',
].forEach((filePath) => {
  const fullPath = rootPath + filePath;
  fs.readFile(fullPath, 'utf8', (err, content) => {
    if (err) throw err;
    fs.writeFileSync(
      fullPath,
      content
        .replace(/NAME: Prestashop ([0-9.]*)/, `NAME: Prestashop ${argv.version}`)
        .replace(/VERSION: ([0-9.]*)/, `VERSION: ${argv.version}`)
    );
  });
});


// Create necessary folders
del([
  `${rootPath}/app/cache`,
  `${rootPath}/app/logs`,
], {force: true}).then((paths) => {
  paths.forEach((path) => {
    console.log(path);
  })
}).catch((paths) => {
  process.stdout.write('Something went wrong');
});


fs.readFile(`${rootPath}/install-dev/install_version.php`, 'utf8', (err, content) => {
  if (err) throw err;

  fs.writeFileSync(
    `${rootPath}/install-dev/install_version.php`,
    content
      .replace(/_PS_INSTALL_VERSION_', '(.*)'\)/, `_PS_INSTALL_VERSION_', '${argv.version}')`)
  );
});


var file = fs.createWriteStream(`${rootPath}/translations/cldr.zip`);
http.get("http://i18n.prestashop.com/cldr/clrd.zip", function(response) {
  response.pipe(file);
});

// exec(`cd ${rootPath} && composer install`, (error) => {
//   if (error === null) {
//     process.stdout.write('Php dependencies installed successfully with composer');
//   } else {
//     process.stdout.write(error);
//   }
// });
//
//
// // Delete unnecessary folders and files
// del([
//   `${rootPath}/**/.DS_Store`,
//   `${rootPath}/.gitignore`,
//   `${rootPath}/.gitmodules`,
//   `${rootPath}/.travis.yml`,
//   `${rootPath}/**/*.map`,
//   `${rootPath}/tests`,
//   // rootPath + '/**/.git',
//   `${rootPath}/.svn`,
//   `${rootPath}/**/node_modules`,
// ], { force: true }).then((paths) => {
//   process.stdout.write('Deleted files and folders:\n', paths.join('\n'));
// });
