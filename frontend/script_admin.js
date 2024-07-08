// const { data } = require("../backend-js/src/controllers/complaintsController");

inbox.addEventListener("click", (e) => {
    // Define Role & ID
    const role = sessionStorage.role;
    const id = sessionStorage.id;
    const name = sessionStorage.name;
    // console.log(name);
    // Define the request URL
    const url = `http://127.0.0.1:5000/all_complaints?role=${role}&id=${id}`;
    // console.log(url);

    // Send data using Fetch API
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((responseData) => {
            // Request was successful
            // console.log(responseData);
            const main_content = document.querySelector("#main-content");
            main_content.innerHTML = `
            <table class="table" id="complaint-table">
            <tr>
                <th>COMPLAINT ID</th>
                <th>DATE</th>
                <th>EMPLOYEE NO</th>
                <th>EMPLOYEE NAME</th>
                <th>DIVISION</th>
                <th>DEPARTMENT</th>
                <th>WEBSITE</th>
                <th>MODULE</th>
                <th>DESC</th>
                <th>STATUS</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>
            <div id='message' style='color:red'></div>`;

            const data = responseData["data"];
            for (let i = 0; i < data.length; i++) {
                const newData = {
                    complaintId: data[i].id,
                    empNo: data[i].employee_no,
                    empName: data[i].employee_name,
                    division: data[i].division_hq,
                    department: data[i].department,
                    website: data[i].website,
                    module: data[i].module,
                    desc: data[i].description,
                    referenceDoc: data[i].referenceDoc,
                    status: data[i].status,
                    date: data[i].date,
                    currently_with: data[i].currently_with,
                };
                const table = document.querySelector("#complaint-table");

                // Create a new row and add the data
                const newRow = table.insertRow();
                console.log(newData)
                // Add event listener to navigate to the complaint details of that page
                newRow.addEventListener("click", () => {
                    window.location.href = `COMPLAINT_DETAILS.html?complaint_id=${newData.complaintId}`;
                });
                newRow.style.cursor = "pointer";
                if (
                    newData.status === "Closed" ||
                    newData.currently_with != sessionStorage.name
                ) {
                    // console.log("random shittery");
                    // document.getElementById('message').innerHTML = `<center><h2>Nothing to show here!!</h2></center>`
                    continue;
                } else {
                    newRow.insertCell(0).textContent = newData.complaintId;
                    newRow.insertCell(1).textContent = newData.date;
                    newRow.insertCell(2).textContent = newData.empNo;
                    newRow.insertCell(3).textContent = newData.empName;
                    newRow.insertCell(4).textContent = newData.division;
                    newRow.insertCell(5).textContent = newData.department;
                    newRow.insertCell(6).textContent = newData.website;
                    newRow.insertCell(7).textContent = newData.module;
                    newRow.insertCell(8).textContent = newData.desc;
                    // newRow.insertCell(9).textContent = newData.referenceDoc;
                    //updated the reference column to a hyperlink
                    // const linkCell = newRow.insertCell(8);
                    // const link = document.createElement('a');
                    // console.log(newData.referenceDoc);
                    // link.href = newData.referenceDoc;
                    // link.textContent = 'Click here';
                    // linkCell.appendChild(link);
                    newRow.insertCell(9).textContent = newData.status;
                }
            }
        })
        .catch((error) => {
            // Request failed
            console.error("Error:", error);
        });

    const main_content = document.querySelector("#main-content");
    main_content.innerHTML = `
    <table class="table">
      <tr>
        <th>COMPLAINT ID</th>
        <th>COMPLAIN CASE ID</th>
        <th>DIV</th>
        <th>DEPARTMENT</th>
        <th>MAGNITUDE</th>
        <th>STATUS</th>
        <th>DATE</th>
      </tr>
      <!-- Table rows can be added here as needed -->
    </table>`;
});

const logOut = document.querySelector(".logout");

logout.addEventListener("click", (e) => {
    sessionStorage.clear();
    location.href = "LOGIN.html";
});
window.onload = () => {
    if (!sessionStorage.role) {
        location.href = "LOGIN.html";
    }
};

