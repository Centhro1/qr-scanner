<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>QR Scanner</title>
  
  <!-- Load the html5-qrcode library from a CDN -->
  <script src="https://cdn.jsdelivr.net/npm/html5-qrcode"></script>
  
  <style>
    main {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 20px;
    }
    #reader {
      width: 600px;
      margin-bottom: 20px;
    }
    #result {
      text-align: center;
      margin-top: 20px;
    }
    #manualButton, #backToQr {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
    }
    #manualForm {
      display: none;
      margin-top: 20px;
      text-align: left;
      width: 300px;
      border: 1px solid #ccc;
      padding: 15px;
      border-radius: 5px;
    }
    #manualForm label {
      display: block;
      margin: 8px 0;
    }
    #manualForm input {
      width: 100%;
      padding: 5px;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <main>
    <!-- QR Reader & Result -->
    <div id="reader"></div>
    <div id="result"></div>
    <button id="manualButton">Manual Registration</button>

    <!-- Manual Registration Form -->
    <div id="manualForm">
      <h2>Manual Registration</h2>
      <form id="registrationForm">
        <label>
          Last Name: 
          <input type="text" name="lname" required />
        </label>
        <label>
          First Name: 
          <input type="text" name="fname" required />
        </label>
        <label>
          Middle Name: 
          <input type="text" name="mname" />
        </label>
        <label>
          Sex: 
          <input type="text" name="sex" required />
        </label>
        <label>
          Date of Birth: 
          <input type="text" name="dob" required />
        </label>
        <label>
          Philsys ID: 
          <input type="text" name="pcn" required />
        </label>
        <button type="submit">Submit Registration</button>
      </form>
      <button id="backToQr">Back to QR Scanning</button>
    </div>
  </main>
  
  <!-- Reference your custom JavaScript code AFTER the CDN script -->
  <script src="index.js"></script>
</body>
</html>
