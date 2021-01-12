// Configurations
let inputDiv = "input";
let questionsDiv = "questions";
let outputDiv = "output";
let namesFile = "names.txt";
let rubricsFile = "rubrics.txt";
let emptyFile = "yepw";
let github_column = 3;

let classList = [];
let iFrameList = [];
let sourceList = [];
let questionList = [];
let groupList = [];
let compareList = [];
let searchList = [];
let stringList = [];
let gradeList = [];

// File reading
function readFile(file = "", fun = consol.log) {
    let text;
    if (window.XMLHttpRequest) text = new XMLHttpRequest();
    text.open("GET", file, true);
    text.send(null);
    text.onreadystatechange = function () {
        if (text.status == 404) fun("");
        else if (text.readyState == 4 && text.status == 200) fun(text.responseText.trim());
    };
}

function generateInput(text = "") {
    let list = text.split("\n");
    if (list.length > 1) {
        list = list.map(li => li.split(","));
        let n = list[0].length;
        classList = list.map(li => makeArray(li, n));
        addField(inputDiv, "c0", "Index:", "1");
        classList[0].forEach((ci, i) => addInputField(ci, i));
    }
    addNavigation(questionsDiv);
    readFile(rubricsFile, generateQuestions);
}

function generateQuestions(text = "") {
    let list = text.split("\n");
    let name = classList[1][github_column - 1];
    let group = 1;
    questionList.length = 0;
    groupList.length = 0;
    addCheckAll(questionsDiv, "Whole workbook:", 0);
    addDivider(questionsDiv);
    for (let li of list) {
        if (li.startsWith("iframe")) {
            let source = getFileName(li);
            sourceList.push(source);
            addIframe(questionsDiv, name + "/" + source);
        }
        else if (li.startsWith("(")) {
            let points = getPoints(li);
            let comment = getPoints(li, true);
            addCheckBox(questionsDiv, "q" + questionList.length, points, comment);
            questionList.push(comment);
            groupList.push(group);
        }
        else if (li.startsWith("group")) {
            addCheckAll(questionsDiv, li.split(" ").reduce((sum, vi, i) => sum + i > 0 ? (i > 1 ? " " : "") + vi : "", ""), group);
        }
        else if (li.startsWith("check")) {
            let source = getFileName(li);
            compareList.push(source);
            addCheckBox(questionsDiv, "m" + compareList.length, "(auto)", "Checked if " + source + " is not changed.");
            addField(questionsDiv, "%m" + compareList.length, "Characters added:", "");
        }
        else if (li.startsWith("search")) {
            let source = getFileName(li);
            let search = getFileName(li, true);
            searchList.push(source);
            stringList.push(search);
            addCheckBox(questionsDiv, "s" + searchList.length, "(auto)", "Checked if " + source + " does not contain \"" + search + "\".");
            addField(questionsDiv, "%s" + searchList.length, "Lines containing \"" + search + "\"", "\n");
        }
        else if (li.startsWith("-----")) {
            addDivider(questionsDiv);
            group++;
        }
    }
    addDivider(questionsDiv);
    goTo();
    addNavigation(outputDiv);
    addField(outputDiv, "grade", "Comments", "\n\n\n\n\n\n\n\n");
    addField(outputDiv, "sheet", "Spreadsheet", "\n\n\n\n\n\n\n\n");
    gradeList = Array(classList.length).fill(0).map(() => Array(questionList.length * 2).fill(0));
    for (let i = 0; i < questionList.length * 2; i++) gradeList[0][i] = i % 2 == 0 ? questionList[i / 2] : "Comment";
}

// Button functions
function moveTo(direction = 1) {
    let field = document.getElementById("c0");
    if (field) {
        let index = getNumber(field.value);
        field.value = (index + direction + classList.length) % classList.length;
        if (field.value == 0) field.value = direction > 0 ? 1 : classList.length - 1;
        goTo();
    }
}

function goTo(column = 0) {
    let field = document.getElementById("c0");
    if (field) {
        let index = 0;
        if (column > 0) {
            let changed = document.getElementById("c" + column);
            if (changed) index = getNumber(changed.value);
        }
        if (index <= 0) index = getNumber(field.value);
        field.value = index;
        for (let i = 1; i <= classList[0].length; i++) document.getElementById("c" + i).value = index;
        let github = document.getElementById("c" + github_column);
        if (github) {
            let name = github.options[github.selectedIndex].text;
            iFrameList.forEach((iframe, i) => iframe.src = name + "/" + sourceList[i]);
            compareList.forEach((ci, i) => compareFile(name + "/" + ci, emptyFile + "/" + ci, i));
            searchList.forEach((si, i) => searchFile(name + "/" + si, stringList[i], i));
        }
    }
    grade();
}

