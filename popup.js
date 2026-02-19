document.addEventListener('DOMContentLoaded', () => {
  const setupScreen = document.getElementById('setup-screen');
  const mainScreen = document.getElementById('main-screen');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const statusDiv = document.getElementById('status');

  // Check if API key exists
  chrome.storage.sync.get(['apiKey'], (result) => {
    if (result.apiKey) {
      setupScreen.classList.add('hidden');
      mainScreen.classList.remove('hidden');
    }
  });

  // Save API Key
  document.getElementById('saveKey').addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      chrome.storage.sync.set({ apiKey: key }, () => {
        setupScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
      });
    }
  });

  // Fill Button Logic
  document.getElementById('fillBtn').addEventListener('click', async () => {
    statusDiv.textContent = "Scraping form...";
    statusDiv.style.color = "#666";
    
    // 1. Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // 2. Ask Content Script to Scrape
    chrome.tabs.sendMessage(tab.id, { action: "scrape" }, (response) => {
      // HANDLE SCRAPE ERRORS (e.g., Content Script not loaded)
      if (chrome.runtime.lastError) {
        statusDiv.textContent = "Connection Failed: Refresh the job page and try again.";
        statusDiv.style.color = "red";
        console.error("Scrape Error:", chrome.runtime.lastError.message);
        return;
      }

      if (!response || !response.fields) {
        statusDiv.textContent = "Error: No fields found. Refresh page.";
        statusDiv.style.color = "red";
        return;
      }

      statusDiv.textContent = `Found ${response.fields.length} fields. Asking Gemini...`;

      // 3. Send to Background to Process
      chrome.runtime.sendMessage({ action: "process_form", fields: response.fields }, (res) => {
        // HANDLE BACKGROUND ERRORS (e.g., Service Worker dead)
        if (chrome.runtime.lastError) {
            statusDiv.textContent = "API Error: Background service unreachable.";
            statusDiv.style.color = "red";
            console.error("Background Error:", chrome.runtime.lastError.message);
            return;
        }

        if (res.error) {
          statusDiv.textContent = res.error;
          statusDiv.style.color = "red";
        } else {
          statusDiv.textContent = "Injecting answers...";
          
          // 4. Send Answers back to Content Script
          chrome.tabs.sendMessage(tab.id, { action: "fill", data: res.answers }, () => {
             if (chrome.runtime.lastError) {
                 // Usually innocuous if content script is busy, but good to log
                 console.error("Inject Warning:", chrome.runtime.lastError.message);
             }
             statusDiv.textContent = "Done! ✨ Check fields.";
             statusDiv.style.color = "green";
          });
        }
      });
    });
  });
});