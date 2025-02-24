/* index.js (plain JS version) */

// Global variable for the scanner
let scanner;

// Helper function to convert a date string into mm/dd/yyyy format
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

// Function to start the QR scanner
function startQrScanner() {
  // Ensure the #reader element exists. If not, create it.
  if (!document.getElementById("reader")) {
    const main = document.querySelector("main");
    main.insertAdjacentHTML("afterbegin", '<div id="reader"></div>');
  }
  // Remove image file scanning option by setting showImageUrlInput to false
  scanner = new Html5QrcodeScanner('reader', { fps: 20, showImageUrlInput: false });
  scanner.render(onScanSuccess, onScanFailure);
}

// Success callback for QR scanning
function onScanSuccess(result) {
  console.log("Raw scanned data:", result);
  try {
    const data = JSON.parse(result);
    console.log("Parsed JSON object:", data);
    const subject = data.subject || {};

    // Extract fields (default to an empty string if not found)
    const lname = subject.lName || "";
    const fname = subject.fName || "";
    const mName = subject.mName || "";
    const sex   = subject.sex   || "";
    const DOB   = subject.DOB   || "";
    const PCN   = subject.PCN   || "";

    // Convert DOB to mm/dd/yyyy
    const formattedDOB = formatDate(DOB);

    // Fill in the manual registration form fields
    document.querySelector('input[name="lname"]').value = lname;
    document.querySelector('input[name="fname"]').value = fname;
    document.querySelector('input[name="mname"]').value = mName;
    document.querySelector('input[name="sex"]').value   = sex;
    document.querySelector('input[name="dob"]').value   = formattedDOB;
    document.querySelector('input[name="pcn"]').value   = PCN;

    document.getElementById('result').innerHTML = `
      <h2>QR Data Captured</h2>
      <p>The manual registration form has been filled with scanned data (DOB formatted as mm/dd/yyyy). Please verify or edit the data and submit.</p>
    `;
    // Show the manual form for verification/editing
    document.getElementById("manualForm").style.display = "block";

  } catch (e) {
    console.error("Error parsing JSON:", e);
    document.getElementById('result').innerHTML = `
      <h2>Error</h2>
      <p>Could not parse QR code data as JSON.</p>
      <p>${e}</p>
    `;
  }

  // Stop scanning and remove the scanner element
  scanner.clear();
  document.getElementById('reader').remove();
}

// Failure callback for QR scanning
function onScanFailure(err) {
  console.error("QR code parse error, error =", err);
}

// Manual Registration button
document.getElementById("manualButton").addEventListener("click", function() {
  if (scanner) {
    scanner.clear();
  }
  if (document.getElementById("reader")) {
    document.getElementById("reader").remove();
  }
  document.getElementById("manualForm").style.display = "block";
  document.getElementById("result").innerHTML = "";
});

// Back to QR Scanning button
document.getElementById("backToQr").addEventListener("click", function() {
  document.getElementById("manualForm").style.display = "none";
  document.getElementById("result").innerHTML = "";
  startQrScanner();
});

// Handle the manual registration form submission and update the Google Spreadsheet
document.getElementById("registrationForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const lname = formData.get("lname");
  const fname = formData.get("fname");
  const mname = formData.get("mname");
  const sex   = formData.get("sex");
  const dob   = formData.get("dob");
  const pcn   = formData.get("pcn");

  // Use the new Google Apps Script web app URL
  const scriptURL = "https://script.google.com/macros/s/AKfycbwWbVonTUt82Y212Rp_ebyFV-QnlpIYnUiKxyWJMGOpPq3E8O9IP2udXgrh7Qkj-BdQ/exec";
  const params = `?lname=${encodeURIComponent(lname)}&fname=${encodeURIComponent(fname)}&mname=${encodeURIComponent(mname)}&sex=${encodeURIComponent(sex)}&dob=${encodeURIComponent(dob)}&pcn=${encodeURIComponent(pcn)}`;
  const fullURL = scriptURL + params;
  console.log("Submitting to URL:", fullURL);

  fetch(fullURL)
    .then(response => response.text())
    .then(resultText => {
      document.getElementById("result").innerHTML = `
        <h2>Registration Submitted</h2>
        <p>${resultText}</p>
      `;
      // Optionally hide the form after submission
      document.getElementById("manualForm").style.display = "none";
    })
    .catch(error => {
      console.error("Error updating Google Spreadsheet:", error);
      document.getElementById("result").innerHTML = `
        <h2>Error</h2>
        <p>There was an error submitting your registration. Please try again.</p>
      `;
    });
});

// Automatically start the QR scanner on page load
startQrScanner();