function compareFile(file = "", otherFile = "", index = 0) {
    readFile(file, (text) => readFile(otherFile, (otherText) => compareText(text, otherText, Number(index))));
}

function compareText(text = "", otherText = "", index = "") {
    let diff = text.length - otherText.length;
    let box = document.getElementById("@m" + (index + 1));
    if (box) box.checked = diff <= 2;
    let field = document.getElementById("%m" + (index + 1));
    if (field) field.value = diff;
}

function searchFile(file = "", search = "", index = 0) {
    readFile(file, (text) => searchText(text, search, index));
}

function searchText(text = "", search = "", index = 0) {
    let lines = text.split("\n");
    let items = search.replace("||", "&&").split("&&");
    let result = lines.reduce((sum, li) => sum + (items.reduce((contain, i) => contain || li.includes(i.trim()), false) ? li + "\n" : ""), "");
    let box = document.getElementById("@s" + (index + 1));
    if (box) box.checked = result.trim() == "";
    let field = document.getElementById("%s" + (index + 1));
    if (field) field.value = result;
}

function checkAll(group = 0, choice = true) {
    for (let i = 0; i < questionList.length; i++) {
        if (group == 0 || groupList[i] == group) {
            let check = document.getElementById("@q" + (i + 1));
            if (check) check.checked = choice;
        }
    }
}

function grade() {
    let totalComment = "";
    let comment = "";
    let totalPoint = 0;
    let point = 0;
    let part = 0;
    let totalOutOf = 0;
    let outOf = 0;
    let index = 0;
    let checkBox, outOfField, partField, commentField, indexField;
    for (let q = 1; q <= questionList.length; q++) {
        checkBox = document.getElementById("@q" + q);
        outOfField = document.getElementById("#q" + q);
        partField = document.getElementById("%q" + q);
        commentField = document.getElementById("$q" + q);
        if (checkBox && outOfField) {
            outOf = getValue(outOfField.innerHTML);
            totalOutOf += outOf;
            part = 0;
            if (partField) part = getNumber(partField.value);
            point = part > 0 ? part : (checkBox.checked ? outOf : 0);
            comment = "";
            if (commentField) comment = " " + String(commentField.value).trim();
            totalPoint += point;
            totalComment += totalComment == "" ? "" : "\t\n";
            totalComment += "(" + point + "/" + outOf + " pts) " + questionList[q - 1].trim() + comment;
            indexField = document.getElementById("c0");
            if (indexField) {
                index = getNumber(indexField.value);
                if (index > 0 && index < gradeList.length) {
                    gradeList[index][2 * (q - 1)] = point;
                    gradeList[index][2 * (q - 1) + 1] = comment.trim();
                }
            }
        }
    }
    totalComment += "\t\nTotal: " + totalPoint + "/" + totalOutOf + " pts";
    let output = document.getElementById("grade");
    let sheet = document.getElementById("sheet");
    let summary = gradeList.map((gi, i) => classList[i].map(cij => cij.trim()).join("\t") + "\t" + gi.map(gij => String(gij).trim()).join("\t")).join("\n");
    if (output && sheet) {
        output.value = totalComment;
        sheet.value = summary;
    }
    else console.log(totalComment, summary);
}

// Helper functions
function makeArray(array = [], size = 1, def = "") {
    let n = array.length;
    while (n < size) {
        array.push(def);
        n++;
    }
    while (n > size) {
        array[n - 2] += def + array[n - 1];
        n--;
    }
    return array;
}

function getFileName(text = "", after = false) {
    let list = text.split(" ");
    let comment = "";
    let start = false;
    for (let li of list) {
        let item = li.toLowerCase().trim();
        if (start) comment += li + " ";
        if (item.endsWith(".htm") || item.endsWith(".html") || item.endsWith(".js")) {
            if (after) start = true;
            else return "for_students/" + li;
        }
        else if (item.endsWith(".md") || item.endsWith(".txt")) {
            if (after) start = true;
            else return li;
        }
    }
    return comment.trim();
}

