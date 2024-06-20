document.addEventListener("DOMContentLoaded", () => {
  //  Credentials for authentication
  const username = "coalition";
  const pswd = "skills-test";
  const authHeader = "Basic " + btoa(`${username}:${pswd}`);

  // Fetching Patient Data
  async function fetchPatientData() {
    const res = await fetch(
      "https://fedskillstest.coalitiontechnologies.workers.dev",
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    const data = await res.json();
    return data.find((patient) => patient.name === "Jessica Taylor");
  }

  async function updateDOM() {
    const patientData = await fetchPatientData();

    //  Updating the DOM with Patient Data
    document.getElementById("profile-picture").src =
      patientData.profile_picture;
    document.getElementById("patient-name").textContent = patientData.name;
    document.getElementById("patient-dob").textContent =
      `Date of Birth: ${new Date(
        patientData.date_of_birth
      ).toLocaleDateString()}`;
    document.getElementById("patient-gender").textContent =
      `Gender: ${patientData.gender}`;
    document.getElementById("patient-phone").textContent =
      `Phone: ${patientData.phone_number}`;
    document.getElementById("emergency-contact").textContent =
      `Emergency Contact: ${patientData.emergency_contact}`;
    document.getElementById("insurance-type").textContent =
      `Insurance: ${patientData.insurance_type}`;

    // Update Blood Pressure chart
    const diagnosisHistory = patientData.diagnosis_history;
    updateBloodPressureChart(diagnosisHistory);

    // Update vital signs
    const vitalsContainer = document.querySelector(".vitals");
    const vitalSigns = [
      {
        name: "Respiratory Rate",
        value: `${diagnosisHistory[0].respiratory_rate.value} bpm`,
        level: diagnosisHistory[0].respiratory_rate.levels,
      },
      {
        name: "Temperature",
        value: `${diagnosisHistory[0].temperature.value} °F`,
        level: diagnosisHistory[0].temperature.levels,
      },
      {
        name: "Heart Rate",
        value: `${diagnosisHistory[0].heart_rate.value} bpm`,
        level: diagnosisHistory[0].heart_rate.levels,
      },
    ];

    vitalSigns.forEach((vital) => {
      const vitalDiv = document.createElement("div");
      vitalDiv.classList.add("vital");

      const img = document.createElement("img");
      img.src = `${vital.name.toLowerCase().replace(" ", "-")}-icon.png`;
      img.alt = vital.name;
      vitalDiv.appendChild(img);

      const title = document.createElement("p");
      title.textContent = vital.name;
      vitalDiv.appendChild(title);

      const value = document.createElement("p");
      value.classList.add("value");
      value.textContent = vital.value;
      vitalDiv.appendChild(value);

      const level = document.createElement("p");
      level.classList.add("level");
      level.textContent = vital.level;
      vitalDiv.appendChild(level);

      vitalsContainer.appendChild(vitalDiv);
    });

    // Update diagnostic list
    const diagnosticList = patientData.diagnostic_list;
    const diagnosticTable = document.getElementById("diagnostic-table");

    const diagnosticTableBody = document.createElement("tbody");

    diagnosticList.forEach((diagnostic, index) => {
      const rowDiagnostic = document.createElement("tr");

      const nameDiagnostic = document.createElement("td");
      nameDiagnostic.textContent = diagnostic.name;
      rowDiagnostic.appendChild(nameDiagnostic);

      const descriptionDiagnostic = document.createElement("td");
      descriptionDiagnostic.textContent = diagnostic.description;
      rowDiagnostic.appendChild(descriptionDiagnostic);

      const statusDiagnostic = document.createElement("td");
      statusDiagnostic.textContent = diagnostic.status;
      rowDiagnostic.appendChild(statusDiagnostic);

      diagnosticTableBody.appendChild(rowDiagnostic);

      // Special styling to the first row - bold
      if (index === 0) {
        rowDiagnostic.classList.add("first-row");
      }
    });

    diagnosticTable.appendChild(diagnosticTableBody);

    // Update lab results
    const labResults = patientData.lab_results;
    const labResultsContainer = document.getElementById("lab-results-list");
    labResultsContainer.innerHTML = "";
    labResults.forEach((result) => {
      const li = document.createElement("li");
      li.textContent = result;
      labResultsContainer.appendChild(li);
    });
  }

  function updateBloodPressureChart(diagnosisHistory) {
    const ctx = document.getElementById("bloodPressure-chart").getContext("2d");
    const labels = diagnosisHistory.map((d) => `${d.month} ${d.year}`);
    const systolicData = diagnosisHistory.map(
      (d) => d.blood_pressure.systolic.value
    );
    const diastolicData = diagnosisHistory.map(
      (d) => d.blood_pressure.diastolic.value
    );

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Systolic",
            data: systolicData,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: false,
          },
          {
            label: "Diastolic",
            data: diastolicData,
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  updateDOM();
});
