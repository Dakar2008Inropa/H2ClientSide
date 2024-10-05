$(document).ready(function () {
    var studentAPI = "https://studentwebapi.buchwaldshave34.dk/api/Student/";
    var teamAPI = "https://studentwebapi.buchwaldshave34.dk/api/Team/";
    var courseAPI = "https://studentwebapi.buchwaldshave34.dk/api/Course/";
    var studentCourseAPI = "https://studentwebapi.buchwaldshave34.dk/api/StudentCourse/";

    GetAllStudents(studentAPI);

    $(document).on("click", ".editBtn", function () {
        var dataId = $(this).attr("data-id");
        $("#EditStudentModal").data("id", dataId);
        $("#EditStudentModal").modal("show");
    });

    $(document).on("click", ".deleteBtn", function () {
        var dataId = $(this).attr("data-id");
        DeleteStudent(studentAPI, dataId);
    });

    $(document).on("click", ".deleteCourseBtn", function () {
        var studentId = $(this).attr("data-studentId");
        var courseId = $(this).attr("data-courseId");
        RemoveCourseFromStudent(studentAPI, courseAPI, studentCourseAPI, studentId, courseId);
    });

    $("#EditStudentModal").on('shown.bs.modal', function () {
        var dataId = $(this).data("id");
        $("#EditFirstname").val("");

        $("#editcollapse-one").removeClass("in");

        $("#AddStudentCourseBtn").data("studentId", dataId);

        $.getJSON(studentAPI + "GetStudent/" + dataId, { UserName: "Daniel", UseLazyLoading: true }, function (data) {

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

            var studentCourses = $(".studentcoursestable");

            studentCourses.empty();

            $.each(data.studentCourses, function (index, item) {
                studentCourses.append(
                    "<tr>" +
                    "<td>" + item.course.courseName + "</td>" +
                    "<td>" +
                    "<a class='btn btn-danger btn-sm btn-block deleteCourseBtn' data-studentId='" + data.studentID + "' data-courseId='"+ item.courseID +"'>Fjern</a>" +
                    "</td>" +
                    "</tr>"
                );
            });

            $.getJSON(courseAPI + "GetCourses", { UserName: "Daniel", UseLazyLoading: false }, function (dataCourse) {
                $("#AddCourseSelect").empty();

                var existingCourseIds = data.studentCourses.map(function (item) { return item.courseID; });

                $.each(dataCourse, function (index, item) {
                    if (existingCourseIds.indexOf(item.courseID) === -1) {
                        $("#AddCourseSelect").append($('<option>', { value: item.courseID, text: item.courseName }));
                    }
                });
            });

        });

        setTimeout(function () {
            var input = document.getElementById("EditFirstname");
            input.focus();
            input.setSelectionRange(0, input.value.length);
        }, 100);
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
        UpdateStudent(studentAPI, dataId);
    });

    $("#AddStudentBtn").click(function () {
        $("#AddStudentModal").modal("show");
    });

    $("#AddNewStudentBtn").click(function () {
        CreateStudent(studentAPI);
    });

    $("#AddStudentCourseBtn").click(function () {

        var dataId = $(this).data("studentId");
        var selectedCourse = $("#AddCourseSelect").val();
        var username = "Daniel";

        var apiURLWithUser = studentCourseAPI + "CreateStudentCourse?UserName=" + encodeURIComponent(username);

        $.ajax({
            url: apiURLWithUser,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                studentID: dataId,
                courseID: selectedCourse
            }),
            success: function () {
                Swal.fire({
                    title: "Fag tilføjet!",
                    text: "fag tilføjet til elev",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
                UpdateStudentCourses(studentAPI, courseAPI, dataId);
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    title: "Fejl",
                    text: error,
                    icon: "error"
                });
            }
        });
    });

    $("#AddLastname").keydown(function (e) {
        if (e.key == "Enter") {
            if ($("#AddFirstname").val()) {
                e.preventDefault();
                CreateStudent(studentAPI);
            }
            else {
                Swal.fire({
                    title: "Fejl",
                    text: "Du skal udfylde fornavn først!",
                    icon: "error",
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    });

    $("#AddFirstname").keydown(function (e) {
        if (e.key == "Enter") {
            if ($("#AddLastname").val()) {
                e.preventDefault();
                CreateStudent(studentAPI);
            }
            else {
                Swal.fire({
                    title: "Fejl",
                    text: "Du skal udfylde efternavn først!",
                    icon: "error",
                    showCancelButton: false,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
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
                title: "Opdateret!",
                text: "Eleven er blevet opdateret.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            $("#EditStudentModal").modal("hide");
            GetAllStudents(apiurl);
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Fejl",
                text: status,
                icon: "error"
            });
        }
    });
}

function DeleteStudent(apiurl, id) {
    var username = "Daniel";

    var apiURLWithUsername = apiurl + "/DeleteStudent/" + id + "?UserName=" + encodeURIComponent(username);

    Swal.fire({
        title: "Slet Elev?",
        text: "Er du sikker på at du vil slette denne elev?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ja slet eleven!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: apiURLWithUsername,
                type: "DELETE",
                success: function () {
                    Swal.fire({
                        title: "Slettet!",
                        text: "Eleven er blevet slettet.",
                        icon: "success"
                    });
                    GetAllStudents(apiurl);
                },
                error: function (xhr, status, error) {
                    Swal.fire({
                        title: "Fejl",
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
                title: "Tilføjet!",
                text: "Ny elev oprettet.",
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
                title: "Fejl",
                text: status,
                icon: "error"
            });
        }
    });
}

function UpdateStudentCourses(studentapi, courseapi, studentId) {
    $.getJSON(studentapi + "GetStudent/" + studentId, { UserName: "Daniel", UseLazyLoading: true }, function (data) {
        var studentCourses = $(".studentcoursestable");

        studentCourses.empty();

        $.each(data.studentCourses, function (index, item) {
            studentCourses.append(
                "<tr>" +
                "<td>" + item.course.courseName + "</td>" +
                "<td>" +
                "<a class='btn btn-danger btn-sm btn-block deleteCourseBtn' data-studentId='" + data.studentID + "' data-courseId='" + item.courseID + "'>Fjern</a>" +
                "</td>" +
                "</tr>"
            );
        });

        $.getJSON(courseapi + "GetCourses", { UserName: "Daniel", UseLazyLoading: false }, function (dataCourse) {
            $("#AddCourseSelect").empty();

            var existingCourseIds = data.studentCourses.map(function (item) { return item.courseID; });

            $.each(dataCourse, function (index, item) {
                if (existingCourseIds.indexOf(item.courseID) === -1) {
                    $("#AddCourseSelect").append($('<option>', { value: item.courseID, text: item.courseName }));
                }
            });
        });
    });
}

function RemoveCourseFromStudent(studentapi, courseapi, studentcourseapi, studentId, courseId) {
    var username = "Daniel";

    var apiURLWithUsername = studentcourseapi + "DeleteStudentCourse/" + studentId + "/" + courseId + "?UserName=" + encodeURIComponent(username);

    Swal.fire({
        title: "Fjern fag",
        text: "er du sikker på at du vil fjerne dette fag fra eleven?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ja fjern det!"
    }).then((result) => {
        $.ajax({
            url: apiURLWithUsername,
            type: "DELETE",
            success: function () {
                Swal.fire({
                    title: "Slettet",
                    text: "Faget er fjernet fra eleven.",
                    icon: "success"
                });
                UpdateStudentCourses(studentapi, courseapi, studentId);
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    title: "Fejl",
                    text: status,
                    icon: "error"
                });
            }
        })
    });
}