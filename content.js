// ============================================================================
// 🤖 GEMINI FORM FILLER - UNIVERSAL CONTENT SCRIPT
// ============================================================================

// --- 1. UTILITIES ---
function cleanLabel(text) {
  if (!text) return "";
  return text.replace(/\*/g, '').replace(/:/g, '').replace(/\n/g, " ").trim();
}

/**
 * UPLOADS A FILE TO A FILE INPUT
 * Chrome extensions cannot access C:\ paths. 
 * We fetch the file from the extension's own package (web_accessible_resources).
 */
async function attachFile(input, filename) {
    try {
        console.log(`Attempting to upload: ${filename} to ${input.id}`);
        
        // 1. Fetch the file from the extension bundle
        const url = chrome.runtime.getURL(filename);
        const response = await fetch(url);
        const blob = await response.blob();
        
        // 2. Create a File object (simulating a user selection)
        const file = new File([blob], filename, { type: 'application/pdf' });
        
        // 3. Use DataTransfer to set the file on the input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        
        // 4. Trigger events so the site notices
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Visual feedback
        input.style.border = "2px solid #34a853"; // Green border
        
    } catch (e) {
        console.error("File upload failed:", e);
    }
}

// --- HELPER: SHADOW DOM WALKER ---
function getAllInputsIncludingShadow(root) {
    let inputs = [];
    const allEl = root.querySelectorAll('*');
    
    allEl.forEach(el => {
        if (el.shadowRoot) {
            inputs = inputs.concat(getAllInputsIncludingShadow(el.shadowRoot));
        }
        if ((el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') && 
            !['hidden', 'submit', 'button', 'image'].includes(el.type)) {
            inputs.push(el);
        }
    });
    
    return inputs;
}

// ============================================================================
// 2. SCRAPING STRATEGIES (The "Eyes")
// ============================================================================

const Strategies = {
  
  // --- STRATEGY A: EIGHTFOLD.AI (Dynamic React Forms) ---
  eightfold: function() {
    const fields = [];
    if (!document.querySelector('#EFSmartApplyContainer') && !document.querySelector('.pcs-form-field')) return fields;

    document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(input => {
        let labelText = "";
        
        // 1. Check aria-labelledby (Eightfold standard)
        const labeledBy = input.getAttribute('aria-labelledby');
        if (labeledBy) {
            const labelEl = document.getElementById(labeledBy);
            if (labelEl) labelText = labelEl.innerText;
        }

        // 2. Check closest label in container
        if (!labelText) {
            const container = input.closest('.pcs-form-field') || input.closest('.form-group');
            if (container) {
                const label = container.querySelector('label, .pcs-label');
                if (label) labelText = label.innerText;
            }
        }

        // 3. Fallback to placeholder/aria-label
        if (!labelText) labelText = input.getAttribute('aria-label') || input.placeholder || "";

        if (cleanLabel(labelText)) {
            fields.push({
                id: input.id || input.name || `ef-${fields.length}`, // Ensure every field has a reference
                name: input.name,
                type: input.tagName.toLowerCase(),
                label: cleanLabel(labelText),
                options: input.tagName === 'SELECT' ? Array.from(input.options).map(o=>o.text) : [],
                strategy: "eightfold"
            });
        }
    });
    return fields;
  },

  // --- STRATEGY B: SMARTRECRUITERS (Shadow DOM) ---
  smartRecruiters: function() {
    const fields = [];
    const appRoot = document.querySelector('oc-app-root');
    if (!appRoot) return fields;

    const inputs = getAllInputsIncludingShadow(document.body);

    inputs.forEach(input => {
        let labelText = "";
        let parent = input.parentElement;
        for(let i=0; i<3; i++) {
            if(!parent) break;
            const label = parent.querySelector('label');
            if (label) {
                labelText = label.innerText;
                break;
            }
            parent = parent.parentElement;
        }

        if (!labelText) labelText = input.getAttribute('placeholder') || input.getAttribute('aria-label') || "";

        if (cleanLabel(labelText)) {
            fields.push({
                id: input.id || input.name, 
                name: input.name,
                type: "shadow_input", 
                tagName: input.tagName.toLowerCase(),
                inputType: input.type,
                label: cleanLabel(labelText),
                options: input.tagName === 'SELECT' ? Array.from(input.options).map(o=>o.text) : [],
                strategy: "smartRecruiters"
            });
        }
    });
    return fields;
  },

  // --- STRATEGY C: AVATURE ---
  avature: function() {
    const fields = [];
    document.querySelectorAll('.fieldSpec').forEach(container => {
      const labelNode = container.querySelector('label.tc_formLabel');
      if (!labelNode) return;
      const labelText = cleanLabel(labelNode.innerText);
      const isRequired = labelNode.innerText.includes('*');
      const input = container.querySelector('input:not([type="hidden"]), select, textarea');
      
      if (input && labelText) {
        let options = input.tagName === 'SELECT' ? Array.from(input.options).map(o => o.text).filter(t => t.trim() !== "") : [];
        fields.push({
          id: input.id || input.name,
          name: input.name,
          type: "avature_input", 
          tagName: input.tagName.toLowerCase(),
          inputType: input.type, 
          label: (isRequired ? "[REQUIRED] " : "") + labelText,
          options: options,
          strategy: "avature"
        });
      }
    });
    return fields;
  },

  // --- STRATEGY D: PERSONIO ---
  personio: function() {
    const fields = [];
    document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(input => {
      if (input.type === 'submit' || input.type === 'button') return; 

      let labelText = "";
      const wrapper = input.closest('.form-group') || input.closest('div');
      if (wrapper) {
          const label = wrapper.querySelector('label');
          if (label) labelText = label.innerText;
      }
      if (labelText && input.placeholder && !labelText.toLowerCase().includes(input.placeholder.toLowerCase())) {
          labelText = `${labelText} - ${input.placeholder}`;
      }
      if (!labelText) labelText = input.getAttribute('aria-label') || input.placeholder || input.name || "";

      if (cleanLabel(labelText)) {
          fields.push({
              id: input.id || input.name,
              name: input.name,
              type: input.tagName.toLowerCase(),
              inputType: input.type,
              label: cleanLabel(labelText),
              options: input.tagName === 'SELECT' ? Array.from(input.options).map(o=>o.text) : [],
              strategy: "personio"
          });
      }
    });
    return fields;
  },

  // --- STRATEGY E: SAP SUCCESSFACTORS ---
  sapSuccessFactors: function() {
    const fields = [];
    document.querySelectorAll('div[id^="picklist_"]').forEach(div => {
      const suffix = div.id.replace('picklist_', '');
      const hiddenInputID = 'tor__f' + suffix; 
      const labelNode = document.querySelector(`label[for="${hiddenInputID}"]`);
      let labelText = labelNode ? cleanLabel(labelNode.innerText) : (div.getAttribute('aria-label') || "");
      if (labelText) {
        fields.push({ id: div.id, type: "sap_picklist", label: labelText, strategy: "sap" });
      }
    });
    return fields;
  },

  // --- STRATEGY F: TALEO / ORACLE ---
  taleoOracle: function() {
    const fields = [];
    document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(input => {
      const parentCell = input.closest('td');
      if (parentCell && parentCell.previousElementSibling) {
        const rawLabel = parentCell.previousElementSibling.innerText;
        if (rawLabel.length > 1) {
           fields.push({
             id: input.id || input.name,
             name: input.name,
             type: input.tagName.toLowerCase(),
             inputType: input.type,
             label: cleanLabel(rawLabel),
             options: input.tagName === 'SELECT' ? Array.from(input.options).map(o=>o.text) : [],
             strategy: "taleo"
           });
        }
      }
    });
    return fields;
  },

  // --- STRATEGY H: iCIMS (Embeds & Iframes) ---
  icims: function() {
    const fields = [];
    // Only run if it looks like iCIMS (common classes or iframe context)
    // Note: window.location.hostname checking in iframe is useful
    const isIcimsFrame = window.location.hostname.includes('icims.com');
    const hasIcimsClasses = document.querySelector('.iCIMS_form_custom, .iCIMS_Logo, iframe[src*="icims"]');
    
    if (!isIcimsFrame && !hasIcimsClasses) return fields;

    document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(input => {
        if (input.type === 'submit' || input.type === 'button') return;

        let labelText = "";

        // 1. iCIMS standard label by ID
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) labelText = label.innerText;
        }

        // 2. Fallback to common iCIMS wrappers
        if (!labelText) {
            const wrapper = input.closest('.iCIMS_form_custom, .form-group, .iCIMS_Field, div');
            if (wrapper) {
                const label = wrapper.querySelector('label, .iCIMS_form_label');
                if (label) labelText = label.innerText;
            }
        }

        // 3. Last resort fallback
        if (!labelText) labelText = input.getAttribute('aria-label') || input.placeholder || input.title || "";

        if (cleanLabel(labelText)) {
            fields.push({
                id: input.id || input.name,
                name: input.name,
                type: input.tagName.toLowerCase(),
                inputType: input.type,
                label: cleanLabel(labelText),
                options: input.tagName === 'SELECT' ? Array.from(input.options).map(o=>o.text) : [],
                strategy: "icims"
            });
        }
    });
    return fields;
  },

  // --- STRATEGY I: HR-ON ---
  hron: function() {
    const fields = [];
    if (!document.querySelector('form[action*="hr-on.com"]') && !window.location.hostname.includes('hr-on.com')) return fields;

    document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(input => {
        if (input.type === 'submit' || input.type === 'button') return;

        let labelText = "";

        // 1. HR-ON specific input row wrapper
        const row = input.closest('.inputrow');
        if (row) {
            const labelSpan = row.querySelector('.label-text');
            if (labelSpan) {
                labelText = labelSpan.innerText;
            } else {
                const labelNode = row.querySelector('label');
                if (labelNode) labelText = labelNode.innerText;
            }
        }

        // 2. Checkbox or nested label (like Terms & Conditions)
        if (!labelText) {
            const labelWrapper = input.closest('label');
            if (labelWrapper) {
                labelText = labelWrapper.innerText;
            }
        }

        // 3. Fallbacks
        if (!labelText && input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) labelText = label.innerText;
        }
        if (!labelText) labelText = input.getAttribute('aria-label') || input.placeholder || "";

        if (cleanLabel(labelText)) {
            fields.push({
                id: input.id || input.name,
                name: input.name,
                type: input.tagName.toLowerCase(),
                inputType: input.type,
                label: cleanLabel(labelText),
                options: input.tagName === 'SELECT' ? Array.from(input.options).map(o=>o.text) : [],
                strategy: "hron"
            });
        }
    });
    return fields;
  },

  // --- STRATEGY G: STANDARD (Fallback) ---
  standard: function() {
    const fields = [];
    document.querySelectorAll('input:not([type="hidden"]), select, textarea').forEach(input => {
        if (input.type === 'submit' || input.style.display === 'none') return;
        let labelText = "";
        if (input.id && document.querySelector(`label[for="${input.id}"]`)) {
            labelText = document.querySelector(`label[for="${input.id}"]`).innerText;
        } else {
            labelText = input.getAttribute('aria-label') || input.placeholder || "";
        }
        if (cleanLabel(labelText)) {
            fields.push({
                id: input.id || input.name,
                name: input.name,
                type: input.tagName.toLowerCase(),
                inputType: input.type,
                label: cleanLabel(labelText),
                options: input.tagName === 'SELECT' ? Array.from(input.options).map(o=>o.text) : [],
                strategy: "standard"
            });
        }
    });
    return fields;
  }
};

