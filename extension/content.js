// Function to extract email headers from Gmail
function getEmailHeaders() {
    let headers = {};
    
    // Find the email header container in Gmail's DOM
    let emailContainer = document.querySelector("div.adn.ads"); 
    if (!emailContainer) {
        console.error("Email container not found!");
        return;
    }

    // Extract headers from the email details section
    let emailDetails = emailContainer.querySelectorAll("span.gD, span.go");
    if (emailDetails.length < 2) {
        console.error("Unable to extract headers!");
        return;
    }

    headers["From"] = emailDetails[0].innerText;
    headers["To"] = emailDetails[1].innerText;

    // Get the subject
    let subjectElement = document.querySelector("h2.hP");
    headers["Subject"] = subjectElement ? subjectElement.innerText : "No Subject";

    // Send headers to the popup script
    chrome.runtime.sendMessage({ action: "emailHeadersExtracted", headers });
}

// Run the function when an email is opened
document.addEventListener("click", () => {
    setTimeout(getEmailHeaders, 1000); // Wait a moment to ensure Gmail loads the email
});
