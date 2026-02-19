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

    // 2. Execute scrape across ALL frames (Top page + iframes like iCIMS)
    // We assume content.js is already injected via manifest (all_frames: true)
    // and has exposed window.scrapeForm.
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: () => typeof window.scrapeForm === "function" ? window.scrapeForm() : []
    }, (injectionResults) => {
      
      if (chrome.runtime.lastError) {
        statusDiv.textContent = "Connection Failed: Refresh page.";
        statusDiv.style.color = "red";
        console.error("Scripting Error:", chrome.runtime.lastError.message);
        return;
      }

      let allFields = [];
      let targetFrameId = 0;

      // Combine results from all frames and track which frame had the actual form
      // If multiple frames have fields, we might just take the one with the most fields
      // or concat them. For now, let's target the frame with the most fields.
      let maxFieldsCount = 0;

      for (const frame of injectionResults) {
          if (frame.result && frame.result.length > 0) {
              if (frame.result.length > maxFieldsCount) {
                  maxFieldsCount = frame.result.length;
                  targetFrameId = frame.frameId;
                  allFields = frame.result; // Prioritize the frame with the most fields (likely the main form)
              }
          }
      }

      if (allFields.length === 0) {
        statusDiv.textContent = "Error: No fields found. Refresh page.";
        statusDiv.style.color = "red";
        return;
      }

      statusDiv.textContent = `Found ${allFields.length} fields. Asking Gemini...`;

      // 3. Send to Background to Process
      chrome.runtime.sendMessage({ action: "process_form", fields: allFields }, (res) => {
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
          
          // 4. Send Answers specifically to the frame that contains the form
          chrome.tabs.sendMessage(tab.id, { action: "fill", data: res.answers }, { frameId: targetFrameId }, () => {
             if (chrome.runtime.lastError) {
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