// --- YOUR NEW PROFILE CONSTANT ---
const userProfile = {
  "personal_information": {
    "full_name": "Mewantha Bandara",
    "current_title": "Lead DevOps & Platform Engineer",
    "email": "me@mewantha.net",
    "phone": "+94 76 536 1417",
    "location": "Colombo, Sri Lanka",
    "language": "English: fluent/advanced",
    "documents": {
      "resume_path": "resume.pdf" // Only Resume, no Cover Letter
    },
    "online_presence": {
      "linkedin": "https://www.linkedin.com/in/mewantha-bandara",
      "github": "https://github.mewantha.net",
      "website": "https://mewantha.net",
      "stackoverflow": "Top 2% Contributor (2022-2023)"
    },
    "visa_sponsorship": {
      "required": true,
      "details": "I require visa sponsorship for on-site roles.",
      "eligibility": "Highly eligible for work visa"
    }
  },
  "compliance": {
    "gender": "Male",
    "veteran_status": "No",
    "disability_status": "No",
    "criminal_record": "No",
    "drug_test_consent": "Yes",
    "conflict_of_interest": "No",
    "previous_employee": "No",
    "relatives_at_company": "No",
    "authorization_to_work": "Yes",
    "non_compete_agreement": "No",
    "marketing_consent": "No"
  },
  "logistics": {
    "notice_period": "3 months",
    "start_date": "3 months from current date",
    "salary_expectations": "Consider which region this job is coming from and come up with a proper salary expectation in correct currency",
    "willing_to_relocate": "Yes",
    "mobility": "Willing to relocate to Anywhere in the world."
  },
  "professional_summary": "CKA-certified Lead DevOps and Platform Engineer with over 8 years of industry experience. Specialist in architecting and operating high-scale Kubernetes and AWS-based platforms that balance rapid software delivery with high-availability and extreme cost efficiency. Proven track record in leading complex migrations for millions of daily users and implementing data-driven cost optimization strategies that have saved organizations over 40% in monthly cloud spend.",
  "key_performance_metrics": [
    {
      "area": "Overall Production Cost",
      "achievement": "40% reduction in total production cloud spend (USD $100K → $50K monthly)."
    },
    {
      "area": "Development & QA Efficiency",
      "achievement": "75% reduction in total development cloud costs (USD $17K → $4K monthly) and 60% reduction in QA cluster costs."
    },
    {
      "area": "System Modernization",
      "achievement": "Zero-downtime migration of 60+ microservices from EC2 to AWS EKS."
    },
    {
      "area": "Stability",
      "achievement": "Reduced production failures to near-zero over a 2-year period at IFS."
    }
  ],
  "experience": [
    {
      "company": "Aeturnum",
      "roles": [
        {
          "title": "DevOps Lead / Associate DevOps Lead",
          "start_date": "May 2023",
          "end_date": "Present"
        }
      ],
      "technical_highlights": [
        "Architected next-generation Kubernetes platform on AWS EKS for 60+ microservices.",
        "Implemented CPU, request, and queue-based autoscaling using KEDA, Prometheus, and Linkerd.",
        "Integrated Karpenter for dynamic node scaling and ArgoCD for GitOps-driven delivery.",
        "Managed wide-ranging AWS stack: VPC, IAM, WAF, GuardDuty, KMS, and SQS/SNS.",
        "Established centralized observability using New Relic and OpenSearch (ELK)."
      ]
    },
    {
      "company": "IFS",
      "roles": [
        {
          "title": "Senior Software Engineer / Software Engineer",
          "start_date": "June 2019",
          "end_date": "February 2023"
        }
      ],
      "technical_highlights": [
        "Owned the CI/CD lifecycle and platform stability for hybrid environments (Azure and On-prem).",
        "Built automated release pipelines using Jenkins, Bitbucket Pipelines, and GitLab CI.",
        "Enforced code quality gates using SonarQube and observability via Grafana.",
        "Developed internal domain-specific IDE tools using Java and ANTLR4."
      ]
    },
    {
      "company": "Upwork",
      "roles": [
        {
          "title": "Freelance Software Engineer",
          "start_date": "June 2018",
          "end_date": "January 2020"
        }
      ],
      "achievements": [
        "Top Rated status with 100% Job Success Score across 33 international projects.",
        "Technical copywriting and full-stack development for global clients (Switzerland, Australia, Singapore)."
      ]
    },
    {
      "company": "Colombo Centre for Cognitive Computing (CogCom)",
      "roles": [
        {
          "title": "Junior Software Engineer / Intern",
          "start_date": "July 2017",
          "end_date": "June 2019"
        }
      ],
      "technical_highlights": [
        "Full-stack development using Angular, .NET MVC, and MsSql.",
        "Integrated machine learning APIs with Azure-based web applications.",
        "Android development with Java and Windows Forms applications in C#."
      ]
    }
  ],
  "technical_skill_matrix": {
    "orchestration_containers": [
      "Kubernetes (CKA Certified)",
      "AWS EKS",
      "Azure AKS",
      "Docker",
      "KEDA",
      "Karpenter"
    ],
    "infrastructure_as_code": [
      "Terraform",
      "Helm",
      "Ansible",
      "ArgoCD (GitOps)"
    ],
    "aws_cloud": [
      "EC2",
      "VPC",
      "S3",
      "RDS",
      "Lambda",
      "WAF",
      "GuardDuty",
      "KMS",
      "IAM Identity Center",
      "Route53"
    ],
    "monitoring_observability": [
      "Prometheus",
      "New Relic",
      "OpenSearch (ELK)",
      "Grafana",
      "CloudWatch",
      "Opsgenie"
    ],
    "networking_security": [
      "Linkerd",
      "Istio Service Mesh",
      "VPN",
      "Keycloak",
      "Google SSO",
      "Vault"
    ],
    "languages_scripting": [
      "Python",
      "Bash",
      "Groovy",
      "Java",
      "C#",
      "Powershell"
    ],
    "databases_messaging": [
      "MySQL",
      "MongoDB",
      "RabbitMQ",
      "Redis (ElastiCache)",
      "SQS"
    ]
  },
  "education": [
    {
      "degree": "MSc Big Data Analytics",
      "institution": "Robert Gordon University, UK",
      "grade": "Distinction",
      "start_date": "2019",
      "end_date": "2021"
    },
    {
      "degree": "BEng (Hons) Software Engineering",
      "institution": "University of Westminster, UK",
      "grade": "First Class Honours",
      "start_date": "2015",
      "end_date": "2019"
    }
  ],
  "certifications": [
    "Certified Kubernetes Administrator (CKA)",
    "Google Cloud Fundamentals: Core Infrastructure",
    "Perform Foundational Infrastructure Tasks in Google Cloud",
    "Kubernetes (LFS158) - Linux Foundation",
    "Full Stack Web Development - Free Code Camp",
    "Certificate in Business Accounting - CIMA"
  ],
  "community_impact": [
    "Top 2% Contributor on StackOverflow (2022-2023).",
    "Active contributor to Collabnix | KubeLabs on EKS, Helm, and KEDA topics."
  ]
};

