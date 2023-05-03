const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });
var cors = require('cors')
app.use(cors())
 
// function encryptFile(filename, key) {
  
//   const data = fs.readFileSync(filename);

//   // Encrypt the data using XOR
//   const encryptedData = Buffer.alloc(data.length);
//   for (let i = 0; i < data.length; i++) {
//     encryptedData[i] = data[i] ^ key.charCodeAt(i % key.length);
//   }

//   const encryptedFilename = `CC-${path.basename(filename)}`;
//   fs.writeFileSync(encryptedFilename, encryptedData);

//   return encryptedFilename;
// }


// function Decrypt(filename, key) {
//   const data = fs.readFileSync(filename);
//   const decryptedData = Buffer.alloc(data.length);
//   for (let i = 0; i < data.length; i++) {
//     decryptedData[i] = data[i] ^ key;
//   }
//   const dcryptedFilename = `CC-${path.basename(filename)}`;
//   fs.writeFileSync("DC-" + dcryptedFilename, decryptedData);
//   return dcryptedFilename;
// }




// app.post('/upload', upload.single('file'), (req, res) => {
//   const file = req.file;
//   const filePath = path.join(__dirname, file.path);

//   // Encrypt the file
//   const encryptedFilePath = encryptFile(filePath, 'abcde12345');

//   // Send the encrypted file as a response
//   res.download(encryptedFilePath, file.originalname, (err) => {
//     // Cleanup: delete the encrypted file after sending
//     fs.unlinkSync(encryptedFilePath);
//   });
// });



// app.post('/uploade', upload.single('file'), (req, res) => {
//   const file = req.file;
//   const filePath = path.join(__dirname, file.path);

//   // Encrypt the file
//   const dcryptedFilePath = Decrypt(filePath, 'abcde12345');

//   // Send the encrypted file as a response
//   res.download(dcryptedFilePath, file.originalname, (err) => {
//     // Cleanup: delete the encrypted file after sending
//     fs.unlinkSync(dcryptedFilePath);
//   });
// });
// Encrypt function
const encrypt = (filename, key) => {
  const fileData = fs.readFileSync(filename);
  const encryptedData = Buffer.alloc(fileData.length);
  for (let i = 0; i < fileData.length; i++) {
    encryptedData[i] = fileData[i] ^ key.charCodeAt(i % key.length);
  }
  const newFilename = `encrypted-${path.basename(filename)}`;
  fs.writeFileSync(newFilename, encryptedData);
  return newFilename;
};

// Decrypt function
const decrypt = (filename, key) => {
  const fileData = fs.readFileSync(filename);
  const decryptedData = Buffer.alloc(fileData.length);
  for (let i = 0; i < fileData.length; i++) {
    decryptedData[i] = fileData[i] ^ key.charCodeAt(i % key.length);
  }
  const newFilename = `decrypted-${path.basename(filename)}`;
  fs.writeFileSync(newFilename, decryptedData);
  return newFilename;
};

app.post('/encrypt', upload.single('file'), (req, res) => {
  const file = req.file;
  const filePath = path.join(__dirname, file.path);

  // Decrypt the file and get the decrypted file path
  const decryptedFilePath = decrypt(filePath, 'abcde12345');

  // Get the original file extension
  const originalFileExtension = path.extname(file.originalname);

  // Send the decrypted file as a response with the original filename and extension
  res.download(decryptedFilePath, `${file.originalname.replace(originalFileExtension, '')}-decrypted${originalFileExtension}`, (err) => {
    // Cleanup: delete the decrypted file after sending
    fs.unlinkSync(decryptedFilePath);
  });
});

app.post('/decrypt', upload.single('file'), (req, res) => {
  const file = req.file;
  const filePath = path.join(__dirname, file.path);

  // Decrypt the file
  const decryptedFilePath = decrypt(filePath, 'abcde12345');

  // Send the decrypted file as a response
  res.download(decryptedFilePath, path.basename(decryptedFilePath), (err) => {
    // Cleanup: delete the decrypted file after sending
    fs.unlinkSync(decryptedFilePath);
  });
});



app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
