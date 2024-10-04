$(document).ready(function () {
    var studentAPI = "https://studentwebapi.buchwaldshave34.dk/api/Student/";
    var teamAPI = "https://studentwebapi.buchwaldshave34.dk/api/Team/";
    var courseAPI = "https://studentwebapi.buchwaldshave34.dk/api/Course/";
    var studentCourseAPI = "https://studentwebapi.buchwaldshave34.dk/api/StudentCourse/";

    GetAllTeams(teamAPI);

    $(document).on("click", ".editBtn", function () {
        var dataId = $(this).attr("data-id");
        $("#EditTeamModal").data("id", dataId);
        $("#EditTeamModal").modal("show");
    });

    $(document).on("click", ".deleteBtn", function () {
        var dataId = $(this).attr("data-id");
        DeleteTeam(teamAPI, dataId);
    });

    $("#EditTeamModal").on('shown.bs.modal', function () {
        var dataId = $(this).data("id");
        $("#EditTeamName").val("");

        $("#editcollapse-one").removeClass("in");

        $.getJSON(teamAPI + "GetTeam/" + dataId, { UserName: "Daniel", UseLazyLoading: true }, function (data) {
            $("#EditTeamModalLabel").text("Rediger - " + data.teamName);
            $("#EditTeamName").val(data.teamName);
        });

        $("#EditTeamName").focus();
    });

    $("#AddTeamModal").on('shown.bs.modal', function () {
        $("#AddTeamName").focus();
    });

    $("#SaveTeamBtn").click(function ()
    {
        var dataId = $("#EditTeamModal").data("id");
        UpdateTeam(teamAPI, dataId);
    });

    $("#AddTeamBtn").click(function () {
        $("#AddTeamModal").modal("show");
    });

    $("#AddNewTeamBtn").click(function () {
        CreateTeam(teamAPI);
    });
});

function ClearAddTeam() {
    $("#AddTeamName").val("");
}

function GetAllTeams(apiurl) {
    $.getJSON(apiurl + "GetTeams", {UserName: "Daniel", UseLazyLoading: true }, function (data) {
        data.sort(function (a, b) {
            return b.teamName - a.teamName;
        });

        $("#TeamTableBody").empty();

        $.each(data, function (index, item) {
            $("#TeamTableBody").append(
                "<tr>" +
                "<td>" + item.teamName + "</td>" +
                "<td class='text-center'>" + item.students.length + "</td>" +
                "<td>" +
                "<a class='btn btn-success btn-sm btn-inlineblock editBtn' data-id='" + item.teamID + "'>Rediger</a>" +
                "<a class='btn btn-danger btn-sm btn-inlineblock deleteBtn' data-id='" + item.teamID + "'>Slet</a>" +
                "</td>" +
                "</tr>"
            );
        });
    });
}

function UpdateTeam(apiurl, id) {
    var updateTeamName = $("#EditTeamName").val();
    var username = "Daniel";
    var apiURLWithUsername = apiurl + "UpdateTeam/" + id + "?UserName=" + encodeURIComponent(username);

    $.ajax({
        url: apiURLWithUsername,
        type: "PUT",
        contentType: 'application/json',
        data: JSON.stringify({
            teamID: id,
            teamName: updateTeamName,
        }),
        success: function () {
            Swal.fire({
                title: "Opdateret!",
                text: "Holdet er blevet opdateret.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            $("#EditTeamModal").modal("hide");
            GetAllTeams(apiurl);
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

function DeleteTeam(apiurl, id) {
    var username = "Daniel";

    var apiURLWithUsername = apiurl + "/DeleteTeam/" + id + "?UserName=" + encodeURIComponent(username);

    Swal.fire({
        title: "Slet Hold?",
        text: "Er du sikker på at du vil slette dette hold?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ja slet holdet!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: apiURLWithUsername,
                type: "DELETE",
                success: function () {
                    Swal.fire({
                        title: "Slettet!",
                        text: "Holdet er blevet slettet.",
                        icon: "success"
                    });
                    GetAllTeams(apiurl);
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

function CreateTeam(apiurl) {
    var addTeamName = $("#AddTeamName").val();
    var username = "Daniel";

    var apiURLWithUser = apiurl + "CreateTeam?UserName=" + encodeURIComponent(username);

    $.ajax({
        url: apiURLWithUser,
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            teamName: addTeamName
        }),
        success: function () {
            Swal.fire({
                title: "Tilføjet!",
                text: "Nyt hold oprettet.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            $("#AddTeamModal").modal("hide");
            ClearAddTeam();
            GetAllTeams(apiurl);
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