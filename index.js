var walk = require("walk");
const fs = require('fs')
const { exec, execSync } = require('child_process');
var files = [];

const getAllFilePaths = (directory) => {
  // Walker options
  return new Promise(resolve => {
    var walker = walk.walk(`./${directory}`, {followLinks: false});

    walker.on("file", function(root, stat, next) {
      // Add this file to the list of files
      files.push(root + "/" + stat.name);
      next();
    });

    walker.on("end", function() {
      resolve(files);
    });
  })
}

const createFile = ({ filePath, subDirectories, destinationDirectory, subFilePath }) => {
  if (subDirectories !== '') {
    execSync(`mkdir -p ${destinationDirectory}/${subDirectories}`);
  }
  console.log(`cp ${filePath} ${destinationDirectory}/${subFilePath}`);
  let message = execSync(`cp ${filePath} ${destinationDirectory}/${subFilePath}`);
}

const firstSetBuilder = ({ inputHolder, inputDirectory, files, destinationDirectory}) => {
  for (let i = 0; i < files.length; i++) {
    const subFilePath = files[i].split(`${inputHolder}/${inputDirectory}`)[1].slice(1);
    console.log('subFilePath:', subFilePath)
    const subDirectories = subFilePath.split('/').slice(0, subFilePath.split('/').length - 1).join('/')
    console.log('subDirectories:', subDirectories)

    createFile({
      filePath: files[i],
      subDirectories,
      destinationDirectory,
      subFilePath
    })
    // if (subDirectories !== '') {
    //   execSync(`mkdir -p ${destinationDirectory}/${subDirectories}`);
    // }
    // console.log(`cp ${files[i]} ${destinationDirectory}/${subFilePath}`)
    // let message = execSync(`cp ${files[i]} ${destinationDirectory}/${subFilePath}`)
  }
}



// go through each file
// see if it exists
  // if it does
    // see if it's a duplicate of the file or any of its variants
    // if new variant, create new suffixed file
    // if not new variant, do not copy to dest
  // if not
    // create file directory in dest
    // copy file to dest
const secondarySetBuilder = ({ inputHolder, inputDirectory, files, destinationDirectory, directoryIndex }) => {
  for (let i = 0; i < files.length; i++) {
    const subFilePath = files[i].split(`${inputHolder}/${inputDirectory}`)[1].slice(1);
    console.log('subFilePath:', subFilePath)
    const subDirectories = subFilePath.split('/').slice(0, subFilePath.split('/').length - 1).join('/')
    console.log('subDirectories:', subDirectories)

    console.log(`DEST: ${destinationDirectory}/${subFilePath}`)
    if (fs.existsSync(`./${destinationDirectory}/${subFilePath}`)) {
      console.log('file exists\n')
    } else {
      console.log('file does not exist\n')

    }
  }
}

// secondarySetBuilder({
//   files: ['./source/test2/a1.txt', './source/test2/a2.txt', './source/test2/a3-diff.txt', './source/test2/charlie/c1.txt', './source/test2/beta/b1.txt'],
//   inputDirectory: 'test2',
//   inputHolder: 'source',
//   destinationDirectory: 'dest1'
// })

const orchestra = async ({ inputHolder, inputDirectories, destinationDirectory }) => {
  const firstFileSet = await getAllFilePaths(`${inputHolder}/${inputDirectories[0]}`)
  console.log(firstFileSet)
  execSync(`mkdir -p ${destinationDirectory}`)

  firstSetBuilder({
    inputHolder,
    inputDirectory: inputDirectories[0],
    files: firstFileSet,
    destinationDirectory
  })
  return;

  for (let i = 1; i < inputDirectories.length; i++) {
    const files = await getAllFilePaths(`${inputHolder}/${inputDirectories[i]}`)
    console.log(files);
    secondarySetBuilder({
      inputHolder,
      inputDirectory: inputDirectories[i],
      files,
      destinationDirectory,
      directoryIndex: i
    })
  }
}
// var x = execSync('echo diff.txt')
// console.log(x.toString('utf8'))

orchestra({
  inputHolder: 'source',
  inputDirectories: ['test1', 'test2'],
  destinationDirectory: 'dest2'
})
//
// console.log(fs.existsSync('./dest1/hat'))
