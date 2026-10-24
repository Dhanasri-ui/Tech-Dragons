
const fileInput = document.getElementById("contractFile");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const uploadTitle = document.getElementById("uploadTitle");
const uploadText = document.getElementById("uploadText");
const form = document.getElementById("uploadForm");
const message = document.getElementById("formMessage");
const removeFileButton = document.getElementById("removeFile");

const maxFileSize = 15 * 1024 * 1024; // 15 MB

function showMessage(text) {
    message.textContent = text;
}

function displayFile(file) {
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();

    // Flask backend supports PDF only
    if (extension !== "pdf") {
        fileInput.value = "";
        fileInfo.hidden = true;
        showMessage("Only PDF files are supported.");
        return;
    }

    if (file.size > maxFileSize) {
        fileInput.value = "";
        fileInfo.hidden = true;
        showMessage("File is too large. Maximum size is 15 MB.");
        return;
    }

    showMessage("");

    fileName.textContent =
        `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;

    fileInfo.hidden = false;

    uploadTitle.textContent = "Contract selected";
    uploadTitle.hidden = false;

    uploadText.textContent = "Your PDF is ready for analysis.";
    uploadText.hidden = false;
}

fileInput.addEventListener("change", function () {
    displayFile(fileInput.files[0]);
});

removeFileButton.addEventListener("click", function () {
    fileInput.value = "";
    fileInfo.hidden = true;
    uploadTitle.hidden = true;
    uploadText.hidden = true;
    showMessage("");
});

form.addEventListener("submit", function (event) {
    if (!fileInput.files.length) {
        event.preventDefault();
        showMessage("Please select a PDF contract first.");
        return;
    }

    const file = fileInput.files[0];

    if (!file.name.toLowerCase().endsWith(".pdf")) {
        event.preventDefault();
        showMessage("Only PDF files are supported.");
        return;
    }

    if (file.size > maxFileSize) {
        event.preventDefault();
        showMessage("File is too large. Maximum size is 15 MB.");
        return;
    }

    showMessage("");
    // Valid PDF: submit the form to Flask.
});

async function saveContract(contractText) {
    try {
        const response = await fetch(
            "http://localhost:3000/api/analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contractText: contractText
                })
            }
        );

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        alert("Backend connection failed. Check Node.js.");
        console.error(error);
    }
}
