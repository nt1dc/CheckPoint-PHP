let answerValues = document.getElementById("answerValues"),
    pointer = document.getElementById("pointer"),
    pickedBtn = false,
    X = 0,
    Y = 0,
    R = 1,
    arrayButton = document.getElementsByClassName("rButton"),
    arrayCheckBox = document.querySelectorAll('input[type=checkbox]')
let buttonItems = [].slice.call(arrayButton);
let checkBoxItems = [].slice.call(arrayCheckBox);


function fixThisShit(errMsg) {
    if (confirm("ПЕРЕЙТИ НА САЙТ ДУРКИ?")) {
        document.location.href = "https://www.kaschenko-spb.ru";
    } else {
        alert(errMsg)
    }
}


function checkX() {
    let flag = false
    for (let i = 0; i < checkBoxItems.length; i++) {
        if (checkBoxItems[i].checked === true) {
            flag = true
            X = checkBoxItems[i].id
            return true
        }
    }
    if (flag === false) {
        fixThisShit("Выберите X")
        return false
    }
}

function checkY() {
    let yCheck = document.getElementById("y").value;
    if (yCheck >= -5 && yCheck <= 3 && (yCheck !== "")) {
        Y=parseFloat(yCheck).toFixed(3)
        console.log(Y)
        return true
    } else {
        fixThisShit("Введи нормальный Y")
        return false
    }
}

function checkR() {
    if (pickedBtn) {
        return true
    } else {
        fixThisShit("R не выбран")
        return false;
    }
}

function clearPointer() {
    pointer.setAttribute("visibility", "hidden");
}

function setPointer() {
    pointer.setAttribute("visibility", "visible");
    pointer.setAttribute("cx", (X / R * 2 * 60 + 150).toString());
    pointer.setAttribute("cy", (-Y / R * 2 * 60 + 150).toString());
}


function processSubmit() {
    let request = '?x=' + X + '&y=' + Y + '&r=' + R;
    setPointer();
    fetch("main.php" + request, {
        method: "GET",
        headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
    }).then(function (response) {
        return response.json()
    }).then(makeTable)
}

function makeTable(serverAnswer) {
    let result = "";
    try {
        for (let [indxex, row] of Object.entries(serverAnswer).reverse()) {
            let color = "";
            // console.log(row)
            // if  (row["coordsStatus"]==="dead_inside"){
            //     color="style='background: red'"
            // }else {
            //     color="style='background: green'"
            // }

            result += "<tr " + color + "> <td>" + row["x"] + "</td><td>" + row["y"] + "</td><td>" + row["r"] + "</td><td>" + row["currentTime"] + "</td><td>" + row["benchmarkTime"] + "</td><td>" + row["coordsStatus"] + "</td></tr>"
        }
        answerValues.innerHTML = result;
    }catch (e){

    }
}

window.onload = function () {
    let request = '?t=3';
    fetch("main.php" + request, {
        method: "GET",
        headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
    }).then(function (response) {
        return response.json().catch(error => console.log("empty"));
    }).then(makeTable)

}


checkBoxItems.forEach(function choose(box, index) {
    box.addEventListener('click', function () {
        checkBoxItems.forEach(
            function disable(box2, index2) {
                if (index2 !== index) {
                    box2.checked = false;
                }
            }
        )
    })
})

buttonItems.forEach(function choose(btn, index) {
    btn.addEventListener('click', function () {
            buttonItems.forEach(
                function disable(btn2, index2) {
                    if (index2 !== index) {
                        btn2.style.backgroundColor = ""
                        btn2.style.color = "#0076ff"
                    }
                }
            )
            R = btn.value
            pickedBtn = true
            btn.style.color = "white"
            btn.style.backgroundColor = "#32CD32";
        }
    )
})

document.getElementById("submitButton").onclick = function submit() {
    if (checkX()) {
        if (checkY()) {
            if (checkR()) {
                processSubmit()
            }
        }
    }
}

function clearX() {
    checkBoxItems.forEach(function (box) {
            box.checked = false;
        }
    )
}

function clearY() {
    document.getElementById("y").value = "";
}

document.getElementById("clearButton").onclick = function () {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'clear.php');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            answerValues.innerHTML = "";
            clearX();
            clearY();
            clearR();
            clearPointer();
        }
    }
    xhr.send()
}

function clearR() {
    buttonItems.forEach(function choose(btn) {
        R = 1;
        pickedBtn = false;
        btn.style.backgroundColor = "";
        btn.style.color = "#0076ff";
    })
}