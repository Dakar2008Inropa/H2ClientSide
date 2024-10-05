$(document).ready(function () {
    var courseAPI = "https://studentwebapi.buchwaldshave34.dk/api/Course/";

    GetAllCourses(courseAPI);

    $(document).on("click", ".editBtn", function () {
        var dataId = $(this).attr("data-id");
        $("#EditCourseModal").data("id", dataId);
        $("#EditCourseModal").modal("show");
    });

    $(document).on("click", ".deleteBtn", function () {
        var dataId = $(this).attr("data-id");
        DeleteCourse(courseAPI, dataId);
    });

    $("#EditCourseModal").on('shown.bs.modal', function () {
        var dataId = $(this).data("id");
        $("#EditCourseName").val("");

        $("#editcollapse-one").removeClass("in");

        $.getJSON(courseAPI + "GetCourse/" + dataId, { UserName: "Daniel", UseLazyLoading: true }, function (data) {
            $("#EditCourseModalLabel").text("Rediger - " + data.courseName);
            $("#EditCourseName").val(data.courseName);
        });

        setTimeout(function () {
            var input = document.getElementById("EditCourseName");
            input.focus();
            input.setSelectionRange(0, input.value.length);
        }, 100);
    });

    $("#AddCourseModal").on('shown.bs.modal', function () {
        $("#AddCourseName").focus();
    });

    $("#SaveCourseBtn").click(function ()
    {
        var dataId = $("#EditCourseModal").data("id");
        UpdateCourse(courseAPI, dataId);
    });

    $("#AddCourseBtn").click(function () {
        $("#AddCourseModal").modal("show");
    });

    $("#AddNewCourseBtn").click(function () {
        CreateCourse(courseAPI);
    });

    $("#AddCourseName").keydown(function (e) {
        if (e.key == "Enter") {
            e.preventDefault();
            CreateCourse(courseAPI);
        }
    });

    $("#EditCourseName").keydown(function (e) {
        if (e.key == "Enter") {
            e.preventDefault();
            $("#SaveCourseBtn").click();
        }
    });
});

function ClearAddCourse() {
    $("#AddCourseName").val("");
}

function GetAllCourses(apiurl) {
    $.getJSON(apiurl + "GetCourses", {UserName: "Daniel", UseLazyLoading: true }, function (data) {
        data.sort(function (a, b) {
            return b.courseName - a.courseName;
        });

        $("#CourseTableBody").empty();

        $.each(data, function (index, item) {
            $("#CourseTableBody").append(
                "<tr>" +
                "<td>" + item.courseName + "</td>" +
                "<td class='text-center'>" + item.studentCourses.length + "</td>" +
                "<td>" +
                "<a class='btn btn-success btn-sm btn-inlineblock editBtn' data-id='" + item.courseID + "'>Rediger</a>" +
                "<a class='btn btn-danger btn-sm btn-inlineblock deleteBtn' data-id='" + item.courseID + "'>Slet</a>" +
                "</td>" +
                "</tr>"
            );
        });
    });
}

function UpdateCourse(apiurl, id) {
    var updateCourseName = $("#EditCourseName").val();
    var username = "Daniel";
    var apiURLWithUsername = apiurl + "UpdateCourse/" + id + "?UserName=" + encodeURIComponent(username);

    $.ajax({
        url: apiURLWithUsername,
        type: "PUT",
        contentType: 'application/json',
        data: JSON.stringify({
            courseID: id,
            courseName: updateCourseName,
        }),
        success: function () {
            Swal.fire({
                title: "Opdateret!",
                text: "Faget er blevet opdateret.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            $("#EditCourseModal").modal("hide");
            GetAllCourses(apiurl);
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

function DeleteCourse(apiurl, id) {
    var username = "Daniel";

    var apiURLWithUsername = apiurl + "/DeleteCourse/" + id + "?UserName=" + encodeURIComponent(username);

    Swal.fire({
        title: "Slet Fag?",
        text: "Er du sikker på at du vil slette dette fag?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ja slet faget!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: apiURLWithUsername,
                type: "DELETE",
                success: function () {
                    Swal.fire({
                        title: "Slettet!",
                        text: "Faget er blevet slettet.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    GetAllCourses(apiurl);
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

function CreateCourse(apiurl) {
    var addcourseName = $("#AddCourseName").val();
    var username = "Daniel";

    var apiURLWithUser = apiurl + "CreateCourse?UserName=" + encodeURIComponent(username);

    $.ajax({
        url: apiURLWithUser,
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            courseName: addcourseName
        }),
        success: function () {
            Swal.fire({
                title: "Tilføjet!",
                text: "Nyt fag oprettet.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            $("#AddCourseModal").modal("hide");
            ClearAddCourse();
            GetAllCourses(apiurl);
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