// ============================================================================
// 3. MAIN SCRAPER CONTROLLER
// ============================================================================
function scrapeForm() {
  let allFields = [];
  const foundKeys = new Set(); 

  const strategiesToRun = [
      Strategies.eightfold,
      Strategies.smartRecruiters, 
      Strategies.avature, 
      Strategies.personio, 
      Strategies.sapSuccessFactors, 
      Strategies.taleoOracle, 
      Strategies.icims, // Added iCIMS
      Strategies.hron, // Added HR-ON
      Strategies.standard
  ];

  strategiesToRun.forEach(fn => {
      const results = fn();
      results.forEach(f => {
          const uniqueKey = f.id || (f.name + f.label);
          if(!foundKeys.has(uniqueKey)) {
              allFields.push(f);
              foundKeys.add(uniqueKey);
          }
      });
  });

  return allFields;
}

// Explicitly attach to window for access by executeScript in popup.js
window.scrapeForm = scrapeForm;

// ============================================================================
// 4. INJECTOR (The Hands)
// ============================================================================

function setReactNativeValue(element, value) {
    let valueSet = false;
    
    try {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value')?.set;

        if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
            valueSet = true;
        } else if (valueSetter) {
            valueSetter.call(element, value);
            valueSet = true;
        }
    } catch (e) {
        // Ignore descriptor errors, fallback to standard assignment
    }

    if (!valueSet) {
        element.value = value;
    }
    
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
    
    // Explicitly trigger React/Vue update
    const ev = new Event('input', { bubbles: true });
    element.dispatchEvent(ev);
}

