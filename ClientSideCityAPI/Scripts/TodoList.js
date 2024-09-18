$(document).ready(function () {
    var API = "https://todoitems.buchwaldshave34.dk/api/TodoItems";

    GetAPIData(API);

    $(document).on("click", ".deleteBtn", function () {
        var dataId = $(this).attr("data-id");
        DeleteItem(API, dataId);
    });

    $(document).on("click", ".editBtn", function () {
        var dataId = $(this).attr("data-id");
        $("#editModal").data("id", dataId);
        $("#editModal").modal("show");
    });

    $("#editModal").on('shown.bs.modal', function () {
        var dataId = $(this).data("id");
        $("#NameInput").val("");
        $.getJSON(API + "/" + dataId,
            function (data) {
                $("#editModalLabel").text("Edit - " + data.name);
                $("#NameInput").val(data.name);
                if (data.isComplete) {
                    $("#IsComplete").attr("checked", true);
                }
                else {
                    $("#IsComplete").attr("checked", false);
                }
            }
        );
        $("#NameInput").focus();
    });

    $("#addModal").on('shown.bs.modal', function () {
        $("#AddNameInput").focus();
    });

    $("#SaveItemBtn").click(function () {
        var dataId = $("#editModal").data("id");
        EditItem(API, dataId);
    });

    $("#AddItemBtn").click(function () {
        AddItem(API);
    });
});

function ClearAddModal() {
    $("#IdInput").val("");
    $("#AddNameInput").val("");
    $("#AddIsComplete").attr("checked", false);
}

function GetAPIData(APIUrl) {
    $.getJSON(APIUrl, { UserName: "Daniel" },
        function (data, textStatus, jqXHR) {

            data.sort(function (a, b) {
                return b.id - a.id;
            });


            $("#TableContent").empty();

            $.each(data, function (indexInArray, valueOfElement) {
                $("#TableContent").append(
                    "<tr>" +
                    "<td>" + valueOfElement.id + "</td>" +
                    "<td>" + valueOfElement.name + "</td>" +
                    "<td class='text-center'>" +
                    "<input type='checkbox' disabled " + (valueOfElement.isComplete ? "checked" : "") + " />" +
                    "</td>" +
                    "<td>" +
                    "<a class='btn btn-success btn-xs editBtn' data-id='" + valueOfElement.id + "'>Edit Item</a>" +
                    "<a class='btn btn-danger btn-xs deleteBtn' data-id='" + valueOfElement.id + "'>Delete Item</a>" +
                    "</td>" +
                    "</tr>"
                );
            });
        }
    );
}

function DeleteItem(APIUrl, id) {
    var username = "Daniel";
    var apiURLWithusername = APIUrl + "/" + id + "?UserName=" + encodeURIComponent(username);
    Swal.fire({
        title: "Delete ToDo?",
        text: "Are you sure you want to delete this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: apiURLWithusername,
                type: 'DELETE',
                success: function () {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The todo has been deleted.",
                        icon: "success"
                    });
                    GetAPIData(APIUrl);
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

function EditItem(APIUrl, id) {

    var updateName = $("#NameInput").val();
    var updateIsComplete = $("#IsComplete").is(":checked");
    var username = "Daniel";
    var apiURLWithUser = APIUrl + "/" + id + "?UserName=" + encodeURIComponent(username);

    $.ajax({
        url: apiURLWithUser,
        type: "PUT",
        contentType: 'application/json',
        data: JSON.stringify({
            id: id,
            name: updateName,
            isComplete: updateIsComplete
        }),
        success: function () {
            Swal.fire({
                title: "Updated!",
                text: "The todo item has been updated.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            $("#editModal").modal("hide");
            GetAPIData(APIUrl);
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error",
                text: "Could not update the item.",
                icon: "error"
            });
        }
    });
}

function AddItem(APIUrl) {

    var addId = $("#IdInput").val();
    var addName = $("#AddNameInput").val();
    var addIsComplete = $("#AddIsComplete").is(":checked");
    var username = "Daniel";

    var apiURLWithUser = APIUrl + "?UserName=" + encodeURIComponent(username);

    $.ajax({
        url: apiURLWithUser,
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            name: addName,
            isComplete: addIsComplete
        }),
        success: function () {
            Swal.fire({
                title: "Added!",
                text: "An todo item has been added.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
            });
            $("#addModal").modal("hide");
            ClearAddModal();
            GetAPIData(APIUrl);
        },
        error: function (xhr, status, error) {
            Swal.fire({
                title: "Error",
                text: "Could not add the item.",
                icon: "error"
            });
            console.log(xhr);
            console.log(status);
            console.log(error);
        }
    });
}