document.getElementById("add_user").addEventListener("click", (e) => {
    if (sessionStorage.role === 'admin') {
        document.querySelector("#main-content").innerHTML = `
        
                <div class="form-container">
                    <h2>Register New User</h2>
                    <form id="registration-form">
                        <div class="form-group">
                            <label for="employee-id">Employee ID</label>
                            <input type="text" id="employee-id" name="employee-id" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="role">Role</label>
                            <select id="role" name="role" required>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button class='submit-button' type="submit">Register</button>
                        </div>
                    </form>
                    <h3 id="status"></h3>
                </div>

        
            `;
        const registerButton = document.querySelector(
            '.form-actions button[type="submit"]'
        );
        formData = {};
        registerButton.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent the default form submission
            formData["id"] = document.getElementById("employee-id").value;
            formData["password"] = document.getElementById("password").value;
            formData["name"] = document.getElementById("name").value;
            formData["role"] = document.getElementById("role").value;
            // console.log("Form submitted:", { formData });
            const xhr = new XMLHttpRequest();

            // Define the onload function to handle the response
            xhr.onload = function () {
                if (xhr.status === 201) {
                    // Request was successful
                    const responseData = JSON.parse(xhr.responseText);
                    // Process the response data here
                    // console.log(responseData);

                    data = responseData["data"];
                    document.getElementById("status").innerHTML = `
                ${data}
              `;
                } else {
                    // Request failed
                    console.error("Error:", xhr.status);
                }
            };

            // Open a POST request to the server
            xhr.open("POST", "http://127.0.0.1:5000/register_users");

            // Set request headers
            xhr.setRequestHeader("Content-Type", "application/json");
            // window.stop()
            // Convert form data to JSON and send it to the server
            xhr.send(JSON.stringify(formData));
        });
    }
    else {
        document.querySelector("#main-content").innerHTML = `
            <h1>Restricted Content!!</h1>
        `
    }
});
document.getElementById("activate_deactivate_user").addEventListener("click", (e) => {
    if (sessionStorage.role === 'admin') {
        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        // Define the request URL
        const url = `http://127.0.0.1:5000/all_users`;
        // console.log(url);

        // Configure the request
        xhr.open("GET", url);

        // Define the onload function to handle the response
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Request was successful
                const responseData = JSON.parse(xhr.responseText);
                // Process the response data here
                // console.log(responseData);
                main_content = document.querySelector("#main-content");
                main_content.innerHTML = `
            <table class="table" id="users-table">
            <tr>
                <th>EMPLOYEE ID</th>
                <th>EMPLOYEE NAME</th>
                <th>SCOPE</th>
                <th>DROP</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>`;
                data = responseData["data"];
                // console.log(responseData);
                for (let i = 0; i < data.length; i++) {
                    const newData = {
                        empId: data[i].employee_id,
                        empName: data[i].employee_name,
                        scope: data[i].scope,
                    };
                    const table = document.querySelector("#users-table");

                    // Create a new row and add the data
                    const newRow = table.insertRow();

                    newRow.insertCell(0).textContent = newData.empId;
                    newRow.insertCell(1).textContent = newData.empName;
                    if (newData.scope) {
                        newRow.insertCell(2).textContent = "Admin";
                    } else {
                        newRow.insertCell(2).textContent = "User";
                    }
                    const dropButton = document.createElement("button");
                    dropButton.textContent = "Drop User";
                    dropButton.onclick = function () {
                        const empId = data[i].employee_id;
                        const xhr = new XMLHttpRequest();
                        const url = `http://127.0.0.1:5000/drop_user/${empId}`;
                        // console.log(url);
                        xhr.open("DELETE", `http://127.0.0.1:5000/drop_user/${empId}`);
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                // Request was successful
                                // console.log("User dropped successfully");
                                // Remove the row from the table
                                const table = document.querySelector("#users-table");
                                table.deleteRow(newRow.rowIndex);
                            } else {
                                // Request failed
                                console.error("Error:", xhr.status);
                            }
                        };
                        xhr.onerror = function () {
                            console.error("Request failed");
                        };
                        xhr.send();
                    };
                    newRow.insertCell(3).appendChild(dropButton);
                }
            } else {
                // Request failed
                console.error("Error:", xhr.status);
            }
        };

        // Define the onerror function to handle errors
        xhr.onerror = function () {
            console.error("Request failed");
        };

        // Send the request
        xhr.send();
    }
    else {
        main_content = document.querySelector("#main-content");
        main_content.innerHTML = `
                <h1>Restricted Content!!</h1>
            `
    }
});

