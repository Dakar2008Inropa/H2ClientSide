$(document).ready(function () {
    var mainAPI = "https://studentwebapi.buchwaldshave34.dk/api/Student/";
    var teamAPI = "https://studentwebapi.buchwaldshave34.dk/api/Team/";

    GetAllStudents(mainAPI);

    $(document).on("click", ".editBtn", function () {
        var dataId = $(this).attr("data-id");
        $("#EditStudentModal").data("id", dataId);
        $("#EditStudentModal").modal("show");
    });

    $(document).on("click", ".deleteBtn", function () {
        var dataId = $(this).attr("data-id");
        DeleteStudent(mainAPI, dataId);
    });

    $("#EditStudentModal").on('shown.bs.modal', function () {
        var dataId = $(this).data("id");
        $("#EditFirstname").val("");
        $.getJSON(mainAPI + "GetStudent/" + dataId, { UserName: "Daniel", UseLazyLoading: true }, function (data) {

            $("#EditStudentModalLabel").text("Rediger - " + data.studentName);
            $("#EditFirstname").val(data.studentName);
            $("#EditLastname").val(data.studentLastName);

            $.getJSON(teamAPI + "GetTeams", { UserName: "Daniel", UseLazyLoading: false }, function (dataTeam) {
                $("#EditTeams").empty();
                $.each(dataTeam, function (indexInArray, valueOfElement) {
                    $("#EditTeams").append($('<option>', { value: valueOfElement.teamID, text: valueOfElement.teamName }));
                });
                $("#EditTeams").val(data.teamID);
            });

        });
        $("#EditFirstname").focus();
    });

    $("#AddStudentModal").on('shown.bs.modal', function () {
        $.getJSON(teamAPI + "GetTeams", { UserName: "Daniel", UseLazyLoading: false }, function (dataTeam) {
            $("#AddTeams").empty();
            $.each(dataTeam, function (index, item) {
                $("#AddTeams").append($('<option>', { value: item.teamID, text: item.teamName }));
            });
        });
        $("#AddFirstname").focus();
    });

    $("#SaveStudentBtn").click(function ()
    {
        var dataId = $("#EditStudentModal").data("id");
        UpdateStudent(mainAPI, dataId);
    });

    $("#AddStudentBtn").click(function () {
        $("#AddStudentModal").modal("show");
    });

    $("#AddNewStudentBtn").click(function () {
        CreateStudent(mainAPI);
    });

});

function ClearAddStudent() {
    $("#AddFirstname").val("");
    $("#AddLastname").val("");
}

function GetAllStudents(apiurl) {
    $.getJSON(apiurl + "GetStudents", {UserName: "Daniel", UseLazyLoading: true }, function (data) {
        data.sort(function (a, b) {
            return b.studentName - a.studentName;
        });

        $("#StudentTableBody").empty();

        $.each(data, function (indexInArray, valueOfElement) {
            $("#StudentTableBody").append(
                "<tr>" +
                "<td>" + valueOfElement.studentName + "</td>" +
                "<td>" + valueOfElement.studentLastName + "</td>" +
                "<td class='text-center'>" + valueOfElement.team.teamName + "</td>" +
                "<td>" +
                "<a class='btn btn-success btn-sm btn-inlineblock editBtn' data-id='" + valueOfElement.studentID + "'>Rediger</a>" +
                "<a class='btn btn-danger btn-sm btn-inlineblock deleteBtn' data-id='" + valueOfElement.studentID + "'>Slet</a>" +
                "</td>" +
                "</tr>"
            );
        });
    });
}

function UpdateStudent(apiurl, id) {
    var updateFirstname = $("#EditFirstname").val();
    var updateLastname = $("#EditLastname").val();
    var updateTeam = $("#EditTeams").val();
    var username = "Daniel";
    var apiURLWithUsername = apiurl + "UpdateStudent/" + id + "?UserName=" + encodeURIComponent(username);

    $.ajax({
        url: apiURLWithUsername,
        type: "PUT",
        contentType: 'application/json',
        data: JSON.stringify({
            studentID: id,
            studentName: updateFirstname,
            studentLastName: updateLastname,
            teamID: updateTeam
        }),
        success: function () {
            Swal.fire({
                title: "Updated!",
                text: "Student is updated.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            $("#EditStudentModal").modal("hide");
            GetAllStudents(apiurl);
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error",
                text: "Could not update the student",
                icon: "error"
            });
        }
    });
}

function DeleteStudent(apiurl, id) {
    var username = "Daniel";

    var apiURLWithUsername = apiurl + "/DeleteStudent/" + id + "?UserName=" + encodeURIComponent(username);

    Swal.fire({
        title: "Delete Student?",
        text: "Are you sure you want to delete this student?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: apiURLWithUsername,
                type: "DELETE",
                success: function () {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The student has been deleted.",
                        icon: "success"
                    });
                    GetAllStudents(apiurl);
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        title: "Error",
                        text: status,
                        icon: "error"
                    });
                }
            })
        }
    });
}

function CreateStudent(apiurl) {
    var firstName = $("#AddFirstname").val();
    var lastName = $("#AddLastname").val();
    var teamID = $("#AddTeams").val();
    var username = "Daniel";

    var apiURLWithUser = apiurl + "CreateStudent?UserName=" + encodeURIComponent(username);

    $.ajax({
        url: apiURLWithUser,
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            studentName: firstName,
            studentLastName: lastName,
            teamID: teamID
        }),
        success: function () {
            Swal.fire({
                title: "Added!",
                text: "New student added.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            $("#AddStudentModal").modal("hide");
            ClearAddStudent();
            GetAllStudents(apiurl);
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error",
                text: "Could not add the student",
                icon: "error"
            });
        }
    });
}