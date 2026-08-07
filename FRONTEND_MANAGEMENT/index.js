const Admin = document.getElementById("admin");
const Employee = document.getElementById("employee");

Admin.addEventListener("click", function () {
    window.location.href = "assets/sign.html";
});
Employee.addEventListener("click", function () {
    window.location.href = "assets/login.html";
});