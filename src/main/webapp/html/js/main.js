function show_page(pageNumber) {
    $("tr:has(td)").remove();

    let url = "/rest/players?";
    let countPerPage = $("#quantity-on-page").val();
    if (countPerPage == null) {
        countPerPage = 3;
    }
    if (pageNumber == null) {
        pageNumber = 0;
    }
    url = url.concat("pageNumber=").concat(pageNumber);
    url = url.concat("&pageSize=").concat(countPerPage);

    $.get(url, function (response) {
        $.each(response, function (i, item) {
            $('<tr>').html("<td>"
                + item.id + "</td><td>"
                + item.name + "</td><td>"
                + item.title + "</td><td>"
                + item.race + "</td><td>"
                + item.profession + "</td><td>"
                + new Date(item.birthday).toLocaleDateString() + "</td><td>"
                + item.banned + "</td><td>"
                + item.level + "</td><td>"
                + "<button id='button_edit_" + item.id + "' onclick='editAccount(" + item.id + ")'>"
                + "<img src='/img/edit_new.png' alt='edit'>"
                + "</button>" + "</td><td>"
                + "<button id='button_delete_" + item.id + "' onclick='deleteAccount(" + item.id + ")'>"
                + "<img src='/img/delete_new.png' alt='delete'>"
                + "</button>" + "</td>"
            ).appendTo('#main-table');
        });
    });

    let totalCount = get_total_account_number();

    let countOfPages = Math.ceil(totalCount / countPerPage);

    $("button.paging_button_style").remove();

    for (let i = 0; i < countOfPages; i++) {
        let button_html = "<button>" + (i + 1) + "</button>"
        let button = $(button_html)
            .attr('id', "paging_button_" + i)
            .attr('onclick', "show_page(" + i + ")")
            .addClass('paging_button_style');
        $('#paging-buttons').append(button);
    }

    let ident = "#paging_button_" + pageNumber;
    $(ident).css('color', "red");
}

function get_total_account_number() {
    let url = "/rest/players/count";
    let res = 0;
    $.ajax({
        url: url,
        async: false,
        success: function (result) {
            res = parseInt(result);
        }
    })
    return res;
}

function deleteAccount(id) {
    let url = "/rest/players/" + id;
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function () {
            show_page(getCurrentPage());
        }
    });
}

function getCurrentPage() {
    let currentPage = 0;
    $('button:parent(div)').each(function () {
        if ($(this).css('color') === 'rgb(255, 0, 0)') {
            currentPage = $(this).text();
        }
    });
    return parseInt(currentPage) - 1;
}

function editAccount(id) {
    let ident_edit = "#button_edit_" + id;
    let ident_delete = "#button_delete_" + id;
    $(ident_delete).remove();
    let save_image_html = "<img src='/img/save_new.png' alt='save'>"
    $(ident_edit).html(save_image_html);

    let current_tr = $(ident_edit).parent().parent();
    let tr_children = current_tr.children();

    let td_name = tr_children[1];
    td_name.innerHTML = "<input id='input_name_" + id + "' type='text' value='" + td_name.innerHTML + "'>";

    let td_title = tr_children[2];
    td_title.innerHTML = "<input id='input_title_" + id + "' type='text' value='" + td_title.innerHTML + "'>";

    let td_race = tr_children[3];
    let race_id = "#select_race_" + id;
    let raceCurrentValue = td_race.innerHTML;
    td_race.innerHTML = getDropListRaceHTML(id);
    $(race_id).val(raceCurrentValue).change();

    let td_profession = tr_children[4];
    let profession_id = "#select_profession_" + id;
    let professionCurrentValue = td_profession.innerHTML;
    td_profession.innerHTML = getDropListProfessionHTML(id);
    $(profession_id).val(professionCurrentValue).change();

    let td_banned = tr_children[6];
    let banned_id = "#select_banned_" + id;
    let bannedCurrentValue = td_banned.innerHTML;
    td_banned.innerHTML = getDropListBannedHTML(id);
    $(banned_id).val(bannedCurrentValue).change();

    let save_html = "saveAccount(" + id + ")";
    $(ident_edit).attr('onclick', save_html);
}

function saveAccount(id) {
    let url = "/rest/players/" + id;
    let nameValue = $("#input_name_" + id).val();
    let titleValue = $("#input_title_" + id).val();
    let raceValue = $("#select_race_" + id).val();
    let professionValue = $("#select_profession_" + id).val();
    let bannedValue = $("#select_banned_" + id).val();
    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        async: false,
        data: JSON.stringify({
            "name": nameValue,
            "title": titleValue,
            "race": raceValue,
            "profession": professionValue,
            "banned": bannedValue
        }),
        success: function () {
            show_page(getCurrentPage());
        }
    });
}

function createAccount() {
    let url = "/rest/players/";
    let nameValue = $("#new_name").val();
    let titleValue = $("#new_title").val();
    let raceValue = $("#new_race").val();
    let professionValue = $("#new_profession").val();
    let levelValue = $("#new_level").val();
    let birthdayValue = $("#new_birthday").val();
    let bannedValue = $("#new_banned").val();

    $.ajax({
        url: url,
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        async: false,
        data: JSON.stringify({
            "name": nameValue,
            "title": titleValue,
            "race": raceValue,
            "profession": professionValue,
            "level": levelValue,
            "birthday": new Date(birthdayValue).getTime(),
            "banned": bannedValue
        }),
        success: function () {
            show_page(getCurrentPage());
            $("#new_name").val("");
            $("#new_title").val("");
            $("#new_race").val();
            $("#new_profession").val();
            $("#new_level").val();
            $("#new_birthday").val()
            $("#new_banned").val();
        }
    })
}

function getDropListRaceHTML(id) {
    let race_id = "select_race_" + id;
    return "<label for='race'></label>"
        + "<select id='" + race_id + "' name='race'>"
        + "<option value='HUMAN'>HUMAN</option>"
        + "<option value='DWARF'>DWARF</option>"
        + "<option value='ELF'>ELF</option>"
        + "<option value='GIANT'>GIANT</option>"
        + "<option value='ORC'>ORC</option>"
        + "<option value='TROLL'>TROLL</option>"
        + "<option value='HOBBIT'>HOBBIT</option>"
        + "</select>";
}

function getDropListProfessionHTML(id) {
    let profession_id = "select_profession_" + id;
    return "<label for='profession'></label>"
        + "<select id='" + profession_id + "' name='profession'>"
        + "<option value='WARRIOR'>WARRIOR</option>"
        + "<option value='ROGUE'>ROGUE</option>"
        + "<option value='SORCERER'>SORCERER</option>"
        + "<option value='CLERIC'>CLERIC</option>"
        + "<option value='PALADIN'>PALADIN</option>"
        + "<option value='NAZGUL'>NAZGUL</option>"
        + "<option value='WARLOCK'>WARLOCK</option>"
        + "<option value='DRUID'>DRUID</option>"
        + "</select>";
}

function getDropListBannedHTML(id) {
    let banned_id = "select_banned_" + id;
    return "<label for='banned'></label>"
        + "<select id='" + banned_id + "' name='banned'>"
        + "<option value='false'>false</option>"
        + "<option value='true'>true</option>"
        + "</select>";
}