document.getElementById("sent").addEventListener("click", (e) => {
    // Define Role & ID
    role = sessionStorage.role;
    id = sessionStorage.id;
    name = sessionStorage.name;

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Define the request URL
    const url = `http://127.0.0.1:5000/sent?role=${role}&id=${id}&name=${name}`;
    // console.log(url);

    // Configure the request
    xhr.open("GET", url);

    // Define the onload function to handle the response
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Request was successful
            const responseData = JSON.parse(xhr.responseText);
            // Process the response data here
            // console.log(responseData);
            main_content = document.querySelector("#main-content");
            main_content.innerHTML = `
            <table class="table" id="complaint-table">
            <tr>
                <th>COMPLAINT ID</th>
                <th>DATE</th>
                <th>EMPLOYEE NO</th>
                <th>EMPLOYEE NAME</th>
                <th>DIVISION</th>
                <th>DEPARTMENT</th>
                <th>WEBSITE</th>
                <th>MODULE</th>
                <th>DESC</th>
                <th>STATUS</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>
            <div id='message' style='color:red'></div>`;
            data = responseData["data"];
            console.log(responseData);
            for (let i = 0; i < data.length; i++) {
                const newData = {
                    complaintId: data[i].id,
                    empNo: data[i].employee_no,
                    empName: data[i].employee_name,
                    division: data[i].division_hq,
                    department: data[i].department,
                    website: data[i].website,
                    module: data[i].module,
                    desc: data[i].description,
                    referenceDoc: data[i].referenceDoc,
                    status: data[i].status,
                    date: data[i].date,
                    currently_with: data[i].currently_with,
                };
                const table = document.querySelector("#complaint-table");
                
                // Create a new row and add the data
                const newRow = table.insertRow();

                // Add event listener to navigate to the complaint details of that page
                newRow.addEventListener("click", () => {
                    window.location.href = `COMPLAINT_DETAILS.html?complaint_id=${newData.complaintId}`;
                });
                newRow.style.cursor = "pointer";
                console.log(newData.currently_with)
                if (
                    newData.status === "Closed"
                    ||
                    newData.currently_with === sessionStorage.name
                ) {
                    // console.log("random shittery");
                    // document.getElementById('message').innerHTML = `<center><h2>Nothing to show here!!</h2></center>`
                    continue;
                } else {
                    newRow.insertCell(0).textContent = newData.complaintId;
                    newRow.insertCell(1).textContent = newData.date;
                    newRow.insertCell(2).textContent = newData.empNo;
                    newRow.insertCell(3).textContent = newData.empName;
                    newRow.insertCell(4).textContent = newData.division;
                    newRow.insertCell(5).textContent = newData.department;
                    newRow.insertCell(6).textContent = newData.website;
                    newRow.insertCell(7).textContent = newData.module;
                    newRow.insertCell(8).textContent = newData.desc;
                    // newRow.insertCell(9).textContent = newData.referenceDoc;
                    //updated the reference column to a hyperlink
                    // const linkCell = newRow.insertCell(8);
                    // const link = document.createElement("a");
                    // link.href = newData.referenceDoc;
                    // link.textContent = "Document";
                    // linkCell.appendChild(link);
                    newRow.insertCell(9).textContent = newData.status;
                }
            }
        } else {
            // Request failed
            console.error("Error:", xhr.status);
        }
    };

    // Define the onerror function to handle errors
    xhr.onerror = function () {
        console.error("Request failed");
    };

    // Send the request
    xhr.send();

    main_content = document.querySelector("#main-content");
    main_content.innerHTML = `
    <table class="table">
      <tr>
        <th>COMPLAINT ID</th>
        <th>COMPLAIN CASE ID</th>
        <th>DIV</th>
        <th>DEPARTMENT</th>
        <th>MAGNITUDE</th>
        <th>STATUS</th>
        <th>DATE</th>
      </tr>
      <!-- Table rows can be added here as needed -->
    </table>
    <div id=''message></div>`;
});


