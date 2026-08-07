async function loadLeaves() {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:8000/leave", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const leaves = await response.json();

        const table = document.getElementById("emptable");
        table.innerHTML = "";

        // ADD THESE VARIABLES
        let annual = 0;
        let medical = 0;
        let casual = 0;

        // REPLACE YOUR OLD forEach WITH THIS
        leaves.forEach(leave => {

    if (leave.status === "approved") {

        if (leave.leavetype === "annual") {
            annual += Number(leave.duration);
        }

        if (leave.leavetype === "medical") {
            medical += Number(leave.duration);
        }

        if (leave.leavetype === "casual") {
            casual += Number(leave.duration);
        }
    }

    let icon = "bi-calendar2";

    switch (leave.leavetype.toLowerCase()) {

        case "annual":
        case "annual leave":
            icon = "bi-airplane-fill";
            break;

        case "medical":
        case "medical leave":
            icon = "bi-calendar2-heart-fill";
            break;

        case "casual":
        case "casual leave":
            icon = "bi-briefcase-fill";
            break;

        default:
            icon = "bi-calendar2";
    }

    table.innerHTML += `
        <tr>

            <td>
                <div class="leave-type">
                    <div class="leave-icon">
                        <i class="bi ${icon}"></i>
                    </div>

                    <span>${leave.leavetype}</span>
                </div>
            </td>

            <td>${leave.duration} Days</td>

            <td>${leave.startdate} - ${leave.enddate}</td>

            <td>
                <span class="status ${leave.status.toLowerCase()}">
                    ${leave.status}
                </span>
            </td>

        </tr>
    `;
});

        // UPDATE THE CARDS
        document.getElementById("annualLeave").textContent = annual;
        document.getElementById("sickLeave").textContent = medical;
        document.getElementById("casualLeave").textContent = casual;

        // UPDATE PROGRESS BARS
        document.getElementById("annualBar").style.width = (annual / 24) * 100 + "%";
        document.getElementById("sickBar").style.width = (medical / 10) * 100 + "%";
        document.getElementById("casualBar").style.width = (casual / 6) * 100 + "%";

        // Total available leave
        const totalAvailable = 24 + 10 + 6; // 40 days

        // Total approved leave used
        const totalUsed = annual + medical + casual;

        // Overall percentage
        const totalPercent = Math.round((totalUsed / totalAvailable) * 100);

        // Annual contribution percentage
        const annualPercent = Math.round((annual / totalAvailable) * 100);

        // Sick + Casual contribution percentage
        const sickCasualPercent = Math.round(
            ((medical + casual) / totalAvailable) * 100
        );
        // Convert percentages to degrees
        const annualDeg = annualPercent * 3.6;
        const usedDeg = (annualPercent + sickCasualPercent) * 3.6;
        // Update utilization card
        document.getElementById("totalUsedPercent").textContent =
            totalPercent + "%";

        const circle = document.getElementById("circleProgress");

        circle.style.setProperty("--annual", annualDeg + "deg");
        circle.style.setProperty("--used", usedDeg + "deg");

        document.getElementById("annualPercent").textContent =
            annualPercent + "%";

        document.getElementById("sickCasualPercent").textContent =
            sickCasualPercent + "%";

    } catch (error) {
        console.error(error);
    }
}

loadLeaves();
const links = document.querySelectorAll(".nav-link");

links.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add("active");
    }
});
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");

if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("show");
    });
}