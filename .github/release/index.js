var fs = require('fs');
var exec = require('child_process').exec;
var del = require('del');

const version = process.argv[2];

// Update constants
fs.readFile('../../config/defines.inc.php', 'utf8', (err, content) => {
  if (err) throw err;
  fs.writeFileSync(
    '../../config/defines.inc.php',
    content
      .replace(/define(.*)_PS_MODE_DEV_(.*);/i, 'define(\'_PS_MODE_DEV_\', false);')
      .replace(/define(.*)_PS_DISPLAY_COMPATIBILITY_WARNING_(.*);/i, 'define(\'_PS_DISPLAY_COMPATIBILITY_WARNING_\', false);')
  );
});


// Update smarty compile config
fs.readFile('../../install-dev/data/xml/configuration.xml', 'utf8', (err, content) => {
  if (err) throw err;
  fs.writeFileSync(
    '../../install-dev/data/xml/configuration.xml',
    content
      .replace(/name="PS_SMARTY_FORCE_COMPILE"(.*\n*[^\/]*)?value>[\d]+/, 'name="PS_SMARTY_FORCE_COMPILE"$1value>0')
      .replace(/name="PS_SMARTY_CONSOLE"(.*\n*[^\/]*)?value>[\d]+/, 'name="PS_SMARTY_CONSOLE"$1value>0')
  );
});


// Update readme.txt
[
  '../../docs/readme_de.txt',
  '../../docs/readme_en.txt',
  '../../docs/readme_es.txt',
  '../../docs/readme_fr.txt',
  '../../docs/readme_it.txt',
].forEach((filePath) => {
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) throw err;
    fs.writeFileSync(
      filePath,
      content
        .replace(/NAME: Prestashop ([0-9.]*)/, 'NAME: Prestashop '+version)
        .replace(/VERSION: ([0-9.]*)/, 'VERSION: '+version)
    );
  });
});


// Create necessary folders
fs.stat('../../app/cache', (err, stats) => {
  if (err)
    fs.mkdir('../../app/cache', () => {
      console.log('app/cache folder created');
    });
});
fs.stat('../../app/logs', (err, stats) => {
  if (err)
    fs.mkdir('../../app/logs', () => {
      console.log('app/logs folder created');
    });
});


fs.readFile('../../install-dev/install_version.php', 'utf8', (err, content) => {
  if (err) throw err;
  fs.writeFileSync(
    '../../install-dev/install_version.php',
    content
      .replace(/_PS_INSTALL_VERSION_', '(.*)'\)/, '_PS_INSTALL_VERSION_\', \''+version+'\')')
  );
});


child = exec("cd ../.. && composer install", function (error, stdout, stderr) {
  if (error === null) {
    console.log('Php dependencies installed successfully with composer');
  } else {
    console.log(error);
  }
});


// Delete unnecessary folders and files
del([
  '../../**/.DS_Store',
  '../../.gitignore',
  '../../.gitmodules',
  '../../.travis.yml',
  '../../**/*.map',
  '../../tests',
  // // '../../.git',
  '../../.svn',
  '../../**/node_modules',
  ], {force: true}).then(paths => {
  console.log('Deleted files and folders:\n', paths.join('\n'));
});
