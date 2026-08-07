const form = document.getElementById("leaveForm")
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let prioritylevel;

    if (document.getElementById("urgent").checked) {
        prioritylevel = "Urgent";
    } else {
        prioritylevel = "Standard";
    }

    const leaveData = {
        leavetype: document.getElementById("leave").value,
        prioritylevel: prioritylevel,
        startdate: document.getElementById("start").value,
        enddate: document.getElementById("end").value,
        reason: document.getElementById("reason").value,
        attachment: null
    };

    try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://employee-leave-management-system-2fr0.onrender.com/leave", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(leaveData)
        });

        const result = await response.json();

        alert(result.message);

        form.reset();

    } catch (error) {
        console.log(error);
        alert("Something went wrong!");
    }
});
const links = document.querySelectorAll(".nav-link");

links.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add("active");
    }
});


const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");

if (menuBtn && sidebar) {

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebar.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            sidebar.classList.remove("show");
        }
    });
}