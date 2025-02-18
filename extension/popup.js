document.addEventListener("DOMContentLoaded", () => {
    const analyzeButton = document.getElementById("analyzeButton");
    const resultDisplay = document.getElementById("result");

    analyzeButton.addEventListener("click", () => {
        resultDisplay.textContent = "Fetching email headers...";

        chrome.runtime.sendMessage({ action: "getAuthToken" }, (response) => {
            if (response.success) {
                fetchEmails(response.token);
            } else {
                resultDisplay.textContent = "Authentication failed: " + response.error;
            }
        });
    });
});

function fetchEmails(token) {
    fetch("https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.messages && data.messages.length > 0) {
            return fetchEmailHeaders(token, data.messages[0].id);
        } else {
            document.getElementById("result").textContent = "No unread emails found.";
        }
    })
    .catch(error => console.error("Fetch Error:", error));
}

function fetchEmailHeaders(token, emailId) {
    fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(email => {
        const headers = extractHeaders(email.payload.headers);
        sendToBackend(headers);
    })
    .catch(error => console.error("Header Fetch Error:", error));
}

function extractHeaders(headersArray) {
    const headers = {};
    headersArray.forEach(header => {
        if (["From", "To", "Subject", "Received-SPF", "Authentication-Results"].includes(header.name)) {
            headers[header.name] = header.value;
        }
    });
    return headers;
}

function sendToBackend(headers) {
    fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("result").textContent = "Analysis Result:\n" + JSON.stringify(data.analysis, null, 2);
    })
    .catch(error => console.error("Backend Error:", error));
}
