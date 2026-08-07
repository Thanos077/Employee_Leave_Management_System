let allLeaves = [];
let currentPage = 1;
const rowsPerPage = 5;

async function getLeaves() {

    const token = localStorage.getItem("token");

    const response = await fetch("https://employee-leave-management-system-2fr0.onrender.com/admin/leave", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    allLeaves = await response.json();

    displayTable();
}

function displayTable() {

    const table = document.getElementById("emptable");
    table.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const currentLeaves = allLeaves.slice(start, end);

    currentLeaves.forEach((leave) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${leave.email}</td>
            <td>${leave.leavetype}</td>
            <td>${leave.duration} Day(s)</td>
            <td>${leave.startdate} - ${leave.enddate}</td>
            <td>${leave.status}</td>

           <td>
    <button class="btn btn-success btn-sm"
        onclick="approveLeave('${leave.id}')"
        ${leave.status !== "pending" ? "disabled" : ""}>
        <i class="bi bi-check-lg"></i>
    </button>

    <button class="btn btn-danger btn-sm"
        onclick="rejectLeave('${leave.id}')"
        ${leave.status !== "pending" ? "disabled" : ""}>
        <i class="bi bi-x-lg"></i>
    </button>
</td>
        `;

        table.appendChild(row);

    });

    createPagination();
}

function createPagination() {

    const pagination = document.getElementById("pagination");
    const pageInfo = document.getElementById("pageInfo");

    pagination.innerHTML = "";

    const totalPages = Math.ceil(allLeaves.length / rowsPerPage);

    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, allLeaves.length);

    pageInfo.innerHTML = `Showing ${start}-${end} of ${allLeaves.length}`;

    // Previous button
    pagination.innerHTML += `
        <button
            class="btn btn-sm btn-light"
            ${currentPage === 1 ? "disabled" : ""}
            onclick="changePage(${currentPage - 1})">
            &laquo;
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `
            <button
                class="btn btn-sm ${i === currentPage ? "btn-primary" : "btn-light"}"
                onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    // Next button
    pagination.innerHTML += `
        <button
            class="btn btn-sm btn-light"
            ${currentPage === totalPages ? "disabled" : ""}
            onclick="changePage(${currentPage + 1})">
            &raquo;
        </button>
    `;
}

function changePage(page) {

    currentPage = page;

    displayTable();
}

async function approveLeave(id, button) {

    const token = localStorage.getItem("token");

    await fetch(`https://employee-leave-management-system-2fr0.onrender.com/admin/leave/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            status: "approved"
        })
    });


    getLeaves();
}

async function rejectLeave(id, button) {

    const token = localStorage.getItem("token");
        
    await fetch(`https://employee-leave-management-system-2fr0.onrender.com/admin/leave/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            status: "rejected"
        })
    });



    getLeaves();
}

getLeaves();