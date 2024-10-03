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

    $("#SaveStudentBtn").click(function ()
    {
        var dataId = $("#EditStudentModal").data("id");
        UpdateStudent(mainAPI, dataId);
    });

});

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

}