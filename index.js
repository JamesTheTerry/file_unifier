var walk = require("walk");
const fs = require('fs')
const path = require("path")
const { exec, execSync } = require('child_process');


const getAllFiles = function(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    console.log(dirPath + '/' + file)
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(dirPath + '/' + file)
    }
  })

  return arrayOfFiles;
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
  }
}

const diffCheck = (file1, file2) => {
  try {
    var x = execSync(`diff ${file1} ${file2}`)
    if (x.toString() === '') {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    // console.log(err.output[1].toString())
    return true;
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
    console.log(`${inputHolder}/${inputDirectory}`)
    console.log(files[i])
    const subFilePath = files[i].split(`${inputHolder}/${inputDirectory}`)[1].slice(1);
    console.log('subFilePath:', subFilePath)
    const subDirectories = subFilePath.split('/').slice(0, subFilePath.split('/').length - 1).join('/')
    console.log('subDirectories:', subDirectories)

    console.log(`DEST: ${destinationDirectory}/${subFilePath}`)
    if (fs.existsSync(`./${destinationDirectory}/${subFilePath}`)) {
      console.log('file exists\n')
      for (let j = 0; j < directoryIndex; j++) {
        
      }
    } else {
      console.log('file does not exist\n')
      createFile({
        filePath: files[i],
        subDirectories,
        destinationDirectory,
        subFilePath
      })
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
  const firstFileSet = await getAllFiles(`${inputHolder}/${inputDirectories[0]}`)
  console.log(firstFileSet)
  execSync(`mkdir -p ${destinationDirectory}`)

  firstSetBuilder({
    inputHolder,
    inputDirectory: inputDirectories[0],
    files: firstFileSet,
    destinationDirectory
  })

  for (let i = 1; i < inputDirectories.length; i++) {
    console.log(`${inputHolder}/${inputDirectories[i]}`)
    const files = await getAllFiles(`${inputHolder}/${inputDirectories[i]}`)
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

// orchestra({
//   inputHolder: 'source',
//   inputDirectories: ['test1', 'test2'],
//   destinationDirectory: 'dest2'
// })

// console.log(fs.existsSync('./dest1/hat'))
