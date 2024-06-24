document.addEventListener("DOMContentLoaded", () => {
  // Credentials for authentication
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

    // Function to format date
    function formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    }

    // Updating the DOM with Patient Data
    document.getElementById("profile-picture").src =
      patientData.profile_picture;
    document.getElementById("patient-name").textContent = patientData.name;
    document.getElementById("patient-dob").textContent =
      `Date of Birth: ${formatDate(patientData.date_of_birth)}`;
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

    // Update Blood Pressure Data
    const bloodPressureDataContainer = document.querySelector(
      ".blood-pressure-data"
    );
    const latestDiagnosis = diagnosisHistory[0];
    const systolicValue = latestDiagnosis.blood_pressure.systolic.value;
    const systolicLevel = latestDiagnosis.blood_pressure.systolic.levels;
    const diastolicValue = latestDiagnosis.blood_pressure.diastolic.value;
    const diastolicLevel = latestDiagnosis.blood_pressure.diastolic.levels;

    // Clear previous content
    bloodPressureDataContainer.innerHTML = "";

    // Systolic Data
    const systolicDiv = document.createElement("div");
    systolicDiv.classList.add("blood-pressure-data-div");

    const systolicSpan = createLegendDot("#e66fd2");
    systolicDiv.appendChild(systolicSpan);

    const systolicStrong = document.createElement("strong");
    systolicStrong.innerHTML = `Systolic: <span id="systolic-value">${systolicValue}</span>`;
    systolicDiv.appendChild(systolicStrong);

    const systolicP = document.createElement("p");
    systolicP.id = "systolic-level";
    systolicP.textContent = systolicLevel;
    systolicDiv.appendChild(systolicP);

    // HR Separator
    const hr = document.createElement("hr");

    // Diastolic Data
    const diastolicDiv = document.createElement("div");
    diastolicDiv.classList.add("blood-pressure-data-div");

    const diastolicSpan = createLegendDot("#8c6fe6");
    diastolicDiv.appendChild(diastolicSpan);

    const diastolicStrong = document.createElement("strong");
    diastolicStrong.innerHTML = `Diastolic: <span id="diastolic-value">${diastolicValue}</span>`;
    diastolicDiv.appendChild(diastolicStrong);

    const diastolicP = document.createElement("p");
    diastolicP.id = "diastolic-level";
    diastolicP.textContent = diastolicLevel;
    diastolicDiv.appendChild(diastolicP);

    bloodPressureDataContainer.appendChild(systolicDiv);
    bloodPressureDataContainer.appendChild(hr);
    bloodPressureDataContainer.appendChild(diastolicDiv);

    // Update vital signs
    const vitalsContainer = document.querySelector(".vitals");
    vitalsContainer.innerHTML = ""; // Clear previous content

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
      title.classList.add("body-emphasized-14pt");
      vitalDiv.appendChild(title);

      const value = document.createElement("p");
      value.classList.add("value", "body-regular-14");
      value.textContent = vital.value;
      vitalDiv.appendChild(value);

      const level = document.createElement("p");
      level.classList.add("level", "body-regular-14");
      level.textContent = vital.level;
      vitalDiv.appendChild(level);

      vitalsContainer.appendChild(vitalDiv);
    });

    // Update diagnostic list
    const diagnosticList = patientData.diagnostic_list;
    const diagnosticTable = document.getElementById("diagnostic-table");
    diagnosticTable.innerHTML = ""; // Clear previous content

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
    labResultsContainer.innerHTML = ""; // Clear previous content

    labResults.forEach((result) => {
      const li = document.createElement("li");
      li.classList.add("body-regular-14");
      li.textContent = result;
      labResultsContainer.appendChild(li);
    });
  }

  function updateBloodPressureChart(diagnosisHistory) {
    const ctx = document.getElementById("bloodPressure-chart").getContext("2d");

    // Filter to get the last 6 months:
    const recentHistory = diagnosisHistory.slice(0, 6);

    const labels = recentHistory.map((d) => `${d.month} ${d.year}`);
    const systolicData = recentHistory.map(
      (d) => d.blood_pressure.systolic.value
    );
    const diastolicData = recentHistory.map(
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
            borderColor: "#e66fd2",
            pointBackgroundColor: "#e66fd2",
            pointRadius: 4,
            fill: false,
          },
          {
            label: "Diastolic",
            data: diastolicData,
            borderColor: "#8c6fe6",
            pointBackgroundColor: "#8c6fe6",
            pointRadius: 4,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: false,
              text: "Month",
            },
          },
          y: {
            display: true,
            title: {
              display: false,
              text: "Blood Pressure (mmHg)",
            },
          },
        },
      },
    });
  }

  function createLegendDot(color) {
    const span = document.createElement("span");
    span.classList.add("legend-dot");
    span.style.backgroundColor = color;
    return span;
  }

  updateDOM();
});