function fillForm(answers) {
  let shadowInputs = [];
  const hasShadowDom = document.querySelector('oc-app-root');
  if (hasShadowDom) {
      shadowInputs = getAllInputsIncludingShadow(document.body);
  }

  answers.forEach(async (answer) => { 
    try {
        if (!answer.value || answer.value === "No Selection" || answer.value === "") return;

        // --- FIND ELEMENT ---
        let el = document.getElementById(answer.id);
        
        // If not found by ID or if the found element is hidden, try finding by name.
        // Frameworks like Yii (jobbsys) use hidden inputs with the same name before checkboxes/file inputs.
        if (!el || el.type === 'hidden') {
            let nameToTry = answer.name || answer.id;
            if (nameToTry) {
                const elsByName = Array.from(document.getElementsByName(nameToTry));
                el = elsByName.find(e => e.type !== 'hidden') || el;
            }
        }

        // Fallback for Shadow DOM (SmartRecruiters)
        if (!el && hasShadowDom) {
            el = shadowInputs.find(i => (answer.id && i.id === answer.id) || (answer.name && i.name === answer.name));
        }

        if (!el) return; // Skip if still not found

        console.log(`Filling ${el.id || el.name} with ${answer.value}`);
        
        // Highlight element to show it was filled
        if (el.style) el.style.backgroundColor = "#e8f0fe"; 

        if (el.type === 'file') {
            const val = String(answer.value).toLowerCase();
            if (val.includes("resume") || val.includes("cv") || val.includes("curriculum")) {
                await attachFile(el, "resume.pdf");
            } 
        }
        else if (el.tagName === 'SELECT') {
            const userValue = String(answer.value).toLowerCase().trim();
            let bestMatchIndex = -1;
            for (let i = 0; i < el.options.length; i++) {
                const optText = el.options[i].text.toLowerCase();
                const optVal = el.options[i].value.toLowerCase();
                if (optText === userValue || optText.includes(userValue) || optVal === userValue) {
                    bestMatchIndex = i;
                    break;
                }
            }
            if (bestMatchIndex !== -1) {
                const valueToSet = el.options[bestMatchIndex].value;
                el.selectedIndex = bestMatchIndex;
                setReactNativeValue(el, valueToSet);
            }
        } 
        else if (el.type === 'checkbox') {
             const valStr = String(answer.value).toLowerCase();
             // Match standard true/yes strings, OR if Gemini returned the checkbox's actual expected value
             const isChecked = ['true', 'yes', '1', 'on'].includes(valStr) || valStr === String(el.value).toLowerCase();
             el.checked = isChecked;
             el.dispatchEvent(new Event('change', { bubbles: true }));
             el.dispatchEvent(new Event('click', { bubbles: true }));
        }
        else if (el.type === 'radio') {
             const radios = document.getElementsByName(el.name);
             let checkTarget = null;
             
             // 1. Try to match by exact ID if Gemini provided it
             if (answer.id) {
                 const exactEl = document.getElementById(answer.id);
                 if (exactEl && exactEl.type === 'radio') checkTarget = exactEl;
             }
             
             // 2. Try to match by Value (e.g. Gemini returned "Male" to match value="male")
             if (!checkTarget) {
                 for (let r of radios) {
                     if (String(r.value).toLowerCase() === String(answer.value).toLowerCase()) {
                         checkTarget = r;
                         break;
                     }
                 }
             }
             
             // 3. Fallback: if Gemini just returned 'true'/'yes'
             if (!checkTarget && ['true', 'yes', '1', 'on'].includes(String(answer.value).toLowerCase())) {
                 checkTarget = el;
             }

             if (checkTarget) {
                 checkTarget.checked = true;
                 checkTarget.dispatchEvent(new Event('change', { bubbles: true }));
                 checkTarget.dispatchEvent(new Event('click', { bubbles: true }));
                 if (checkTarget.style) checkTarget.style.backgroundColor = "#e8f0fe"; 
             }
        }
        else {
            setReactNativeValue(el, answer.value);
        }
        
        // Handle specific SAP Picklists
        if (answer.type === "sap_picklist") {
            const div = document.getElementById(answer.id);
            if (div) {
                div.click();
                setTimeout(() => {
                    const input = div.querySelector('input[type="text"]');
                    if (input) {
                        setReactNativeValue(input, answer.value);
                        input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: 13, key: 'Enter' }));
                    }
                }, 100);
            }
        }
    } catch (err) {
        console.error(`Error filling field ${answer.id || answer.name}:`, err);
    }
  });
}

// --- MESSAGING ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrape") {
    const data = scrapeForm();
    sendResponse({ fields: data });
  } else if (request.action === "fill") {
    fillForm(request.data);
    sendResponse({ status: "done" });
  }
});