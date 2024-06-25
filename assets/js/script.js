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
    return data;
  }

  async function updateDOM() {
    const allPatients = await fetchPatientData();

    // Update patient list
    const patientListContainer = document.getElementById("patient-list");
    patientListContainer.innerHTML = ""; // Clear previous content

    allPatients.forEach((patient) => {
      const patientLi = document.createElement("li");
      patientLi.classList.add("patient-item");

      // This should be done dymamicaly when selecting the patient from the list
      if (patient.name === "Jessica Taylor") {
        patientLi.classList.add("highlighted-patient");
      }

      const patientDiv = document.createElement("div");
      patientDiv.classList.add("patient-div");
      patientLi.appendChild(patientDiv);

      const img = document.createElement("img");
      img.src = patient.profile_picture;
      img.alt = `${patient.name} profile picture`;
      img.classList.add("patient-profile-picture");
      patientDiv.appendChild(img);

      const patientInfoDiv = document.createElement("div");
      patientInfoDiv.classList.add("patient-info__patients");

      const name = document.createElement("p");
      name.classList.add("body-emphasized-14pt");
      name.textContent = patient.name;
      patientInfoDiv.appendChild(name);

      const genderAge = document.createElement("p");
      genderAge.classList.add("body-secondary-info-14pt");
      const age =
        new Date().getFullYear() -
        new Date(patient.date_of_birth).getFullYear();
      genderAge.textContent = `${patient.gender}, ${age} years`;
      patientInfoDiv.appendChild(genderAge);

      patientDiv.appendChild(patientInfoDiv);

      const moreIcon = document.createElement("img");
      moreIcon.src = "/assets/img/more_horiz_FILL0_wght300_GRAD0_opsz24.svg";
      moreIcon.alt = "More options";
      moreIcon.classList.add("more-icon");
      patientLi.appendChild(moreIcon);

      patientListContainer.appendChild(patientLi);
    });

    // Update the selected patient data
    const selectedPatient = allPatients.find(
      (patient) => patient.name === "Jessica Taylor"
    );

    if (selectedPatient) {
      // Function to format date
      function formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
      }

      // Updating the DOM with selected Patient Data
      document.getElementById("profile-picture").src =
        selectedPatient.profile_picture;
      document.getElementById("patient-name").textContent =
        selectedPatient.name;
      document.getElementById("patient-dob").textContent =
        `Date of Birth: ${formatDate(selectedPatient.date_of_birth)}`;
      document.getElementById("patient-gender").textContent =
        `Gender: ${selectedPatient.gender}`;
      document.getElementById("patient-phone").textContent =
        `Phone: ${selectedPatient.phone_number}`;
      document.getElementById("emergency-contact").textContent =
        `Emergency Contact: ${selectedPatient.emergency_contact}`;
      document.getElementById("insurance-type").textContent =
        `Insurance: ${selectedPatient.insurance_type}`;

      // Update Blood Pressure chart
      const diagnosisHistory = selectedPatient.diagnosis_history;
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
          imgSrc: "/assets/img/respiratory_rate.svg",
        },
        {
          name: "Temperature",
          value: `${diagnosisHistory[0].temperature.value} °F`,
          level: diagnosisHistory[0].temperature.levels,
          imgSrc: "/assets/img/temperature.svg",
        },
        {
          name: "Heart Rate",
          value: `${diagnosisHistory[0].heart_rate.value} bpm`,
          level: diagnosisHistory[0].heart_rate.levels,
          imgSrc: "/assets/img/HeartBPM.svg",
        },
      ];

      vitalSigns.forEach((vital) => {
        const vitalDiv = document.createElement("div");
        vitalDiv.classList.add("vital");

        const img = document.createElement("img");
        img.src = vital.imgSrc;
        img.width = 96;
        img.height = 96;
        vitalDiv.appendChild(img);

        const title = document.createElement("p");
        title.textContent = vital.name;
        title.classList.add("vitals-title", "card-title-24pt");
        vitalDiv.appendChild(title);

        const value = document.createElement("p");
        value.classList.add("vitals-value", "body-regular-14");
        value.textContent = vital.value;
        vitalDiv.appendChild(value);

        const level = document.createElement("p");
        level.classList.add("level", "body-regular-14");
        level.textContent = vital.level;
        vitalDiv.appendChild(level);

        vitalsContainer.appendChild(vitalDiv);
      });

      // Update diagnostic list
      const diagnosticList = selectedPatient.diagnostic_list;
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
      const labResults = selectedPatient.lab_results;
      const labResultsContainer = document.getElementById("lab-results-list");
      labResultsContainer.innerHTML = ""; // Clear previous content

      labResults.forEach((result) => {
        const li = document.createElement("li");
        li.classList.add("body-regular-14");
        li.textContent = result;
        labResultsContainer.appendChild(li);
      });
    }
  }

  function updateBloodPressureChart(diagnosisHistory) {
    const ctx = document.getElementById("bloodPressure-chart").getContext("2d");

    const lastSixMonths = diagnosisHistory.slice(0, 6).reverse();

    const labels = lastSixMonths.map(
      (d) => `${d.month.slice(0, 3)}, ${d.year}`
    );
    const systolicData = lastSixMonths.map(
      (d) => d.blood_pressure.systolic.value
    );
    const diastolicData = lastSixMonths.map(
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
            tension: 0.5,
          },
          {
            label: "Diastolic",
            data: diastolicData,
            borderColor: "#8c6fe6",
            pointBackgroundColor: "#8c6fe6",
            pointRadius: 4,
            fill: false,
            tension: 0.5,
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