// --- FINAL WORKING API CALLER ---
async function callGemini(formFields, apiKey) {
  const prompt = `
    You are an expert Job Application Assistant.
    PROFILE: ${JSON.stringify(userProfile)}
    FORM FIELDS: ${JSON.stringify(formFields)}
    
    INSTRUCTIONS:
    1. Map Profile to Fields. Return JSON array: [{ "id": "...", "value": "..." }]
    
    CRITICAL RULES:
    - **FILE UPLOADS**: 
      - If the field asks for "Resume" or "CV", return value: "resume.pdf".
    - **COMPLIANCE**: Always answer "No" to Criminal, Disability, Veteran, Conflict of Interest, and Previous Employment unless specifically asked otherwise.
    - **SPONSORSHIP**: Answer "Yes" to "Require Sponsorship".
    - **LOGISTICS**: Use the 'logistics' block for Salary and Notice Period. Determine appropriate currency based on context if possible.
    - **DROPDOWNS**: Select the closest matching string from the provided 'options'.
    - **FORMAT**: Dates as YYYY-MM-DD.
    
    RESPONSE FORMAT: 
    Return ONLY valid JSON.
  `;

  try {
    console.log("Calling Gemini API with model: gemini-2.5-flash...");

    // UPDATED URL: Using 'gemini-2.5-flash' based on your success with it
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST", // CRITICAL: This was missing before!
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error("Gemini returned an empty response.");
    }

    let text = data.candidates[0].content.parts[0].text;
    console.log("Raw Gemini Response:", text); 

    // Clean up markdown if Gemini adds it
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Extension Error:", error);
    return { error: error.message }; 
  }
}

// --- LISTENER ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "process_form") {
    // We wrap everything in a promise to handle async errors gracefully
    (async () => {
      try {
        const result = await chrome.storage.sync.get(['apiKey']);
        if (!result.apiKey) {
          sendResponse({ error: "No API Key found. Click extension icon to set it." });
          return;
        }
        const answers = await callGemini(request.fields, result.apiKey);
        sendResponse({ answers: answers });
      } catch (err) {
        console.error("Background script error:", err);
        sendResponse({ error: "Background script error: " + err.message });
      }
    })();
    
    return true; // Keep channel open for async response
  }
});