function getPoints(text = "", after = false) {
    let list = text.split(" ");
    let comment = "";
    let start = false;
    for (let li of list) {
        if (start) comment += li + " ";
        if (li.startsWith("(") && li.endsWith(")")) {
            if (after) start = true;
            else return li.trim();
        }
    }
    return comment.trim();
}

function getValue(text = "") {
    let begin = text.indexOf("(");
    let end = text.indexOf(")");
    let n = 0;
    if (begin >= 0 && end >= 0) n = Number(text.substring(begin + 1, end));
    return isNaN(n) ? 0 : n;
}

function getNumber(text = "") {
    let num = Number(text);
    if (isNaN(num)) return 0;
    else return num;
}

function getDiv(text = "") {
    let div = document.getElementById(text);
    if (!div) {
        div = document.createElement("div");
        div.id = text;
        document.body.appendChild(div);
    }
    return div;
}

// Add elements
function addIframe(location = "div1", source = "") {
    if (source != "") {
        let div = getDiv(location);
        let iframe = document.createElement("iframe");
        iframe.src = source;
        iFrameList.push(iframe);
        div.appendChild(iframe);
        div.appendChild(document.createElement("br"));
    }
}

function addField(location = "div1", id = "", name = "", value = "", onchange = undefined) {
    if (id && name) {
        let div = getDiv(location);
        let textLabel = document.createTextNode(name + " ");
        let textField;
        if (Array.isArray(value)) {
            textField = document.createElement("select");
            let index = 1;
            for (let vi of value) {
                let option = document.createElement("option");
                option.value = index;
                option.text = vi;
                textField.appendChild(option);
                index++;
            }
        }
        else if (value.includes("\n")) {
            textField = document.createElement("textarea");
            textField.rows = value.split("\n").length + 1;
            textField.cols = 50;
        }
        else {
            textField = document.createElement("input");
            textField.type = "text";
            textField.value = value.trim();
        }
        textField.id = id;
        if (onchange) textField.onchange = onchange;
        div.appendChild(textLabel);
        if (value.includes("\n")) div.appendChild(document.createElement("br"));
        div.appendChild(textField);
        div.appendChild(document.createElement("br"));
    }
}

function addCheckBox(location = "div1", id = "", points = "(0)", name = "") {
    if (id && name) {
        let div = getDiv(location);
        let checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = "@" + id;
        let pointsLabel = document.createElement("b");
        pointsLabel.innerHTML = points + " ";
        pointsLabel.id = "#" + id;
        let textLabel = document.createTextNode(name + " ");
        div.appendChild(checkBox);
        div.appendChild(pointsLabel);
        div.appendChild(textLabel);
        div.appendChild(document.createElement("br"));
        if (points != "(auto)") {
            let partLabel = document.createElement("input");
            partLabel.type = "text";
            partLabel.size = 2;
            partLabel.id = "%" + id;
            let commentLabel = document.createElement("input");
            commentLabel.type = "text";
            commentLabel.id = "$" + id;
            div.appendChild(document.createTextNode("Partial points: "));
            div.appendChild(partLabel);
            div.appendChild(document.createTextNode("  Add comments: "));
            div.appendChild(commentLabel);
            div.appendChild(document.createElement("br"));
        }
    }
}

function addButton(location = "div1", name = "", label = "", onclick = undefined) {
    if (name && onclick) {
        let div = getDiv(location);
        let button = document.createElement("button");
        button.innerHTML = name.trim();
        button.onclick = onclick;
        let textLabel = document.createTextNode(label + " ");
        if (label) div.appendChild(textLabel);
        div.appendChild(button);
        if (name.endsWith("\n")) div.appendChild(document.createElement("br"));
    }
}

function addDivider(location = "div1") {
    let div = getDiv(location);
    let line = document.createElement("hr");
    div.appendChild(line);
}

function addNavigation(location = "div1") {
    addButton(location, "Previous", "Navigation:", () => moveTo(-1));
    addButton(location, "GoTo", "", goTo);
    addButton(location, "Next\n", "", () => moveTo(1));
}

function addInputField(title = "", index = 0) {
    let column = [];
    for (let i = 1; i < classList.length; i++) column.push(classList[i][index]);
    addField(inputDiv, "c" + (index + 1), title.trim() + ":", column, () => goTo(index + 1));
}

function addCheckAll(location = "div1", name = "", group = 0) {
    addButton(location, "Check All", name, () => checkAll(group, true));
    addButton(location, "Uncheck All\n", "", () => checkAll(group, false));
}

// Load everything
window.onload = function () {
    readFile(namesFile, generateInput);
};