document.getElementById('all_complaints').addEventListener("click", (e) => {
    // Define Role & ID
    const role = sessionStorage.role;
    const id = sessionStorage.id;
    const name = sessionStorage.name;

    if (sessionStorage.role === 'admin') {
        // Define the request URL
        const url = `http://127.0.0.1:5000/all_complaints?role=${role}&id=${id}`;


        // Send data using Fetch API
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                // Request was successful
                // console.log(responseData);
                const main_content = document.querySelector("#main-content");
                main_content.innerHTML = `
            <table class="table" id="complaint-table">
            <tr>
                <th>COMPLAINT ID</th>
                <th>DATE</th>
                <th>EMPLOYEE NO</th>
                <th>EMPLOYEE NAME</th>
                <th>DIVISION</th>
                <th>DEPARTMENT</th>
                <th>WEBSITE</th>
                <th>MODULE</th>
                <th>DESC</th>
                <th>STATUS</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>`;

                const data = responseData["data"];
                for (let i = 0; i < data.length; i++) {
                    const newData = {
                        complaintId: data[i].id,
                        empNo: data[i].employee_no,
                        empName: data[i].employee_name,
                        division: data[i].division_hq,
                        department: data[i].department,
                        website: data[i].website,
                        module: data[i].module,
                        desc: data[i].description,
                        referenceDoc: data[i].referenceDoc,
                        status: data[i].status,
                        date: data[i].date,
                        currently_with: data[i].currently_with,
                    };
                    const table = document.querySelector("#complaint-table");

                    // Create a new row and add the data
                    const newRow = table.insertRow();

                    // Add event listener to navigate to the complaint details of that page
                    newRow.addEventListener("click", () => {
                        window.location.href = `COMPLAINT_DETAILS.html?complaint_id=${newData.complaintId}`;
                    });
                    newRow.style.cursor = "pointer";

                    newRow.insertCell(0).textContent = newData.complaintId;
                    newRow.insertCell(1).textContent = newData.date;
                    newRow.insertCell(2).textContent = newData.empNo;
                    newRow.insertCell(3).textContent = newData.empName;
                    newRow.insertCell(4).textContent = newData.division;
                    newRow.insertCell(5).textContent = newData.department;
                    newRow.insertCell(6).textContent = newData.website;
                    newRow.insertCell(7).textContent = newData.module;
                    newRow.insertCell(8).textContent = newData.desc;
                    // newRow.insertCell(9).textContent = newData.referenceDoc;
                    //updated the reference column to a hyperlink
                    // const linkCell = newRow.insertCell(8);
                    // const link = document.createElement('a');
                    // console.log(newData.referenceDoc);
                    // link.href = newData.referenceDoc;
                    // link.textContent = 'Click here';
                    // linkCell.appendChild(link);
                    newRow.insertCell(9).textContent = newData.status;
                }
            }
            )
            .catch((error) => {
                // Request failed
                console.error("Error:", error);
            });

        const main_content = document.querySelector("#main-content");
        main_content.innerHTML = `
            <table class="table">
            <tr>
                <th>COMPLAINT ID</th>
                <th>COMPLAIN CASE ID</th>
                <th>DIV</th>
                <th>DEPARTMENT</th>
                <th>MAGNITUDE</th>
                <th>STATUS</th>
                <th>DATE</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>
            `;
    }
    else{
        const main_content = document.querySelector("#main-content");
        main_content.innerHTML = `
            <h1>Restricted Content!!</h1>
        `
    }
});

document.getElementById("reports").addEventListener("click", (e) => {
    const main_content = document.querySelector("#main-content");
    main_content.innerHTML = `<div class="form-container" style="overflow: scroll;">
        <h2>Complaints Report Page</h2>
        <div class="complaint-details-single" style="display: flex; justify-content: left;">


          <form id="complaintForm" style="padding: 10px">
            <div class="form-group" style="margin-top: 0%;">
              <label for="start-date">Start Date:</label>
              <input type="date" id="start-date">
            </div>
            <div class="form-group">
              <label for="end-date">End Date:</label>
              <input type="date" id="end-date">
            </div>
            <div class="form-group">
              <label for="status">Status:</label>
                <select id="status">
                  <option value="pending">Pending</option>
                  <option value="unprocessed">Unprocessed</option>
                  <option value="closed">Closed</option>
                </select>
            </div>
            <button class="submit-button" onclick="fetchComplaints()">Filter</button>
          </form>
          <div style="padding=10px">
          <table class="table" id="complaint-table">
            <tr>
                <th>COMPLAINT ID</th>
                <th>DATE</th>
                <th>EMPLOYEE NO</th>
                <th>EMPLOYEE NAME</th>
                <th>DIVISION</th>
                <th>DEPARTMENT</th>
                <th>WEBSITE</th>
                <th>MODULE</th>
                <th>DESC</th>
                <th>STATUS</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>
          </div>
        </div>

        
      </div>`
    async function fetchComplaints() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const status = document.getElementById('status').value;
        
        try {
            const response = await fetch(`/api/complaints?startDate=${startDate}&endDate=${endDate}&status=${status}`);
            const complaints = await response.json();
            const tableBody = document.querySelector('#complaints-table tbody');
            const noData = document.getElementById('no-data');
            tableBody.innerHTML = '';

            if (complaints.length > 0) {
                noData.style.display = 'none';
                complaints.forEach(complaint => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${complaint.complaint_id}</td>
                        <td>${complaint.division}</td>
                        <td>${complaint.department}</td>
                        <td>${complaint.website}</td>
                        <td>${complaint.module}</td>
                        <td>${complaint.description}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                noData.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', fetchComplaints);
})