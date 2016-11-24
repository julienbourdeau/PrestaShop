const fs = require('fs');
const exec = require('child_process').exec;
const del = require('del');
const path = require('path');

const version = process.argv[2];

const rootPath = path.normalize(`${__dirname}/../..`);

// Update constants
fs.readFile(`${rootPath}/config/defines.inc.php`, 'utf8', (err, content) => {
  if (err) throw err;
  fs.writeFileSync(
    `${rootPath}/config/defines.inc.php`,
    content
      .replace(/define(.*)_PS_MODE_DEV_(.*);/i, 'define(\'_PS_MODE_DEV_\', false);')
      .replace(/define(.*)_PS_DISPLAY_COMPATIBILITY_WARNING_(.*);/i, 'define(\'_PS_DISPLAY_COMPATIBILITY_WARNING_\', false);'),
  );
});


// Update smarty compile config
fs.readFile(`${rootPath}/install-dev/data/xml/configuration.xml`, 'utf8', (err, content) => {
  if (err) throw err;
  fs.writeFileSync(
    `${rootPath}/install-dev/data/xml/configuration.xml`,
    content
      .replace(/name="PS_SMARTY_FORCE_COMPILE"(.*\n*[^\/]*)?value>[\d]+/, 'name="PS_SMARTY_FORCE_COMPILE"$1value>0')
      .replace(/name="PS_SMARTY_CONSOLE"(.*\n*[^\/]*)?value>[\d]+/, 'name="PS_SMARTY_CONSOLE"$1value>0'),
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
  filePath = rootPath + filePath;
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) throw err;
    fs.writeFileSync(
      filePath,
      content
        .replace(/NAME: Prestashop ([0-9.]*)/, `NAME: Prestashop ${version}`)
        .replace(/VERSION: ([0-9.]*)/, `VERSION: ${version}`),
    );
  });
});


// Create necessary folders
fs.stat(`${rootPath}/app/cache`, (err, stats) => {
  if (err) {
    fs.mkdir(`${rootPath}/app/cache`, () => {
      console.log('/app/cache folder created');
    });
  }
});
fs.stat(`${rootPath}/app/logs`, (err, stats) => {
  if (err) {
    fs.mkdir(`${rootPath}/app/logs`, () => {
      console.log('/app/logs folder created');
    });
  }
});


fs.readFile(`${rootPath}/install-dev/install_version.php`, 'utf8', (err, content) => {
  if (err) throw err;
  fs.writeFileSync(
    `${rootPath}/install-dev/install_version.php`,
    content
      .replace(/_PS_INSTALL_VERSION_', '(.*)'\)/, `_PS_INSTALL_VERSION_', '${version}')`),
  );
});


// child = exec("COMPOSER="+rootPath+"/composer.json COMPOSER_VENDOR_DIR="+rootPath+"/vendor composer install", function (error, stdout, stderr) {
child = exec(`cd ${rootPath} && composer install`, (error, stdout, stderr) => {
  if (error === null) {
    console.log('Php dependencies installed successfully with composer');
  } else {
    console.log(error);
  }
});


// Delete unnecessary folders and files
del([
  `${rootPath}/**/.DS_Store`,
  `${rootPath}/.gitignore`,
  `${rootPath}/.gitmodules`,
  `${rootPath}/.travis.yml`,
  `${rootPath}/**/*.map`,
  `${rootPath}/tests`,
  // rootPath + '/**/.git',
  `${rootPath}/.svn`,
  `${rootPath}/**/node_modules`,
], { force: true }).then((paths) => {
  console.log('Deleted files and folders:\n', paths.join('\n'));
});
